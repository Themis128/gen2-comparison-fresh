import { expect, test } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject test mode before navigation
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
    });

    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for any dynamic content to be ready
    await page.waitForTimeout(1000);
  });

  test('should load home page with correct title and meta tags', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Themistoklis Baltzakis/);

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]').first();
    await expect(metaDescription).toHaveAttribute('content', /ML.*Engineer|Software Engineer/);

    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check hero section exists
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // Verify hero content
    await expect(page.locator('h1').filter({ hasText: 'Hi, I\'m' })).toBeVisible();
    await expect(page.locator('h1').filter({ hasText: 'Themistoklis Baltzakis' })).toBeVisible();
    await expect(page.locator('#hero').getByText(/ML\/LLM Engineer/).first()).toBeVisible();

    // Check for call-to-action buttons
    await expect(page.locator('button').filter({ hasText: /Get In Touch/i })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /View Resume/i })).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    const sections = ['about', 'skills', 'experience', 'projects', 'contact'];

    for (const section of sections) {
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeVisible();

      // Scroll to section to ensure it's in viewport
      await sectionElement.scrollIntoViewIfNeeded();
      await expect(sectionElement).toBeInViewport();
    }
  });

  test('should have working navigation', async ({ page }) => {
    // Check navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Test desktop navigation
    const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

    for (const linkText of navLinks) {
      const link = page.locator(`nav button:has-text("${linkText}")`).filter({ visible: true }).first();
      await expect(link).toBeVisible();

      // Click navigation link
      await link.click();

      // Verify we scrolled to the correct section
      await expect(page.locator(`#${linkText.toLowerCase()}`)).toBeInViewport();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile navigation (hamburger menu)
    const mobileMenu = page.locator('button[aria-label="Open menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }

    // Verify hero content is still visible
    await expect(page.locator('h1').filter({ hasText: 'Hi, I\'m' })).toBeVisible();

    // Test scrolling on mobile
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      // Some images might be decorative or have empty alt, but they should have the attribute
      await expect(img).toHaveAttribute('alt');
    }

    // Check for proper form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if (await label.count() > 0) {
          await expect(label).toBeVisible();
        }
      }
    }
  });

  test('should handle smooth scrolling', async ({ page }) => {
    // Click on a navigation link
    await page.locator('nav button:has-text("About")').filter({ visible: true }).first().click();

    // Wait for scroll to complete
    await page.waitForTimeout(500);

    // Verify we're at the about section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();

    // Check scroll position
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
  });

  test('should have working theme toggle', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(300);

      // Verify theme changed
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});
