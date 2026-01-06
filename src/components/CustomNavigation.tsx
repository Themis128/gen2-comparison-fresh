'use client';

import React from 'react';

import Image from 'next/image';

import { Menu } from 'lucide-react';

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

  const navItems = [
    { label: 'Home', href: '#about' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Languages', href: '#languages' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

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
                onClick={() => scrollToSection(item.href.substring(1))}
                className="nav-accent group relative font-mono font-medium text-gray-600 transition-all duration-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-white"
                aria-label={item.label}
              >
                {item.label}
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
                    onClick={() => scrollToSection(item.href.substring(1))}
                    className="justify-start font-medium"
                  >
                    {item.label}
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
