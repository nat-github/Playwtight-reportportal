import { Page, Locator } from '@playwright/test';

export class LoansElements {
  readonly page: Page;

  // Loan application form
  readonly applyNowButton: Locator;
  readonly loanemail: Locator;
  readonly loanAmountInput: Locator;
  readonly loanTermSelect: Locator;
  readonly incomeInput: Locator;
  readonly age: Locator;
  readonly submitApplicationButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Application form
    this.applyNowButton = page.locator("#applyButton");
    this.loanemail = page.locator('input[type="email"]');
    this.loanAmountInput = page.locator("//input[@id='amount']");
    this.loanTermSelect = page.locator("//select[@id='term']")
    this.incomeInput = page.locator("#income");
    this.age = page.locator("#age");
    this.submitApplicationButton = page.locator("#submitButton");
  }
}