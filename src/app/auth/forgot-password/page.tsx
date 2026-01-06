'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { resetPassword } from 'aws-amplify/auth';
import { Mail } from 'lucide-react';

import { AuthLogo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword({
        username: email,
      });
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <AuthLogo href="/" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending reset email...' : 'Send reset email'}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
              data-testid="back-to-signin-link"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
