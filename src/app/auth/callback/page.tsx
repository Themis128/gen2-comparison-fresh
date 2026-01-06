'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Hub } from 'aws-amplify/utils';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          router.replace('/');
          break;
        case 'signInWithRedirect_failure':
          router.replace('/auth/signin?error=oauth_failed');
          break;
        case 'customOAuthState':
          router.replace('/');
          break;
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}