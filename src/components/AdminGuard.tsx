'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAuthUser } from '@/lib/roleBasedAuth';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await getCurrentAuthUser();
        
        if (!authUser) {
          router.push('/auth/signin');
          return;
        }

        if (authUser.role === 'admin') {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard');
          return;
        }
      } catch {
        router.push('/auth/signin');
        return;
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
