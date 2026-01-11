import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/en');
    await this.scrollToSection('contact');
  }

  async fillContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    priority?: 'low' | 'medium' | 'high';
    newsletter?: boolean;
  }) {
    await this.page.locator('input[name="name"]').fill(data.name);
    await this.page.locator('input[name="email"]').fill(data.email);
    await this.page.locator('input[name="subject"]').fill(data.subject);
    await this.page.locator('textarea[name="message"]').fill(data.message);
    
    if (data.priority) {
      await this.page.locator('select[name="priority"]').selectOption(data.priority);
    }
    
    if (data.newsletter !== undefined) {
      const checkbox = this.page.locator('input[name="newsletter"]');
      if (data.newsletter) {
        await checkbox.check();
      } else {
        await checkbox.uncheck();
      }
    }
  }

  async submitForm() {
    await this.page.locator('[data-testid="contact-submit"]').click();
  }

  async getValidationError(field: string) {
    return await this.page.locator(`[data-testid="error-${field}"]`).textContent();
  }

  async isFormVisible() {
    return await this.isVisible('[data-testid="contact-form"]');
  }

  async waitForSuccessMessage() {
    await expect(this.page.locator('text=Message sent successfully')).toBeVisible();
  }

  async waitForErrorMessage() {
    await expect(this.page.locator('text=An unexpected error occurred')).toBeVisible();
  }

  async mockRecaptcha() {
    await this.page.evaluate(() => {
      (window as any).grecaptcha = {
        getResponse: () => 'test-recaptcha-token',
        reset: () => {},
      };
    });
  }
}
