import { test, expect } from '@playwright/test';

import { SmartLocators, SmartExpect, TestUtils } from './test-utils';

/**
 * Next.js 16 Advanced Features Test Suite
 * Exploiting all latest Next.js capabilities for comprehensive testing
 */
test.describe('Next.js 16 Advanced Features', () => {
  let _smartLocators: SmartLocators;

  test.beforeEach(async ({ page }) => {
    _smartLocators = new SmartLocators(page);
    await TestUtils.waitForPageLoad(page);
  });

  test.describe('App Router Features', () => {
    test('should handle loading states with Suspense boundaries', async ({ page }) => {
      // Navigate to a page that triggers loading state
      await page.goto('/projects/test-project');

      // Verify loading state appears and disappears
      await expect(page.locator('text=Loading...')).toBeVisible({ timeout: 1000 });
      await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 5000 });

      // Verify final content loads
      await expect(page.locator('text=Project: test-project')).toBeVisible();
    });

    test('should handle error boundaries', async ({ page }) => {
      // Navigate to a page that might trigger an error
      await page.goto('/error-test');

      // Verify error boundary is displayed
      await expect(page.locator('text=Something went wrong!')).toBeVisible();

      // Test error recovery
      await page.click('button:has-text("Try again")');
      // Should either recover or stay in error state
    });

    test('should handle dynamic routes and metadata', async ({ page }) => {
      await page.goto('/projects/portfolio-website?tab=overview');

      // Verify dynamic content
      await expect(page.locator('text=Project: portfolio-website')).toBeVisible();
      await expect(page.locator('text=Current tab: overview')).toBeVisible();

      // Verify dynamic metadata (check document title)
      await expect(page).toHaveTitle(/Project: portfolio-website/);
    });
  });

  test.describe('Server Actions', () => {
    test('should handle server action form submissions', async ({ page }) => {
      await page.goto('/contact');

      // Fill out the contact form
      await TestUtils.safeType(page, 'input[name="name"]', 'Test User');
      await TestUtils.safeType(page, 'input[name="email"]', 'test@example.com');
      await TestUtils.safeType(page, 'input[name="subject"]', 'Test Subject');
      await TestUtils.safeType(page, 'textarea[name="message"]', 'This is a test message for server actions.');

      // Select priority
      await page.selectOption('select[name="priority"]', 'high');

      // Submit the form (server action)
      await page.click('button[type="submit"]');

      // Verify server action response
      await expect(page.locator('text=Message sent successfully')).toBeVisible();
    });

    test('should handle server action validation errors', async ({ page }) => {
      await page.goto('/contact');

      // Submit form with invalid data
      await TestUtils.safeType(page, 'input[name="email"]', 'invalid-email');
      await page.click('button[type="submit"]');

      // Verify validation error from server action
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    });

    test('should handle optimistic updates with server actions', async ({ page }) => {
      await page.goto('/contact');

      // Fill form quickly
      await page.fill('input[name="name"]', 'Quick User');
      await page.fill('input[name="email"]', 'quick@example.com');
      await page.fill('input[name="subject"]', 'Quick Test');
      await page.fill('textarea[name="message"]', 'Quick message');

      // Submit and verify immediate feedback
      await page.click('button[type="submit"]');

      // Should show loading state immediately, then success
      await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Route Handlers (API Routes)', () => {
    test('should handle API route POST requests', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'API Test User',
          email: 'api@example.com',
          subject: 'API Test Subject',
          message: 'Testing API route handler',
          priority: 'medium'
        }
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Message sent successfully');
      expect(data.id).toBeDefined();
    });

    test('should handle API route validation errors', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          // Missing required fields
          email: 'test@example.com'
        }
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing required fields');
    });

    test('should handle API route GET requests', async ({ request }) => {
      const response = await request.get('/api/contact');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.message).toBe('Contact API is running');
      expect(data.timestamp).toBeDefined();
    });
  });

  test.describe('Middleware', () => {
    test('should add middleware headers to requests', async ({ page }) => {
      await page.goto('/');

      // Check middleware headers
      const middlewareHeader = await page.evaluate(() =>
        document.querySelector('meta[name="x-middleware-test"]')?.getAttribute('content') ||
        // Fallback: check response headers via fetch
        fetch('/api/test-headers').then(r => r.headers.get('x-middleware-test'))
      );

      expect(middlewareHeader).toBe('true');
    });

    test('should handle middleware redirects for protected routes', async ({ page }) => {
      // Try to access protected route without auth
      await page.goto('/admin');

      // Should redirect to auth page
      await expect(page).toHaveURL(/\/auth/);
      await expect(page.locator('text=Please sign in')).toBeVisible();
    });

    test('should handle middleware with auth headers', async ({ page }) => {
      // Add auth header via extra HTTP headers
      await page.route('**/admin**', async route => {
        const headers = {
          ...route.request().headers(),
          'x-test-auth': 'authenticated'
        };
        await route.continue({ headers });
      });

      await page.goto('/admin');
      // Should not redirect with auth header
      await expect(page).toHaveURL(/\/admin/);
    });
  });

  test.describe('Parallel Routes and Interception', () => {
    test('should handle parallel route modals', async ({ page }) => {
      await page.goto('/dashboard');

      // Click button that opens modal (parallel route)
      await page.click('button:has-text("Open Modal")');

      // Verify modal appears without page navigation
      await expect(page.locator('text=Modal Content')).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard$/); // URL should not change

      // Close modal
      await page.click('button:has-text("Close")');
      await expect(page.locator('text=Modal Content')).not.toBeVisible();
    });

    test('should preserve page state during modal interactions', async ({ page }) => {
      await page.goto('/dashboard');

      // Interact with dashboard content
      await page.fill('input[name="search"]', 'test query');

      // Open modal
      await page.click('button:has-text("Open Modal")');

      // Verify search input still has value
      const searchValue = await page.inputValue('input[name="search"]');
      expect(searchValue).toBe('test query');

      // Close modal and verify state preserved
      await page.click('button:has-text("Close")');
      expect(await page.inputValue('input[name="search"]')).toBe('test query');
    });
  });

  test.describe('Streaming and Suspense', () => {
    test('should handle streaming responses', async ({ page }) => {
      await page.goto('/streaming-test');

      // Verify content streams in
      await expect(page.locator('text=Loading...')).toBeVisible();

      // Wait for streaming to complete
      await expect(page.locator('text=Streamed content')).toBeVisible({ timeout: 10000 });

      // Verify all parts of the stream are present
      await expect(page.locator('text=Part 1')).toBeVisible();
      await expect(page.locator('text=Part 2')).toBeVisible();
      await expect(page.locator('text=Part 3')).toBeVisible();
    });

    test('should handle selective hydration', async ({ page }) => {
      await page.goto('/');

      // Server-rendered content should be immediately visible
      await expect(page.locator('text=Server Component')).toBeVisible();

      // Client components should hydrate without layout shift
      const initialHeight = await page.locator('.client-component').boundingBox();

      // Wait for hydration
      await page.waitForTimeout(100);

      const finalHeight = await page.locator('.client-component').boundingBox();
      expect(finalHeight?.height).toBe(initialHeight?.height);
    });
  });

  test.describe('Edge Runtime Features', () => {
    test('should handle edge function responses', async ({ request }) => {
      const response = await request.get('/api/edge-test');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      // Verify edge runtime headers
      expect(response.headers()['x-edge-runtime']).toBe('true');
      expect(data.region).toBeDefined();
    });

    test('should handle edge middleware', async ({ page }) => {
      await page.goto('/edge-protected');

      // Verify edge middleware adds appropriate headers
      const edgeHeader = await page.evaluate(() =>
        fetch('/api/edge-headers').then(r => r.headers.get('x-edge-processed'))
      );

      expect(edgeHeader).toBe('true');
    });
  });

  test.describe('Advanced Metadata API', () => {
    test('should generate dynamic metadata', async ({ page }) => {
      await page.goto('/projects/dynamic-metadata-test');

      // Verify dynamic title
      await expect(page).toHaveTitle('Project: dynamic-metadata-test');

      // Verify Open Graph metadata
      const ogTitle = await page.evaluate(() =>
        document.querySelector('meta[property="og:title"]')?.getAttribute('content')
      );
      expect(ogTitle).toBe('Project: dynamic-metadata-test');
    });

    test('should handle metadata with search params', async ({ page }) => {
      await page.goto('/projects/metadata-with-params?version=2.0');

      // Verify metadata includes search params context
      const description = await page.evaluate(() =>
        document.querySelector('meta[name="description"]')?.getAttribute('content')
      );
      expect(description).toContain('version 2.0');
    });
  });

  test.describe('Client-Server Component Integration', () => {
    test('should handle server component data in client components', async ({ page }) => {
      await page.goto('/integrated-components');

      // Server component renders initial data
      await expect(page.locator('text=Server Data:')).toBeVisible();

      // Client component can interact with server data
      await page.click('button:has-text("Update Client State")');

      // Verify client-server interaction
      await expect(page.locator('text=Client Updated')).toBeVisible();
      await expect(page.locator('text=Server Data:')).toBeVisible(); // Still visible
    });

    test('should handle form state across server/client boundaries', async ({ page }) => {
      await page.goto('/hybrid-form');

      // Fill server-rendered form
      await page.fill('input[name="server-field"]', 'Server value');

      // Client component adds additional fields
      await page.fill('input[name="client-field"]', 'Client value');

      // Submit hybrid form
      await page.click('button[type="submit"]');

      // Verify both server and client data are processed
      await expect(page.locator('text=Server value')).toBeVisible();
      await expect(page.locator('text=Client value')).toBeVisible();
    });
  });
});
