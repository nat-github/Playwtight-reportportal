import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const Environment = {
  // Application URLs
  WEB_BASE_URL: process.env.BASE_URL_WEB || 'https://uibank.uipath.com',
  API_BASE_URL: process.env.BASE_URL_API || 'https://jsonplaceholder.typicode.com',

  // UI Bank Credentials
  UI_BANK_USERNAME: process.env.UI_BANK_USERNAME || 'poc_testing',
  UI_BANK_PASSWORD: process.env.UI_BANK_PASSWORD || 'Natarajasai@123',

  // ReportPortal Configuration
  REPORTPORTAL_ENABLED: process.env.REPORTPORTAL_ENABLED === 'true',
  REPORTPORTAL_ENDPOINT: process.env.REPORTPORTAL_ENDPOINT || 'http://localhost:8080',
  REPORTPORTAL_PROJECT: process.env.REPORTPORTAL_PROJECT || 'default_personal',
  REPORTPORTAL_TOKEN: process.env.REPORTPORTAL_TOKEN || 'default_token_here',
  REPORTPORTAL_LAUNCH: process.env.REPORTPORTAL_LAUNCH || 'Playwright_Tests_1',

  // Test Configuration
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '2'),
  VIEWPORT_WIDTH: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
  VIEWPORT_HEIGHT: parseInt(process.env.VIEWPORT_HEIGHT || '1080'),

  // Timeouts
  PAGE_LOAD_TIMEOUT: 30000,
  API_TIMEOUT: 10000,
  ACTION_TIMEOUT: 15000,
} as const;