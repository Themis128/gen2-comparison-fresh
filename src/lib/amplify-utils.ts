import { Amplify } from 'aws-amplify';
import { getAmplifyConfig } from './amplify-client-config';

// Configure Amplify for server-side use
const config = getAmplifyConfig();
if (config && typeof window === 'undefined') {
  // Only configure on server-side
  Amplify.configure(config, { ssr: true });
}

export { config };

// Export a function to create a client with config
export const createAmplifyClient = () => {
  return config;
};

// Compatibility function for server-side context
export const runWithAmplifyServerContext = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  // In Amplify v6, server-side operations can run directly
  // The configuration is already set globally
  return operation();
};
