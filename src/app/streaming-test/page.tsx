import { Suspense } from 'react';

// Server Component that simulates streaming
async function StreamedContent() {
  // Simulate slow data fetching
  await new Promise(resolve => setTimeout(resolve, 1000));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Streamed content</h2>
      <div className="space-y-2">
        <div className="rounded border p-4">
          <h3 className="font-medium">Part 1</h3>
          <p>This content was streamed from the server.</p>
        </div>
        <Suspense fallback={<div className="animate-pulse rounded border p-4">Loading Part 2...</div>}>
          <StreamedPart2 />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse rounded border p-4">Loading Part 3...</div>}>
          <StreamedPart3 />
        </Suspense>
      </div>
    </div>
  );
}

// Nested streaming components
async function StreamedPart2() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return (
    <div className="rounded border p-4">
      <h3 className="font-medium">Part 2</h3>
      <p>This is the second part of the streamed content.</p>
    </div>
  );
}

async function StreamedPart3() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return (
    <div className="rounded border p-4">
      <h3 className="font-medium">Part 3</h3>
      <p>This is the final part of the streamed content.</p>
    </div>
  );
}

export default function StreamingTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Streaming Test Page</h1>
      <Suspense fallback={
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        <StreamedContent />
      </Suspense>
    </div>
  );
}
