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

    this.chkUsedToys = page.getByLabel('ของเล่นมือสอง');
    this.chkDIY = page.getByLabel('สินค้า D.I.Y');
    this.chkUsedDecor = page.getByLabel('ของแต่งบ้านมือสอง/ของใช้');
    this.chkHomemadeSnack = page.getByLabel('ขนมโฮมเมด');
    this.chkUsedClothes = page.getByLabel('เสื้อผ้ามือสอง');
    this.chkCollectibles = page.getByLabel('ของสะสม');
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
      // Page 4 allows 0 or more selections, so it's always valid
      // But we can check if at least one is selected for business rules
      const products = [
        this.chkUsedToys,
        this.chkDIY,
        this.chkUsedDecor,
        this.chkHomemadeSnack,
        this.chkUsedClothes,
        this.chkCollectibles,
      ];

      const productSelected = await Promise.all(
        products.map(async (product) => await product.isChecked())
      );

      const selectedCount = productSelected.filter(Boolean).length;

      // Business rule: maximum 2 products can be selected
      return selectedCount <= FORM_CONSTANTS.MAX_PRODUCT_TYPES;
    } catch (error) {
      console.error('Error validating Page 4 fields:', error);
      return false;
    }
  }
}
