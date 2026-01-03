'use client';

import { useEffect } from 'react';
import { ensureAmplifyConfigured } from '../lib/amplify-client-config';

export default function AmplifyInitializer() {
  useEffect(() => {
    // Ensure Amplify is configured when the app mounts
    ensureAmplifyConfigured();
  }, []);

  // This component doesn't render anything
  return null;
}