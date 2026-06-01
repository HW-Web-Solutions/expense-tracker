# Expense Tracker

A simple expense sheet with receipts attached.

像 Excel 一样简单，但每一笔支出都可以绑定一张小票。

## Product idea

Many people already use Excel or Google Sheets to track spending. The pain point is not the spreadsheet itself. The pain point is that receipts are hard to store, search, and match back to each expense row.

This product keeps the spreadsheet-like habit, but adds receipt storage and AI-powered receipt extraction.

## MVP goal

Build a simple web-first app where a user can:

1. Scan or upload a receipt.
2. Let AI detect the merchant, date/time, amount, and currency.
3. Review and edit the extracted result.
4. Save it as one expense row.
5. View all expenses in a simple Excel-style list.
6. Open a record and see the original receipt image.
7. Add an expense manually when there is no receipt.
8. Export expenses to CSV.

## What this app is

- A lightweight expense list.
- A receipt-backed spreadsheet.
- A simple tool for tracking spending only.
- A mobile-friendly web app first.
- A future mobile app after the MVP is validated.

## What this app is not

For the first version, this app will not include:

- Income tracking.
- Budget planning.
- Bank account syncing.
- Credit card syncing.
- Reimbursement workflows.
- Approval flows.
- Tax filing features.
- Team/company expense management.
- Complex accounting reports.
- Heavy dashboards.

The first version should stay simple enough that a new user understands it immediately.

## First testable version

The first version should be testable on a phone browser and desktop browser.

Main test flow:

1. Open the web app.
2. Sign in.
3. Tap **Scan Receipt**.
4. Take a photo or upload a receipt image.
5. AI extracts:
   - Merchant
   - Expense date
   - Expense time
   - Amount
   - Currency
6. User reviews and edits the fields.
7. User saves the expense.
8. User sees the new row in the expense list.
9. User opens the row and sees the attached receipt image.
10. User adds a manual expense without a receipt.
11. User exports expenses as CSV.

## Core user experience

The app should feel closer to a spreadsheet than a finance platform.

Primary screen:

| Date | Merchant | Amount | Currency | Receipt | Notes |
|---|---|---:|---|---|---|
| 2026-06-01 | Costco | 86.24 | CAD | View | Groceries |
| 2026-06-02 | 蜜雪冰城 | 18.00 | CNY | View | Drink |

Main actions:

- **Scan Receipt**
- **Manual Entry**
- **Export CSV**

## Technical architecture

Recommended MVP stack:

- **Frontend / Web App**: Next.js with TypeScript
- **Mobile-first experience**: responsive PWA-style web app
- **Backend**: Next.js Route Handlers / Server Actions
- **Auth**: Supabase Auth
- **Database**: Supabase Postgres
- **Receipt image storage**: Supabase Storage
- **AI receipt extraction**: OpenAI Vision-capable model using the Responses API with structured JSON output
- **Deployment**: Vercel

This gives us one full-stack web codebase first. A native mobile app can come later through Expo/React Native or a PWA wrapper if the MVP proves useful.

## Data storage plan

### Receipt images

Receipt images will be uploaded to **Supabase Storage**.

Suggested bucket:

```text
receipts
```

Suggested path pattern:

```text
receipts/{user_id}/{expense_id}/{original_filename}
```

The app should store the receipt image URL/path in the database. The image itself should not be stored directly in the database.

### Expense records

Expense data will be stored in **Supabase Postgres**.

Suggested table:

```text
expenses
```

Suggested fields:

```text
id                  uuid primary key
user_id             uuid references auth.users(id)
merchant            text
amount              numeric
currency            text
expense_date        date
expense_time        time nullable
notes               text nullable
receipt_image_path  text nullable
source              text -- scan or manual
ai_confidence       numeric nullable
raw_ai_result       jsonb nullable
created_at          timestamptz
updated_at          timestamptz
```

## AI receipt extraction

The app will send the uploaded receipt image to an AI model and ask for structured JSON.

Expected output shape:

```json
{
  "merchant": "Costco",
  "expense_date": "2026-06-01",
  "expense_time": "15:42",
  "amount": 86.24,
  "currency": "CAD",
  "confidence": 0.91,
  "needs_review": false,
  "notes": "Total amount detected from receipt total."
}
```

Important rule: AI output should always be reviewed by the user before saving. The user should be able to edit every extracted field.

## Bilingual receipt support

The MVP should support English and Chinese receipts.

The AI extraction prompt should explicitly support:

- English receipts
- Simplified Chinese receipts
- Traditional Chinese receipts when possible
- Mixed-language receipts
- Currency symbols such as `$`, `CAD`, `USD`, `¥`, `RMB`, `CNY`

The extraction logic should be careful with Chinese receipt labels such as:

- 合计
- 总计
- 实收
- 应收
- 支付金额
- 微信支付
- 支付宝支付
- 优惠
- 找零

The final amount should usually be the amount actually paid, not subtotal, discount, change, or loyalty points.

## Privacy notes

Receipts may contain sensitive personal information. The MVP should follow these basic rules:

- Require login before storing receipts.
- Keep receipt files private by default.
- Use row-level security in Supabase.
- Do not expose receipt URLs publicly unless using signed URLs.
- Store API keys only on the server.
- Never send OpenAI API keys to the browser.

## Possible product names

Working names only:

- Receipt Sheet
- Expense Sheet
- 小票支出表
- 拍票支出表
- Receipt-backed Expense Tracker

## Current status

Planning stage.

No application code has been added yet.
