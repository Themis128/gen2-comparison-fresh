'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Menu, X } from 'lucide-react';

import { useMobileMenu } from '@/hooks/useMobileMenu';

import { ResponsiveLogo } from './Logo';

export function MobileNavigation() {
  const { isOpen, toggle, close, menuRef, buttonRef } = useMobileMenu();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
        <div className="container flex h-14 items-center px-4">
          <ResponsiveLogo href="/" />

          <div className="flex flex-1 items-center justify-end space-x-2">
            <button
                ref={buttonRef}
                onClick={toggle}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary touch-manipulation"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <nav
            ref={menuRef}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background p-6 shadow-lg mobile-menu-enter"
          >
            <div className="flex items-center justify-between">
              <ResponsiveLogo />
              <button
                onClick={close}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground mobile-nav-item touch-manipulation"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
