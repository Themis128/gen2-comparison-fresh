'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Menu, X, User, LogOut } from 'lucide-react';

import { useMobileMenu } from '@/hooks/useMobileMenu';
import { signOutUser } from '@/lib/useAuth';

import { ResponsiveLogo } from './Logo';

export function MobileNavigation() {
  const { isOpen, toggle, close, menuRef, buttonRef } = useMobileMenu();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="safe-area-top sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <ResponsiveLogo href="/" />

          <div className="flex flex-1 items-center justify-end space-x-2">
            <button
              ref={buttonRef}
              onClick={toggle}
              className="inline-flex touch-manipulation items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
            className="mobile-menu-enter fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background p-6 shadow-lg"
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
                    className="mobile-nav-item block touch-manipulation rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* User Actions */}
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => {
                      close();
                      // Profile functionality could be added here
                    }}
                    className="mobile-nav-item flex w-full touch-manipulation items-center rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      close();
                      handleSignOut();
                    }}
                    className="mobile-nav-item flex w-full touch-manipulation items-center rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
