'use client';

import { resetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientMesh } from '@/components/gradient-mesh';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

  if (success) {
    return (
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" aria-label="home" className="flex gap-2 items-center">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                A
              </div>
            </Link>
          </div>

          <div className="flex flex-1 w-full items-center justify-center">
            <div className="w-full max-w-sm text-center">
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We&apos;ve sent you a password reset link. Please check your email and follow the instructions.
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/auth/signin">Back to sign in</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted relative hidden lg:block">
          <GradientMesh
            colors={["#3b82f6", "#6366f1", "#8b5cf6"]}
            distortion={5}
            swirl={0.3}
            speed={0.9}
            rotation={35}
            waveAmp={0.1}
            waveFreq={11}
            waveSpeed={0.22}
            grain={0.05}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
            <blockquote className="space-y-4 text-center">
              <p className="text-2xl font-semibold text-foreground">
                &ldquo;Secure password recovery&rdquo;
              </p>
              <cite className="block text-sm text-muted-foreground not-italic">
                Reset your password safely and securely
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" aria-label="home" className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              A
            </div>
          </Link>
        </div>

        <div className="flex flex-1 w-full items-center justify-center">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <Link href="/auth/signin" className="text-primary hover:underline underline-offset-4 font-medium">
                  Back to sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Gradient Background */}
      <div className="bg-muted relative hidden lg:block">
        <GradientMesh
          colors={["#f97316", "#ef4444", "#ec4899"]}
          distortion={8}
          swirl={0.4}
          speed={1.3}
          rotation={50}
          waveAmp={0.16}
          waveFreq={16}
          waveSpeed={0.32}
          grain={0.09}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
            <blockquote className="space-y-4 text-center">
              <p className="text-2xl font-semibold text-foreground">
                &ldquo;Password security matters&rdquo;
              </p>
              <cite className="block text-sm text-muted-foreground not-italic">
                Keep your account safe with our secure reset process
              </cite>
            </blockquote>
          </div>
      </div>
    </div>
  );
}
