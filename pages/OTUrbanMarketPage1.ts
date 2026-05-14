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

    this.chkXUnionMall = page.getByLabel('X Union Mall');
    this.chkFacebookUnionMall = page.getByLabel('Facebook Union Mall');
    this.chkTikTokUnionMall = page.getByLabel('TikTok Union Mall');
    this.chkInstagramUnionMall = page.getByLabel('Instagram Union Mall');
    this.chkFriend = page.getByLabel('เพื่อน / คนรู้จัก');
    this.chkTikTokInfluencer = page.getByLabel('TikTok influencer');
    this.chkXInfluencer = page.getByLabel('X influencer');
    this.chkFacebookInfluencer = page.getByLabel('Facebook influencer');
    this.chkWalkby = page.getByLabel('ผ่านมาเจอ');

    this.rdoMoreThanOncePerMonth = page.getByLabel('มากกว่า 1 ครั้งต่อเดือน');
    this.rdoOncePerMonth = page.getByLabel('1 เดือน 1 ครั้ง');
    this.rdoOncePerThreeMonths = page.getByLabel('3 เดือน 1 ครั้ง');
    this.rdoOncePerSixMonths = page.getByLabel('6 เดือน 1 ครั้ง');
    this.rdoOncePerYear = page.getByLabel('1 ปี 1 ครั้ง');

    this.rdoNever = page.getByLabel('ไม่เคยเลย');
    this.rdoOnce = page.getByLabel('1 ครั้ง');
    this.rdoMoreThanTwicePerMonth = page.getByLabel('มากกว่า 2 ครั้ง ต่อเดือน');
    this.rdoEveryMonth = page.getByLabel('ทุกเดือน');

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

    await sourceMap[data.source].check();
    await visitMap[data.visitFrequency].check();
    await sellMap[data.sellFrequency].check();
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
    await hearts[rating - 1].click();
  }

  async validateRequiredFields(): Promise<boolean> {
    try {
      // Check if at least one source is selected
      const sources = [
        this.chkXUnionMall,
        this.chkFacebookUnionMall,
        this.chkTikTokUnionMall,
        this.chkInstagramUnionMall,
        this.chkFriend,
        this.chkTikTokInfluencer,
        this.chkXInfluencer,
        this.chkFacebookInfluencer,
        this.chkWalkby,
      ];

      const sourceSelected = await Promise.all(
        sources.map(async (source) => await source.isChecked())
      );

      const hasSourceSelected = sourceSelected.some(Boolean);

      // Check if visit frequency is selected
      const visitFrequencies = [
        this.rdoMoreThanOncePerMonth,
        this.rdoOncePerMonth,
        this.rdoOncePerThreeMonths,
        this.rdoOncePerSixMonths,
        this.rdoOncePerYear,
      ];

      const visitSelected = await Promise.all(
        visitFrequencies.map(async (freq) => await freq.isChecked())
      );

      const hasVisitSelected = visitSelected.some(Boolean);

      // Check if sell frequency is selected
      const sellFrequencies = [
        this.rdoNever,
        this.rdoOnce,
        this.rdoMoreThanTwicePerMonth,
        this.rdoEveryMonth,
      ];

      const sellSelected = await Promise.all(
        sellFrequencies.map(async (freq) => await freq.isChecked())
      );

      const hasSellSelected = sellSelected.some(Boolean);

      // Check if satisfaction rating is selected
      const ratings = [
        this.ratingHeart1,
        this.ratingHeart2,
        this.ratingHeart3,
        this.ratingHeart4,
        this.ratingHeart5,
      ];

      const ratingSelected = await Promise.all(
        ratings.map(async (rating) => await rating.isChecked())
      );

      const hasRatingSelected = ratingSelected.some(Boolean);

      return hasSourceSelected && hasVisitSelected && hasSellSelected && hasRatingSelected;
    } catch (error) {
      console.error('Error validating Page 1 fields:', error);
      return false;
    }
  }
}
