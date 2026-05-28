import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Page2Data {
  acceptTerms: boolean;
  pdpaConsent: boolean;
  poleConsent: boolean;
  penaltyConsent: boolean;
  preferredDay: 'tuesday' | 'wednesday';
}

export class Page2Section extends BasePage {

  readonly rdoAcceptTerms: Locator;
  readonly rdoNotReadTerms: Locator;
  readonly rdoPdpaConsent: Locator;
  readonly rdoPdpaNotConsent: Locator;
  readonly rdoPoleConsent: Locator;
  readonly rdoPoleNotConsent: Locator;
  readonly rdoPenaltyConsent: Locator;
  readonly rdoPenaltyNotConsent: Locator;
  readonly rdoTuesday: Locator;
  readonly rdoWednesday: Locator;

  constructor(page: Page) {
    super(page);

    this.rdoAcceptTerms = page.getByLabel('ได้อ่านและเข้าใจเงื่อนไขทั้งหมดแล้ว');
    this.rdoNotReadTerms = page.getByLabel('ยังไม่ได้อ่าน/ไม่เข้าใจเงื่อนไข');

    this.rdoPdpaConsent = page.getByLabel('ยินยอม').nth(0);
    this.rdoPdpaNotConsent = page.getByLabel('ไม่ยินยอม').nth(0);
    this.rdoPoleConsent = page.getByLabel('ยินยอม').nth(1);
    this.rdoPoleNotConsent = page.getByLabel('ไม่ยินยอม').nth(1);
    this.rdoPenaltyConsent = page.getByLabel('ยินยอม').nth(2);
    this.rdoPenaltyNotConsent = page.getByLabel('ไม่ยินยอม').nth(2);

    this.rdoTuesday = page.getByLabel('วันอังคาร');
    this.rdoWednesday = page.getByLabel('วันพุธ');
  }

  async fill(data: Page2Data): Promise<void> {
    await this.checkElement(data.acceptTerms ? this.rdoAcceptTerms : this.rdoNotReadTerms);
    await this.checkElement(data.pdpaConsent ? this.rdoPdpaConsent : this.rdoPdpaNotConsent);
    await this.checkElement(data.poleConsent ? this.rdoPoleConsent : this.rdoPoleNotConsent);
    await this.checkElement(data.penaltyConsent ? this.rdoPenaltyConsent : this.rdoPenaltyNotConsent);
    await this.checkElement(data.preferredDay === 'wednesday' ? this.rdoWednesday : this.rdoTuesday);
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      // Check if terms acceptance is selected
      const termsAccepted = await this.rdoAcceptTerms.isChecked();
      const termsNotRead = await this.rdoNotReadTerms.isChecked();
      const hasTermsSelected = termsAccepted || termsNotRead;

      // Check if PDPA consent is selected
      const pdpaConsent = await this.rdoPdpaConsent.isChecked();
      const pdpaNotConsent = await this.rdoPdpaNotConsent.isChecked();
      const hasPdpaSelected = pdpaConsent || pdpaNotConsent;

      // Check if pole consent is selected
      const poleConsent = await this.rdoPoleConsent.isChecked();
      const poleNotConsent = await this.rdoPoleNotConsent.isChecked();
      const hasPoleSelected = poleConsent || poleNotConsent;

      // Check if penalty consent is selected
      const penaltyConsent = await this.rdoPenaltyConsent.isChecked();
      const penaltyNotConsent = await this.rdoPenaltyNotConsent.isChecked();
      const hasPenaltySelected = penaltyConsent || penaltyNotConsent;

      // Check if preferred day is selected
      const tuesdaySelected = await this.rdoTuesday.isChecked();
      const wednesdaySelected = await this.rdoWednesday.isChecked();
      const hasPreferredDaySelected = tuesdaySelected || wednesdaySelected;

      return hasTermsSelected && hasPdpaSelected && hasPoleSelected && hasPenaltySelected && hasPreferredDaySelected;
    } catch (error) {
      console.error('Error validating Page 2 fields:', error);
      return false;
    }
  }
}
