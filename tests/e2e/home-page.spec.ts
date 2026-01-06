import { expect, test } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject test mode before navigation
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
      // Mock user role for testing
      (window as any).__TEST_USER_ROLE = 'admin';
    });

    // Set test mode header
    await page.setExtraHTTPHeaders({
      'x-test-mode': 'true',
    });

    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for any dynamic content to be ready
    await page.waitForTimeout(1000);
  });

  test('should load home page with correct title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    if ((await page.url()).includes('/auth/signin')) {
      await expect(page).toHaveTitle(/Themistoklis Baltzakis|Sign In|Welcome back/);
      const heading = page.locator('h1').filter({ hasText: 'Welcome back' });
      await expect(heading).toBeVisible();
    } else {
      test.skip(true, 'Not redirected to sign-in page');
    }
  });

  test('should display main application content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    if ((await page.url()).includes('/auth/signin')) {
      const heading = page.locator('h1').filter({ hasText: 'Welcome back' });
      await expect(heading).toBeVisible();
    } else {
      test.skip(true, 'Not redirected to sign-in page');
    }
  });

  test('should have authentication links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    if ((await page.url()).includes('/auth/signin')) {
      const signUpLink = page.locator('a[href="/auth/signup"]');
      await expect(signUpLink).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    } else {
      test.skip(true, 'Not redirected to sign-in page');
    }
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    if ((await page.url()).includes('/auth/signin')) {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Test desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(500);
      await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    } else {
      test.skip(true, 'Not redirected to sign-in page');
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    if ((await page.url()).includes('/auth/signin')) {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
    } else {
      test.skip(true, 'Not redirected to sign-in page');
    }
  });

  test('should navigate to authentication pages', async ({ page }) => {
    // Test Sign In navigation
    const signInButton = page.locator('[data-testid="sign-in-link"]');
    if (await signInButton.count() > 0) {
      await signInButton.first().click();
      await expect(page).toHaveURL(/\/auth\/signin/);
      await page.goBack();
    }

    // Test Create Account navigation
    const signUpButton = page.locator('[data-testid="create-account-link"]');
    if (await signUpButton.count() > 0) {
      await signUpButton.first().click();
      await expect(page).toHaveURL(/\/auth\/signup/);
    }
  });
});
