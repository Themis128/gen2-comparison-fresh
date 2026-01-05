'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// Cache auth state to avoid repeated checks
let cachedAuthState: boolean | null = null;
let authCheckPromise: Promise<boolean> | null = null;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(cachedAuthState);
  const router = useRouter();

  // Check if test mode is enabled
  const isTestMode = useMemo(() => {
    return process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
           (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_TEST_MODE === 'true');
  }, []);

  const checkAuth = useCallback(async () => {
    // Return cached result if available
    if (cachedAuthState !== null) {
      return cachedAuthState;
    }

    // Return existing promise if auth check is in progress
    if (authCheckPromise) {
      return authCheckPromise;
    }

    // Start new auth check
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

  useEffect(() => {
    let mounted = true;

    checkAuth().then((authenticated) => {
      if (!mounted) return;
      
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        router.push('/auth/signin');
      }
    });

    return () => {
      mounted = false;
    };
  }, [checkAuth, router]);

  // Optimized loading state with skeleton
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
