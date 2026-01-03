'use client';

import { generateClient } from 'aws-amplify/api';
import { useState } from 'react';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

export default function SayHelloTest() {
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSayHello = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await client.queries.sayHello({ name: name.trim() });
      if (response.data) {
        const { message, apiEndpoint, hasApiKey, timestamp, functionConfig } =
          response.data;
        const configInfo = functionConfig
          ? 'Function config available'
          : 'Function config not available';
        setResult(
          `Message: ${message}\nAPI Endpoint: ${apiEndpoint}\nAPI Key Status: ${hasApiKey}\nTimestamp: ${timestamp}\nFunction Config: ${configInfo}`
        );
      } else {
        setResult('No response data');
      }
    } catch (error) {
      console.error('Error calling sayHello:', error);
      setResult('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Test SayHello Function
      </h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter a name"
          />
        </div>
        <button
          onClick={handleSayHello}
          disabled={loading || !name.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Say Hello'}
        </button>
        {result && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-900 dark:text-white">
              <strong>Result:</strong> {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
