
import { test, expect } from '../../core/fixtures/web.fixture';

test.describe('UI Bank Login Tests @web @smoke', () => {
 
  test('Successful login with valid credentials', async ({
    loginPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();
   
    logger.step(2, 'Enter valid credentials');
    await loginPage.login(
      testData.user.username,
      testData.user.password
    );
   
    logger.step(3, 'Verify successful login');
    await expect(loginPage.page).toHaveURL(/home|dashboard/);
    expect(await loginPage.isLoginSuccessful()).toBeTruthy();
   
    logger.uiAction('Login', 'login form', 'valid credentials');
  });

  test('Login with invalid credentials shows error', async ({
    loginPage,
    logger
  }) => {
    logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();
   
    logger.step(2, 'Enter invalid credentials');
    await loginPage.login('invaliduser', 'wrongpassword');
   
    logger.step(3, 'Verify error message');
    const errorMessage = await loginPage.getErrorMessage();
    logger.verification(
      'Error message contains "Invalid"',
      'to contain "Invalid"',
      errorMessage
    );
    expect(errorMessage).toContain('Invalid');
  });

  test('Navigate to loans page after login', async ({
    loginPage,
    loansPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Login with valid credentials');
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      testData.user.username,
      testData.user.password
    );
   
    logger.step(2, 'Navigate to loans section');
    await loginPage.navigateToLoans();
   
    logger.step(3, 'Verify loans page loaded');
    await expect(loginPage.page).toHaveURL(/loans/);
    expect(await loansPage.isPageLoaded()).toBeTruthy();
  });

  test('Logout functionality', async ({
    loginPage,
    logger,
    testData
  }) => {
    logger.step(1, 'Login with valid credentials');
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      testData.user.username,
      testData.user.password
    );
   
    logger.step(2, 'Logout from application');
    await loginPage.logout();
   
    logger.step(3, 'Verify redirected to login page');
    await expect(loginPage.page).toHaveURL(/login/);
  });
});