'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

let cachedAuthState: boolean | null = null;
let authCheckPromise: Promise<boolean> | null = null;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(cachedAuthState);
  const router = useRouter();

  const isTestMode = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
      (typeof window !== 'undefined' &&
        (window as typeof globalThis & { __NEXT_PUBLIC_TEST_MODE?: string })
          .__NEXT_PUBLIC_TEST_MODE === 'true')
    );
  }, []);

  const checkAuth = useCallback(async () => {
    if (cachedAuthState !== null) {
      return cachedAuthState;
    }

    if (authCheckPromise) {
      return authCheckPromise;
    }

    authCheckPromise = (async () => {
      try {
        if (isTestMode) {
          cachedAuthState = true;
          return true;
        }

        const user = await getCurrentUser();
        cachedAuthState = !!user;
        return cachedAuthState;
      } catch {
        cachedAuthState = false;
        return false;
      } finally {
        authCheckPromise = null;
      }
    })();

    return authCheckPromise;
  }, [isTestMode]);

  const checkUserRole = useCallback(async () => {
    try {
      const _user = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];
      return groups.includes('admin') ? 'admin' : 'user';
    } catch {
      return 'user';
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    checkAuth().then(async (authenticated) => {
      if (!mounted) return;

      setIsAuthenticated(authenticated);
      if (!authenticated) {
        router.push('/auth/signin');
      } else {
        const role = await checkUserRole();
        if (role === 'admin') {
          router.push('/admin');
        }
        // Regular users stay in the protected app area
      }
    });

    return () => {
      mounted = false;
    };
  }, [checkAuth, checkUserRole, router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
