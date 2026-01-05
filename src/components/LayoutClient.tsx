"use client";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Lazy load development-only components
const DevConsoleFilter = dynamic(() => import('./DevConsoleFilter'), { ssr: false });
const DevListenerPatch = dynamic(() => import('./DevListenerPatch'), { ssr: false });

// Lazy load non-critical components
const InstallPrompt = dynamic(() => import('./InstallPrompt'), { ssr: false });
const PWARegistration = dynamic(() => import('./PWARegistration'), { ssr: false });

export default function LayoutClient() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevListenerPatch />}
      {process.env.NODE_ENV === 'development' && <DevConsoleFilter />}
      {!isAuthRoute && <InstallPrompt />}
      <PWARegistration />
    </>
  );
}
