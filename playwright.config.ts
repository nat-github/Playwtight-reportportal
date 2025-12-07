import { defineConfig, devices } from '@playwright/test';
import { Environment } from './src/config/environment';
import { ReportPortalConfig } from './src/config/reportportal.config';
import { RPReporter } from '@reportportal/agent-js-playwright';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  globalTimeout: 600000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Environment.RETRY_ATTEMPTS,
  workers: process.env.CI ? 2 : '50%',
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html-report', open: 'never' }],
    ['junit', { outputFile: './reports/junit/results.xml' }],
    ...(ReportPortalConfig.enabled ? [[RPReporter, ReportPortalConfig]] : []),
  ],
 
  projects: [
    {
      name: 'ui-bank-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: Environment.VIEWPORT_WIDTH,
          height: Environment.VIEWPORT_HEIGHT
        },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        baseURL: Environment.WEB_BASE_URL,
      },
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
    },
  ],
 
  use: {
    actionTimeout: Environment.ACTION_TIMEOUT,
    navigationTimeout: Environment.PAGE_LOAD_TIMEOUT,
    trace: 'on-first-retry',
  },
});import { defineConfig, devices } from '@playwright/test';
import { Environment } from './src/config/environment';
import { ReportPortalConfig } from './src/config/reportportal.config';
import { RPReporter } from '@reportportal/agent-js-playwright';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  globalTimeout: 600000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Environment.RETRY_ATTEMPTS,
  workers: process.env.CI ? 2 : '50%',
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html-report', open: 'never' }],
    ['junit', { outputFile: './reports/junit/results.xml' }],
    ...(ReportPortalConfig.enabled ? [[RPReporter, ReportPortalConfig]] : []),
  ],
 
  projects: [
    {
      name: 'ui-bank-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: Environment.VIEWPORT_WIDTH,
          height: Environment.VIEWPORT_HEIGHT
        },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        baseURL: Environment.WEB_BASE_URL,
      },
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
    },
  ],
 
  use: {
    actionTimeout: Environment.ACTION_TIMEOUT,
    navigationTimeout: Environment.PAGE_LOAD_TIMEOUT,
    trace: 'on-first-retry',
  },
});