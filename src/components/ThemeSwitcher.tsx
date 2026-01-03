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
      <div className="relative group">
        <button
          className="relative inline-flex items-center justify-center w-14 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background hover:shadow-xl hover:shadow-primary/10 hover:scale-105 active:scale-95"
          aria-label="Theme switcher"
          title="Theme switcher"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Switch knob */}
          <div className="absolute w-6 h-6 rounded-full bg-white dark:bg-gray-200 shadow-lg transform translate-x-1 scale-100 transition-all duration-300" />
          
          {/* Sun icon placeholder */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleToggle}
        className="relative inline-flex items-center justify-center w-14 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background hover:shadow-xl hover:shadow-primary/10 hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {/* Subtle background glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          theme === 'dark' ? 'via-indigo-500/5' : 'via-yellow-500/5'
        }`} />
        
        {/* Switch knob with enhanced styling */}
        <div
          className={`absolute w-6 h-6 rounded-full bg-white dark:bg-gray-200 shadow-lg transform transition-all duration-300 ease-in-out ${
            theme === 'light' ? 'translate-x-1' : 'translate-x-7'
          } ${isAnimating ? 'scale-95' : 'scale-100'} group-hover:shadow-xl`}
        />
        
        {/* Sun icon (light theme) */}
        <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-2'
        }`}>
          <div className="relative">
            <svg className="w-4 h-4 text-yellow-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
            {/* Sun rays effect */}
            <div className={`absolute inset-0 rounded-full bg-yellow-300/20 blur-sm scale-150 opacity-0 transition-opacity duration-300 ${
              theme === 'light' ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
        </div>

        {/* Moon icon (dark theme) */}
        <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 -translate-x-2'
        }`}>
          <div className="relative">
            <svg className="w-4 h-4 text-indigo-300 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            {/* Moon glow effect */}
            <div className={`absolute inset-0 rounded-full bg-indigo-300/20 blur-sm scale-150 opacity-0 transition-opacity duration-300 ${
              theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
        </div>
      </button>
      
      {/* Elegant tooltip with better positioning - only show when mounted */}
      {mounted && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-95 group-hover:scale-100 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900">
          <span className="font-medium text-primary/80">Theme:</span>
          <span className="ml-2 font-semibold">
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-gray-900 to-gray-800 rotate-45" />
        </div>
      )}
    </div>
  );
}
