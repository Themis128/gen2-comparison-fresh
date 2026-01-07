'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Menu, Lock } from 'lucide-react';

import ThemeSwitcher from './ThemeSwitcher';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import UserSession from './UserSession';

interface NavigationProps {
  logoSrc?: string;
  logoAlt?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  logoSrc = '/cloudless-logo.svg',
  logoAlt = 'Themis Baltzakis Logo',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (item: NavItem) => {
    if (item.type === 'scroll' && item.sectionId) {
      scrollToSection(item.sectionId);
    } else if (item.type === 'route' && item.href) {
      router.push(item.href);
    }
  };

  // Context-aware navigation items based on current route
  const getNavigationItems = (): NavItem[] => {
    // Portfolio/Home page - use scrolling navigation
    if (pathname === '/') {
      return [
        { label: 'Home', type: 'scroll', sectionId: 'about', protected: false },
        { label: 'About', type: 'scroll', sectionId: 'about', protected: false },
        { label: 'Skills', type: 'scroll', sectionId: 'skills', protected: false },
        { label: 'Experience', type: 'scroll', sectionId: 'experience', protected: false },
        { label: 'Certifications', type: 'scroll', sectionId: 'certifications', protected: false },
        { label: 'Languages', type: 'scroll', sectionId: 'languages', protected: false },
        { label: 'Achievements', type: 'scroll', sectionId: 'achievements', protected: false },
        { label: 'Projects', type: 'route', href: '/projects', protected: false },
        { label: 'Contact', type: 'scroll', sectionId: 'contact', protected: false },
      ];
    }

    // Protected app pages - show app navigation
    if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
      return [
        { label: 'Dashboard', type: 'route', href: '/app', protected: true },
        { label: 'Projects', type: 'route', href: '/projects', protected: false },
        { label: 'Portfolio', type: 'route', href: '/', protected: false },
      ];
    }

    // Projects page
    if (pathname === '/projects') {
      return [
        { label: 'Portfolio', type: 'route', href: '/', protected: false },
        { label: 'Dashboard', type: 'route', href: '/app', protected: true },
        { label: 'All Projects', type: 'scroll', sectionId: 'projects', protected: false },
      ];
    }

    // Default navigation for other pages
    return [
      { label: 'Portfolio', type: 'route', href: '/', protected: false },
      { label: 'Projects', type: 'route', href: '/projects', protected: false },
      { label: 'Dashboard', type: 'route', href: '/app', protected: true },
    ];
  };

  const navItems = getNavigationItems();

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
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('about')}
            className="group flex items-center gap-3"
            aria-label="Home"
          >
            <Image
              alt={logoAlt}
              loading="lazy"
              width={64}
              height={64}
              className="h-8 w-8 transition-all duration-300 group-hover:scale-110 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 dark:brightness-0 dark:invert"
              src={logoSrc}
            />
            <span className="sr-only">Home</span>
          </button>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="nav-accent group relative font-mono font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-white"
                aria-label={`${item.label}${item.protected ? ' (requires authentication)' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {item.label}
                  {item.protected && (
                    <Lock className="h-3 w-3 opacity-60" aria-hidden="true" />
                  )}
                </div>
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <UserSession />
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
                  <UserSession />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;