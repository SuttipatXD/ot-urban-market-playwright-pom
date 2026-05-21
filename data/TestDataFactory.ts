import { Page1Data } from '../pages/OTUrbanMarketPage1';
import { Page2Data } from '../pages/OTUrbanMarketPage2';
import { Page3Data } from '../pages/OTUrbanMarketPage3';
import { ProductType } from '../pages/OTUrbanMarketPage4';

export class TestDataFactory {
  static createValidPage1Data(overrides: Partial<Page1Data> = {}): Page1Data {
    return {
      source: 'X',
      visitFrequency: 'monthly',
      sellFrequency: 'everyMonth',
      satisfaction: 5,
      ...overrides,
    };
  }

  static createValidPage2Data(overrides: Partial<Page2Data> = {}): Page2Data {
    return {
      acceptTerms: true,
      pdpaConsent: true,
      poleConsent: true,
      penaltyConsent: true,
      preferredDay: 'wednesday',
      ...overrides,
    };
  }

  static createValidPage3Data(overrides: Partial<Page3Data> = {}): Page3Data {
    return {
      title: 'นางสาว',
      fullName: 'ณัฐกาญจน์ แก้วแกมแข',
      nationalId: '1679800286571',
      phone: '0913932648',
      postalCode: '10240',
      occupation: 'พนักงานบริษัท',
      age: 25,
      ...overrides,
    };
  }

  static createValidProductTypes(): ProductType[] {
    return ['usedDecor', 'usedClothes'];
  }

  static createAllSources(): Array<Page1Data['source']> {
    return [
      'X',
      'Facebook',
      'TikTok',
      'Instagram',
      'friend',
      'tiktokInfluencer',
      'xInfluencer',
      'facebookInfluencer',
      'walkby',
    ];
  }
}