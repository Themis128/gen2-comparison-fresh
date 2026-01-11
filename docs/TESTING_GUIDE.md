# Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the Themistoklis Baltzakis Portfolio Application. The testing suite uses Playwright for end-to-end testing to ensure all user journeys work correctly across different browsers and devices.

## Testing Framework

### Playwright Configuration

The application uses Playwright with the following configuration:

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001/en',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",
});
```

### Test Categories

## 1. Portfolio Navigation Tests

### Homepage Tests
- **File**: `tests/homepage.spec.ts`
- **Purpose**: Verify homepage loads and displays correctly
- **Coverage**:
  - Hero section rendering
  - Navigation menu functionality
  - Section scrolling and visibility
  - Responsive design across viewports

### Key Test Scenarios:
```typescript
test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Themistoklis Baltzakis/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should navigate to sections via menu', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="#about"]').click();
    await expect(page.locator('#about')).toBeInViewport();
  });
});
```

## 2. Contact Form Tests

### Contact Form Validation
- **File**: `tests/contact-form.spec.ts`
- **Purpose**: Test contact form functionality and validation
- **Coverage**:
  - Form field validation
  - Submission process
  - Error handling
  - Success feedback

### Key Test Scenarios:
```typescript
test.describe('Contact Form', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/en');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    await page.locator('[data-testid="contact-submit"]').click();
    await expect(page.locator('text=Name is required')).toBeVisible();
  });

  test('should submit form successfully', async ({ page }) => {
    await page.goto('/en');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="subject"]').fill('Test Subject');
    await page.locator('textarea[name="message"]').fill('Test message content');
    
    await page.locator('[data-testid="contact-submit"]').click();
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
  });
});
```

## 3. Authentication Tests

### Sign Up Flow
- **File**: `tests/auth-signup.spec.ts`
- **Purpose**: Test user registration process
- **Coverage**:
  - Registration form validation
  - Email verification process
  - Password requirements
  - Error handling

### Sign In Flow
- **File**: `tests/auth-signin.spec.ts`
- **Purpose**: Test user login process
- **Coverage**:
  - Login form validation
  - Authentication success/failure
  - Session management
  - Redirect behavior

### Password Reset Flow
- **File**: `tests/auth-password-reset.spec.ts`
- **Purpose**: Test password recovery
- **Coverage**:
  - Reset request form
  - Email sending
  - Reset link validation
  - New password setting

## 4. Admin Dashboard Tests

### Message Management
- **File**: `tests/admin-messages.spec.ts`
- **Purpose**: Test admin contact message management
- **Coverage**:
  - Message listing and filtering
  - Message details view
  - Message status updates
  - Bulk operations

### Access Control
- **File**: `tests/admin-access.spec.ts`
- **Purpose**: Test admin-only feature access
- **Coverage**:
  - Authentication requirements
  - Authorization checks
  - Permission-based UI elements
  - Unauthorized access handling

## 5. Accessibility Tests

### WCAG Compliance
- **File**: `tests/accessibility.spec.ts`
- **Purpose**: Ensure accessibility standards compliance
- **Coverage**:
  - Keyboard navigation
  - Screen reader support
  - Color contrast ratios
  - ARIA attributes
  - Focus management

### Key Accessibility Tests:
```typescript
test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    // Verify logical heading order
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
```

## 6. Performance Tests

### Core Web Vitals
- **File**: `tests/performance.spec.ts`
- **Purpose**: Monitor performance metrics
- **Coverage**:
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)

### Loading Performance
- **File**: `tests/loading.spec.ts`
- **Purpose**: Test page loading performance
- **Coverage**:
  - Initial page load time
  - Resource loading
  - JavaScript execution time
  - Image loading optimization

## 7. Responsive Design Tests

### Mobile Responsiveness
- **File**: `tests/mobile.spec.ts`
- **Purpose**: Test mobile device compatibility
- **Coverage**:
  - Touch interactions
  - Mobile navigation
  - Responsive layouts
  - Mobile-specific features

### Cross-Device Testing
- **File**: `tests/responsive.spec.ts`
- **Purpose**: Test across different screen sizes
- **Coverage**:
  - Desktop layouts
  - Tablet layouts
  - Mobile layouts
  - Breakpoint transitions

## 8. Internationalization Tests

### Language Switching
- **File**: `tests/i18n.spec.ts`
- **Purpose**: Test multi-language support
- **Coverage**:
  - Language switching functionality
  - Content translation accuracy
  - RTL language support
  - Locale-specific formatting

## Test Execution

### Running Tests Locally

```bash
# Run all tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests headlessly
npm run test:headed

