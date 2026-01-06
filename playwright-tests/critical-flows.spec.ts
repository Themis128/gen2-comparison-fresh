import { test, expect } from '@playwright/test';

// Admin page access control

test('Admin page should require authentication', async ({ page }) => {
  await page.goto('/admin');
  // Expect redirect or error message for unauthenticated user
  await expect(page).toHaveURL(/auth|login|error/);
});

// Dashboard loads for authenticated user

test('Dashboard should load for authenticated user', async ({ page }) => {
  // Simulate login (replace with actual login steps if needed)
  await page.goto('/auth');
  // ...login steps...
  await page.goto('/dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible();
});

// Global error page for invalid route

test('Global error page appears for invalid route', async ({ page }) => {
  await page.goto('/non-existent-route');
  await expect(page.locator('text=Error')).toBeVisible();
});

// User profile view/edit

test('User profile page should display and allow edit', async ({ page }) => {
  // Simulate login
  await page.goto('/auth');
  // ...login steps...
  await page.goto('/profile');
  await expect(page.locator('text=User Profile')).toBeVisible();
  // Edit profile (replace with actual selectors)
  await page.fill('input[name="username"]', 'NewName');
  await page.click('button:has-text("Save")');
  await expect(page.locator('text=Profile updated')).toBeVisible();
});

// Navigation between major pages

test('Navigation between major pages works', async ({ page }) => {
  await page.goto('/');
  await page.click('nav >> text=Dashboard');
  await expect(page).toHaveURL(/dashboard/);
  await page.click('nav >> text=Contact');
  await expect(page).toHaveURL(/contact/);
  await page.click('nav >> text=Admin');
  await expect(page).toHaveURL(/admin/);
});

// Theme switcher functionality

test('Theme switcher toggles between light and dark', async ({ page }) => {
  await page.goto('/');
  await page.click('button[aria-label="Toggle theme"]');
  // Check for dark mode class or style
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.click('button[aria-label="Toggle theme"]');
  await expect(page.locator('body')).not.toHaveClass(/dark/);
});
