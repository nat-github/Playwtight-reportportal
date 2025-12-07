import { Page, Locator } from '@playwright/test';

export class LoginElements {
  readonly page: Page;
 
  // Login form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
 
  // Navigation elements
  readonly accountsLink: Locator;
  readonly loansLink: Locator;
  readonly transferLink: Locator;
  readonly billsLink: Locator;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
   
    // Login form
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.rememberMeCheckbox = page.locator('input[name="remember"]');
    this.errorMessage = page.locator('.alert.alert-danger');
    this.successMessage = page.locator('.alert.alert-success');
    this.forgotPasswordLink = page.locator('a[href*="forgot-password"]');
    this.registerLink = page.locator('a[href*="register"]');
   
    // Navigation (after login)
    this.accountsLink = page.locator('a:has-text("Accounts")');
    this.loansLink = page.locator('a:has-text("Loans")');
    this.transferLink = page.locator('a:has-text("Transfer")');
    this.billsLink = page.locator('a:has-text("Bills")');
    this.welcomeMessage = page.locator('.welcome-message');
    this.logoutButton = page.locator('a:has-text("Logout")');
  }
}