import { test, expect } from '@playwright/test';
import { BasePage } from './page-objects/BasePage';

test.describe('Homepage', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto('/en');
    await basePage.waitForLoad();
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Themistoklis Baltzakis/);
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Check hero content
    await expect(page.locator('h1')).toContainText('Themistoklis Baltzakis');
    await expect(page.locator('[data-testid="hero-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-subtitle"]')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    await expect(nav.locator('a[href="#about"]')).toBeVisible();
    await expect(nav.locator('a[href="#skills"]')).toBeVisible();
    await expect(nav.locator('a[href="#experience"]')).toBeVisible();
    await expect(nav.locator('a[href="#projects"]')).toBeVisible();
    await expect(nav.locator('a[href="#contact"]')).toBeVisible();
  });

  test('should navigate to about section', async ({ page }) => {
    await page.locator('nav a[href="#about"]').click();
    await expect(page.locator('#about')).toBeInViewport();
    
    // Check about section content
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
  });

  test('should navigate to skills section', async ({ page }) => {
    await page.locator('nav a[href="#skills"]').click();
    await expect(page.locator('#skills')).toBeInViewport();
    
    // Check skills section content
    await expect(page.locator('[data-testid="skills-section"]')).toBeVisible();
  });

  test('should navigate to experience section', async ({ page }) => {
    await page.locator('nav a[href="#experience"]').click();
    await expect(page.locator('#experience')).toBeInViewport();
    
    // Check experience section content
    await expect(page.locator('[data-testid="experience-section"]')).toBeVisible();
  });

  test('should navigate to projects section', async ({ page }) => {
    await page.locator('nav a[href="#projects"]').click();
    await expect(page.locator('#projects')).toBeInViewport();
    
    // Check projects section content
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
  });

  test('should navigate to contact section', async ({ page }) => {
    await page.locator('nav a[href="#contact"]').click();
    await expect(page.locator('#contact')).toBeInViewport();
    
    // Check contact section content
    await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
  });

  test('should display theme toggle', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Check initial theme
    const initialClass = await page.locator('html').getAttribute('class');
    
    // Toggle theme
    await themeToggle.click();
    
    // Check theme changed
    const newClass = await page.locator('html').getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('should display language switcher', async ({ page }) => {
    const langSwitcher = page.locator('[data-testid="language-switcher"]');
    await expect(langSwitcher).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content');
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content');
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check mobile navigation
      const mobileNav = page.locator('[data-testid="mobile-nav"]');
      await expect(mobileNav).toBeVisible();
      
      // Check hero section fits mobile screen
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
    }
  });

  test('should load all sections progressively', async ({ page }) => {
    // Check that sections load as user scrolls
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('should have working social links', async ({ page }) => {
    const socialLinks = page.locator('[data-testid="social-links"] a');
    const count = await socialLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Check first social link
    const firstLink = socialLinks.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('should display footer with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    await expect(footer).toContainText('©');
    await expect(footer).toContainText('Themistoklis Baltzakis');
  });
});
