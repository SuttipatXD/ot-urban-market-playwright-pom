import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type Page1Source =
  | 'X'
  | 'Facebook'
  | 'TikTok'
  | 'Instagram'
  | 'friend'
  | 'tiktokInfluencer'
  | 'xInfluencer'
  | 'facebookInfluencer'
  | 'walkby';

export type Page1VisitFrequency =
  | 'moreThanOnce'
  | 'monthly'
  | 'quarterly'
  | 'biannual'
  | 'yearly';

export type Page1SellFrequency = 'never' | 'once' | 'moreThanTwice' | 'everyMonth';

export interface Page1Data {
  source: Page1Source;
  visitFrequency: Page1VisitFrequency;
  sellFrequency: Page1SellFrequency;
  satisfaction: 1 | 2 | 3 | 4 | 5;
}

export class Page1Section extends BasePage {

  readonly chkXUnionMall: Locator;
  readonly chkFacebookUnionMall: Locator;
  readonly chkTikTokUnionMall: Locator;
  readonly chkInstagramUnionMall: Locator;
  readonly chkFriend: Locator;
  readonly chkTikTokInfluencer: Locator;
  readonly chkXInfluencer: Locator;
  readonly chkFacebookInfluencer: Locator;
  readonly chkWalkby: Locator;

  readonly rdoMoreThanOncePerMonth: Locator;
  readonly rdoOncePerMonth: Locator;
  readonly rdoOncePerThreeMonths: Locator;
  readonly rdoOncePerSixMonths: Locator;
  readonly rdoOncePerYear: Locator;

  readonly rdoNever: Locator;
  readonly rdoOnce: Locator;
  readonly rdoMoreThanTwicePerMonth: Locator;
  readonly rdoEveryMonth: Locator;

  readonly ratingHeart1: Locator;
  readonly ratingHeart2: Locator;
  readonly ratingHeart3: Locator;
  readonly ratingHeart4: Locator;
  readonly ratingHeart5: Locator;

  constructor(page: Page) {
    super(page);

    this.chkXUnionMall = page.getByRole('checkbox', { name: 'X Union Mall' });
    this.chkFacebookUnionMall = page.getByRole('checkbox', { name: 'Facebook Union Mall' });
    this.chkTikTokUnionMall = page.getByRole('checkbox', { name: 'TikTok Union Mall' });
    this.chkInstagramUnionMall = page.getByRole('checkbox', { name: 'Instagram Union Mall' });
    this.chkFriend = page.getByRole('checkbox', { name: 'เพื่อน / คนรู้จัก' });
    this.chkTikTokInfluencer = page.getByRole('checkbox', { name: 'TikTok influencer' });
    this.chkXInfluencer = page.getByRole('checkbox', { name: 'X influencer' });
    this.chkFacebookInfluencer = page.getByRole('checkbox', { name: 'Facebook influencer' });
    this.chkWalkby = page.getByRole('checkbox', { name: 'ผ่านมาเจอ' });

    this.rdoMoreThanOncePerMonth = page.getByRole('radio', { name: 'มากกว่า 1 ครั้งต่อเดือน' });
    this.rdoOncePerMonth = page.getByRole('radio', { name: '1 เดือน 1 ครั้ง', exact: true });
    this.rdoOncePerThreeMonths = page.getByRole('radio', { name: '3 เดือน 1 ครั้ง', exact: true });
    this.rdoOncePerSixMonths = page.getByRole('radio', { name: '6 เดือน 1 ครั้ง', exact: true });
    this.rdoOncePerYear = page.getByRole('radio', { name: '1 ปี 1 ครั้ง', exact: true });

    this.rdoNever = page.getByRole('radio', { name: 'ไม่เคยเลย', exact: true });
    this.rdoOnce = page.getByRole('radio', { name: '1 ครั้ง', exact: true });
    this.rdoMoreThanTwicePerMonth = page.getByRole('radio', { name: 'มากกว่า 2 ครั้ง ต่อเดือน' });
    this.rdoEveryMonth = page.getByRole('radio', { name: 'ทุกเดือน', exact: true });

    this.ratingHeart1 = page.getByRole('radio', { name: '1 Heart' });
    this.ratingHeart2 = page.getByRole('radio', { name: '2 Heart' });
    this.ratingHeart3 = page.getByRole('radio', { name: '3 Heart' });
    this.ratingHeart4 = page.getByRole('radio', { name: '4 Heart' });
    this.ratingHeart5 = page.getByRole('radio', { name: '5 Heart' });
  }

  async fill(data: Page1Data): Promise<void> {
    const sourceMap: Record<Page1Source, Locator> = {
      X: this.chkXUnionMall,
      Facebook: this.chkFacebookUnionMall,
      TikTok: this.chkTikTokUnionMall,
      Instagram: this.chkInstagramUnionMall,
      friend: this.chkFriend,
      tiktokInfluencer: this.chkTikTokInfluencer,
      xInfluencer: this.chkXInfluencer,
      facebookInfluencer: this.chkFacebookInfluencer,
      walkby: this.chkWalkby,
    };
    const visitMap: Record<Page1VisitFrequency, Locator> = {
      moreThanOnce: this.rdoMoreThanOncePerMonth,
      monthly: this.rdoOncePerMonth,
      quarterly: this.rdoOncePerThreeMonths,
      biannual: this.rdoOncePerSixMonths,
      yearly: this.rdoOncePerYear,
    };
    const sellMap: Record<Page1SellFrequency, Locator> = {
      never: this.rdoNever,
      once: this.rdoOnce,
      moreThanTwice: this.rdoMoreThanTwicePerMonth,
      everyMonth: this.rdoEveryMonth,
    };

    await this.checkElement(sourceMap[data.source]);
    await this.checkElement(visitMap[data.visitFrequency]);
    await this.checkElement(sellMap[data.sellFrequency]);
    await this.selectSatisfactionRating(data.satisfaction);
  }

  async selectSatisfactionRating(rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
    const hearts: Locator[] = [
      this.ratingHeart1,
      this.ratingHeart2,
      this.ratingHeart3,
      this.ratingHeart4,
      this.ratingHeart5,
    ];
    await this.clickElement(hearts[rating - 1]);
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      const allSources = [
        this.chkXUnionMall, this.chkFacebookUnionMall, this.chkTikTokUnionMall,
        this.chkInstagramUnionMall, this.chkFriend, this.chkTikTokInfluencer,
        this.chkXInfluencer, this.chkFacebookInfluencer, this.chkWalkby,
      ];
      const visitFrequencies = [
        this.rdoMoreThanOncePerMonth, this.rdoOncePerMonth,
        this.rdoOncePerThreeMonths, this.rdoOncePerSixMonths, this.rdoOncePerYear,
      ];
      const sellFrequencies = [this.rdoNever, this.rdoOnce, this.rdoMoreThanTwicePerMonth, this.rdoEveryMonth];
      const hearts = [this.ratingHeart1, this.ratingHeart2, this.ratingHeart3, this.ratingHeart4, this.ratingHeart5];

      return (
        await this.isAnyChecked(allSources) &&
        await this.isAnyChecked(visitFrequencies) &&
        await this.isAnyChecked(sellFrequencies) &&
        await this.isAnyChecked(hearts)
      );
    } catch {
      return false;
    }
  }
}
