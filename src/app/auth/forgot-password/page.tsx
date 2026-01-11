'use client';

import { Authenticator } from '@aws-amplify/ui-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
        </div>
        <Authenticator />
      </div>
    </div>
  );
}
