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
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

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
              onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
              className="flex w-full items-center justify-between py-2 text-base font-medium text-foreground transition-colors hover:text-primary"
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
              <div className="animate-in slide-in-from-top-2 space-y-2 pl-4">
                {item.children.map((child) => (
                  <button
                    key={child.label}
                    onClick={() => handleNavClick(child)}
                    className="block w-full py-2 text-left text-sm text-muted-foreground transition-colors hover:text-primary"
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
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  className="w-full cursor-pointer text-left"
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
            ? 'block w-full py-2 text-left text-base font-medium text-foreground transition-colors hover:text-primary'
            : 'rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        }`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border bg-background/80 shadow-sm backdrop-blur-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="group flex items-center gap-3"
            aria-label="Home"
          >
            <div className="text-2xl font-bold text-foreground transition-colors hover:text-primary">
              {logo}
            </div>
          </button>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          <div className="flex items-center gap-2">
            {showThemeToggle && <ThemeSwitcher />}
            <UserSession />

            <Button asChild className="hidden md:inline-flex" size="sm">
              <button onClick={() => scrollToSection('contact')}>{ctaText}</button>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="mt-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => renderNavItem(item, true))}
                  </div>
                  <Button asChild className="w-full">
                    <button onClick={() => scrollToSection('contact')}>{ctaText}</button>
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
