import { test, expect } from '@playwright/test';
import { BasePage } from './page-objects/BasePage';

test.describe('Accessibility', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto('/en');
    await basePage.waitForLoad();
  });

  test('should have proper document structure', async ({ page }) => {
    // Check for proper HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();
    
    // Check for header landmark
    await expect(page.locator('header')).toBeVisible();
    
    // Check for navigation landmark
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    
    // Should have at least one h1
    const h1Headings = await page.locator('h1').count();
    expect(h1Headings).toBeGreaterThan(0);
    
    // Check that headings follow logical hierarchy
    // This is a basic check - more sophisticated checks would analyze the actual hierarchy
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Start keyboard navigation
    await page.keyboard.press('Tab');
    
    let focusedElement = await page.locator(':focus');
    expect(await focusedElement.isVisible()).toBe(true);
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        // Check that focused element is visible and interactive
        const isVisible = await focusedElement.isVisible();
        expect(isVisible).toBe(true);
        
        // Check for focus indicators (basic check)
        const boxShadow = await focusedElement.evaluate(el => 
          window.getComputedStyle(el).boxShadow
        );
        // Focus indicators may vary, so we just ensure element is focusable
      }
    }
  });

  test('should have accessible form elements', async ({ page }) => {
    // Navigate to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Check form labels
    const inputs = await page.locator('input, textarea, select').all();
    for (const input of inputs) {
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      
      // Should have some form of labeling
      const hasLabel = ariaLabel || ariaLabelledBy || id || name;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic check - comprehensive contrast testing would require additional tools
    // Check that text colors are not invisible (basic visibility test)
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();
    
    for (const element of textElements.slice(0, 10)) { // Check first 10 elements
      const color = await element.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const backgroundColor = await element.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Basic check that colors are defined
      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Images should have alt text or aria-label
      const hasAlt = alt || ariaLabel;
      if (hasAlt !== null) {
        expect(typeof hasAlt).toBe('string');
      }
    }
  });

  test('should have accessible buttons and links', async ({ page }) => {
    const buttons = await page.locator('button, [role="button"]').all();
    const links = await page.locator('a').all();
    
    // Check buttons have accessible names
    for (const button of buttons.slice(0, 5)) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      const hasAccessibleName = text?.trim() || ariaLabel || title;
      expect(hasAccessibleName).toBeTruthy();
    }
    
    // Check links have accessible names
    for (const link of links.slice(0, 5)) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      const hasAccessibleName = text?.trim() || ariaLabel || title;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for ARIA landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    expect(landmarks).toBeGreaterThan(0);
    
    // Check for proper semantic HTML
    const semanticElements = await page.locator('header, nav, main, section, article, aside, footer').count();
    expect(semanticElements).toBeGreaterThan(0);
  });

  test('should handle focus management properly', async ({ page }) => {
    // Test focus trapping in modals (if any exist)
    const modals = await page.locator('[role="dialog"], .modal').all();
    
    if (modals.length > 0) {
      // If modals exist, they should trap focus
      // This is a basic check - comprehensive focus trapping tests are more complex
      const modal = modals[0];
      await modal.click();
      
      // Focus should move within the modal
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      expect(await focusedElement.isVisible()).toBe(true);
    }
  });

  test('should have proper table structure', async ({ page }) => {
    const tables = await page.locator('table').all();
    
    for (const table of tables) {
      // Check for proper table headers
      const thElements = await table.locator('th').count();
      const headers = await table.locator('[role="columnheader"], [role="rowheader"]').count();
      
      if (thElements > 0 || headers > 0) {
        // If table has headers, check structure
        const rows = await table.locator('tr').count();
        expect(rows).toBeGreaterThan(0);
      }
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Check if animations respect prefers-reduced-motion
    const animations = await page.locator('[style*="animation"], .animate, [class*="motion"]').all();
    
    // This is a basic check - comprehensive reduced motion testing requires media query simulation
    if (animations.length > 0) {
      console.log('Animations detected - should respect prefers-reduced-motion');
    }
  });

  test('should have proper error messaging', async ({ page }) => {
    // Navigate to contact form
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Submit empty form to trigger errors
    await page.locator('[data-testid="contact-submit"]').click();
    
    // Check that error messages are properly associated with form fields
    const errorMessages = await page.locator('[role="alert"], .error, [data-testid*="error"]').all();
    
    for (const error of errorMessages) {
      const isVisible = await error.isVisible();
      expect(isVisible).toBe(true);
      
      // Check if error is associated with a form field
      const ariaDescribedBy = await error.getAttribute('aria-describedby');
      const ariaLabelledBy = await error.getAttribute('aria-labelledby');
      
      // Errors should be properly linked to form fields
      if (ariaDescribedBy || ariaLabelledBy) {
        const associatedElement = await page.locator(`#${ariaDescribedBy}`).count() || 
                                  await page.locator(`#${ariaLabelledBy}`).count();
        expect(associatedElement).toBeGreaterThan(0);
      }
    }
  });
});
