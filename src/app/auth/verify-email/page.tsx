'use client';

// Force dynamic rendering for auth pages that use search params
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

import { GradientMesh } from '@/components/gradient-mesh';
import { AuthLogo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function VerifyEmailForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      router.push('/auth/signin?verified=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await resendSignUpCode({ username: email });
      setError('');
      alert('Verification code sent! Check your email.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
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
                <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>

              <div className="text-center">
                <p className="mb-2 text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="w-full"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
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
          colors={['#10b981', '#3b82f6', '#8b5cf6']}
          distortion={6}
          swirl={0.4}
          speed={0.8}
          rotation={30}
          waveAmp={0.12}
          waveFreq={12}
          waveSpeed={0.25}
          grain={0.06}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
          <blockquote className="space-y-4 text-center">
            <p className="text-2xl font-semibold text-foreground">
              &ldquo;One step closer to your account&rdquo;
            </p>
            <cite className="block text-sm not-italic text-muted-foreground">
              Verify your email to complete registration
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailForm />
    </Suspense>
  );
}
