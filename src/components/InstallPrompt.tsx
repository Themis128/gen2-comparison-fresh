'use client';

import { useEffect, useState } from 'react';

import { Download, X } from 'lucide-react';

import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Check for iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isIOS && isSafari && (window.navigator as { standalone?: boolean }).standalone) {
        setIsInstalled(true);
        return;
      }
    };

    checkInstalled();

    const handleUserInteraction = () => {
      setUserInteracted(true);
      // If we have a deferred prompt and user has interacted, show it
      if (deferredPrompt && !showPrompt) {
        setShowPrompt(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      // Removed preventDefault to allow browser native prompt
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show prompt after user has interacted with the page
      if (userInteracted) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for user interactions to show install prompt later
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [deferredPrompt, showPrompt, userInteracted]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.warn('User accepted the install prompt');
      } else {
        console.warn('User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Install Portfolio App
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              Get the full experience! Install our portfolio app for offline access and native app features.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} className="flex items-center gap-2" size="sm">
                <Download className="h-4 w-4" />
                Install App
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
