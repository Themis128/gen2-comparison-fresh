import { test, expect } from '@playwright/test';

// OAuth login button presence

test('OAuth login button is visible on sign-in page', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
});

// OAuth login flow (Google)

test('OAuth login flow redirects to Google', async ({ page }) => {
  await page.goto('/auth/signin');
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('button:has-text("Continue with Google")'),
  ]);
  await expect(popup).toHaveURL(/accounts\.google\.com/);
});

// OAuth config check (basic presence)

test('OAuth config is loaded in the app', async ({ page }) => {
  await page.goto('/auth/signin');
  // Check for OAuth config presence in window object (customize as needed)
  const oauthConfig = await page.evaluate(() => (window as any)?.Amplify?.Auth?.configuredProviders);
  expect(oauthConfig).toBeDefined();
});
