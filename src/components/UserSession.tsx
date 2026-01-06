'use client';

import { useState } from 'react';

import { AuthEventMonitor } from './AuthEventMonitor';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { UserProfile } from './UserProfile';
import {
  type AuthFlowType,
  checkAuthStatus,
  confirmSignInWithChallenge,
  type PreferredChallenge,
  refreshAuthSession,
  type SignInResult,
  signInWithFlow,
  signOutUser,
} from '../lib/useAuth';
import { useAuthEventLogger, useAuthState } from '../lib/useAuthEvents';

export default function UserSession() {
  // Use auth state hook for automatic event-driven updates
  const authState = useAuthState();
  const { user, isLoading } = authState;

  // Enable auth event logging in development
  useAuthEventLogger();

  const [showSignIn, setShowSignIn] = useState(false);
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
    preferredChallenge: '',
    selectedChallenge: '',
  });
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [authFlow, setAuthFlow] = useState<AuthFlowType>('USER_AUTH');
  const [signInStep, setSignInStep] = useState<SignInResult | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showEventMonitor, setShowEventMonitor] = useState(false);

  const handleRefreshSession = async () => {
    if (!user) return;
    try {
      await refreshAuthSession();
      console.warn('Session refreshed successfully');
      // Auth events will automatically update the user state
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.warn('User signed out');
      // Auth events will automatically update the user state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSigningIn(true);
    setSignInError(null);

    try {
      let result: SignInResult;

      if (signInStep?.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION') {
        // User has selected a challenge, confirm it
        const selectedChallenge = signInData.selectedChallenge || availableChallenges[0];
        result = await confirmSignInWithChallenge(selectedChallenge);
      } else {
        // Initial sign-in attempt
        const preferredChallenge = signInData.preferredChallenge as PreferredChallenge;
        result = await signInWithFlow(signInData.username, signInData.password || undefined, {
          authFlowType: authFlow,
          preferredChallenge: preferredChallenge || undefined,
        });
      }

      setSignInStep(result);

      if (result.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION') {
        setAvailableChallenges(result.nextStep.availableChallenges || []);
        setSignInError(null);
      } else if (result.nextStep.signInStep === 'DONE') {
        await checkAuthStatus(); // This will trigger auth events
        setShowSignIn(false);
        setSignInData({
          username: '',
          password: '',
          preferredChallenge: '',
          selectedChallenge: '',
        });
        setSignInStep(null);
        setAvailableChallenges([]);
      } else {
        // Handle other steps (like custom challenges, etc.)
        setSignInError(`Authentication step: ${result.nextStep.signInStep}`);
      }
    } catch (error: unknown) {
      setSignInError(String(error));
    } finally {
      setSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white" />
        <span>Checking session...</span>
      </div>
    );
  }

  if (!user) {
    if (showSignIn) {
      // Show challenge selection if available
      if (signInStep?.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION') {
        return (
          <div className="relative">
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Choose authentication method:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableChallenges.map((challenge) => (
                  <button
                    key={challenge}
                    onClick={() => {
                      setSignInData((prev) => ({
                        ...prev,
                        selectedChallenge: challenge,
                      }));
                      handleSignIn();
                    }}
                    disabled={signingIn}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {challenge.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowSignIn(false);
                  setSignInStep(null);
                  setAvailableChallenges([]);
                  setSignInData({
                    username: '',
                    password: '',
                    preferredChallenge: '',
                    selectedChallenge: '',
                  });
                }}
                className="self-start rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
            {signInError && (
              <div className="absolute top-full mt-1 text-xs text-red-600 dark:text-red-400">
                {signInError}
              </div>
            )}
          </div>
        );
      }

      // Regular sign-in form
      return (
        <div className="relative">
          <form onSubmit={handleSignIn} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <select
                value={authFlow}
                onChange={(e) => setAuthFlow(e.target.value as AuthFlowType)}
                className="rounded border px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="USER_AUTH">USER_AUTH (Recommended)</option>
                <option value="USER_SRP_AUTH">USER_SRP_AUTH</option>
                <option value="USER_PASSWORD_AUTH">USER_PASSWORD_AUTH</option>
                <option value="CUSTOM_WITH_SRP">CUSTOM_WITH_SRP</option>
                <option value="CUSTOM_WITHOUT_SRP">CUSTOM_WITHOUT_SRP</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Username or Email"
                value={signInData.username}
                onChange={(e) =>
                  setSignInData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="rounded border px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                required
              />

              {(authFlow === 'USER_SRP_AUTH' ||
                authFlow === 'USER_PASSWORD_AUTH' ||
                authFlow === 'CUSTOM_WITH_SRP') && (
                <input
                  type="password"
                  placeholder="Password"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="rounded border px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                  required
                />
              )}

              {authFlow === 'USER_AUTH' && (
                <select
                  value={signInData.preferredChallenge || ''}
                  onChange={(e) =>
                    setSignInData((prev) => ({
                      ...prev,
                      preferredChallenge: e.target.value,
                    }))
                  }
                  className="rounded border px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">Choose method (optional)</option>
                  <option value="PASSWORD_SRP">Password SRP</option>
                  <option value="PASSWORD">Password</option>
                  <option value="WEB_AUTHN">WebAuthn</option>
                  <option value="EMAIL_OTP">Email OTP</option>
                  <option value="SMS_OTP">SMS OTP</option>
                </select>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                disabled={signingIn}
                className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
              >
                {signingIn ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(false);
                  setSignInStep(null);
                  setAvailableChallenges([]);
                  setSignInData({
                    username: '',
                    password: '',
                    preferredChallenge: '',
                    selectedChallenge: '',
                  });
                }}
                className="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
          {signInError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">{signInError}</div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowSignIn(true)}
        className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="text-gray-900 dark:text-white">
        <div className="font-medium">{user.signInDetails?.loginId || user.username}</div>
      </div>
      <div className="flex space-x-2">
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogTrigger asChild>
            <button
              className="rounded bg-purple-600 px-3 py-1 text-xs text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              aria-label="Open user profile"
            >
              Profile
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto bg-background/95 p-0 backdrop-blur-sm">
            <div className="p-6">
              <UserProfile />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEventMonitor} onOpenChange={setShowEventMonitor}>
          <DialogTrigger asChild>
            <button
              className="rounded bg-indigo-600 px-3 py-1 text-xs text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              aria-label="Open authentication events monitor"
            >
              Events
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto bg-background/95 p-0 backdrop-blur-sm">
            <div className="p-6">
              <AuthEventMonitor />
            </div>
          </DialogContent>
        </Dialog>

        <button
          onClick={handleRefreshSession}
          className="rounded bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Refresh authentication session"
        >
          Refresh Session
        </button>
        <button
          onClick={handleSignOut}
          className="rounded bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Sign out of account"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
