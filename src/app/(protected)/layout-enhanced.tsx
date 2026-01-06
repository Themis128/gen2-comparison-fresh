'use client';

import { useEffect, useState, useCallback } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import {
  getCurrentAuthUser,
  canAccessRoute,
  getRoleBasedRedirect,
  type AuthUser,
} from '@/lib/roleBasedAuth';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuthAndPermissions = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for test mode
      const isTestMode =
        process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
        (typeof window !== 'undefined' &&
          (window as typeof globalThis & { __NEXT_PUBLIC_TEST_MODE?: string })
            .__NEXT_PUBLIC_TEST_MODE === 'true');

      if (isTestMode) {
        setAuthUser({
          id: 'test-user',
          email: 'test@test.com',
          role: 'admin',
          groups: ['admin'],
          isEmailVerified: true,
        });
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Get current authenticated user with role
      const user = await getCurrentAuthUser();

      if (!user) {
        // Not authenticated - redirect to sign in
        router.push('/auth/signin');
        return;
      }

      setAuthUser(user);

      // Check if user has access to current route
      const canAccess = canAccessRoute(pathname, user.role);

      if (!canAccess) {
        // User doesn't have permission - redirect to appropriate page
        const redirectTo = getRoleBasedRedirect(user.role);
        router.push(redirectTo);
        return;
      }

      // Check if user should be redirected to role-specific home
      if (pathname === '/(protected)/app' || pathname === '/app') {
        const roleRedirect = getRoleBasedRedirect(user.role);
        if (roleRedirect !== '/(protected)/app') {
          router.push(roleRedirect);
          return;
        }
      }

      setHasAccess(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthUser(null);
      setHasAccess(false);
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    checkAuthAndPermissions();
  }, [checkAuthAndPermissions]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="animate-pulse text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Only render children if user has access
  if (!hasAccess || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Pass user context down if needed */}
      <div data-user-role={authUser.role} data-user-id={authUser.id}>
        {children}
      </div>
    </div>
  );
}
