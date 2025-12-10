import { Page } from '@playwright/test';
import { BasePage } from '../../core/base/base.page';
import { LoginElements } from './elements/login.elements';
import { Environment } from '../../config/environment';

export class LoginPage extends BasePage {
  private elements: LoginElements;

  constructor(page: Page) {
    super(page);
    this.elements = new LoginElements(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async logout(): Promise<void> {
    await this.clickElement(this.elements.logoutButton);
    await this.page.waitForURL(/welcome/, { timeout: 5000 });
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.elements.usernameInput.isVisible();
  }

  async waitForPageLoad(): Promise<void> {
    await this.waitForElement(this.elements.usernameInput);
  }

  async login(username: string, password: string): Promise<void> {
    await this.logger.info(`Logging in with username: ${username}`);

    await this.typeText(this.elements.usernameInput, username);
    await this.typeText(this.elements.passwordInput, password);
    await this.clickElement(this.elements.loginButton);
    await this.clickElement(this.elements.privacyButton);

    // Wait for navigation to complete
    await this.page.waitForURL(/accounts/, { timeout: 10000 });
  }

  async loginWithDefaultUser(): Promise<void> {
    await this.login(Environment.UI_BANK_USERNAME, Environment.UI_BANK_PASSWORD);
  }

  async navigateToLoans(): Promise<void> {
    await this.logger.info('Navigating to Loans section');
    await this.clickElement(this.elements.loansLink);
    await this.page.waitForURL(/loans/, { timeout: 5000 });
  }
}