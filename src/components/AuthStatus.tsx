'use client';

import { useState, useEffect } from 'react';

import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { User } from 'lucide-react';

import { Button } from './ui/button';

interface AuthStatusProps {
  className?: string;
}

export default function AuthStatus({ className = '' }: AuthStatusProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.log('No user signed in');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      setUser(null);
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm">Checking auth...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button variant="outline" size="sm" asChild>
          <a href="/auth/signin">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">
        Hello, {user.username}
      </span>
      {user.signInDetails?.loginId?.includes('@cloudless.com') && (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Admin
        </span>
      )}
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
