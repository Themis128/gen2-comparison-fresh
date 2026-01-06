'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [clientState, setClientState] = useState('Initial client state');
  const [count, setCount] = useState(0);

  return (
    <div className="rounded-lg border p-4 bg-green-50 client-component">
      <h3 className="font-semibold text-green-900">Client Component</h3>
      <p className="text-green-700">Client State: {clientState}</p>
      <p className="text-green-700">Count: {count}</p>

      <div className="mt-4 space-x-2">
        <button
          onClick={() => setClientState('Client Updated')}
          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
        >
          Update Client State
        </button>
        <button
          onClick={() => setCount(c => c + 1)}
          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
        >
          Increment Count
        </button>
      </div>
    </div>
  );
}
