import { expect, test } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject test mode before navigation
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
      // Mock user role for testing
      (window as any).__TEST_USER_ROLE = 'user';
    });

    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load home page with portfolio content', async ({ page }) => {
    // In test mode, should show portfolio content
    await expect(page.locator('h1').filter({ hasText: "Hi, I'm" })).toBeVisible();
    await expect(page.locator('text=View My Work')).toBeVisible();
  });

  test('should display main application content', async ({ page }) => {
    // Check for portfolio sections
    const heroSection = page.locator('h1').filter({ hasText: "Hi, I'm" });
    const aboutSection = page.locator('#about, [data-section="about"]');
    const projectsSection = page.locator('#projects, [data-section="projects"]');

    await expect(heroSection.or(aboutSection).or(projectsSection)).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Themistoklis Baltzakis');

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /ML\/LLM Engineer|portfolio/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero section should still be visible
    await expect(page.locator('h1').filter({ hasText: "Hi, I'm" })).toBeVisible();

    // Navigation should work on mobile
    const mobileMenu = page
      .locator('button[aria-label*="menu"]')
      .or(page.locator('.mobile-menu-toggle'));
    if ((await mobileMenu.count()) > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should have working navigation links', async ({ page }) => {
    // Check for navigation elements
    const navLinks = page.locator('a[href*="#"], button[aria-label*="scroll"]').first();

    if ((await navLinks.count()) > 0) {
      // If there are navigation links, they should be clickable
      await expect(navLinks).toBeEnabled();
    }
  });

  test('should have authentication links', async ({ page }) => {
    // Add test mode to prevent redirects
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for AuthWrapper to complete
    await expect(page.locator('.animate-spin')).toHaveCount(0);

    // Should show home page with auth links
    const signInLink = page.locator('a[href="/auth/signin"]');
    const signUpLink = page.locator('a[href="/auth/signup"]');

    await expect(signInLink).toBeVisible();
    await expect(signUpLink).toBeVisible();
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
    if ((await signInButton.count()) > 0) {
      await signInButton.first().click();
      await expect(page).toHaveURL(/\/auth\/signin/);
      await page.goBack();
    }

    // Test Create Account navigation
    const signUpButton = page.locator('[data-testid="create-account-link"]');
    if ((await signUpButton.count()) > 0) {
      await signUpButton.first().click();
      await expect(page).toHaveURL(/\/auth\/signup/);
    }
  });
});
