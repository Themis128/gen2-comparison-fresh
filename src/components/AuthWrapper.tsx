'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import { getCurrentAuthUser, getRoleBasedRedirect, canAccessRoute, routePermissions } from '@/lib/roleBasedAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
  testMode?: boolean;
}

const AuthWrapper = ({ children, testMode }: AuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const isProtectedRoute = (path: string) => {
    const protectedPaths = ['/admin', '/profile', '/settings', '/(protected)'];
    return protectedPaths.some(route => path.startsWith(route));
  };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (testMode || process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
      setIsAuthenticated(true);
      return;
    }

    // Check if we're in test mode via headers (for Playwright tests)
    const isTestMode =
      (typeof window !== 'undefined' && document.cookie.includes('x-test-mode=true')) ||
      (window as any).testMode === true;

    if (isTestMode) {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const authUser = await getCurrentAuthUser();
        
        if (!authUser) {
          setIsAuthenticated(false);
          if (isProtectedRoute(pathname)) {
            router.push('/auth/signin');
          }
          return;
        }

        setUserRole(authUser.role);
        setIsAuthenticated(true);

        // Handle routing based on role and current path
        if (isProtectedRoute(pathname)) {
          if (!canAccessRoute(pathname, authUser.role)) {
            // User trying to access admin route without permission
            const correctPath = getRoleBasedRedirect(authUser.role);
            router.push(correctPath);
            return;
          }
        } else if (pathname === '/' || pathname === '/app') {
          // Redirect from root or /app to appropriate dashboard
          const targetPath = getRoleBasedRedirect(authUser.role);
          router.push(targetPath);
        }
      } catch {
        setIsAuthenticated(false);
        if (isProtectedRoute(pathname)) {
          router.push('/auth/signin');
        }
      }
    };

    checkAuth();
  }, [router, pathname, testMode]);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-500" />
        <div className="ml-4 text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
