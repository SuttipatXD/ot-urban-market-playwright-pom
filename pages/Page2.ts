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

    this.rdoAcceptTerms = page.getByRole('radio', { name: 'ได้อ่านและเข้าใจเงื่อนไขทั้งหมดแล้ว' });
    this.rdoNotReadTerms = page.getByRole('radio', { name: 'ยังไม่ได้อ่าน/ไม่เข้าใจเงื่อนไข' });

    this.rdoPdpaConsent = page.getByRole('radio', { name: 'ยินยอม', exact: true }).nth(0);
    this.rdoPdpaNotConsent = page.getByRole('radio', { name: 'ไม่ยินยอม', exact: true }).nth(0);
    this.rdoPoleConsent = page.getByRole('radio', { name: 'ยินยอม', exact: true }).nth(1);
    this.rdoPoleNotConsent = page.getByRole('radio', { name: 'ไม่ยินยอม', exact: true }).nth(1);
    this.rdoPenaltyConsent = page.getByRole('radio', { name: 'ยินยอม', exact: true }).nth(2);
    this.rdoPenaltyNotConsent = page.getByRole('radio', { name: 'ไม่ยินยอม', exact: true }).nth(2);

    this.rdoTuesday = page.getByRole('radio', { name: 'วันอังคาร' });
    this.rdoWednesday = page.getByRole('radio', { name: 'วันพุธ' });
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
      return (
        await this.isAnyChecked([this.rdoAcceptTerms, this.rdoNotReadTerms]) &&
        await this.isAnyChecked([this.rdoPdpaConsent, this.rdoPdpaNotConsent]) &&
        await this.isAnyChecked([this.rdoPoleConsent, this.rdoPoleNotConsent]) &&
        await this.isAnyChecked([this.rdoPenaltyConsent, this.rdoPenaltyNotConsent]) &&
        await this.isAnyChecked([this.rdoTuesday, this.rdoWednesday])
      );
    } catch {
      return false;
    }
  }
}
