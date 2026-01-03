'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  listenToAuthEvents,
  listenToSpecificAuthEvents,
  logAuthEvents,
  type AuthEventType,
  type AuthEventData,
  checkAuthStatus,
  type UserInfo
} from './useAuth';

// Re-export types for components
export type { AuthEventType, AuthEventData };

/**
 * Hook for listening to all auth events
 * @param callback - Function to call when auth events occur
 * @param enabled - Whether to start listening (default: true)
 * @returns Object with current user state and auth status
 */
export const useAuthEvents = (
  callback?: (data: AuthEventData) => void,
  enabled: boolean = true
) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<AuthEventData | null>(null);

  const handleAuthEvent = useCallback((data: AuthEventData) => {
    setLastEvent(data);

    // Update user state based on auth events
    switch (data.event) {
      case 'signedIn':
      case 'tokenRefresh':
        // Refresh user info when signed in or tokens refreshed
        checkAuthStatus().then(setUser).catch(() => setUser(null));
        break;
      case 'signedOut':
        setUser(null);
        break;
    }

    // Call user-provided callback
    callback?.(data);
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // Initial user check
    checkAuthStatus()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    // Start listening to auth events
    const stopListening = listenToAuthEvents(handleAuthEvent);

    return () => {
      stopListening();
    };
  }, [enabled, handleAuthEvent]);

  return {
    user,
    isLoading,
    lastEvent,
    isAuthenticated: !!user,
  };
};

/**
 * Hook for listening to specific auth events
 * @param events - Array of events to listen for
 * @param callback - Function to call when specified events occur
 * @param enabled - Whether to start listening (default: true)
 * @returns Object with current user state and auth status
 */
export const useSpecificAuthEvents = (
  events: AuthEventType[],
  callback?: (data: AuthEventData) => void,
  enabled: boolean = true
) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<AuthEventData | null>(null);

  const handleAuthEvent = useCallback((data: AuthEventData) => {
    setLastEvent(data);

    // Update user state based on auth events
    switch (data.event) {
      case 'signedIn':
      case 'tokenRefresh':
        checkAuthStatus().then(setUser).catch(() => setUser(null));
        break;
      case 'signedOut':
        setUser(null);
        break;
    }

    callback?.(data);
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // Initial user check
    checkAuthStatus()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    // Start listening to specific auth events
    const stopListening = listenToSpecificAuthEvents(events, handleAuthEvent);

    return () => {
      stopListening();
    };
  }, [events, enabled, handleAuthEvent]);

  return {
    user,
    isLoading,
    lastEvent,
    isAuthenticated: !!user,
  };
};

/**
 * Hook for logging auth events to console
 * @param events - Optional array of events to log (logs common events if not specified)
 * @param enabled - Whether to start logging (default: true in development, false in production)
 * @returns Function to stop logging
 */
export const useAuthEventLogger = (
  events?: AuthEventType[],
  enabled: boolean = process.env.NODE_ENV === 'development'
) => {
  useEffect(() => {
    if (!enabled) return;

    const stopLogging = logAuthEvents(events);

    return () => {
      stopLogging();
    };
  }, [events, enabled]);
};

/**
 * Hook for auth state management with event-driven updates
 * This is a convenience hook that combines auth event listening with state management
 */
export const useAuthState = () => {
  const [authState, setAuthState] = useState<{
    user: UserInfo | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    lastEvent: AuthEventData | null;
  }>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    lastEvent: null,
  });

  const handleAuthEvent = useCallback((data: AuthEventData) => {
    setAuthState(prev => ({
      ...prev,
      lastEvent: data,
    }));

    // Update auth state based on events
    switch (data.event) {
      case 'signedIn':
      case 'tokenRefresh':
        checkAuthStatus()
          .then(user => setAuthState(prev => ({
            ...prev,
            user,
            isAuthenticated: !!user,
            isLoading: false,
          })))
          .catch(() => setAuthState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })));
        break;
      case 'signedOut':
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        break;
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    checkAuthStatus()
      .then(user => setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        lastEvent: null,
      }))
      .catch(() => setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastEvent: null,
      }));

    // Listen to auth events
    const stopListening = listenToAuthEvents(handleAuthEvent);

    return () => {
      stopListening();
    };
  }, [handleAuthEvent]);

  return authState;
};