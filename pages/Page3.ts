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

    this.ddlTitle = page.getByRole('button', { name: /คำนำหน้าชื่อ/ });
    this.txtFullName = page.getByRole('textbox', { name: /ชื่อ.*นามสกุล/ });
    this.txtNationalId = page.getByRole('textbox', { name: /เลขบัตรประชาชน/ });
    this.txtPhone = page.getByRole('textbox', { name: /เบอร์โทร/ });
    this.txtPostalCode = page.getByRole('textbox', { name: /รหัสไปรษณีย์/ });
    this.ddlOccupation = page.getByRole('button', { name: /อาชีพ/ });
    this.txtAge = page.getByRole('textbox', { name: /อายุ/ });
  }

  async fill(data: Page3Data): Promise<void> {
    await this.selectTitle(data.title);
    await this.fillElement(this.txtFullName, data.fullName);
    await this.fillElement(this.txtNationalId, data.nationalId);
    await this.fillElement(this.txtPhone, data.phone);
    await this.fillElement(this.txtPostalCode, data.postalCode);
    await this.selectOccupation(data.occupation);
    await this.fillElement(this.txtAge, String(data.age));
  }

  async selectTitle(title: string): Promise<void> {
    await this.clickElement(this.ddlTitle);
    await this.page.getByRole('option', { name: title, exact: true }).click();
  }

  async selectOccupation(occupation: string): Promise<void> {
    await this.clickElement(this.ddlOccupation);
    await this.page.getByRole('option', { name: occupation }).click();
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      const isDropdownFilled = (text: string) => text.trim() !== 'Select your answer' && text.trim().length > 0;

      const hasTitleSelected = isDropdownFilled(await this.ddlTitle.innerText());
      const hasFullName = (await this.txtFullName.inputValue()).trim().length > 0;
      const hasValidNationalId = (await this.txtNationalId.inputValue()).length >= 13;
      const hasValidPhone = (await this.txtPhone.inputValue()).length >= 10;
      const hasPostalCode = (await this.txtPostalCode.inputValue()).length >= 5;
      const hasOccupationSelected = isDropdownFilled(await this.ddlOccupation.innerText());
      const age = parseInt(await this.txtAge.inputValue(), 10);
      const hasValidAge = !isNaN(age) && age >= 6 && age <= 99;

      return hasTitleSelected && hasFullName && hasValidNationalId && hasValidPhone &&
             hasPostalCode && hasOccupationSelected && hasValidAge;
    } catch {
      return false;
    }
  }
}
