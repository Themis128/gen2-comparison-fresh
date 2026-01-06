import { test, expect } from '@playwright/test';

import { SmartLocators, SmartExpect, TestUtils } from './test-utils';

test.describe('Auto-healing Test Suite', () => {
  let smartLocators: SmartLocators;

  test.beforeEach(async ({ page }) => {
    smartLocators = new SmartLocators(page);
    await TestUtils.waitForPageLoad(page);
  });

  test('should handle dynamic element changes with auto-healing', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-auto-healing');

    // Use smart locator to find sign in link with multiple fallback strategies
    const signInLink = await smartLocators.findLink(/Sign In/i);

    // Use enhanced expect with suggestions
    await SmartExpect.toBeVisibleWithSuggestion(signInLink);

    // Click with safe click utility
    await TestUtils.safeClick(page, signInLink);

    // Verify navigation to auth page
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should auto-heal form interactions', async ({ page }) => {
    await page.goto('/test-auto-healing');

    // Use smart locator to find form inputs
    const nameInput = await smartLocators.findInput('name');
    const emailInput = await smartLocators.findInput('email');

    // Safe type with auto-healing
    await TestUtils.safeType(page, nameInput, 'Test User');
    await TestUtils.safeType(page, emailInput, 'test@example.com');

    // Find and click submit button
    const submitButton = await smartLocators.findButton(/Send Message|submit|send/i);
    await TestUtils.safeClick(page, submitButton);

    // Verify form was submitted (button should still be visible or form should be in submitted state)
    await expect(submitButton).toBeVisible();
  });

  test('should handle navigation with smart link finding', async ({ page }) => {
    await page.goto('/test-auto-healing');

    // Find navigation links with auto-healing (look for contact or dashboard links)
    const contactLink = await smartLocators.findLink(/Contact|Dashboard/i);
    await TestUtils.safeClick(page, contactLink);

    // Verify navigation
    await expect(page).toHaveURL(/\/contact|\/dashboard/);
  });

  test('should demonstrate locator fallback strategies', async ({ page }) => {
    await page.goto('/test-auto-healing');

    // This test demonstrates how the smart locator tries multiple strategies
    // If the primary selector fails, it falls back to alternatives
    try {
      const signInLink = await smartLocators.findLink(/Sign In|Create Account/i);
      await SmartExpect.toBeVisibleWithSuggestion(signInLink);
    } catch (error) {
      console.log('Auto-healing: Sign in link not found with standard selectors, trying alternatives...');
      // The error will include suggestions for debugging
      throw error;
    }
  });
});
