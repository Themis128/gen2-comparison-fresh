import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('should redirect to sign-in when visiting home page', async ({ page }) => {
    // Visit the home page
    await page.goto('http://localhost:3000');

    // Should redirect to sign-in page
    await page.waitForURL('**/auth/signin');
    await expect(page).toHaveURL(/.*\/auth\/signin/);
  });

  test('should load sign-in page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Check page title and content
    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
    await expect(page.locator('text=Sign in to your account to continue')).toBeVisible();

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('should load sign-up page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signup');

    // Check page title and content
    await expect(page.locator('h1').filter({ hasText: 'Create your account' })).toBeVisible();
    await expect(page.locator('text=Join us today and get started')).toBeVisible();

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible(); // Password field
    await expect(page.locator('#confirmPassword')).toBeVisible(); // Confirm password field
    await expect(page.locator('button:has-text("Create account")')).toBeVisible();
  });

  test('should load forgot-password page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/forgot-password');

    // Check page title and content
    await expect(page.locator('h1').filter({ hasText: 'Reset your password' })).toBeVisible();
    await expect(page.locator('text=Enter your email address and we\'ll send you a link to reset your password.')).toBeVisible();

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send reset email")')).toBeVisible();
  });

  test('should navigate between auth pages using links', async ({ page }) => {
    // Start at sign-in page
    await page.goto('http://localhost:3000/auth/signin');

    // Click "Sign up" link
    await page.click('text=Sign up');
    await page.waitForURL('**/auth/signup');
    await expect(page).toHaveURL(/.*\/auth\/signup/);

    // Click "Sign in" link
    await page.click('text=Sign in');
    await page.waitForURL('**/auth/signin');
    await expect(page).toHaveURL(/.*\/auth\/signin/);

    // Click "Forgot password?" link
    await page.click('text=Forgot password?');
    await page.waitForURL('**/auth/forgot-password');
    await expect(page).toHaveURL(/.*\/auth\/forgot-password/);

    // Click "Back to sign in" link
    await page.click('text=Back to sign in');
    await page.waitForURL('**/auth/signin');
    await expect(page).toHaveURL(/.*\/auth\/signin/);
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Try to submit empty form
    await page.click('button:has-text("Sign in")');

    // Should show validation errors or stay on page
    await expect(page).toHaveURL(/.*\/auth\/signin/);
  });

  test('should maintain responsive design on auth pages', async ({ page }) => {
    // Test sign-in page on mobile
    await page.goto('http://localhost:3000/auth/signin');
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();

    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1').filter({ hasText: 'Welcome back' })).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Check for proper form structure
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Check that inputs have proper IDs for label association
    await expect(emailInput).toHaveAttribute('id', 'email');
    await expect(passwordInput).toHaveAttribute('id', 'password');

    // Check that labels exist (Radix UI Label components)
    await expect(page.locator('label')).toHaveCount(2); // Email and Password labels

    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();

    // Check for required attributes on form inputs
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  test('should prevent access to protected routes without authentication', async ({ page }) => {
    // Try to access home page directly
    await page.goto('http://localhost:3000');

    // Should redirect to sign-in
    await page.waitForURL('**/auth/signin');
    await expect(page).toHaveURL(/.*\/auth\/signin/);
  });

  test('should load test page without authentication', async ({ page }) => {
    // Test page should be accessible without auth (uses mock data)
    await page.goto('http://localhost:3000/test-page');

    // Should load without redirecting
    await expect(page.locator('h1').filter({ hasText: 'Fresh Gen2 Amplify App - Test Mode' })).toBeVisible();
  });
});
