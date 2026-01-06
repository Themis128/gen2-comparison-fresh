'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ChevronDown, Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';


import ThemeSwitcher from './ThemeSwitcher';
import UserSession from './UserSession';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavigationProps {
  logo?: string;
  navItems?: NavItem[];
  showThemeToggle?: boolean;
  ctaText?: string;
}

const ModernNavigation: React.FC<NavigationProps> = ({
  logo = 'TBaltzakis',
  navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'AI Generator', href: '/ai-generator' },
    { label: 'Contact', href: '#contact' },
  ],
  showThemeToggle = true,
  ctaText = 'Get Started',
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
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
    setMobileOpen(false);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.href.startsWith('#')) {
      scrollToSection(item.href.substring(1));
    } else if (item.href.startsWith('/')) {
      // Use Next.js router for client-side navigation
      router.push(item.href);
    }
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    if (item.children && item.children.length > 0) {
      if (isMobile) {
        return (
          <div key={item.label} className="space-y-2">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === item.label ? null : item.label)
              }
              className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors py-2 text-base font-medium"
              aria-expanded={openDropdown === item.label}
              aria-haspopup="true"
            >
              {item.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openDropdown === item.label ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openDropdown === item.label && (
              <div className="pl-4 space-y-2 animate-in slide-in-from-top-2">
                {item.children.map((child) => (
                  <button
                    key={child.label}
                    onClick={() => handleNavClick(child)}
                    className="block text-muted-foreground hover:text-primary transition-colors py-2 text-sm w-full text-left"
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
              aria-haspopup="true"
            >
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {item.children.map((child) => (
              <DropdownMenuItem key={child.label} asChild>
                <button
                  onClick={() => handleNavClick(child)}
                  className="cursor-pointer w-full text-left"
                >
                  {child.label}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <button
        key={item.label}
        onClick={() => handleNavClick(item)}
        className={`${
          isMobile
            ? 'block text-foreground hover:text-primary transition-colors py-2 text-base font-medium w-full text-left'
            : 'text-foreground hover:text-primary transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1'
        }`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
            aria-label="Home"
          >
            <div className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              {logo}
            </div>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          <div className="flex items-center gap-2">
            {showThemeToggle && <ThemeSwitcher />}
            <UserSession />

            <Button asChild className="hidden md:inline-flex" size="sm">
              <button onClick={() => scrollToSection('contact')}>
                {ctaText}
              </button>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => renderNavItem(item, true))}
                  </div>
                  <Button asChild className="w-full">
                    <button onClick={() => scrollToSection('contact')}>
                      {ctaText}
                    </button>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavigation;
