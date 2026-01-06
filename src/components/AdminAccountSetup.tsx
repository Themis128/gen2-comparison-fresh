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
      const signUpResult = await signUp({
        username: 'tbaltzakis@cloudless.com',
        password: 'TH!123789th!',
        options: {
          userAttributes: {
            email: 'tbaltzakis@cloudless.com',
          },
        },
      });

      console.warn('Admin account created:', signUpResult);

      // Since the Lambda function auto-confirms @cloudless.com emails,
      // the account should be ready to use
      setMessage(
        '✅ Admin account created successfully! You can now sign in with tbaltzakis@cloudless.com'
      );
    } catch (error: unknown) {
      console.error('Error creating admin account:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorName = error instanceof Error ? (error as { name?: string }).name : undefined;

      if (errorName === 'UsernameExistsException') {
        setMessage(
          '✅ Admin account already exists! You can sign in with tbaltzakis@cloudless.com'
        );
      } else {
        setMessage(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Admin Account Setup</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Create the admin account for tbaltzakis@cloudless.com
      </p>

      <Button onClick={createAdminAccount} disabled={isCreating} className="mb-4 w-full">
        {isCreating ? 'Creating Admin Account...' : 'Create Admin Account'}
      </Button>

      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.includes('✅')
              ? 'border border-green-200 bg-green-50 text-green-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
