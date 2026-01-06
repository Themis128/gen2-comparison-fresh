'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    workbox?: unknown;
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
    } else if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.warn('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.warn('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
}
