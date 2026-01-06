"use client";
import Link from 'next/link';

import AuthWrapper from '../components/AuthWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  return (
    <AuthWrapper>
      <main role="main">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              AWS Amplify Gen2 Authentication Demo
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in or create an account to explore the authentication features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="/auth/signin" className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95 h-12 px-6 text-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ring/70" data-testid="sign-in-link">
                Sign In
              </a>
              <a href="/auth/signup" className="w-full inline-flex items-center justify-center rounded-lg border border-input bg-background font-semibold shadow-sm hover:bg-background/90 active:bg-background/95 h-12 px-6 text-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ring/70" data-testid="create-account-link">
                Create Account
              </a>
              <div className="pt-4 border-t">
                <Link href="/test-page" className="w-full">
                  <Button variant="ghost" className="w-full text-sm" size="sm">
                    View Demo Features →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Built with AWS Amplify Gen2, Next.js, and TypeScript</p>
            <p className="mt-1">Featuring Google & GitHub OAuth authentication</p>
          </div>
          </div>
        </div>
      </main>
    </AuthWrapper>
  );
}
