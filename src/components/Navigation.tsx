'use client';
import { useEffect, useState, useRef } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ThemeSwitcher from './ThemeSwitcher';
import UserSession from './UserSession';
import { trackInteraction } from '../lib/analytics';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    trackInteraction('navigation_click', 'navigation', sectionId);

    let element;

    if (sectionId === 'hero') {
      element = document.getElementById('hero-anchor');
      if (!element) {
        element = document.getElementById('hero');
      }
    } else {
      element = document.getElementById(sectionId);
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

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'AI Generator', href: '/ai-generator' },
    { name: 'Contact', id: 'contact' },
  ] as const;

  const handleNavigation = (item: (typeof navItems)[number]) => {
    if ('href' in item) {
      trackInteraction('navigation_click', 'navigation', item.href);
      router.push(item.href);
    } else {
      scrollToSection(item.id);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95'
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
              scrollToSection('hero');
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
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className="nav-accent group relative font-mono font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-white"
                aria-label={item.name}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <UserSession />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileButtonRef}
            onClick={toggleMobileMenu}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden dark:hover:bg-gray-800"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-6 w-6 text-gray-700 transition-transform duration-300 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
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
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="animate-in slide-in-from-top-2 mt-4 border-t border-gray-200 pb-4 duration-200 md:hidden dark:border-gray-700"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="group relative rounded-lg px-4 py-3 text-left text-lg font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label={item.name}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}

              {/* Mobile Theme Switcher and User Session */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <UserSession />
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close menu"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
