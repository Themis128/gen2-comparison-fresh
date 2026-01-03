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
    Amplify.configure(outputs, { ssr: true });
    isConfigured = true;
    console.log(`✅ Amplify configured successfully for runtime`);
  } catch {
    console.error('❌ Failed to configure Amplify');
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
    Amplify.configure(outputs, { ssr: true });
    isConfigured = true;
    console.log(`✅ Amplify configured successfully`);
  } catch {
    console.error('❌ Failed to configure Amplify');
    // Don't throw - allow component to render even if config fails
  }
};

// For backward compatibility, export a default config object
const defaultConfig: AmplifyConfig = outputs;
export default defaultConfig;
