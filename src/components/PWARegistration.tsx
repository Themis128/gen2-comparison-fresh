'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    workbox?: unknown;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWARegistration() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial online status
    setIsOnline(navigator.onLine);

    // PWA install prompt handling
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Service worker registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service worker registered:', reg.scope);

            // Check for updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true);
                  }
                });
              }
            });

            setRegistration(reg);
          })
          .catch((error) => {
            console.error('[PWA] Service worker registration failed:', error);
          });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  // Listen for service worker controller change (update applied)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service worker updated, reloading page');
        window.location.reload();
      });
    }
  }, []);

  // Don't render anything if everything is normal
  if (isOnline && !isInstallable && !updateAvailable) {
    return null;
  }

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span className="text-sm font-medium">Offline</span>
          </div>
        </div>
      )}

      {/* PWA Install prompt */}
      {isInstallable && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Install App</span>
            <button
              onClick={handleInstall}
              className="rounded bg-white px-3 py-1 text-sm font-medium text-blue-500 transition-colors hover:bg-gray-100"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Update available notification */}
      {updateAvailable && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Update available!</span>
            <button
              onClick={handleUpdate}
              className="rounded bg-white px-3 py-1 text-sm font-medium text-green-500 transition-colors hover:bg-gray-100"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}
