import { test, expect } from '../../core/fixtures/web.fixture';

test.describe('UI Bank Loans Tests @web @regression', () => {
 
  test.beforeEach(async ({
    loginPage,
    loansPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Login and navigate to loans');
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      testData.user.username,
      testData.user.password
    );
    await loginPage.navigateToLoans();
  });

  test('View existing loans', async ({ loansPage, logger }) => {
    logger.step(1, 'Verify loans list is visible');
    const isListVisible = await loansPage.isLoanListVisible();
    logger.verification(
      'Loans list is visible',
      true,
      isListVisible
    );
    expect(isListVisible).toBeTruthy();
   
    logger.step(2, 'Get loan count');
    const loanCount = await loansPage.getLoanCount();
    logger.info(`Found ${loanCount} loans`);
    expect(loanCount).toBeGreaterThanOrEqual(0);
  });

  test('Submit personal loan application', async ({
    loansPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Click Apply Now button');
    await loansPage.clickApplyNow();
   
    logger.step(2, 'Submit loan application');
    await loansPage.submitLoanApplication(testData.loan.personal);
   
    logger.step(3, 'Verify success message');
    const successMessage = await loansPage.getSuccessMessage();
    logger.verification(
      'Success message contains "success"',
      'to contain "success"',
      successMessage.toLowerCase()
    );
    expect(successMessage.toLowerCase()).toContain('success');
  });

  test('Loan application validation', async ({
    loansPage,
    logger
  }) => {
    logger.step(1, 'Click Apply Now button');
    await loansPage.clickApplyNow();
   
    logger.step(2, 'Submit loan with invalid amount');
    const invalidApplication = {
      loanType: 'personal',
      amount: 1000000, // Too high
      term: '12 months',
      income: 10000, // Too low
      employmentStatus: 'part-time',
    };
   
    await loansPage.submitLoanApplication(invalidApplication);
   
    logger.step(3, 'Verify error message');
    const errorMessage = await loansPage.getErrorMessage();
    logger.verification(
      'Error message is displayed',
      'to contain text',
      errorMessage
    );
    expect(errorMessage).toBeTruthy();
  });
});