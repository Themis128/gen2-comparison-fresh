#!/usr/bin/env node

/**
 * Test runner script for Playwright E2E tests
 * This script can be used to run tests programmatically
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'e2e');
const CONFIG_FILE = path.join(__dirname, '..', 'playwright.config.ts');

 
console.log('🚀 Starting Playwright E2E Tests');
 
console.log(`📁 Test directory: ${TEST_DIR}`);
 
console.log(`⚙️  Config file: ${CONFIG_FILE}`);

try {
  // Run Playwright tests
   
  console.log('\n📝 Running tests...');

   
  execSync(`npx playwright test ${TEST_DIR} --config=${CONFIG_FILE}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

   
  console.log('\n✅ Tests completed successfully!');

} catch (error) {
   
  console.error('\n❌ Tests failed with error:');
   
  console.error(error.message);
  process.exit(1);
}
