'use client';

import { useState } from 'react';

import { signUp } from 'aws-amplify/auth';

import { Button } from './ui/button';

export default function AdminAccountSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const createAdminAccount = async () => {
    setIsCreating(true);
    setMessage('');

    try {
      // Create the admin account
      const { user } = await signUp({
        username: 'tbaltzakis@cloudless.com',
        password: 'TH!123789th!',
        attributes: {
          email: 'tbaltzakis@cloudless.com',
        },
      });

      console.warn('Admin account created:', user);

      // Since the Lambda function auto-confirms @cloudless.com emails,
      // the account should be ready to use
      setMessage('✅ Admin account created successfully! You can now sign in with tbaltzakis@cloudless.com');

    } catch (error: unknown) {
      console.error('Error creating admin account:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorName = error instanceof Error ? (error as { name?: string }).name : undefined;

      if (errorName === 'UsernameExistsException') {
        setMessage('✅ Admin account already exists! You can sign in with tbaltzakis@cloudless.com');
      } else {
        setMessage(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Admin Account Setup</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create the admin account for tbaltzakis@cloudless.com
      </p>

      <Button
        onClick={createAdminAccount}
        disabled={isCreating}
        className="w-full mb-4"
      >
        {isCreating ? 'Creating Admin Account...' : 'Create Admin Account'}
      </Button>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('✅')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
