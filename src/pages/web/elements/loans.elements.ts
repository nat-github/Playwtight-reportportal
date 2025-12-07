import { Page, Locator } from '@playwright/test';

export class LoansElements {
  readonly page: Page;
 
  // Loan application form
  readonly applyNowButton: Locator;
  readonly loanTypeSelect: Locator;
  readonly loanAmountInput: Locator;
  readonly loanTermSelect: Locator;
  readonly incomeInput: Locator;
  readonly employmentSelect: Locator;
  readonly submitApplicationButton: Locator;
 
  // Loan list
  readonly loanList: Locator;
  readonly loanItems: Locator;
  readonly loanStatus: Locator;
  readonly loanAmountDisplay: Locator;
 
  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly applicationStatus: Locator;

  constructor(page: Page) {
    this.page = page;
   
    // Application form
    this.applyNowButton = page.locator('button:has-text("Apply Now")');
    this.loanTypeSelect = page.locator('#loanType');
    this.loanAmountInput = page.locator('#loanAmount');
    this.loanTermSelect = page.locator('#loanTerm');
    this.incomeInput = page.locator('#income');
    this.employmentSelect = page.locator('#employmentStatus');
    this.submitApplicationButton = page.locator('button:has-text("Submit Application")');
   
    // Loan list
    this.loanList = page.locator('.loan-list');
    this.loanItems = page.locator('.loan-item');
    this.loanStatus = page.locator('.loan-status');
    this.loanAmountDisplay = page.locator('.loan-amount');
   
    // Messages
    this.successMessage = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger');
    this.applicationStatus = page.locator('.application-status');
  }
}