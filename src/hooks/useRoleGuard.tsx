'use client';

import { useEffect, useState, useCallback } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { getCurrentAuthUser, canAccessRoute, getRoleBasedRedirect, type AuthUser, type UserRole } from '@/lib/roleBasedAuth';

interface UseRoleGuardOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  allowTestMode?: boolean;
}

interface UseRoleGuardReturn {
  user: AuthUser | null;
  isLoading: boolean;
  hasAccess: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook for role-based route protection
 * @param options Configuration for role guard
 * @returns Auth state and access information
 */
export const useRoleGuard = (options: UseRoleGuardOptions = {}): UseRoleGuardReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { requiredRole, redirectTo, allowTestMode = true } = options;

  const checkAccess = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for test mode
      const isTestMode =
        allowTestMode && (
          process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
          (typeof window !== 'undefined' && (window as Record<string, unknown>).__NEXT_PUBLIC_TEST_MODE === 'true')
        );

      if (isTestMode) {
        const testUser: AuthUser = {
          id: 'test-user',
          email: 'test@test.com',
          role: 'admin', // Test user has admin access
          groups: ['admin'],
          isEmailVerified: true,
        };
        setUser(testUser);
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Get current authenticated user
      const authUser = await getCurrentAuthUser();

      if (!authUser) {
        setUser(null);
        setHasAccess(false);
        // Redirect to sign in if not authenticated
        router.push('/auth/signin');
        return;
      }

      setUser(authUser);

      // Check route-specific access
      let canAccess = true;

      if (requiredRole) {
        // Check specific role requirement
        canAccess = authUser.role === requiredRole ||
                   (authUser.role === 'admin' && requiredRole !== 'admin'); // Admin can access most routes
      } else {
        // Check general route access
        canAccess = canAccessRoute(pathname, authUser.role);
      }

      if (!canAccess) {
        setHasAccess(false);
        // Redirect to custom location or role-based default
        const redirect = redirectTo || getRoleBasedRedirect(authUser.role);
        router.push(redirect);
        return;
      }

      setHasAccess(true);
    } catch (error) {
      console.error('Role guard check failed:', error);
      setUser(null);
      setHasAccess(false);
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname, requiredRole, redirectTo, allowTestMode]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    user,
    isLoading,
    hasAccess,
    isAuthenticated: !!user,
  };
};

/**
 * Hook for admin-only access
 */
export const useAdminGuard = (redirectTo?: string) => {
  return useRoleGuard({ requiredRole: 'admin', redirectTo });
};

/**
 * Hook for moderator+ access
 */
export const useModeratorGuard = (redirectTo?: string) => {
  const result = useRoleGuard({ redirectTo });

  // Override hasAccess to allow moderator and admin
  const hasModeratorAccess = result.user &&
    (result.user.role === 'moderator' || result.user.role === 'admin');

  return {
    ...result,
    hasAccess: hasModeratorAccess || false,
  };
};

/**
 * Higher-order component for role protection
 */
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: UseRoleGuardOptions = {}
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { isLoading, hasAccess } = useRoleGuard(options);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!hasAccess) {
      return null;
    }

    return <Component {...props} />;
  };

  ProtectedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name})`;

  return ProtectedComponent;
};
