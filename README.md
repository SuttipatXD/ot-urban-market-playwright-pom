# O.T. URBAN MARKET — Playwright POM E2E Tests

โปรเจกต์ทดสอบ E2E อัตโนมัติสำหรับแบบฟอร์มลงทะเบียน O.T. URBAN MARKET (Microsoft Forms) ด้วย Playwright + TypeScript ตาม Pattern **Page Object Model (POM)**

---

## Project Structure

```
ot-urban-market-playwright-pom/
├── constants/
│   └── FormConstants.ts   # URL, timeouts, validation limits, max selections
├── data/
│   └── TestDataFactory.ts # Factory methods สร้าง test data แต่ละหน้า
├── pages/
│   ├── BasePage.ts        # Abstract base — helper methods (click, fill, wait, isAnyChecked)
│   ├── FormPage.ts        # Orchestrator — compose Page1–4, clickNext, Submit
│   ├── Page1.ts           # Page 1: แหล่งที่รู้จัก / ความถี่เข้า-ขาย / rating
│   ├── Page2.ts           # Page 2: เงื่อนไข / PDPA / วันขาย
│   ├── Page3.ts           # Page 3: ข้อมูลส่วนตัว (ชื่อ, บัตรปชช., โทร ฯลฯ)
│   └── Page4.ts           # Page 4: ประเภทสินค้า (เลือกได้สูงสุด 2)
├── tests/
│   └── form.spec.ts       # Test cases TC01–TC07 + Data-Driven TC06
├── playwright.config.ts   # Config: chromium
├── package.json
├── tsconfig.json
└── README.md
```

---

## Form Flow (4 Pages)

| Page | คำถาม | รายละเอียด |
|------|--------|-----------|
| 1 | Q1–Q4 | แหล่งที่รู้จักตลาด (checkbox) / ความถี่เข้าชม / ความถี่ขาย / ความพึงพอใจ ♥ |
| 2 | Q5–Q9 | ยอมรับเงื่อนไข / PDPA / พื้นที่แผง / บทลงโทษ / วันที่ต้องการขาย |
| 3 | Q10–Q16 | คำนำหน้า / ชื่อ-นามสกุล / เลขบัตร ปชช. / โทรศัพท์ / รหัสไปรษณีย์ / อาชีพ / อายุ |
| 4 | Q17 | ประเภทสินค้า (เลือกได้สูงสุด 2 อย่าง) → Submit |

---

## Setup

```bash
npm install
npx playwright install
```

---

## Run Tests

```bash
npm test                # รันทุก test (headless)
npm run test:headed     # เปิด browser ให้เห็น
npm run test:ui         # Playwright UI mode (debug/step-through)
npm run test:chromium   # Chromium เท่านั้น
npm run test:firefox    # Firefox เท่านั้น
npm run test:mobile     # Mobile Chrome (Pixel 5)
npm run test:tc01       # รัน TC01 อย่างเดียว
npm run test:report     # เปิด HTML report
npm run codegen         # บันทึก test ใหม่จาก browser
```

---

## Test Cases

| ID | ชื่อ | รายละเอียด |
|----|------|-----------|
| TC01 | Happy path | กรอกครบทุกหน้าแล้ว Submit สำเร็จ (ตรวจ "ขอขอบคุณ") |
| TC02 | Validation | กด Next หน้า 1 โดยไม่กรอก → ต้องแสดง error |
| TC03 | วันอังคาร | เลือก preferredDay = tuesday และตรวจ radio checked |
| TC04 | Product types | เลือกของแต่งบ้าน + เสื้อผ้ามือสอง (max 2) |
| TC05 | Rating 1–5 | ทดสอบเลือก heart rating ทุกค่า (loop goto) |
| TC06 | Data-Driven | ทดสอบทุก source (9 กรณี — X, Facebook, TikTok …) |
| TC07 | PDPA reject | เลือก "ไม่ยินยอม" PDPA และตรวจ state ของ radio |

---

## Architecture Notes

### Page Object Model

```
FormPage (Orchestrator)
├── Page1Section  → fill(), selectSatisfactionRating(), validateRequiredFields()
├── Page2Section  → fill(), validateRequiredFields()
├── Page3Section  → fill(), selectTitle(), selectOccupation(), validateRequiredFields()
└── Page4Section  → fill(), validateRequiredFields()
```

- **BasePage** จัดการ `waitFor`, `clickElement`, `fillElement`, `selectOption`, `isAnyChecked` รวมศูนย์
- **TestDataFactory** สร้าง test data ผ่าน static factory methods พร้อม `overrides` pattern
- **FormConstants** เก็บ URL, timeout, และ business rule (เช่น `MAX_PRODUCT_TYPES = 2`) ไว้ที่เดียว

### Key Implementation Details

- **Q6–Q8 (Page 2)** — ใช้ `.nth(0/1/2)` แยก radio buttons ที่มี label "ยินยอม" / "ไม่ยินยอม" ซ้ำกัน
- **Q17 (Page 4)** — `.slice(0, MAX_PRODUCT_TYPES)` บังคับ business rule ฝั่ง POM
- **Rating hearts** — ใช้ `role="radio"` + `name="N Heart"` ตาม Microsoft Forms DOM
- **National ID (Q12)** — ค่าใน `TestDataFactory` เป็น placeholder ต้องใช้ Thai ID จริงในการทดสอบจริง

---

## Browser Projects

| Project | Config |
|---------|--------|
| chromium | Desktop Chrome |

- `retries: 0` — ไม่ retry อัตโนมัติ
- `fullyParallel: false` — รัน sequential (form มี shared state)
- `locale: 'th-TH'` — ภาษาไทย
- Artifact (screenshot / video / trace) บันทึกเฉพาะเมื่อ test fail
