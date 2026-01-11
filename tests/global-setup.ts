import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:30000/en');
    
    // Wait for the application to be ready
    await page.waitForLoadState('networkidle');
    
    // Any additional setup can be done here
    // For example: create test users, seed data, etc.
    
    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
