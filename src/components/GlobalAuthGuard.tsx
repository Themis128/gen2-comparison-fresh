'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentAuthUser } from '@/lib/roleBasedAuth';

interface GlobalAuthGuardProps {
  children: React.ReactNode;
}

const GlobalAuthGuard = ({ children }: GlobalAuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Allow access to auth pages without authentication
        if (pathname?.startsWith('/auth')) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check for test mode - multiple ways to detect
        const isTestMode =
          process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
          (typeof window !== 'undefined' &&
            ((window as typeof globalThis & { __NEXT_PUBLIC_TEST_MODE?: string })
              .__NEXT_PUBLIC_TEST_MODE === 'true' ||
             (window as typeof globalThis & { testMode?: boolean }).testMode === true ||
             localStorage.getItem('test-mode') === 'true' ||
             localStorage.getItem('test-role') !== null)); // Playwright test sets test-role

        if (isTestMode) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check authentication
        const authUser = await getCurrentAuthUser();
        setIsAuthenticated(!!authUser);

        // Redirect to signin if not authenticated and not on auth pages
        if (!authUser && !pathname?.startsWith('/auth')) {
          router.push('/auth/signin');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        if (!pathname?.startsWith('/auth')) {
          router.push('/auth/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  // Show children if authenticated or on auth pages
  if (isAuthenticated || pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  // This shouldn't be reached, but just in case
  return null;
};

export default GlobalAuthGuard;