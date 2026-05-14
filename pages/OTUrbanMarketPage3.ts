import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Page3Data {
  title: 'นาย' | 'นาง' | 'นางสาว' | 'เด็กชาย' | 'เด็กหญิง' | 'Other';
  fullName: string;
  nationalId: string;
  phone: string;
  postalCode: string;
  occupation: string;
  age: number;
}

export class Page3Section extends BasePage {

  readonly ddlTitle: Locator;
  readonly txtFullName: Locator;
  readonly txtNationalId: Locator;
  readonly txtPhone: Locator;
  readonly txtPostalCode: Locator;
  readonly ddlOccupation: Locator;
  readonly txtAge: Locator;

  constructor(page: Page) {
    super(page);

    this.ddlTitle = page.getByRole('button', { name: 'Select your answer' }).first();
    this.txtFullName = page.getByRole('textbox').nth(0);
    this.txtNationalId = page.getByPlaceholder('Please enter at least 13 characters');
    this.txtPhone = page.getByPlaceholder('Please enter at least 10 characters');
    this.txtPostalCode = page.getByPlaceholder('Please enter at least 5 characters');
    this.ddlOccupation = page.getByRole('button', { name: 'Select your answer' }).nth(1);
    this.txtAge = page.getByPlaceholder('The value must be a number');
  }

  async fill(data: Page3Data): Promise<void> {
    await this.selectTitle(data.title);
    await this.txtFullName.fill(data.fullName);
    await this.txtNationalId.fill(data.nationalId);
    await this.txtPhone.fill(data.phone);
    await this.txtPostalCode.fill(data.postalCode);
    await this.selectOccupation(data.occupation);
    await this.txtAge.fill(String(data.age));
  }

  async selectTitle(title: string): Promise<void> {
    await this.ddlTitle.click();
    await this.page.getByRole('option', { name: title }).click();
  }

  async selectOccupation(occupation: string): Promise<void> {
    await this.ddlOccupation.click();
    await this.page.getByRole('option', { name: occupation }).click();
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      // Check if title is selected (dropdown has value)
      const titleValue = await this.ddlTitle.inputValue();
      const hasTitleSelected = titleValue.trim().length > 0;

      // Check if full name is filled
      const fullNameValue = await this.txtFullName.inputValue();
      const hasFullName = fullNameValue.trim().length > 0;

      // Check if national ID is filled and has correct length
      const nationalIdValue = await this.txtNationalId.inputValue();
      const hasValidNationalId = nationalIdValue.length >= 13;

      // Check if phone is filled and has correct length
      const phoneValue = await this.txtPhone.inputValue();
      const hasValidPhone = phoneValue.length >= 10;

      // Check if postal code is filled
      const postalCodeValue = await this.txtPostalCode.inputValue();
      const hasPostalCode = postalCodeValue.length >= 5;

      // Check if occupation is selected
      const occupationValue = await this.ddlOccupation.inputValue();
      const hasOccupationSelected = occupationValue.trim().length > 0;

      // Check if age is filled and is a valid number
      const ageValue = await this.txtAge.inputValue();
      const ageNumber = parseInt(ageValue, 10);
      const hasValidAge = !isNaN(ageNumber) && ageNumber > 0 && ageNumber <= 120;

      return hasTitleSelected && hasFullName && hasValidNationalId && hasValidPhone &&
             hasPostalCode && hasOccupationSelected && hasValidAge;
    } catch (error) {
      console.error('Error validating Page 3 fields:', error);
      return false;
    }
  }
}
