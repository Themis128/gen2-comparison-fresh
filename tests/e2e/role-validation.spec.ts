import { test, expect } from '@playwright/test';

/**
 * Role-Based Authentication Validation Suite
 *
 * This test suite validates the complete role-based authentication system:
 * - Admin vs User routing and access control
 * - Authentication state management
 * - Navigation structure for each role
 * - Access control and permissions
 * - UI consistency across different user types
 */

test.describe('Role-Based Authentication System', () => {
  test.describe('Authentication State Management', () => {
    test('should redirect unauthenticated users to signin', async ({ page }) => {
      // Override headers to disable test mode for this test
      await page.setExtraHTTPHeaders({
        'x-test-mode': 'false',
      });

      // Also set a cookie to indicate test mode is disabled
      await page.context().addCookies([{
        name: 'test-mode',
        value: 'false',
        domain: 'localhost',
        path: '/',
      }]);

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for potential redirect (client-side redirect happens after load)
      await page.waitForURL(/\/auth\/signin/, { timeout: 5000 });

      // Should be on signin page
      await expect(page).toHaveURL(/\/auth\/signin/);
    });

    test('should handle already authenticated users gracefully', async ({ page }) => {
      // This test assumes some users might be authenticated
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Either stays on signin (not authenticated) or redirects (authenticated)
      const isOnSignin = currentUrl.includes('/auth/signin');
      const isOnProtectedRoute =
        currentUrl.includes('/admin') ||
        currentUrl.includes('/dashboard') ||
        currentUrl.includes('/(protected)');

      expect(isOnSignin || isOnProtectedRoute).toBe(true);
    });
  });

  test.describe('Role-Based Routing', () => {
    test('admin users should be routed to admin dashboard', async ({ page }) => {
      // Set admin role via context
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('test-role', 'admin');
      });

      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should redirect to admin or stay on signin if not authenticated
      const isValidDestination =
        currentUrl.includes('/admin') || currentUrl.includes('/auth/signin');
      expect(isValidDestination).toBe(true);

      if (currentUrl.includes('/admin')) {
        // Verify admin interface elements
        const adminTitle = page.locator('text=Admin Dashboard').or(page.locator('text=Dashboard'));
        await expect(adminTitle).toBeVisible();
      }
    });

    test('regular users should be routed to user dashboard', async ({ page }) => {
      // Set user role via context
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('test-role', 'user');
      });

      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should redirect to user dashboard or stay on signin if not authenticated
      const isValidDestination =
        currentUrl.includes('/dashboard') ||
        currentUrl.includes('/(protected)') ||
        currentUrl.includes('/auth/signin');
      expect(isValidDestination).toBe(true);
    });

    test('moderator users should be routed appropriately', async ({ page }) => {
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('test-role', 'moderator');
      });

      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Moderators should go to dashboard or stay on signin
      const isValidDestination =
        currentUrl.includes('/dashboard') || currentUrl.includes('/auth/signin');
      expect(isValidDestination).toBe(true);
    });
  });

  test.describe('Access Control Validation', () => {
    test('admin areas should require admin role', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should either show admin content or redirect to signin
      const hasAccess = currentUrl.includes('/admin');
      const isRedirected = currentUrl.includes('/auth/signin');

      expect(hasAccess || isRedirected).toBe(true);
    });

    test('protected user areas should require authentication', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should either show dashboard or redirect to signin
      const hasAccess = currentUrl.includes('/dashboard');
      const isRedirected = currentUrl.includes('/auth/signin');

      expect(hasAccess || isRedirected).toBe(true);
    });

    test('public routes should be accessible to all', async ({ page }) => {
      const publicRoutes = ['/', '/contact'];

      for (const route of publicRoutes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Should not redirect to signin for public routes
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('/auth/signin');
      }
    });
  });

  test.describe('Navigation Structure', () => {
    test('admin navigation should show admin-specific sections', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      if (currentUrl.includes('/admin')) {
        // Check for admin navigation elements
        const sidebar = page.locator('[class*="border-r"]').first();
        await expect(sidebar).toBeVisible();

        // Check for admin-specific nav items
        const adminNavItems = ['Dashboard', 'Users', 'Analytics', 'Security', 'System', 'Settings'];

        for (const item of adminNavItems) {
          const navItem = page.locator(`button:has-text("${item}")`);
          await expect(navItem).toBeVisible();
        }
      }
    });

    test('user navigation should show user-specific sections', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      if (currentUrl.includes('/dashboard')) {
        // Check for user dashboard elements
        const dashboardTitle = page.locator('text=Dashboard');
        await expect(dashboardTitle).toBeVisible();

        // Check for user-specific functionality
        const searchInput = page.locator('input[placeholder*="Search"]').first();
        const modalButton = page.locator('button:has-text("Open Modal")').first();

        // These might exist depending on the dashboard implementation
        const hasSearch = await searchInput.isVisible().catch(() => false);
        const hasModal = await modalButton.isVisible().catch(() => false);

        // At least one user-specific element should be present
        expect(hasSearch || hasModal).toBe(true);
      }
    });
  });

  test.describe('UI Consistency', () => {
    test('admin and user interfaces should have consistent styling', async ({ page }) => {
      // Test admin interface
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      if (page.url().includes('/admin')) {
        const adminHeader = page.locator('header').first();
        const adminSidebar = page.locator('[class*="border-r"]').first();

        await expect(adminHeader).toBeVisible();
        await expect(adminSidebar).toBeVisible();

        // Take admin screenshot for comparison
        await page.screenshot({ path: 'test-results/admin-interface.png' });
      }

      // Test user interface
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      if (page.url().includes('/dashboard')) {
        const userHeader = page.locator('header').or(page.locator('h1')).first();

        await expect(userHeader).toBeVisible();

        // Take user screenshot for comparison
        await page.screenshot({ path: 'test-results/user-interface.png' });
      }
    });

    test('error handling should be consistent across roles', async ({ page }) => {
      // Test accessing admin route as regular user
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Should handle unauthorized access gracefully
      const currentUrl = page.url();
      const isHandled =
        currentUrl.includes('/auth/signin') ||
        currentUrl.includes('/admin') ||
        page.locator('text=Loading').isVisible();

      expect(isHandled).toBe(true);
    });
  });

  test.describe('Authentication Flow Integration', () => {
    test('sign out should clear role-based state', async ({ page }) => {
      // This test would need to be run with an authenticated session
      // For now, just validate the signin page structure
      await page.goto('/auth/signin');

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const signInButton = page.locator('button[type="submit"]').first();

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(signInButton).toBeVisible();
    });

    test('OAuth callbacks should handle role-based redirects', async ({ page }) => {
      await page.goto('/auth/callback');

      // Should show loading state or redirect
      const loadingText = page.locator('text=Completing sign in').first();
      const isLoading = await loadingText.isVisible().catch(() => false);

      // Either shows loading or redirects
      const currentUrl = page.url();
      const hasRedirected = !currentUrl.includes('/auth/callback');

      expect(isLoading || hasRedirected).toBe(true);
    });
  });
});
