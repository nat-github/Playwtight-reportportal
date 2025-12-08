import { test, expect } from '../../src/core/fixtures/web.fixture';

test.describe('UI Bank Loans Tests @web @regression', () => {

  test.beforeEach(async ({
    loginPage,
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


  test('Submit personal loan application', async ({
    loansPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Click Apply Now button');
    await loansPage.clickApplyNow();

    logger.step(2, 'Submit loan application');
    await loansPage.submitLoanApplication(testData.loan.personal);
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
  });
});