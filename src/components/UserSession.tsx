'use client';

import { useState } from 'react';
import {
  AuthFlowType,
  checkAuthStatus,
  confirmSignInWithChallenge,
  PreferredChallenge,
  refreshAuthSession,
  SignInResult,
  signInWithFlow,
  signOutUser,
} from '../lib/useAuth';
import { useAuthEventLogger, useAuthState } from '../lib/useAuthEvents';
import { AuthEventMonitor } from './AuthEventMonitor';
import { UserProfile } from './UserProfile';

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
      console.log('Session refreshed successfully');
      // Auth events will automatically update the user state
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log('User signed out');
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

      if (
        signInStep?.nextStep.signInStep ===
        'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION'
      ) {
        // User has selected a challenge, confirm it
        const selectedChallenge =
          signInData.selectedChallenge || availableChallenges[0];
        result = await confirmSignInWithChallenge(selectedChallenge);
      } else {
        // Initial sign-in attempt
        const preferredChallenge =
          signInData.preferredChallenge as PreferredChallenge;
        result = await signInWithFlow(
          signInData.username,
          signInData.password || undefined,
          {
            authFlowType: authFlow,
            preferredChallenge: preferredChallenge || undefined,
          }
        );
      }

      setSignInStep(result);

      if (
        result.nextStep.signInStep ===
        'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION'
      ) {
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
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
        <span>Checking session...</span>
      </div>
    );
  }

  if (!user) {
    if (showSignIn) {
      // Show challenge selection if available
      if (
        signInStep?.nextStep.signInStep ===
        'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION'
      ) {
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
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-xs"
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
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs self-start"
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
                className="px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-600"
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
                className="px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-600"
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
                  className="px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-600"
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
                  className="px-2 py-1 text-xs border rounded dark:bg-gray-800 dark:border-gray-600"
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
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs"
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
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
          {signInError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              {signInError}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowSignIn(true)}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="text-gray-900 dark:text-white">
        <div className="font-medium">{user.username}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          ID: {user.userId}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowProfile(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
        >
          Profile
        </button>
        <button
          onClick={() => setShowEventMonitor(true)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
        >
          Events
        </button>
        <button
          onClick={handleRefreshSession}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
        >
          Refresh Session
        </button>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
        >
          Sign Out
        </button>
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}

      {showEventMonitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <AuthEventMonitor onClose={() => setShowEventMonitor(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
