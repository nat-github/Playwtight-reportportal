import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../helpers/logger';
import { Environment } from '../../config/environment';

export abstract class BasePage {
  public page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  // Navigation methods
  protected async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: Environment.PAGE_LOAD_TIMEOUT
    });
  }

  protected async reloadPage(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  // Wait methods
  protected async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async waitForElementHidden(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  protected async waitForElementEnabled(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  // Action methods
  protected async clickElement(locator: Locator): Promise<void> {
    this.logger.info(`Clicking element: ${await this.getLocatorDescription(locator)}`);
    await this.waitForElementEnabled(locator);
    await locator.click();
  }

  protected async doubleClickElement(locator: Locator): Promise<void> {
    this.logger.info(`Double clicking element: ${await this.getLocatorDescription(locator)}`);
    await this.waitForElementEnabled(locator);
    await locator.dblclick();
  }

  protected async typeText(locator: Locator, text: string): Promise<void> {
    this.logger.info(`Typing text: "${text}"`);
    await this.waitForElementEnabled(locator);
    await locator.fill(text);
  }

  protected async clearAndType(locator: Locator, text: string): Promise<void> {
    await this.waitForElementEnabled(locator);
    await locator.clear();
    await this.typeText(locator, text);
  }

  protected async selectOption(locator: Locator, value: string): Promise<void> {
    this.logger.info(`Selecting option: "${value}"`);
    await this.waitForElementEnabled(locator);
    await locator.selectOption(value);
  }

  protected async checkCheckbox(locator: Locator): Promise<void> {
    this.logger.info(`Checking checkbox`);
    await this.waitForElementEnabled(locator);
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  protected async uncheckCheckbox(locator: Locator): Promise<void> {
    this.logger.info(`Unchecking checkbox`);
    await this.waitForElementEnabled(locator);
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  // Getter methods
  protected async getElementText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  protected async getElementAttribute(locator: Locator, attribute: string): Promise<string> {
    const value = await locator.getAttribute(attribute);
    return value || '';
  }

  protected async getInputValue(locator: Locator): Promise<string> {
    return await this.getElementAttribute(locator, 'value');
  }

  // Verification methods
  protected async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  protected async isElementEnabled(locator: Locator): Promise<boolean> {
    try {
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  protected async isElementChecked(locator: Locator): Promise<boolean> {
    try {
      return await locator.isChecked();
    } catch {
      return false;
    }
  }

  // Assertion methods
  protected async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    const actualText = await this.getElementText(locator);
    expect(actualText).toBe(expectedText);
  }

  protected async verifyElementContainsText(locator: Locator, expectedText: string): Promise<void> {
    const actualText = await this.getElementText(locator);
    expect(actualText).toContain(expectedText);
  }

  protected async verifyElementIsVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  protected async verifyElementIsHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  protected async verifyElementIsEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  protected async verifyElementIsDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  // Screenshot methods
  protected async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${name}-${timestamp}.png`;
    const screenshotPath = `./reports/screenshots/${screenshotName}`;

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    this.logger.info(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  // Utility methods
  protected async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  protected async hoverOverElement(locator: Locator): Promise<void> {
    this.logger.info(`Hovering over element`);
    await locator.hover();
  }

  protected async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  // Private helper
  private async getLocatorDescription(locator: Locator): Promise<string> {
    try {
      const count = await locator.count();
      return `Locator[count=${count}]`;
    } catch {
      return 'Locator';
    }
  }

  // Abstract method - must be implemented by child classes
  public abstract isPageLoaded(): Promise<boolean>;
}