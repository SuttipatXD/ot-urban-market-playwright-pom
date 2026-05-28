import { Page } from '@playwright/test';
import { Page1Section, Page1Data } from './Page1';
import { Page2Section, Page2Data } from './Page2';
import { Page3Section, Page3Data } from './Page3';
import { Page4Section, ProductType } from './Page4';
import { FORM_URLS } from '../constants/FormConstants';

export class OTUrbanMarketFormPage {
  readonly page: Page;
  readonly url = FORM_URLS.REGISTRATION;

  readonly page1: Page1Section;
  readonly page2: Page2Section;
  readonly page3: Page3Section;
  readonly page4: Page4Section;

  constructor(page: Page) {
    this.page = page;
    this.page1 = new Page1Section(page);
    this.page2 = new Page2Section(page);
    this.page3 = new Page3Section(page);
    this.page4 = new Page4Section(page);
  }

  get btnNextTo() {
    return this.page.getByRole('button', { name: 'ถัดไป' });
  }

  get btnNext() {
    return this.page.getByRole('button', { name: 'Next' });
  }

  get btnSubmitTh() {
    return this.page.getByRole('button', { name: 'ส่ง' });
  }

  get btnSubmit() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.page1.chkXUnionMall.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async clickNext(): Promise<void> {
    const isThaiBtn = await this.btnNextTo.isVisible();
    await (isThaiBtn ? this.btnNextTo : this.btnNext).click();
    await this.page.waitForTimeout(1_500);
  }

  async clickSubmit(): Promise<void> {
    const isThaiBtn = await this.btnSubmitTh.isVisible();
    const btn = isThaiBtn ? this.btnSubmitTh : this.btnSubmit;
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await this.page.waitForLoadState('load');
  }

  async isSubmitSuccess(): Promise<boolean> {
    await this.page.waitForSelector('text=ขอขอบคุณ', { timeout: 10_000 });
    return true;
  }

  async fillPage1(data: Page1Data): Promise<void> {
    await this.page1.fill(data);
  }

  async fillPage2(data: Page2Data): Promise<void> {
    await this.page2.fill(data);
  }

  async fillPage3(data: Page3Data): Promise<void> {
    await this.page3.fill(data);
  }

  async fillPage4(types: ProductType[]): Promise<void> {
    await this.page4.fill(types);
  }

  async validateAllPages(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      const page1Valid = await this.page1.validateRequiredFields();
      if (!page1Valid) errors.push('Page 1: Missing required fields');

      const page2Valid = await this.page2.validateRequiredFields();
      if (!page2Valid) errors.push('Page 2: Missing required fields');

      const page3Valid = await this.page3.validateRequiredFields();
      if (!page3Valid) errors.push('Page 3: Missing required fields');

      const page4Valid = await this.page4.validateRequiredFields();
      if (!page4Valid) errors.push('Page 4: Too many products selected (max 2)');

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error validating form:', error);
      return {
        isValid: false,
        errors: ['Validation failed due to technical error']
      };
    }
  }

  async fillAllPages(data: {
    page1: Page1Data;
    page2: Page2Data;
    page3: Page3Data;
    page4: ProductType[];
  }): Promise<void> {
    await this.page1.fill(data.page1);
    await this.clickNext();
    await this.page2.fill(data.page2);
    await this.clickNext();
    await this.page3.fill(data.page3);
    await this.clickNext();
    await this.page4.fill(data.page4);
  }
}