# Run specific test file
npx playwright test tests/contact-form.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with debugging
npx playwright test --debug
```

### CI/CD Integration

Tests are automatically executed in CI/CD pipelines:

```yaml
# .github/workflows/test.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## Test Data Management

### Test Data Setup
```typescript
// tests/global-setup.ts
export default async function globalSetup() {
  // Create test users
  // Seed test data
  // Configure test environment
}
```

### Test Data Cleanup
```typescript
// tests/global-teardown.ts
export default async function globalTeardown() {
  // Clean up test data
  // Remove test users
  // Reset test environment
}
```

## Best Practices

### Test Organization
1. **Descriptive test names**: Use clear, descriptive test names
2. **Page Object Model**: Use page objects for reusable selectors
3. **Data-driven tests**: Use test data from external sources
4. **Independent tests**: Each test should be able to run independently

### Selector Strategies
1. **Data attributes**: Prefer `data-testid` attributes
2. **Semantic selectors**: Use semantic HTML selectors when possible
3. **Accessible selectors**: Use ARIA attributes and roles
4. **Stable selectors**: Avoid CSS classes that may change

### Example Page Object:
```typescript
// tests/page-objects/ContactPage.ts
export class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/en');
    await this.page.locator('#contact').scrollIntoViewIfNeeded();
  }

  async fillForm(data: { name: string; email: string; subject: string; message: string }) {
    await this.page.locator('input[name="name"]').fill(data.name);
    await this.page.locator('input[name="email"]').fill(data.email);
    await this.page.locator('input[name="subject"]').fill(data.subject);
    await this.page.locator('textarea[name="message"]').fill(data.message);
  }

  async submitForm() {
    await this.page.locator('[data-testid="contact-submit"]').click();
  }

  async getValidationError(field: string) {
    return this.page.locator(`[data-testid="error-${field}"]`).textContent();
  }
}
```

## Debugging Tests

### Common Debugging Techniques

1. **Visual Debugging**:
```typescript
await page.pause(); // Pause execution for manual inspection
```

2. **Screenshot on Failure**:
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

3. **Console Logging**:
```typescript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

4. **Network Monitoring**:
```typescript
page.on('request', request => console.log('Request:', request.url()));
page.on('response', response => console.log('Response:', response.status()));
```

## Test Maintenance

### Regular Maintenance Tasks
1. **Update selectors**: When UI changes affect selectors
2. **Review test data**: Ensure test data remains relevant
3. **Update assertions**: When application behavior changes
4. **Performance baselines**: Update performance expectations

### Flaky Test Management
1. **Identify flaky tests**: Monitor test results for inconsistent failures
2. **Add retry logic**: Use Playwright's built-in retry mechanism
3. **Stabilize timing**: Use proper wait strategies
4. **Isolate dependencies**: Ensure tests don't depend on external services

## Reporting and Analytics

### Test Reports
- **HTML Report**: Visual test results with screenshots
- **JUnit XML**: CI/CD integration for test results
- **JSON Report**: Programmatic access to test data

### Coverage Analysis
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Enable coverage collection
    // Note: Requires additional setup
  },
});
```

## Continuous Testing

### Test Automation
1. **Pre-commit hooks**: Run tests before commits
2. **Pull request checks**: Automated testing on PR creation
3. **Scheduled runs**: Regular test execution for stability
4. **Performance regression**: Automated performance monitoring

### Quality Gates
1. **Test pass rate**: Minimum test pass percentage
2. **Performance thresholds**: Maximum acceptable load times
3. **Accessibility scores**: Minimum WCAG compliance scores
4. **Bundle size limits**: Maximum JavaScript bundle sizes

This comprehensive testing strategy ensures the portfolio application maintains high quality, performance, and user experience across all supported platforms and use cases.
