'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Something went wrong!</h1>
        <p className="mb-6 text-muted-foreground">
          An error occurred while loading this page.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
