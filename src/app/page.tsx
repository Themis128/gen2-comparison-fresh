'use client';

import { AuthWrapper } from '@/components/AuthWrapper';
import { TodoList } from '@/components/TodoList';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

function Dashboard() {
  const [user, setUser] = useState<{
    username?: string;
    signInDetails?: { loginId?: string };
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Fresh Gen2 Amplify App</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">
              Welcome, {user?.username || user?.signInDetails?.loginId}!
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Todos</h3>
          <TodoList />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  );
}
