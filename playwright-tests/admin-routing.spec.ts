import { test, expect } from '@playwright/test';

// Admin routing flow after login

test.describe('Admin Routing Flow', () => {
  test('Redirects unauthenticated user from /admin to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/auth|login|signin/);
  });

  test('Authenticated admin user can access /admin and see dashboard', async ({ page }) => {
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
    await expect(page.locator('text=Dashboard')).toBeVisible(); // Header title
    await expect(page.locator('text=Total Users')).toBeVisible(); // Dashboard metrics
  });

  test('Sidebar navigation works for admin sections', async ({ page }) => {
    // Simulate login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.goto('/admin');

    // Test Dashboard section (default)
    await expect(page.locator('h1')).toHaveText('Dashboard');
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();

    // Click Users section
    await page.click('button:has-text("Users")');
    await expect(page.locator('h1')).toHaveText('Users');
    await expect(page.locator('text=User Management')).toBeVisible();
    await expect(page.locator('text=Search users')).toBeVisible();

    // Click Analytics section
    await page.click('button:has-text("Analytics")');
    await expect(page.locator('h1')).toHaveText('Analytics');
    await expect(page.locator('text=Analytics Coming Soon')).toBeVisible();

    // Click System section
    await page.click('button:has-text("System")');
    await expect(page.locator('h1')).toHaveText('System');
    await expect(page.locator('text=System Monitoring')).toBeVisible();
    await expect(page.locator('text=CPU Usage')).toBeVisible();

    // Click Settings section
    await page.click('button:has-text("Settings")');
    await expect(page.locator('h1')).toHaveText('Settings');
    await expect(page.locator('text=Settings Coming Soon')).toBeVisible();

    // Go back to Dashboard
    await page.click('button:has-text("Dashboard")');
    await expect(page.locator('h1')).toHaveText('Dashboard');
    await expect(page.locator('text=Total Users')).toBeVisible();
  });

  test('Admin can add a new user', async ({ page }) => {
    // Simulate login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.goto('/admin');

    // Navigate to Users section
    await page.click('button:has-text("Users")');

    // Open Add User dialog
    await page.click('button:has-text("Add User")');
    await page.fill('input[placeholder*="Name"]', 'Test User');
    await page.fill('input[placeholder*="Email"]', 'testuser@example.com');
    await page.selectOption('select', 'User');
    await page.click('button:has-text("Create")');

    // Check for new user in table (this might need adjustment based on actual implementation)
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('Admin sidebar can be collapsed and expanded', async ({ page }) => {
    // Simulate login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.goto('/admin');

    // Check initial sidebar state (expanded)
    const sidebar = page.locator('[class*="border-r"]').first();
    await expect(sidebar).toHaveClass(/w-64/);

    // Click toggle button to collapse
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('.lucide-chevron-down') });
    await toggleButton.click();

    // Check collapsed state
    await expect(sidebar).toHaveClass(/w-16/);

    // Click again to expand
    await toggleButton.click();
    await expect(sidebar).toHaveClass(/w-64/);
  });
});
