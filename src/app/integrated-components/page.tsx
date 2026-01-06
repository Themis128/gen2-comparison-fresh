import { Suspense } from 'react';

import ClientComponent from './ClientComponent';

// Server Component
async function ServerDataComponent() {
  // Simulate server-side data fetching
  const serverData = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
    .catch(() => ({ title: 'Server Fetched Data', body: 'This data comes from the server.' }));

  return (
    <div className="rounded-lg border p-4 bg-blue-50">
      <h3 className="font-semibold text-blue-900">Server Component</h3>
      <p className="text-blue-700">Server Data: {serverData.title}</p>
      <p className="text-sm text-blue-600 mt-2">{serverData.body}</p>
    </div>
  );
}

export default function IntegratedComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Client-Server Component Integration</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div className="rounded-lg border p-4 animate-pulse">Loading server component...</div>}>
          <ServerDataComponent />
        </Suspense>

        <ClientComponent />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Integration Test</h2>
        <p className="text-muted-foreground">
          This page demonstrates how server and client components can work together seamlessly.
          The server component fetches data on the server, while the client component handles
          user interactions on the browser.
        </p>
      </div>
    </div>
  );
}
