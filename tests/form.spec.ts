import { test, expect } from '@playwright/test';
import { OTUrbanMarketFormPage } from '../pages/FormPage';
import { TestDataFactory } from '../data/TestDataFactory';
import { FORM_CONSTANTS } from '../constants/FormConstants';

const testData = {
  page1: TestDataFactory.createValidPage1Data(),
  page2: TestDataFactory.createValidPage2Data(),
  page3: TestDataFactory.createValidPage3Data(),
  page4: TestDataFactory.createValidProductTypes(),
};

async function fillPagesThroughPage3(form: OTUrbanMarketFormPage): Promise<void> {
  await form.page1.fill(testData.page1);
  await form.clickNext();
  await form.page2.fill(testData.page2);
  await form.clickNext();
  await form.page3.fill(testData.page3);
  await form.clickNext();
}

const sources = TestDataFactory.createAllSources();

test.describe('O.T. URBAN MARKET — Registration Form E2E (POM)', () => {
  let form: OTUrbanMarketFormPage;

  test.beforeEach(async ({ page }) => {
    form = new OTUrbanMarketFormPage(page);
    await form.goto();
  });

  test.describe('Happy Path Scenarios', () => {
    test('TC01 - Happy path: กรอกครบทุกข้อแล้ว Submit สำเร็จ', async () => {
      await form.fillAllPages(testData);
      await form.clickSubmit();
      await expect(form.page.getByText('ขอขอบคุณ')).toBeVisible({
        timeout: FORM_CONSTANTS.TIMEOUTS.SUBMIT_SUCCESS,
      });
    });
  });

  test.describe('Validation Scenarios', () => {
    test('TC02 - กด Next โดยไม่กรอกหน้า 1 ควรแสดง error', async () => {
      await form.clickNext();
      const error = form.page.locator('[aria-invalid="true"], [role="alert"]').first();
      await expect(error).toBeVisible({ timeout: FORM_CONSTANTS.TIMEOUTS.ELEMENT_WAIT });
    });
  });

  test.describe('Page 2 - Consent Scenarios', () => {
    test('TC03 - เลือกวันอังคารเป็นวันขาย', async () => {
      await form.page1.fill(TestDataFactory.createValidPage1Data({ source: 'Facebook' }));
      await form.clickNext();
      await form.page2.fill({ ...testData.page2, preferredDay: 'tuesday' });
      await expect(form.page2.rdoTuesday).toBeChecked();
    });

    test('TC07 - ไม่ยินยอม PDPA', async () => {
      await form.page1.fill(testData.page1);
      await form.clickNext();
      await form.page2.fill({ ...testData.page2, pdpaConsent: false });
      await expect(form.page2.rdoPdpaNotConsent).toBeChecked();
      await expect(form.page2.rdoPdpaConsent).not.toBeChecked();
    });
  });

  test.describe('Page 4 - Product Selection', () => {
    test('TC04 - เลือกของแต่งบ้าน + เสื้อผ้ามือสอง (max 2)', async () => {
      await fillPagesThroughPage3(form);
      await form.page4.fill(['usedDecor', 'usedClothes']);
      await expect(form.page4.chkUsedDecor).toBeChecked();
      await expect(form.page4.chkUsedClothes).toBeChecked();
      await expect(form.page4.chkUsedToys).not.toBeChecked();
    });
  });

  test.describe('Page 1 - Rating Scenarios', () => {
    test('TC05 - เลือก satisfaction rating ครบทุกค่า (1-5)', async () => {
      const heartLocators = [
        form.page1.ratingHeart1,
        form.page1.ratingHeart2,
        form.page1.ratingHeart3,
        form.page1.ratingHeart4,
        form.page1.ratingHeart5,
      ];

      for (let i = 1; i <= 5; i++) {
        await form.goto();
        await form.page1.selectSatisfactionRating(i as 1 | 2 | 3 | 4 | 5);
        await expect(heartLocators[i - 1]).toBeChecked();
      }
    });
  });

  test.describe('Data-Driven Tests', () => {
    for (const src of sources) {
      test(`TC06-DataDriven - รู้จักตลาดจาก: ${src}`, async () => {
        const sourceMap = {
          X: form.page1.chkXUnionMall,
          Facebook: form.page1.chkFacebookUnionMall,
          TikTok: form.page1.chkTikTokUnionMall,
          Instagram: form.page1.chkInstagramUnionMall,
          friend: form.page1.chkFriend,
          tiktokInfluencer: form.page1.chkTikTokInfluencer,
          xInfluencer: form.page1.chkXInfluencer,
          facebookInfluencer: form.page1.chkFacebookInfluencer,
          walkby: form.page1.chkWalkby,
        } as const;

        await form.page1.fill(TestDataFactory.createValidPage1Data({ source: src }));
        await expect(sourceMap[src]).toBeChecked();
      });
    }
  });
});