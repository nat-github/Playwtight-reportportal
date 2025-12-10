import { Page, Locator } from '@playwright/test';

export class LoginElements {
  readonly page: Page;

  // Login form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly privacyButton: Locator;
  readonly logoutButton: Locator;

  // Navigation elements
  readonly loansLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByText('Sign In');
    this.privacyButton = page.locator('button:has-text("I agree to the Privacy Policy →")');
    this.logoutButton = page.getByRole('link', { name: 'Logout' });

    // Navigation (after login)

    this.loansLink = page.getByRole('link', { name: 'Apply For A Loan →' })

  }
}