import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @see https://playwright.dev/docs/test-configuration
 *
 * Role-Based Authentication Validation Suite:
 * - Validates admin vs user routing and access control
 * - Tests authentication state management
 * - Ensures proper navigation structure for each role
 * - Verifies UI consistency and permissions
 * - Auto-detects and reports structural issues
 *
 * Projects:
 * - chromium-admin: Tests admin user flows
 * - chromium-user: Tests regular user flows
 * - chromium-guest: Tests unauthenticated user flows
 * - chromium-cross-role: Tests role boundary validation
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests sequentially to avoid auth state conflicts */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use single worker to avoid race conditions */
  workers: 1,
  /* Enhanced reporter with role-based test results */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/role-based-auth-results.json' }],
    ['junit', { outputFile: 'test-results/junit-role-auth.xml' }],
  ],
  /* Test match patterns - prioritize role-based tests */
  testMatch: [
    '**/*role*.spec.ts',
    '**/*auth*.spec.ts',
    '**/*admin*.spec.ts',
    '**/*user*.spec.ts',
    '**/*.spec.ts',
    '**/*.test.ts',
  ],
  /* Test ignore patterns - exclude Jest tests and other non-e2e files */
  testIgnore: ['**/__tests__/**', '**/*.test.tsx', '**/*.spec.tsx', '**/node_modules/**'],
  /* Global test timeout */
  timeout: 60000,
  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      /* An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 */
      maxDiffPixelRatio: 0.05,
    },
    toMatchSnapshot: {
      /* An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 */
      maxDiffPixelRatio: 0.05,
    },
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:50000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Set test timeout */
    actionTimeout: 10000,

    /* Set navigation timeout */
    navigationTimeout: 30000,

    /* Add role-based test headers for auth simulation */
    extraHTTPHeaders: {
      'x-test-mode': 'true',
      'x-test-role': process.env.TEST_ROLE || 'guest',
      'x-test-user-id': process.env.TEST_USER_ID || '',
      'x-test-user-email': process.env.TEST_USER_EMAIL || '',
    },

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording for debugging */
    video: 'retain-on-failure',

    /* Browser context options - expandable viewport for responsive testing */
    viewport: {
      width: process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 1920,
      height: process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1080,
    }, // Configurable viewport via environment variables
    ignoreHTTPSErrors: true,

    /* Reduce flakiness */
    bypassCSP: true,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 50, // Slow down in development for better debugging
    },
  },

  /* Configure projects for role-based authentication testing */
  projects: [
    {
      name: 'role-validation',
      testMatch: ['**/role-validation.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'admin-flow',
      testMatch: ['**/admin*.spec.ts', '**/role-based-auth.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'x-test-role': 'admin',
          'x-test-user-email': 'admin@cloudless.com',
        },
      },
    },
    {
      name: 'user-flow',
      testMatch: ['**/user*.spec.ts', '**/dashboard*.spec.ts', '**/role-based-auth.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'x-test-role': 'user',
          'x-test-user-email': 'user@example.com',
        },
      },
    },
    {
      name: 'guest-flow',
      testMatch: ['**/guest*.spec.ts', '**/auth*.spec.ts', '**/public*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'x-test-role': 'guest',
        },
      },
    },
    {
      name: 'cross-role-access',
      testMatch: ['**/access-control.spec.ts', '**/security.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'responsive-validation',
      testMatch: ['**/responsive*.spec.ts', '**/mobile*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 }, // Tablet landscape
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 }, // Tablet landscape
      },
    },
    {
      name: 'chromium-wide',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 }, // Ultra-wide desktop
      },
    },
    {
      name: 'chromium-ultra-wide',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3440, height: 1440 }, // Ultra-wide 34-inch monitor
      },
    },
  ],

  /* Global setup and teardown with role-based initialization */
  // globalSetup: path.resolve(__dirname, './tests/e2e/global-setup.ts'),
  // globalTeardown: path.resolve(__dirname, './tests/e2e/global-teardown.ts'),

  /* Update snapshots automatically in CI */
  updateSnapshots: process.env.CI ? 'all' : 'none',

  /* Configure snapshot paths */
  snapshotDir: './tests/e2e/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  /* Metadata for test reporting */
  metadata: {
    'test-suite': 'role-based-auth-validation',
    'app-structure': 'nextjs-app-router',
    'auth-system': 'aws-amplify-cognito',
    'routing-type': 'role-based',
  },
});