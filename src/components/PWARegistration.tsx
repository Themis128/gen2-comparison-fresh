'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    workbox?: any;
  }
}

export default function PWARegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // If using workbox-window
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
}
