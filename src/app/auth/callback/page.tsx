'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Hub } from 'aws-amplify/utils';

import { getCurrentAuthUser, getRoleBasedRedirect } from '../../../lib/roleBasedAuth';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const authUser = await getCurrentAuthUser();
      const redirectPath = authUser ? getRoleBasedRedirect(authUser.role) : '/auth/signin';
      return redirectPath;
    };

    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          const redirectPath = await handleAuthRedirect();
          router.replace(redirectPath);
          break;
        case 'signInWithRedirect_failure':
          router.replace('/auth/signin?error=oauth_failed');
          break;
        case 'customOAuthState':
          const customRedirectPath = await handleAuthRedirect();
          router.replace(customRedirectPath);
          break;
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="mt-4 text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
