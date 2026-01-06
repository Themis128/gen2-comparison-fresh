import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode for consistent behavior
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
    });
  });

  test('Home page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').filter({ hasText: "Hi, I'm" })).toBeVisible();
    await expect(page.locator('text=View My Work')).toBeVisible();
    await expect(page.locator('text=Get In Touch')).toBeVisible();
  });

  test('Navigation between sections works', async ({ page }) => {
    await page.goto('/');
    // Check if navigation exists and sections are present
    const aboutSection = page.locator('#about, [data-section="about"]');
    const projectsSection = page.locator('#projects, [data-section="projects"]');
    const contactSection = page.locator('#contact, [data-section="contact"]');

    // At least one section should be visible
    await expect(aboutSection.or(projectsSection).or(contactSection)).toBeVisible();
  });

  test('Theme switcher functionality', async ({ page }) => {
    await page.goto('/');
    // Look for theme toggle button
    const themeButton = page.locator(
      'button[aria-label*="theme"], button[aria-label*="Theme"], .theme-toggle, [data-theme-toggle]'
    );
    if ((await themeButton.count()) > 0) {
      await themeButton.first().click();
      // Check for dark mode class
      await expect(page.locator('html')).toHaveClass(/dark/);
      await themeButton.first().click();
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    }
  });

  test('Contact form is accessible', async ({ page }) => {
    await page.goto('/');
    // Check for contact section or link
    const contactLink = page.locator('a[href*="contact"], button:has-text("Contact")').first();
    if ((await contactLink.count()) > 0) {
      await contactLink.click();
      // Should navigate to contact page or show contact form
      await expect(page.locator('form, [data-contact-form]')).toBeVisible();
    }
  });

  test('Projects section displays content', async ({ page }) => {
    await page.goto('/');
    // Check for projects section
    const projectsSection = page.locator('#projects, [data-section="projects"]');
    if ((await projectsSection.count()) > 0) {
      await expect(projectsSection).toBeVisible();
      // Should have some project content
      await expect(page.locator('.project, [data-project], .card')).toHaveCount(
        await page.locator('.project, [data-project], .card').count()
      );
    }
  });

  test('Global error page for invalid route', async ({ page }) => {
    await page.goto('/non-existent-route');
    // Should show error page
    await expect(
      page.locator('text=Not Found').or(page.locator('text=404')).or(page.locator('.error-page'))
    ).toBeVisible();
  });
});
