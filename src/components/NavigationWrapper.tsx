'use client';

import { usePathname } from 'next/navigation';
import CustomNavigation from '../components/CustomNavigation';

export default function NavigationWrapper() {
  const pathname = usePathname();

  // Don't render navigation on auth pages
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  return <CustomNavigation />;
}
