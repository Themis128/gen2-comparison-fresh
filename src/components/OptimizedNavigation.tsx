'use client';
import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { trackInteraction } from '../lib/analytics';
import ThemeSwitcher from './ThemeSwitcher';
import UserSession from './UserSession';

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
      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 font-medium relative group font-mono nav-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={item.name}
    >
      {item.name}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
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
      className="mobile-nav-item text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 font-medium relative group text-lg py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={item.name}
    >
      {item.name}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
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
          element =
            document.getElementById('hero-anchor') ||
            document.getElementById('hero');
        } else {
          element = document.getElementById(item.id!);
        }

        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50'
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
            className="flex items-center gap-3 group"
            aria-label="Home"
          >
            <Image
              src="/cloudless-logo.svg"
              alt="Themis Baltzakis Logo"
              width={32}
              height={32}
              className="h-8 w-8 dark:brightness-0 dark:invert transition-all duration-300 group-hover:scale-110"
            />
            <span className="sr-only">Home</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                onClick={() => handleNavigation(item)}
              />
            ))}
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <UserSession />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={toggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className={`w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${
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
            className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.name}
                  item={item}
                  onClick={() => handleNavigation(item)}
                />
              ))}

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <UserSession />
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={close}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
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
