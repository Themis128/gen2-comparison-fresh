'use client';
import { memo, useCallback, useMemo, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ThemeSwitcher from './ThemeSwitcher';
import UserSession from './UserSession';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { trackInteraction } from '../lib/analytics';

// Memoized navigation item component
const NavItem = memo(
  ({
    item,
    onClick,
  }: {
    item: { name: string; id?: string; href?: string };
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="nav-accent group relative font-mono font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-white"
      aria-label={item.name}
    >
      {item.name}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
    </button>
  )
);

NavItem.displayName = 'NavItem';

// Memoized mobile navigation item
const MobileNavItem = memo(
  ({
    item,
    onClick,
  }: {
    item: { name: string; id?: string; href?: string };
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="mobile-nav-item group relative rounded-lg px-4 py-3 text-left text-lg font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      aria-label={item.name}
    >
      {item.name}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
    </button>
  )
);

MobileNavItem.displayName = 'MobileNavItem';

export default function OptimizedNavigation() {
  const { isOpen, toggle, close, menuRef, buttonRef } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Memoize navigation items
  const navItems = useMemo(
    () => [
      { name: 'Home', id: 'hero' },
      { name: 'About', id: 'about' },
      { name: 'Skills', id: 'skills' },
      { name: 'Experience', id: 'experience' },
      { name: 'Projects', id: 'projects' },
      { name: 'AI Generator', href: '/ai-generator' },
      { name: 'Contact', id: 'contact' },
    ],
    []
  );

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Memoized navigation handler
  const handleNavigation = useCallback(
    (item: (typeof navItems)[0]) => {
      if ('href' in item) {
        trackInteraction('navigation_click', 'navigation', item.href);
        router.push(item.href!);
      } else {
        // Handle scroll navigation
        trackInteraction('navigation_click', 'navigation', item.id!);
        let element;
        if (item.id === 'hero') {
          element = document.getElementById('hero-anchor') || document.getElementById('hero');
        } else {
          element = document.getElementById(item.id!);
        }

        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
        close();
      }
    },
    [close, router]
  );

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95'
          : 'border-b border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(navItems[0]);
            }}
            className="group flex items-center gap-3"
            aria-label="Home"
          >
            <Image
              src="/cloudless-logo.svg"
              alt="Themis Baltzakis Logo"
              width={32}
              height={32}
              className="transition-all duration-300 group-hover:scale-110 dark:brightness-0 dark:invert"
            />
            <span className="sr-only">Home</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} onClick={() => handleNavigation(item)} />
            ))}
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <UserSession />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={toggle}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden dark:hover:bg-gray-800"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className={`h-6 w-6 text-gray-700 transition-transform duration-300 dark:text-gray-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={menuRef}
            id="mobile-menu"
            className="animate-in slide-in-from-top-2 mt-4 border-t border-gray-200 pb-4 duration-200 md:hidden dark:border-gray-700"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <MobileNavItem key={item.name} item={item} onClick={() => handleNavigation(item)} />
              ))}

              {/* Mobile Actions */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <UserSession />
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={close}
                  className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close menu"
                >
                  Close Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
