import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Launch browser for teardown
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:30000/en');
    
    // Any cleanup operations can be performed here
    // For example: clean up test data, remove test users, etc.
    
    console.log('Global teardown completed successfully');
  } catch (error) {
    console.error('Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await browser.close();
  }
}

export default globalTeardown;
