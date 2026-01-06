"use client";
export default AuthWrapper;


import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
  testMode?: boolean;
}


const AuthWrapper = ({ children, testMode }: AuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (
      testMode ||
      process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    ) {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];

        setIsAuthenticated(true);

        if (groups.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/app');
        }
      } catch {
        setIsAuthenticated(false);
        router.push('/auth/signin');
      }
    };

    checkAuth();
  }, [router, testMode]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

