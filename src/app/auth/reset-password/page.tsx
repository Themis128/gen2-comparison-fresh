'use client';

// Force dynamic rendering for auth pages that use search params
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { confirmResetPassword } from 'aws-amplify/auth';

import { GradientMesh } from '@/components/gradient-mesh';
import { AuthLogo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

function ResetPasswordForm() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      router.push('/auth/signin?reset=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <AuthLogo href="/" />
        </div>

        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter the code from your email and your new password
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Reset Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter reset code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <PasswordInput
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Resetting password...' : 'Reset Password'}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <GradientMesh
          colors={['#f59e0b', '#ef4444', '#ec4899']}
          distortion={5}
          swirl={0.3}
          speed={0.9}
          rotation={25}
          waveAmp={0.1}
          waveFreq={12}
          waveSpeed={0.2}
          grain={0.05}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
          <blockquote className="space-y-4 text-center">
            <p className="text-2xl font-semibold text-foreground">
              &ldquo;Secure password reset&rdquo;
            </p>
            <cite className="block text-sm not-italic text-muted-foreground">
              Reset your password securely and regain access
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
              <Link href="/" aria-label="home" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
                  A
                </div>
              </Link>
            </div>
            <div className="flex w-full flex-1 items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted lg:block">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
