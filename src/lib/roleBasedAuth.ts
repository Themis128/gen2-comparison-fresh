'use client';

import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  groups: string[];
  isEmailVerified: boolean;
}

/**
 * Enhanced role detection logic
 * Combines Cognito groups with email-based role detection
 */
export const detectUserRole = (email: string, groups: string[] = []): UserRole => {
  // First check Cognito groups (most authoritative)
  if (groups.includes('admin')) return 'admin';
  if (groups.includes('moderator')) return 'moderator';
  if (groups.includes('user')) return 'user';

  // Fallback to email-based detection for backward compatibility
  const emailLower = email.toLowerCase();

  // Admin patterns
  if (
    emailLower.includes('admin') ||
    emailLower.endsWith('@admin.com') ||
    emailLower.endsWith('@company.com') ||
    emailLower.endsWith('@cloudless.com') ||
    emailLower === 'tbaltzakis@cloudless.com'
  ) {
    return 'admin';
  }

  // Moderator patterns
  if (
    emailLower.includes('moderator') ||
    emailLower.includes('mod') ||
    emailLower.endsWith('@mod.com')
  ) {
    return 'moderator';
  }

  // Default to user role
  return 'user';
};

/**
 * Get current authenticated user with role information
 */
export const getCurrentAuthUser = async (): Promise<AuthUser | null> => {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();

    const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];
    const email = user.signInDetails?.loginId || '';
    const role = detectUserRole(email, groups);

    return {
      id: user.userId,
      email,
      name: user.signInDetails?.loginId, // Can be enhanced with user attributes
      role,
      groups,
      isEmailVerified: true, // Can be enhanced with verification status
    };
  } catch (error) {
    console.error('Error getting current auth user:', error);
    return null;
  }
};

/**
 * Role hierarchy for permission checking
 */
const roleHierarchy: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  moderator: 2,
  admin: 3,
};

/**
 * Check if user has required permission level
 */
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Route permissions configuration
 */
export const routePermissions: Record<string, UserRole> = {
  '/': 'guest',
  '/auth/*': 'guest',
  '/contact': 'guest',
  '/dashboard': 'user',
  '/(protected)/*': 'user',
  '/admin': 'admin',
  '/admin/*': 'admin',
  '/api/admin/*': 'admin',
  '/api/dashboard/*': 'user',
};

/**
 * Check if user can access a route
 */
export const canAccessRoute = (route: string, userRole: UserRole): boolean => {
  // Find matching route permission
  for (const [routePattern, requiredRole] of Object.entries(routePermissions)) {
    if (routePattern.includes('*')) {
      const baseRoute = routePattern.replace('/*', '');
      if (route.startsWith(baseRoute)) {
        return hasPermission(userRole, requiredRole);
      }
    } else if (route === routePattern) {
      return hasPermission(userRole, requiredRole);
    }
  }

  // Default to user role requirement for protected routes
  return hasPermission(userRole, 'user');
};

/**
 * Get redirect route based on user role
 */
export const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'moderator':
      return '/dashboard';
    case 'user':
      return '/(protected)/app';
    default:
      return '/auth/signin';
  }
};

/**
 * Enhanced middleware helper for role-based routing
 */
export const checkRouteAccess = async (pathname: string): Promise<{
  allowed: boolean;
  redirectTo?: string;
  role?: UserRole;
}> => {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return {
        allowed: false,
        redirectTo: '/auth/signin',
      };
    }

    const canAccess = canAccessRoute(pathname, user.role);

    if (!canAccess) {
      return {
        allowed: false,
        redirectTo: getRoleBasedRedirect(user.role),
        role: user.role,
      };
    }

    return {
      allowed: true,
      role: user.role,
    };
  } catch (error) {
    console.error('Error checking route access:', error);
    return {
      allowed: false,
      redirectTo: '/auth/signin',
    };
  }
};
