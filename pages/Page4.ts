import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { FORM_CONSTANTS } from '../constants/FormConstants';

export type ProductType =
  | 'usedToys'
  | 'diy'
  | 'usedDecor'
  | 'homemadeSnack'
  | 'usedClothes'
  | 'collectibles';

export class Page4Section extends BasePage {

  readonly chkUsedToys: Locator;
  readonly chkDIY: Locator;
  readonly chkUsedDecor: Locator;
  readonly chkHomemadeSnack: Locator;
  readonly chkUsedClothes: Locator;
  readonly chkCollectibles: Locator;

  constructor(page: Page) {
    super(page);

    this.chkUsedToys = page.getByRole('checkbox', { name: 'ของเล่นมือสอง' });
    this.chkDIY = page.getByRole('checkbox', { name: 'สินค้า D.I.Y' });
    this.chkUsedDecor = page.getByRole('checkbox', { name: 'ของแต่งบ้านมือสอง/ของใช้' });
    this.chkHomemadeSnack = page.getByRole('checkbox', { name: 'ขนมโฮมเมด' });
    this.chkUsedClothes = page.getByRole('checkbox', { name: 'เสื้อผ้ามือสอง' });
    this.chkCollectibles = page.getByRole('checkbox', { name: 'ของสะสม' });
  }

  async fill(types: ProductType[]): Promise<void> {
    const selectedTypes = types.slice(0, FORM_CONSTANTS.MAX_PRODUCT_TYPES);

    for (const type of selectedTypes) {
      const locator = this.getProductLocator(type);
      await this.clickElement(locator);
    }
  }

  private getProductLocator(type: ProductType): Locator {
    const productMap: Record<ProductType, Locator> = {
      usedToys: this.chkUsedToys,
      diy: this.chkDIY,
      usedDecor: this.chkUsedDecor,
      homemadeSnack: this.chkHomemadeSnack,
      usedClothes: this.chkUsedClothes,
      collectibles: this.chkCollectibles,
    };
    return productMap[type];
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      const allProducts = [
        this.chkUsedToys, this.chkDIY, this.chkUsedDecor,
        this.chkHomemadeSnack, this.chkUsedClothes, this.chkCollectibles,
      ];
      const checked = await Promise.all(allProducts.map(p => p.isChecked()));
      return checked.filter(Boolean).length <= FORM_CONSTANTS.MAX_PRODUCT_TYPES;
    } catch {
      return false;
    }
  }
}
