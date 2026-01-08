'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Menu, Lock } from 'lucide-react';

import ThemeSwitcher from './ThemeSwitcher';
import LocaleSwitcher from './LocaleSwitcher';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
// import UserSession from './UserSession';

interface NavigationProps {
  logoSrc?: string;
  logoAlt?: string;
}

const Navigation: React.FC<NavigationProps> = React.memo(
  ({ logoSrc = '/cloudless-logo.svg', logoAlt = 'Themis Baltzakis Logo' }) => {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('navigation');
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Optimized scroll function with throttling
    const scrollToSection = useCallback((sectionId: string) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 64; // Updated for py-3 (12px top/bottom) padding
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 16); // ~60fps throttling
    }, []);

    // Optimized navigation handler
    const handleNavigation = useCallback(
      (item: NavItem) => {
        if (item.type === 'scroll' && item.sectionId) {
          scrollToSection(item.sectionId);
        } else if (item.type === 'route' && item.href) {
          router.push(item.href);
        }
      },
      [scrollToSection, router]
    );

    // Memoized navigation items to prevent unnecessary recalculations
    const navItems = useMemo((): NavItem[] => {
      // Portfolio/Home page - use scrolling navigation
      if (pathname === '/') {
        return [
          { label: t('home'), type: 'route', href: '/app', protected: false },
          { label: t('about'), type: 'route', href: '/app#about', protected: false },
          { label: 'Skills', type: 'route', href: '/app#skills', protected: false },
          { label: t('experience'), type: 'route', href: '/app#experience', protected: false },
          { label: 'Certifications', type: 'route', href: '/app#certifications', protected: false },
          { label: 'Languages', type: 'route', href: '/app#languages', protected: false },
          { label: 'Achievements', type: 'route', href: '/app#achievements', protected: false },
          { label: t('contact'), type: 'route', href: '/app#contact', protected: false },
        ];
      }

      // Protected app pages - show scrolling navigation for portfolio sections
      if (pathname === '/app') {
        return [
          { label: t('about'), type: 'scroll', sectionId: 'about', protected: false },
          { label: 'Skills', type: 'scroll', sectionId: 'skills', protected: false },
          { label: t('experience'), type: 'scroll', sectionId: 'experience', protected: false },
          {
            label: 'Certifications',
            type: 'scroll',
            sectionId: 'certifications',
            protected: false,
          },
          { label: 'Languages', type: 'scroll', sectionId: 'languages', protected: false },
          { label: 'Achievements', type: 'scroll', sectionId: 'achievements', protected: false },
          { label: t('contact'), type: 'scroll', sectionId: 'contact', protected: false },
        ];
      }

      // Admin pages - show admin navigation
      if (pathname.startsWith('/admin')) {
        return [{ label: 'Portfolio', type: 'route', href: '/app', protected: false }];
      }

      // Projects page
      if (pathname === '/projects') {
        return [
          { label: 'Portfolio', type: 'route', href: '/app', protected: false },
          { label: 'All Projects', type: 'scroll', sectionId: 'projects', protected: false },
        ];
      }

      // Default navigation for other pages
      return [{ label: 'Portfolio', type: 'route', href: '/app', protected: false }];
    }, [pathname]);

    // Optimized logo click handler
    const handleLogoClick = useCallback(() => {
      router.push('/app');
    }, [router]);

    // Handle hash-based navigation on page load - optimized
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash && pathname === '/app') {
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            setTimeout(() => scrollToSection(hash), 100);
          });
        }
      }

      // Cleanup timeout on unmount
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, [pathname, scrollToSection]);

    interface NavItem {
      label: string;
      type: 'scroll' | 'route';
      sectionId?: string;
      href?: string;
      protected: boolean;
    }

    return (
      <nav
        className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 dark:border-gray-700/50 dark:bg-gray-900/80"
        role="navigation"
        aria-label="Main navigation"
        id="main-navigation"
      >
        <div className="container relative mx-auto px-6 py-3">
          {/* Logo positioned absolutely to extend outside bar */}
          <button
            onClick={handleLogoClick}
            className="group absolute left-6 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3"
            aria-label="Home"
          >
            <Image
              alt={logoAlt}
              loading="eager"
              width={200}
              height={200}
              className="h-24 w-24 transition-all duration-300 group-hover:scale-110 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 dark:brightness-0 dark:invert"
              src={logoSrc}
            />
            <span className="sr-only">Home</span>
          </button>

          <div className="flex items-center justify-between pl-32">
            <div className="hidden items-center space-x-6 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className="nav-accent group relative font-mono font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-white"
                  aria-label={`${item.label}${item.protected ? ' (requires authentication)' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {item.label}
                    {item.protected && <Lock className="h-3 w-3 opacity-60" aria-hidden="true" />}
                  </div>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}

              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

              <div className="flex items-center gap-4">
                <LocaleSwitcher />
                <ThemeSwitcher />
                {/* <UserSession /> */}
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="mt-6 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      onClick={() => handleNavigation(item)}
                      className="justify-start font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {item.label}
                        {item.protected && (
                          <Lock className="h-3 w-3 opacity-60" aria-hidden="true" />
                        )}
                      </div>
                    </Button>
                  ))}

                  <div className="flex flex-col gap-4 border-t pt-4">
                    <ThemeSwitcher />
                    {/* <UserSession /> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';

export default Navigation;
