import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Smart locator utilities with auto-healing capabilities
 */
export class SmartLocators {
  constructor(private page: Page) {}

  /**
   * Find element by multiple strategies with auto-healing
   */
  async findElement(selectors: string[]): Promise<Locator> {
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible({ timeout: 1000 });
        return element;
      } catch {
        continue;
      }
    }
    throw new Error(`Could not find element with any of the selectors: ${selectors.join(', ')}`);
  }

  /**
   * Smart button locator with multiple fallback strategies
   */
  async findButton(text: string | RegExp): Promise<Locator> {
    if (typeof text === 'string') {
      const selectors = [
        `button:has-text("${text}")`,
        `[role="button"]:has-text("${text}")`,
        `input[type="submit"][value*="${text}"]`,
        `input[type="button"][value*="${text}"]`,
      ];
      return this.findElement(selectors);
    } else {
      // For RegExp, find all buttons and filter by text content
      const buttons = await this.page.locator('button, [role="button"], input[type="submit"], input[type="button"]').all();
      for (const button of buttons) {
        const buttonText = await button.textContent();
        if (buttonText && text.test(buttonText)) {
          return button;
        }
      }
      throw new Error(`Could not find button matching regex: ${text}`);
    }
  }

  /**
   * Smart input locator with auto-healing
   */
  async findInput(placeholder?: string, label?: string): Promise<Locator> {
    const selectors: string[] = [];

    if (placeholder) {
      selectors.push(`input[placeholder*="${placeholder}"]`);
      selectors.push(`textarea[placeholder*="${placeholder}"]`);
    }

    if (label) {
      selectors.push(`input[aria-label*="${label}"]`);
      selectors.push(`textarea[aria-label*="${label}"]`);
      selectors.push(`label:has-text("${label}") + input`);
      selectors.push(`label:has-text("${label}") + textarea`);
    }

    // Fallback to common input types
    selectors.push('input[type="text"]', 'input[type="email"]', 'textarea');

    return this.findElement(selectors);
  }

  /**
   * Smart link locator
   */
  async findLink(text: string | RegExp): Promise<Locator> {
    if (typeof text === 'string') {
      const selectors = [
        `a:has-text("${text}")`,
        `[role="link"]:has-text("${text}")`,
      ];
      return this.findElement(selectors);
    } else {
      // For RegExp, find all links and filter by text content
      const links = await this.page.locator('a, [role="link"]').all();
      for (const link of links) {
        const linkText = await link.textContent();
        if (linkText && text.test(linkText)) {
          return link;
        }
      }
      throw new Error(`Could not find link matching regex: ${text}`);
    }
  }
}

/**
 * Enhanced expect utilities with auto-healing suggestions
 */
export class SmartExpect {
  static async toBeVisibleWithSuggestion(locator: Locator, options?: { timeout?: number }) {
    try {
      await expect(locator).toBeVisible(options);
    } catch (error) {
      // Provide helpful suggestions for debugging
      const page = locator.page();
      const similarElements = await page.locator('[data-testid], [aria-label], button, a').all();

      console.warn('💡 Auto-healing suggestions:');
      console.warn('Similar elements found:');
      for (const element of similarElements.slice(0, 5)) {
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const text = await element.textContent();
        const testId = await element.getAttribute('data-testid');
        const ariaLabel = await element.getAttribute('aria-label');

        console.warn(`  - ${tagName}: "${text?.trim()}" ${testId ? `(data-testid: ${testId})` : ''} ${ariaLabel ? `(aria-label: ${ariaLabel})` : ''}`);
      }

      throw error;
    }
  }
}

/**
 * Test utilities for common actions with auto-healing
 */
export class TestUtils {
  static async waitForPageLoad(page: Page, timeout = 10000) {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {
      // Ignore networkidle timeout as it's not critical
    });
  }

  static async safeClick(page: Page, locator: Locator | string, options?: { timeout?: number }) {
    const element = typeof locator === 'string' ? page.locator(locator) : locator;
    await expect(element).toBeVisible({ timeout: options?.timeout || 5000 });
    await element.click();
  }

  static async safeType(page: Page, locator: Locator | string, text: string, options?: { timeout?: number }) {
    const element = typeof locator === 'string' ? page.locator(locator) : locator;
    await expect(element).toBeVisible({ timeout: options?.timeout || 5000 });
    await element.fill(text);
  }
}
