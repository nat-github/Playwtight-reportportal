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
   
    // Wait for navigation to complete
    await this.page.waitForURL(/home|dashboard/, { timeout: 10000 });
  }

  async loginWithDefaultUser(): Promise<void> {
    await this.login(Environment.UI_BANK_USERNAME, Environment.UI_BANK_PASSWORD);
  }

  async isLoginSuccessful(): Promise<boolean> {
    try {
      await this.waitForElement(this.elements.welcomeMessage, 5000);
      return await this.elements.welcomeMessage.isVisible();
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.elements.errorMessage);
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.elements.forgotPasswordLink);
  }

  async clickRegister(): Promise<void> {
    await this.clickElement(this.elements.registerLink);
  }

  async navigateToLoans(): Promise<void> {
    await this.logger.info('Navigating to Loans section');
    await this.clickElement(this.elements.loansLink);
    await this.page.waitForURL(/loans/, { timeout: 5000 });
  }

  async logout(): Promise<void> {
    await this.logger.info('Logging out');
    await this.clickElement(this.elements.logoutButton);
    await this.page.waitForURL(/login/, { timeout: 5000 });
  }
}