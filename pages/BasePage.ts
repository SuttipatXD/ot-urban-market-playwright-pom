import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async waitForElement(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  protected async fillElement(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  protected async checkElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.check();
  }

  protected async selectOption(locator: Locator, option: string): Promise<void> {
    await this.clickElement(locator);
    await this.page.getByRole('option', { name: option }).click();
  }

  protected async isAnyChecked(locators: Locator[]): Promise<boolean> {
    const results = await Promise.all(locators.map(l => l.isChecked()));
    return results.some(Boolean);
  }
}