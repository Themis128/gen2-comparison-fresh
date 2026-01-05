  sst#!/usr/bin/env node

/**
 * Test runner script for Playwright E2E tests
 * This script can be used to run tests programmatically
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-unused-vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'e2e');
const CONFIG_FILE = path.join(__dirname, '..', 'playwright.config.ts');

// eslint-disable-next-line no-console
console.log('🚀 Starting Playwright E2E Tests');
// eslint-disable-next-line no-console
console.log(`📁 Test directory: ${TEST_DIR}`);
// eslint-disable-next-line no-console
console.log(`⚙️  Config file: ${CONFIG_FILE}`);

try {
  // Run Playwright tests
  // eslint-disable-next-line no-console
  console.log('\n📝 Running tests...');

  // eslint-disable-next-line no-unused-vars
  execSync(`npx playwright test ${TEST_DIR} --config=${CONFIG_FILE}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // eslint-disable-next-line no-console
  console.log('\n✅ Tests completed successfully!');

} catch (error) {
  // eslint-disable-next-line no-console
  console.error('\n❌ Tests failed with error:');
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
}
