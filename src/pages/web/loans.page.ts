import { Page } from '@playwright/test';
import { BasePage } from '../../core/base/base.page';
import { LoansElements } from './elements/loans.elements';

export interface LoanApplication {
  loanemail: string;
  amount: number;
  term: string;
  income: number;
  age: number;
}

export class LoansPage extends BasePage {
  private elements: LoansElements;

  constructor(page: Page) {
    super(page);
    this.elements = new LoansElements(page);
  }

  async navigateToLoansPage(): Promise<void> {
    await this.navigateTo('/loans');
    await this.waitForPageLoad();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.elements.applyNowButton.isVisible() ||
      await this.elements.applyNowButton.isVisible();
  }

  async waitForPageLoad(): Promise<void> {
    await this.waitForElement(this.elements.applyNowButton);
  }

  async clickApplyNow(): Promise<void> {
    await this.clickElement(this.elements.applyNowButton);
    await this.page.waitForLoadState('networkidle');
  }

  async submitLoanApplication(application: LoanApplication): Promise<void> {
    await this.logger.info('Submitting loan application:', application);

    await this.typeText(this.elements.loanemail, application.loanemail);
    await this.typeText(this.elements.loanAmountInput, application.amount.toString());
    await this.selectOption(this.elements.loanTermSelect, application.term);
    await this.typeText(this.elements.incomeInput, application.income.toString());
    await this.typeText(this.elements.age, application.age.toString());


    await this.clickElement(this.elements.submitApplicationButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstLoanAmount(): Promise<string> {
    return await this.getElementText(this.elements.loanAmountInput.first());
  }
}