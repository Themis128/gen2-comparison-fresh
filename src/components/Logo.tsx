'use client';

import React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'mobile';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export function Logo({ 
  variant = 'full', 
  size = 'md', 
  className,
  href = '/',
  priority = false,
  loading = 'eager'
}: LogoProps) {
  
  // Responsive size classes optimized for mobile-first
  const sizeClasses = {
    xs: 'h-6 w-auto max-w-[120px]',
    sm: 'h-8 w-auto max-w-[160px]', 
    md: 'h-10 w-auto max-w-[200px]',
    lg: 'h-12 w-auto max-w-[240px]',
    xl: 'h-16 w-auto max-w-[300px]'
  };

  // Mobile-optimized cloud icon for small screens
  const CloudIcon = ({ className: iconClassName }: { className?: string }) => (
    <svg 
      viewBox="0 0 84 60" 
      className={cn('w-auto', iconClassName)}
      aria-label="Cloudless"
      role="img"
    >
      <defs>
        <linearGradient id="mobileCloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#f0f9ff"/>
          <stop offset="100%" stopColor="#dbeafe"/>
        </linearGradient>
        <filter id="mobileShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#475569" floodOpacity="0.1"/>
        </filter>
      </defs>
      <g filter="url(#mobileShadow)">
        <ellipse cx="42" cy="36" rx="28" ry="12" fill="url(#mobileCloudGradient)"/>
        <ellipse cx="25" cy="32" rx="16" ry="14" fill="url(#mobileCloudGradient)"/>
        <ellipse cx="55" cy="34" rx="18" ry="12" fill="url(#mobileCloudGradient)"/>
        <ellipse cx="35" cy="24" rx="20" ry="16" fill="#ffffff"/>
        <ellipse cx="50" cy="22" rx="14" ry="12" fill="#ffffff"/>
        <ellipse cx="42" cy="16" rx="10" ry="6" fill="#ffffff"/>
      </g>
    </svg>
  );

  // Full logo with optimized text rendering
  const FullLogo = ({ className: logoClassName }: { className?: string }) => (
    <svg 
      viewBox="0 0 360 100" 
      className={cn(sizeClasses[size], logoClassName)}
      aria-label="Cloudless.gr"
      role="img"
    >
      <defs>
        <linearGradient id="cloudMainLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="30%" stopColor="#fafeff"/>
          <stop offset="70%" stopColor="#e8f4fc"/>
          <stop offset="100%" stopColor="#d0e8f5"/>
        </linearGradient>
        <linearGradient id="cloudTopHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#f0f9ff"/>
        </linearGradient>
        <linearGradient id="cloudMidTone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fcff"/>
          <stop offset="100%" stopColor="#dbeafe"/>
        </linearGradient>
        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
          <feOffset dx="0" dy="2" result="offsetBlur"/>
          <feFlood floodColor="#475569" floodOpacity="0.1"/>
          <feComposite in2="offsetBlur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#softShadow)" transform="translate(8, 12)">
        <ellipse cx="42" cy="48" rx="32" ry="16" fill="url(#cloudMainLight)"/>
        <ellipse cx="22" cy="42" rx="20" ry="18" fill="url(#cloudMainLight)"/>
        <ellipse cx="62" cy="44" rx="22" ry="16" fill="url(#cloudMainLight)"/>
        <ellipse cx="35" cy="36" rx="24" ry="20" fill="url(#cloudMidTone)"/>
        <ellipse cx="55" cy="34" rx="22" ry="18" fill="url(#cloudMidTone)"/>
        <ellipse cx="28" cy="30" rx="16" ry="14" fill="url(#cloudTopHighlight)"/>
        <ellipse cx="48" cy="26" rx="18" ry="16" fill="url(#cloudTopHighlight)"/>
        <ellipse cx="38" cy="22" rx="14" ry="10" fill="#ffffff"/>
        <ellipse cx="54" cy="20" rx="10" ry="8" fill="#ffffff"/>
        <ellipse cx="42" cy="18" rx="8" ry="5" fill="#ffffff"/>
      </g>
      
      <text 
        x="100" 
        y="58" 
        fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" 
        fontSize="34" 
        fontWeight="700" 
        fill="currentColor" 
        letterSpacing="-0.5"
        className="fill-slate-800 dark:fill-white"
      >
        cloudless
        <tspan fill="#0284c7" fontWeight="600">.gr</tspan>
      </text>
    </svg>
  );

  // Compact version for medium spaces
  const CompactLogo = ({ className: compactClassName }: { className?: string }) => (
    <div className={cn('flex items-center gap-2', compactClassName)}>
      <CloudIcon className="h-8 w-8" />
      <span className="text-xl font-bold text-slate-800 dark:text-white">
        cloudless<span className="text-blue-600">.gr</span>
      </span>
    </div>
  );

  // Choose variant based on screen size and props
  const getLogoContent = () => {
    switch (variant) {
      case 'icon':
        return <CloudIcon className={sizeClasses[size]} />;
      case 'compact':
        return <CompactLogo className={sizeClasses[size]} />;
      case 'mobile':
        return (
          <div className="flex items-center gap-2">
            <CloudIcon className="h-6 w-6" />
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              cloudless<span className="text-blue-600">.gr</span>
            </span>
          </div>
        );
      default:
        return <FullLogo />;
    }
  };

  const logoContent = getLogoContent();

  // Wrapper with optimized interactions
  const LogoWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={cn(
      'inline-flex items-center transition-all duration-200',
      'hover:scale-105 active:scale-95',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
      'rounded-lg',
      className
    )}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className={cn(
          'inline-flex items-center transition-all duration-200',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'rounded-lg touch-manipulation',
          className
        )}
        aria-label="Go to homepage"
        prefetch={priority}
      >
        {logoContent}
      </Link>
    );
  }

  return <LogoWrapper>{logoContent}</LogoWrapper>;
}

// Responsive logo that adapts to screen size
export function ResponsiveLogo(props: Omit<LogoProps, 'variant'>) {
  return (
    <>
      {/* Mobile: Icon + compact text */}
      <div className="block sm:hidden">
        <Logo variant="mobile" size="sm" {...props} />
      </div>
      
      {/* Tablet: Compact version */}
      <div className="hidden sm:block lg:hidden">
        <Logo variant="compact" size="md" {...props} />
      </div>
      
      {/* Desktop: Full logo */}
      <div className="hidden lg:block">
        <Logo variant="full" size="lg" {...props} />
      </div>
    </>
  );
}

// Preset components for common use cases
export const HeaderLogo = (props: Omit<LogoProps, 'variant' | 'size'>) => (
  <ResponsiveLogo priority {...props} />
);

export const FooterLogo = (props: Omit<LogoProps, 'variant' | 'size'>) => (
  <Logo variant="compact" size="md" {...props} />
);

export const AuthLogo = (props: Omit<LogoProps, 'variant' | 'size'>) => (
  <Logo variant="full" size="xl" {...props} />
);

export const MobileLogo = (props: Omit<LogoProps, 'variant' | 'size'>) => (
  <Logo variant="icon" size="sm" {...props} />
);