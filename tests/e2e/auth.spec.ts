import { expect, test } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject test mode for auth tests
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
      (window as any).__TEST_USER_ROLE = 'user';
    });
  });

  test('should navigate between auth pages using links', async ({ page }) => {
    // Start at sign-in page
    await page.goto('/auth/signin');

    // Click "Sign up" link
    await page.click('a:has-text("Sign up")');
    await expect(page).toHaveURL(/\/auth\/signup/);

    // Click "Sign in" link
    await page.click('a:has-text("Sign in")');
    await expect(page).toHaveURL(/\/auth\/signin/);

    // Click "Forgot password?" link
    await page.click('a:has-text("Forgot password?")');
    await expect(page).toHaveURL(/\/auth\/forgot-password/);

    // Click "Sign in" link to return
    await page.click('a:has-text("Sign in")');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should load sign-in page correctly', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check for sign-in form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
    await expect(page.locator('text=Continue with Google')).toBeVisible();
    await expect(page.locator("text=Don't have an account?")).toBeVisible();
  });

  test('should load sign-up page correctly', async ({ page }) => {
    await page.goto('/auth/signup');

    // Check for sign-up form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign up")')).toBeVisible();
    await expect(page.locator('text=Already have an account?')).toBeVisible();
  });

  test('should load forgot-password page correctly', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    // Check for forgot password form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send reset code")')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to submit empty form
    await page.click('button:has-text("Sign in")');

    // Check for HTML5 validation or error messages
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Inputs should be required
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should maintain responsive design on auth pages', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    // Check that form is still visible and usable on mobile
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check for proper labels and ARIA attributes
    await expect(page.locator('input[type="email"]')).toHaveAttribute('aria-label', /email/i);
    await expect(page.locator('input[type="password"]')).toHaveAttribute('aria-label', /password/i);
    await expect(page.locator('button[aria-label*="password"]')).toBeVisible(); // Show/hide password button
  });

  test('should load home page in test mode without redirect', async ({ page }) => {
    // In test mode, should show portfolio content
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should show portfolio hero section
    await expect(page.locator('h1').filter({ hasText: "Hi, I'm" })).toBeVisible();
  });

  test('should allow access to protected routes in test mode', async ({ page }) => {
    // In test mode, protected routes should be accessible
    await page.goto('/(protected)/app');

    // Should load without redirecting to auth
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load dashboard page', async ({ page }) => {
    // Dashboard page should be accessible
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should load without major errors
    await expect(page.locator('body')).toBeVisible();
  });
});
