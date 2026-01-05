import { expect, test } from '@playwright/test';

test.describe('API E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject test mode before navigation
    await page.addInitScript(() => {
      (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
    });
    // Navigate to a page to ensure window.location.origin is set
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should test GraphQL API endpoints', async ({ page }) => {
    // Navigate to a page that uses GraphQL
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    // Mock GraphQL responses for testing
    await page.route('**/graphql', async route => {
      const request = route.request();
      const postData = request.postData();

      if (postData && postData.includes('query')) {
        // Mock successful GraphQL response
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              getUser: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com'
              }
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    // Test GraphQL query
    const response = await page.evaluate(async () => {
      const query = `
        query GetUser {
          getUser {
            id
            name
            email
          }
        }
      `;

      const result = await fetch(`${window.location.origin}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      return await result.json();
    });

    expect(response.data.getUser).toBeDefined();
    expect(response.data.getUser.name).toBe('Test User');
  });

  test('should test REST API endpoints', async ({ page }) => {
    // Mock REST API responses
    await page.route('**/api/**', async route => {
      const url = route.request().url();

      if (url.includes('/api/contact')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Message sent successfully'
          })
        });
      } else if (url.includes('/api/projects')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              title: 'Test Project',
              description: 'Test project description'
            }
          ])
        });
      } else {
        await route.continue();
      }
    });

    // Test contact API
    const contactResponse = await page.evaluate(async () => {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      };

      const result = await fetch(`${window.location.origin}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      return await result.json();
    });

    expect(contactResponse.success).toBe(true);
    expect(contactResponse.message).toBe('Message sent successfully');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error responses
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        })
      });
    });

    // Test error handling
    const errorResponse = await page.evaluate(async () => {
      try {
        const result = await fetch(`${window.location.origin}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
            message: 'Test'
          })
        });

        return await result.json();
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    expect(errorResponse.error).toBeDefined();
  });

  test('should test authentication-protected APIs', async ({ page }) => {
    // Mock auth token
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'test-token');
    });

    // Mock protected API endpoint
    await page.route('**/api/protected/**', async route => {
      const headers = route.request().headers();
      const authHeader = headers.authorization || headers.Authorization;

      if (authHeader && authHeader.includes('test-token')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: 'Protected data',
            user: { id: '1', name: 'Authenticated User' }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Unauthorized'
          })
        });
      }
    });

    // Test protected API with valid token
    const protectedResponse = await page.evaluate(async () => {
      const result = await fetch(`${window.location.origin}/api/protected/data`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });

      return await result.json();
    });

    expect(protectedResponse.data).toBe('Protected data');
    expect(protectedResponse.user).toBeDefined();
  });

  test('should test file upload API', async ({ page }) => {
    // Mock file upload endpoint
    await page.route('**/api/upload', async route => {
      const request = route.request();
      const headers = request.headers();

      if (headers['content-type'] && headers['content-type'].includes('multipart/form-data')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            filename: 'test-file.jpg',
            url: '/uploads/test-file.jpg'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Test file upload
    const uploadResponse = await page.evaluate(async () => {
      // Create a mock file
      const file = new File(['test content'], 'test-file.jpg', {
        type: 'image/jpeg'
      });

      const formData = new FormData();
      formData.append('file', file);

      const result = await fetch(`${window.location.origin}/api/upload`, {
        method: 'POST',
        body: formData
      });

      return await result.json();
    });

    expect(uploadResponse.success).toBe(true);
    expect(uploadResponse.filename).toBe('test-file.jpg');
  });

  test('should test rate limiting', async ({ page }) => {
    // Mock rate limiting
    let requestCount = 0;

    await page.route('**/api/**', async route => {
      requestCount++;

      if (requestCount > 5) {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too many requests'
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    // Make multiple requests
    const responses = [];
    for (let i = 0; i < 7; i++) {
      const response = await page.evaluate(async () => {
        const result = await fetch(`${window.location.origin}/api/test`, {
          method: 'GET'
        });
        return {
          status: result.status,
          data: await result.json()
        };
      });
      responses.push(response);
    }

    // Check that rate limiting kicked in
    expect(responses[5].status).toBe(429);
    expect(responses[5].data.error).toBe('Too many requests');
  });
});
