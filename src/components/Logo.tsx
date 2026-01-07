'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ResponsiveLogoProps {
  href?: string;
  className?: string;
}

export function ResponsiveLogo({ href = '/', className = '' }: ResponsiveLogoProps) {
  const logoContent = (
    <Image
      src="/cloudless-logo.svg"
      alt="Themis Baltzakis Logo"
      width={40}
      height={40}
      className={`h-8 w-8 transition-all duration-300 hover:scale-110 dark:brightness-0 dark:invert ${className}`}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return <div className="flex items-center">{logoContent}</div>;
}
