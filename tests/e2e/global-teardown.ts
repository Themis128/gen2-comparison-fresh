import * as fs from 'fs';
import * as path from 'path';

import { chromium } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Runs after all test suites
 */
async function globalTeardown() {
  // Stop Next.js dev server if it was started by setup
  const devServerPidFile = path.join(process.cwd(), 'test-results', 'dev-server.pid');
  if (fs.existsSync(devServerPidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(devServerPidFile, 'utf-8'));
      if (pid) {
        console.warn(`🛑 Stopping Next.js dev server (PID: ${pid})...`);
        process.kill(pid, 'SIGTERM');
        // Wait a bit for graceful shutdown
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Force kill if still running
        try {
          process.kill(pid, 'SIGKILL');
        } catch (_error) {
          // Already stopped
        }
        console.warn('✅ Stopped Next.js dev server');
      }
      fs.unlinkSync(devServerPidFile);
    } catch (error) {
      console.warn('⚠️ Could not stop Next.js dev server:', (error as Error).message);
    }
  }

  // Stop Amplify sandbox if it was started by setup
  const sandboxPidFile = path.join(process.cwd(), 'test-results', 'sandbox.pid');
  if (fs.existsSync(sandboxPidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(sandboxPidFile, 'utf-8'));
      if (pid) {
        console.warn(`🛑 Stopping Amplify sandbox (PID: ${pid})...`);
        process.kill(pid, 'SIGTERM');
        // Wait a bit for graceful shutdown
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Force kill if still running
        try {
          process.kill(pid, 'SIGKILL');
        } catch (_error) {
          // Already stopped
        }
        console.warn('✅ Stopped Amplify sandbox');
      }
      fs.unlinkSync(sandboxPidFile);
    } catch (error) {
      console.warn('⚠️ Could not stop Amplify sandbox:', (error as Error).message);
    }
  }

  // Clean up any temporary files or resources
  const tempDir = path.join(process.cwd(), 'test-results', 'temp');
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.warn('✅ Cleaned up temporary test files');
    } catch (error) {
      console.warn('⚠️ Could not clean up temporary files:', (error as Error).message);
    }
  }

  // Clean up any lingering browser processes
  try {
    const browser = await chromium.launch();
    await browser.close();
    console.warn('✅ Cleaned up browser processes');
  } catch (error) {
    console.warn('⚠️ Could not clean up browser processes:', (error as Error).message);
  }

  console.warn('✅ Playwright global teardown completed');
}

export default globalTeardown;
