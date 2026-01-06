import { test, expect } from '@playwright/test';

test.describe('Admin Routing Flow', () => {
  test('Redirects unauthenticated user from /admin to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/auth|login|signin/);
  });

  test('Authenticated user can access /admin and see dashboard', async ({ page }) => {
    // Simulate login (replace with actual login steps if needed)
    await page.goto('/auth/signin');
    // Example login steps (customize selectors as needed)
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard|admin/);
    // Go to admin page
    await page.goto('/admin');
    await expect(page.locator('text=Admin Panel')).toBeVisible();
    await expect(page.locator('text=User Management')).toBeVisible();
  });

  test('Sidebar navigation works for admin sections', async ({ page }) => {
    // Simulate login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.goto('/admin');
    // Click sidebar items and check content
    await page.click('button:has-text("Users")');
    await expect(page.locator('text=User Management')).toBeVisible();
    await page.click('button:has-text("Dashboard")');
    await expect(page.locator('text=Total Users')).toBeVisible();
    await page.click('button:has-text("Analytics")');
    await expect(page.locator('text=System Performance')).toBeVisible();
  });

  test('Admin can add a new user', async ({ page }) => {
    // Simulate login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.goto('/admin');
    // Open Add User dialog
    await page.click('button:has-text("Add User")');
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', 'testuser@example.com');
    await page.selectOption('select#role', 'User');
    await page.click('button:has-text("Create User")');
    // Check for new user in table
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=testuser@example.com')).toBeVisible();
  });
});
