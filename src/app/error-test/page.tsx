'use client';

import { useState, useEffect } from 'react';

export default function ErrorTestPage() {
  const [shouldError, setShouldError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only enable error throwing on the client side
    setIsClient(true);
    setShouldError(true);
  }, []);

  if (isClient && shouldError) {
    throw new Error('This is a test error for error boundary testing');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Error Test Page</h1>
      <p className="text-muted-foreground">
        This page tests error boundaries. Click the button to trigger an error.
      </p>
      <button
        onClick={() => setShouldError(true)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Trigger Error
      </button>
    </div>
  );
}
