import { defineConfig, devices } from '@playwright/test';
import { Environment } from './src/config/environment';

export default defineConfig({
  // Make sure testDir points to correct location
  testDir: './src/tests',
  testMatch: '**/*.spec.ts',  // Add this line
  
  outputDir: './reports/test-results',
  timeout: 60000,
  globalTimeout: 600000,
  expect: {
    timeout: 10000,
  },
  
  // Add grep for test filtering
  grep: /@web|@api|@smoke|@regression/,
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Environment.RETRY_ATTEMPTS,
  workers: process.env.CI ? 2 : '50%',
  
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html-report', open: 'never' }],
    ['junit', { outputFile: './reports/junit/results.xml' }],
  ],
  
  projects: [
    {
      name: 'ui-bank-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        baseURL: Environment.WEB_BASE_URL,
      },
      testMatch: '**/web/**/*.spec.ts',  // Specific pattern for web tests
    },
    {
      name: 'jsonplaceholder-api',
      use: {
        baseURL: Environment.API_BASE_URL,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
      testMatch: '**/api/**/*.spec.ts',  // Specific pattern for API tests
    },
  ],
  
  use: {
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
  },
});