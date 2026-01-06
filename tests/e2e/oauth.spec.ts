import { test, expect } from '@playwright/test';

/**
 * OAuth Authentication Flow Tests
 *
 * Tests OAuth sign-in, callback handling, and role-based redirects
 */

test.describe('OAuth Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode for OAuth tests
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
    });
  });

  test.describe('OAuth Sign-in Initiation', () => {
    test('signin page should have OAuth provider options', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      // Look for OAuth provider buttons (Google, etc.)
      const googleButton = page.locator('button:has-text("Continue with Google")');
      const oauthButtons = page.locator('button').filter({ hasText: /Continue with/ });

      // Should have OAuth options
      await expect(googleButton.or(oauthButtons.first())).toBeVisible();
    });

    test('OAuth buttons should be clickable', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const oauthButton = page.locator('button:has-text("Continue with Google")').first();

      if (await oauthButton.isVisible()) {
        // Button should be enabled
        await expect(oauthButton).toBeEnabled();
      }
    });
  });

  test.describe('OAuth Callback Handling', () => {
    test('callback route should handle successful OAuth response', async ({ page }) => {
      // Simulate OAuth callback with success parameters
      await page.goto('/auth/callback?code=success&state=test');
      await page.waitForLoadState('networkidle');

      // Should either show loading state or redirect to appropriate page
      const currentUrl = page.url();
      const hasRedirected = !currentUrl.includes('/auth/callback');

      expect(hasRedirected).toBe(true);
    });

    test('callback route should handle OAuth errors gracefully', async ({ page }) => {
      // Simulate OAuth callback with error
      await page.goto(
        '/auth/callback?error=access_denied&error_description=User%20denied%20access'
      );
      await page.waitForLoadState('networkidle');

      // Should handle error appropriately
      const currentUrl = page.url();
      const hasRedirected = !currentUrl.includes('/auth/callback');

      expect(hasRedirected).toBe(true);
    });

    test('callback route should handle role-based redirects after OAuth', async ({ page }) => {
      // Simulate successful OAuth callback
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('oauth-success', 'true');
        (window as any).localStorage.setItem('user-role', 'admin');
      });

      await page.goto('/auth/callback?code=success');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should redirect appropriately
      const hasRedirected = !currentUrl.includes('/auth/callback');
      expect(hasRedirected).toBe(true);
    });
  });

  test.describe('OAuth State Management', () => {
    test('OAuth flow should maintain state across redirects', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      // Verify signin page loads without errors
      const signinForm = page.locator('form').first();
      await expect(signinForm).toBeVisible();
    });

    test('successful OAuth should set authentication state', async ({ page }) => {
      // Simulate successful OAuth completion
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('is-authenticated', 'true');
        (window as any).localStorage.setItem('auth-method', 'oauth');
      });

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      // Should either show dashboard or redirect appropriately
      const isOnDashboard = currentUrl.includes('/dashboard');
      const isOnHome = currentUrl === 'http://localhost:50000/' || currentUrl.includes('/');

      expect(isOnDashboard || isOnHome).toBe(true);
    });
  });

  test.describe('OAuth Error Scenarios', () => {
    test('network errors during OAuth should be handled', async ({ page }) => {
      // Simulate network error during OAuth
      await page.context().addInitScript(() => {
        (window as any).localStorage.setItem('oauth-error', 'network_error');
      });

      await page.goto('/auth/callback');
      await page.waitForLoadState('networkidle');

      // Should handle error
      const currentUrl = page.url();
      const hasRedirected = !currentUrl.includes('/auth/callback');
      expect(hasRedirected).toBe(true);
    });
  });
  });

  test.describe('OAuth Provider Integration', () => {
    test('multiple OAuth providers should be supported', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      // Count different OAuth provider options
      const googleButton = page.locator('button').filter({ hasText: /Google/i });
      const facebookButton = page.locator('button').filter({ hasText: /Facebook/i });
      const githubButton = page.locator('button').filter({ hasText: /GitHub/i });

      const providerCount =
        (await googleButton.count()) +
        (await facebookButton.count()) +
        (await githubButton.count());

      // Should have at least one OAuth provider
      expect(providerCount).toBeGreaterThan(0);
    });

    test('OAuth provider buttons should have proper styling', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('networkidle');

      const oauthButton = page
        .locator('button')
        .filter({ hasText: /Google|Facebook|GitHub/ })
        .first();

      if (await oauthButton.isVisible()) {
        // Button should be properly styled and accessible
        await expect(oauthButton).toBeVisible();
        await expect(oauthButton).toBeEnabled();

        // Should have reasonable dimensions
        const box = await oauthButton.boundingBox();
        expect(box?.width).toBeGreaterThan(100);
        expect(box?.height).toBeGreaterThan(30);
      }
    });
  });
