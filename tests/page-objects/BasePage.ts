import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url?: string) {
    await this.page.goto(url || '/');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToSection(sectionId: string) {
    await this.page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
  }

  async getTitle() {
    return await this.page.title();
  }

  async isVisible(selector: string) {
    return await this.page.locator(selector).isVisible();
  }

  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string) {
    return await this.page.locator(selector).textContent();
  }

  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }
}
