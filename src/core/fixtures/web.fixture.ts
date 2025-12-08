import { test as baseTest, Page } from '@playwright/test';
import { LoginPage } from '../../pages/web/login.page';
import { LoansPage } from '../../pages/web/loans.page';
import { Logger } from '../helpers/logger';
import { Environment } from '../../config/environment';

// Define fixture types
export type WebFixtures = {
  page: Page;
  loginPage: LoginPage;
  loansPage: LoansPage;
  logger: Logger;
  testData: TestData;
};

// Test data interface
export interface TestData {
  user: {
    username: string;
    password: string;
    email: string;
  };
  loan: {
    personal: LoanData;
    auto: LoanData;
    mortgage: LoanData;
  };
}

export interface LoanData {
  loanType: string;
  amount: number;
  term: string;
  income: number;
  employmentStatus: string;
}

// Extended test with fixtures
export const test = baseTest.extend<WebFixtures>({
  // Logger fixture
  logger: async ({ }, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    await use(logger);
  },

  // Test data fixture
  testData: async ({ }, use) => {
    const testData: TestData = {
      user: {
        username: Environment.UI_BANK_USERNAME,
        password: Environment.UI_BANK_PASSWORD,
        email: 'test.user@example.com',
      },
      loan: {
        personal: {
          loanType: 'personal',
          amount: 5000,
          term: '12 months',
          income: 60000,
          employmentStatus: 'full-time',
        },
        auto: {
          loanType: 'auto',
          amount: 25000,
          term: '60 months',
          income: 80000,
          employmentStatus: 'full-time',
        },
        mortgage: {
          loanType: 'mortgage',
          amount: 300000,
          term: '30 years',
          income: 120000,
          employmentStatus: 'full-time',
        },
      },
    };
    await use(testData);
  },

  // Login page fixture
  loginPage: async ({ page, logger }, use) => {
    const loginPage = new LoginPage(page);
    logger.info('Login page fixture initialized');
    await use(loginPage);
  },

  // Loans page fixture
  loansPage: async ({ page, logger }, use) => {
    const loansPage = new LoansPage(page);
    logger.info('Loans page fixture initialized');
    await use(loansPage);
  },

  // Enhanced page fixture with automatic screenshots on failure
  page: async ({ page, logger }, use, testInfo) => {
    // Listen to console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error' || type === 'warning') {
        logger.warn(`Browser ${type}: ${text}`);
      }
    });

    // Listen to page errors
    page.on('pageerror', error => {
      logger.error(`Page error: ${error.message}`);
    });

    // Listen to network requests
    page.on('request', request => {
      logger.debug(`Request: ${request.method()} ${request.url()}`);
    });

    // Listen to network responses
    page.on('response', response => {
      const status = response.status();
      if (status >= 400) {
        logger.warn(`Response ${status}: ${response.url()}`);
      }
    });

    // Use the page
    await use(page);

    // Take screenshot on test failure
    if (testInfo.status === 'failed') {
      const screenshotPath = await page.screenshot({
        path: `./reports/screenshots/${testInfo.title}-${testInfo.retry}.png`,
        fullPage: true,
      });
      logger.info(`Screenshot saved: ${screenshotPath}`);
      testInfo.attachments.push({
        name: 'screenshot',
        contentType: 'image/png',
        path: `./reports/screenshots/${testInfo.title}-${testInfo.retry}.png`,
      });
    }
  },
});

// Export expect from Playwright
export { expect } from '@playwright/test';