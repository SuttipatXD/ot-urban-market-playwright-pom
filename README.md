# O.T. URBAN MARKET — Playwright POM E2E Tests

## Project Structure

```
form-fill/
├── tests/
│   ├── constants/
│   │   └── FormConstants.ts           # Shared constants (timeouts, selectors)
│   ├── data/
│   │   └── TestDataFactory.ts         # Factory methods for test data
│   ├── pages/
│   │   ├── BasePage.ts                # Base class (goto, clickNext, clickSubmit)
│   │   ├── OTUrbanMarketFormPage.ts   # Orchestrator — composes page objects
│   │   ├── OTUrbanMarketPage1.ts      # Page 1: source / freq / rating
│   │   ├── OTUrbanMarketPage2.ts      # Page 2: consents / preferred day
│   │   ├── OTUrbanMarketPage3.ts      # Page 3: personal info
│   │   └── OTUrbanMarketPage4.ts      # Page 4: product types
│   └── specs/
│       └── otUrbanMarketForm.spec.ts  # 7 test cases (TC01–TC07)
├── playwright.config.ts               # 3 projects: chromium / firefox / mobile-chrome
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Form Flow (4 Pages)

| Page | Questions | Details |
|------|-----------|---------|
| 1 | Q1–Q4 | Source of info (checkbox) / Visit freq / Sell freq / Satisfaction ♥ |
| 2 | Q5–Q9 | Accept terms / PDPA / Pole area / Penalty / Preferred day |
| 3 | Q10–Q16 | Title / Full name / National ID / Phone / Postal code / Occupation / Age |
| 4 | Q17 | Product types (max 2) → Submit |

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test                # All tests (headless)
npm run test:headed     # With visible browser
npm run test:ui         # Playwright UI mode (debug)
npm run test:chromium   # Chromium only
npm run test:firefox    # Firefox only
npm run test:mobile     # Mobile Chrome (Pixel 5)
npm run test:tc01       # Run TC01 only
npm run test:report     # Open HTML report
npm run codegen         # Record new tests
```

## Test Cases

| ID | Name | Description |
|----|------|-------------|
| TC01 | Happy path | กรอกครบทุกหน้าและ Submit สำเร็จ |
| TC02 | Validation | กด Next หน้า 1 โดยไม่กรอก → แสดง error |
| TC03 | Tuesday | เลือกวันอังคาร |
| TC04 | Product types | เลือกของแต่งบ้าน + เสื้อผ้ามือสอง |
| TC05 | Rating | ทดสอบ rating 1–5 ทุกค่า |
| TC06 | Data-driven | ทดสอบทุก source (9 กรณี) |
| TC07 | PDPA reject | ไม่ยินยอม PDPA |

## Notes

- **Q12 National ID**: Replace `'2523058445221'` ด้วย Thai ID จริงในการทดสอบ
- **Q17**: Max 2 selections — enforced by `.slice(0, 2)` ใน POM
- **Q6–Q8**: ใช้ `.nth()` แยก radio buttons ที่มี label เหมือนกัน
- Rating hearts ใช้ `role="radio"` กับ `name="N Heart"` ใน Microsoft Forms
