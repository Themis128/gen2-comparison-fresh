import { Amplify } from 'aws-amplify';

import outputs from '../../amplify_outputs.json';

// Define proper types
interface AmplifyConfig {
  [key: string]: unknown;
}

let isConfigured = false;

// Configure Amplify for runtime (not build time)
const configureAmplify = (): void => {
  if (isConfigured) return;

  try {
    // Remove auth from outputs for client-side config since we removed auth
    const clientOutputs = { ...outputs };
    delete (clientOutputs as any).auth;

    Amplify.configure(clientOutputs, { ssr: true });
    isConfigured = true;
    console.warn(`✅ Amplify configured successfully for runtime (without auth)`);
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error);
    // Don't throw here as this might be expected during build time
  }
};

// Configure Amplify immediately when this module is loaded (browser only)
if (typeof window !== 'undefined') {
  configureAmplify();
}

// Export functions for compatibility
export const getAmplifyConfig = (): AmplifyConfig | null => {
  // Return the outputs config object
  return outputs;
};

// Export a function to ensure Amplify is configured (for use in components)
export const ensureAmplifyConfigured = async (): Promise<void> => {
  if (isConfigured) return;

  try {
    // Remove auth from outputs for client-side config since we removed auth from backend
    const clientOutputs = { ...outputs };
    delete (clientOutputs as any).auth;

    Amplify.configure(clientOutputs, { ssr: true });
    isConfigured = true;
    console.warn(`✅ Amplify configured successfully (without auth)`);
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error);
    // Don't throw - allow component to render even if config fails
  }
};

// For backward compatibility, export a default config object
const defaultConfig: AmplifyConfig = outputs;
export default defaultConfig;
