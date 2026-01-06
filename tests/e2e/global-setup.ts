import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global setup for Playwright tests
 * Runs before all test suites
 */
async function globalSetup() {
  console.log('🚀 Starting Playwright global setup...');

  // Start Next.js dev server if not already running
  const devServerPidFile = path.join(process.cwd(), 'test-results', 'dev-server.pid');
  if (!fs.existsSync(path.dirname(devServerPidFile))) {
    fs.mkdirSync(path.dirname(devServerPidFile), { recursive: true });
  }

  // Check if dev server is already running
  let devServerRunning = false;
  try {
    const response = await fetch('http://localhost:50000', { method: 'HEAD', timeout: 5000 });
    if (response.ok) {
      console.log('✅ Next.js dev server is already running on port 50000');
      devServerRunning = true;
    }
  } catch (error) {
    console.log('ℹ️ Next.js dev server not detected on port 50000, starting...');
  }

  if (!devServerRunning) {
    console.log('🌐 Starting Next.js dev server on port 50000...');
    let devServerStarted = false;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} to start Next.js dev server...`);

      const devServerProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['inherit', 'inherit', 'inherit'],
        detached: true,
        env: { ...process.env, PORT: '50000' },
      });

      // Save PID for teardown
      fs.writeFileSync(devServerPidFile, devServerProcess.pid?.toString() || '');

      // Wait for dev server to be ready
      console.log('⏳ Waiting for Next.js dev server to start...');
      let ready = false;
      for (let i = 0; i < 30; i++) {
        try {
          const response = await fetch('http://localhost:50000', { method: 'HEAD', timeout: 5000 });
          if (response.ok) {
            console.log('✅ Next.js dev server is ready on port 50000!');
            devServerStarted = true;
            ready = true;
            break;
          }
        } catch (error) {
          // Continue waiting
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (ready) {
        break;
      } else {
        console.warn(`⚠️ Attempt ${attempt} failed. Stopping process and retrying...`);
        try {
          const pid = parseInt(fs.readFileSync(devServerPidFile, 'utf-8'));
          if (pid) {
            process.kill(pid, 'SIGTERM');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
              process.kill(pid, 'SIGKILL');
            } catch (error) {
              // Already stopped
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not stop failed dev server process:', (error as Error).message);
        }

        if (attempt === maxRetries) {
          console.error('❌ Failed to start Next.js dev server after all retries');
          throw new Error('Next.js dev server failed to start');
        }

        // Wait a bit before retrying
        console.log('⏳ Waiting before retry...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  // Start Amplify sandbox if not already running
  const sandboxPidFile = path.join(process.cwd(), 'test-results', 'sandbox.pid');
  if (!fs.existsSync(path.dirname(sandboxPidFile))) {
    fs.mkdirSync(path.dirname(sandboxPidFile), { recursive: true });
  }

  // Check if sandbox is already running
  let sandboxRunning = false;
  try {
    const response = await fetch('http://localhost:3001', { method: 'HEAD', timeout: 5000 });
    if (response.ok) {
      console.log('✅ Amplify sandbox is already running');
      sandboxRunning = true;
    }
  } catch (error) {
    console.log('ℹ️ Amplify sandbox not detected, starting...');
  }

  if (!sandboxRunning) {
    console.log('🏗️ Starting Amplify sandbox...');
    let sandboxStarted = false;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} to start Amplify sandbox...`);

      const sandboxProcess = spawn('npx', ['ampx', 'sandbox'], {
        stdio: ['inherit', 'inherit', 'inherit'],
        detached: true,
        env: { ...process.env, AWS_REGION: 'us-east-1' },
      });

      // Save PID for teardown
      fs.writeFileSync(sandboxPidFile, sandboxProcess.pid?.toString() || '');

      // Wait for sandbox to be ready
      console.log('⏳ Waiting for Amplify sandbox to start...');
      let ready = false;
      for (let i = 0; i < 60; i++) {
        try {
          const response = await fetch('http://localhost:3001', { method: 'HEAD', timeout: 5000 });
          if (response.ok) {
            console.log('✅ Amplify sandbox is ready!');
            sandboxStarted = true;
            ready = true;
            break;
          }
        } catch (error) {
          // Continue waiting
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (ready) {
        break;
      } else {
        console.warn(`⚠️ Attempt ${attempt} failed. Stopping process and retrying...`);
        try {
          const pid = parseInt(fs.readFileSync(sandboxPidFile, 'utf-8'));
          if (pid) {
            process.kill(pid, 'SIGTERM');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
              process.kill(pid, 'SIGKILL');
            } catch (error) {
              // Already stopped
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not stop failed sandbox process:', (error as Error).message);
        }

        if (attempt === maxRetries) {
          console.error('❌ Failed to start Amplify sandbox after all retries');
          throw new Error('Amplify sandbox failed to start');
        }

        // Wait a bit before retrying
        console.log('⏳ Waiting before retry...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  // Pre-warm browser for faster test execution
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Pre-load common pages to warm up the cache
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:50000';
  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    console.log(`✅ Pre-warmed application at ${baseUrl}`);
  } catch (error) {
    console.warn('⚠️ Could not pre-warm application:', (error as Error).message);
  }

  await browser.close();
  console.log('✅ Playwright global setup completed');
}

export default globalSetup;
