import { test, expect } from '@playwright/test';

test.describe('Admin Routing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode and admin role
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
      (window as any).__TEST_USER_ROLE = 'admin';
    });
  });

  test('Admin user can access /admin in test mode', async ({ page }) => {
    await page.goto('/admin');

    // Should load admin page without redirect
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Admin Panel').or(page.locator('text=Dashboard'))).toBeVisible();
  });

  test('Sidebar navigation works for admin sections', async ({ page }) => {
    await page.goto('/admin');

    // Check for navigation elements
    const navElements = [
      page.locator('button:has-text("Users")').or(page.locator('[data-testid*="user"]')),
      page.locator('button:has-text("Analytics")').or(page.locator('[data-testid*="analytic"]')),
      page.locator('button:has-text("Settings")').or(page.locator('[data-testid*="setting"]')),
    ];

    // At least some navigation should be present
    let navFound = false;
    for (const nav of navElements) {
      if ((await nav.count()) > 0) {
        navFound = true;
        break;
      }
    }
    expect(navFound).toBe(true);
  });

  test('Admin dashboard shows key metrics', async ({ page }) => {
    await page.goto('/admin');

    // Check for dashboard metrics (adjust based on actual content)
    const metrics = [
      page.locator('text=Total Users').or(page.locator('text=Users')),
      page.locator('text=Active').or(page.locator('text=Status')),
      page.locator('text=System').or(page.locator('text=Performance')),
    ];

    // At least some metrics should be visible
    let metricsFound = false;
    for (const metric of metrics) {
      if ((await metric.count()) > 0) {
        metricsFound = true;
        break;
      }
    }
    expect(metricsFound).toBe(true);
  });

  test('User management interface is accessible', async ({ page }) => {
    await page.goto('/admin');

    // Look for user management elements
    const userElements = [
      page.locator('table').or(page.locator('.user-list')),
      page.locator('button:has-text("Add")').or(page.locator('[data-testid*="add"]')),
      page.locator('input[type="search"]').or(page.locator('[placeholder*="search"]')),
    ];

    // At least some user management elements should be present
    let userElementsFound = false;
    for (const element of userElements) {
      if ((await element.count()) > 0) {
        userElementsFound = true;
        break;
      }
    }
    expect(userElementsFound).toBe(true);
  });

  test('Admin page maintains responsive design', async ({ page }) => {
    await page.goto('/admin');
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    // Check that key elements are still accessible on mobile
    await expect(page.locator('body')).toBeVisible();
    // Navigation should still be usable
    const navToggle = page
      .locator('button[aria-label*="menu"]')
      .or(page.locator('.mobile-menu-toggle'));
    if ((await navToggle.count()) > 0) {
      await expect(navToggle).toBeVisible();
    }
  });
});
