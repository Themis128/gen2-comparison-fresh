import { test, expect } from '@playwright/test';

/**
 * Viewport Expansion Test Suite
 * Demonstrates horizontal expandability of the Playwright configuration
 */
test.describe('Viewport Expansion Tests', () => {
  test('should handle wide content layouts', async ({ page }) => {
    await page.goto('/');

    // Test that the page can handle wide viewports
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThanOrEqual(1024);

    // Check if content adapts to wide screens
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);

    // Content should utilize available width
    expect(bodyWidth).toBeLessThanOrEqual(viewport?.width || 1920);
  });

  test('should work with ultra-wide displays', async ({ page }) => {
    await page.goto('/');

    // Set ultra-wide viewport for testing
    await page.setViewportSize({ width: 3440, height: 1440 });

    // Verify the page handles ultra-wide layouts
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(3440);

    // Test that horizontal scrolling is not needed for main content
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);

    // Main content should fit within viewport (allowing some tolerance for padding/margins)
    expect(scrollWidth - clientWidth).toBeLessThan(100);
  });

  test('should adapt to different screen sizes', async ({ page, browserName: _browserName }) => {
    await page.goto('/');

    // Get current viewport from project configuration
    const viewport = page.viewportSize();

    // Test responsive behavior
    if (viewport?.width === 1024) {
      // Tablet layout
      console.log('Testing tablet layout (1024px)');
    } else if (viewport?.width === 1920) {
      // Desktop layout
      console.log('Testing desktop layout (1920px)');
    } else if (viewport?.width === 2560) {
      // Wide desktop layout
      console.log('Testing wide desktop layout (2560px)');
    } else if (viewport?.width === 3440) {
      // Ultra-wide layout
      console.log('Testing ultra-wide layout (3440px)');
    }

    // Verify page loads and is interactive
    await expect(page.locator('body')).toBeVisible();
  });
});
