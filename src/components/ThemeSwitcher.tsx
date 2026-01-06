'use client';

import { useState } from 'react';

import { useTheme } from '../lib/theme-context';

export default function ThemeSwitcher() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Don't render theme-dependent content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="group relative">
        <button
          className="relative inline-flex h-8 w-14 items-center justify-center rounded-full border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background active:scale-95 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700"
          aria-label="Theme switcher"
          title="Theme switcher"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Switch knob */}
          <div className="absolute h-6 w-6 translate-x-1 scale-100 transform rounded-full bg-white shadow-lg transition-all duration-300 dark:bg-gray-200" />

          {/* Sun icon placeholder */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
            <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={handleToggle}
        className="relative inline-flex h-8 w-14 items-center justify-center rounded-full border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background active:scale-95 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {/* Subtle background glow effect */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            theme === 'dark' ? 'via-indigo-500/5' : 'via-yellow-500/5'
          }`}
        />

        {/* Switch knob with enhanced styling */}
        <div
          className={`absolute h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-200 ${
            theme === 'light' ? 'translate-x-1' : 'translate-x-7'
          } ${isAnimating ? 'scale-95' : 'scale-100'} group-hover:shadow-xl`}
        />

        {/* Sun icon (light theme) */}
        <div
          className={`absolute left-2 top-1/2 -translate-y-1/2 transform transition-all duration-300 ${
            theme === 'light'
              ? 'translate-x-0 scale-100 opacity-100'
              : 'translate-x-2 scale-75 opacity-0'
          }`}
        >
          <div className="relative">
            <svg
              className="h-4 w-4 text-yellow-400 drop-shadow-sm"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
            {/* Sun rays effect */}
            <div
              className={`absolute inset-0 scale-150 rounded-full bg-yellow-300/20 opacity-0 blur-sm transition-opacity duration-300 ${
                theme === 'light' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Moon icon (dark theme) */}
        <div
          className={`absolute right-2 top-1/2 -translate-y-1/2 transform transition-all duration-300 ${
            theme === 'dark'
              ? 'translate-x-0 scale-100 opacity-100'
              : '-translate-x-2 scale-75 opacity-0'
          }`}
        >
          <div className="relative">
            <svg
              className="h-4 w-4 text-indigo-300 drop-shadow-sm"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            {/* Moon glow effect */}
            <div
              className={`absolute inset-0 scale-150 rounded-full bg-indigo-300/20 opacity-0 blur-sm transition-opacity duration-300 ${
                theme === 'dark' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </button>

      {/* Elegant tooltip with better positioning - only show when mounted */}
      {mounted && (
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 scale-95 transform rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-all duration-200 before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900 before:content-[''] group-hover:scale-100 group-hover:opacity-100">
          <span className="font-medium text-primary/80">Theme:</span>
          <span className="ml-2 font-semibold">{theme === 'light' ? 'Light' : 'Dark'}</span>
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-gradient-to-r from-gray-900 to-gray-800" />
        </div>
      )}
    </div>
  );
}
