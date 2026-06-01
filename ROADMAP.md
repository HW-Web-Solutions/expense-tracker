# Roadmap

This roadmap keeps the product intentionally simple.

The product direction is:

> A simple Excel-style expense list where each row can have a receipt attached.

## Phase 0: Product and technical planning

Status: In progress

Goals:

- Define the product positioning.
- Define the MVP feature scope.
- Choose the technical architecture.
- Decide where receipts, expenses, and AI data will be stored.
- Avoid feature creep before development starts.

Deliverables:

- README.md
- ROADMAP.md
- Future technical setup docs

## Phase 1: Project setup

Goal: Create the initial full-stack web app foundation.

Tasks:

- Initialize a Next.js app with TypeScript.
- Add basic app layout.
- Add mobile-first responsive styling.
- Configure environment variables.
- Add Supabase client setup.
- Add basic routing:
  - `/`
  - `/expenses`
  - `/expenses/new`
  - `/expenses/[id]`
  - `/scan`
- Add README setup instructions.

Definition of done:

- App runs locally.
- App deploys successfully to Vercel.
- Basic pages can be opened on desktop and mobile browser.

## Phase 2: Authentication

Goal: Let each user safely store their own expenses and receipts.

Tasks:

- Add Supabase Auth.
- Add sign in/sign out flow.
- Protect expense pages.
- Add user session handling.
- Add basic profile/user context.

Definition of done:

- User can sign in.
- User can sign out.
- Expense pages require login.
- User data is scoped to the signed-in user.

## Phase 3: Database and storage

Goal: Store expenses and receipt image files safely.

Tasks:

- Create Supabase `expenses` table.
- Create Supabase Storage bucket: `receipts`.
- Add row-level security policies.
- Add storage access rules.
- Add database types for the app.

Suggested `expenses` table fields:

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
ai_provider         text nullable -- gemini, openai, mock, etc.
ai_model            text nullable
ai_confidence       numeric nullable
raw_ai_result       jsonb nullable
created_at          timestamptz
updated_at          timestamptz
```

Definition of done:

- App can create a manual expense.
- App can read expenses for the current user only.
- Receipt image files can be uploaded privately.

## Phase 4: Manual expense entry

Goal: Let users add spending even when there is no receipt.

Tasks:

- Build manual expense form.
- Required fields:
  - merchant
  - amount
  - currency
  - date
- Optional fields:
  - time
  - notes
  - receipt image
- Save manual expense to database.
- Show saved manual expenses in the list.

Definition of done:

- User can add a manual expense in under 30 seconds.
- Expense appears in the main list immediately after saving.

## Phase 5: Expense list

Goal: Build the Excel-style expense list.

Tasks:

- Create `/expenses` page.
- Show expense rows with:
  - date
  - merchant
  - amount
  - currency
  - receipt indicator
  - notes preview
- Add simple sort by date.
- Add search by merchant and notes.
- Add month filter.
- Add empty state.

Definition of done:

- User can see all expenses in a simple table/list.
- User can search and filter expenses.
- Page feels good on mobile and desktop.

## Phase 6: Receipt upload

Goal: Let users attach receipt images to expenses.

Tasks:

- Add image upload input.
- Support camera capture from mobile browser.
- Upload image to Supabase Storage.
- Store receipt image path in `expenses` table.
- Add receipt preview.
- Add image compression if needed.

Definition of done:

- User can upload or take a receipt photo.
- Receipt image is saved to Supabase Storage.
- User can open the expense detail and view the receipt.

## Phase 7: AI receipt extraction

Goal: Use Google Gemini to fill the expense form from a receipt image.

Tasks:

- Create server-side receipt extraction endpoint.
- Add a provider-based receipt extraction interface.
- Use Google Gemini as the default AI provider.
- Start with `gemini-2.5-flash-lite` for MVP testing.
- Keep `gemini-2.5-flash` as a quality upgrade option.
- Keep OpenAI as an optional fallback provider for comparison testing.
- Ask the model for structured JSON output.
- Extract:
  - merchant
  - expense date
  - expense time
  - amount
  - currency
  - confidence
  - notes
- Support English and Chinese receipts.
- Show extracted result in review form.
- Require user confirmation before saving.
- Store `ai_provider`, `ai_model`, and `raw_ai_result` for debugging and improvement.

Definition of done:

- User can scan/upload a receipt.
- Gemini fills the form with extracted fields.
- User can edit the result.
- User can save the confirmed expense.
- The code can support a different AI provider later without changing the UI flow.

## Phase 8: Expense detail page

Goal: Let users view and edit one expense with its receipt.

Tasks:

- Create `/expenses/[id]` page.
- Show all expense fields.
- Show receipt image.
- Add edit mode.
- Add delete expense.
- Optional: delete attached receipt file when expense is deleted.

Definition of done:

- User can open a row and see the matching receipt.
- User can edit or delete the expense.

## Phase 9: CSV export

Goal: Let users keep ownership of their data.

Tasks:

- Add CSV export button.
- Export current filtered result or all expenses.
- Include:
  - date
  - time
  - merchant
  - amount
  - currency
  - notes
  - source
  - receipt image path/link

Definition of done:

- User can download expenses as CSV.
- CSV opens cleanly in Excel or Google Sheets.

## Phase 10: MVP polish and testing

Goal: Make the app feel simple and reliable.

Tasks:

- Test English receipts.
- Test Simplified Chinese receipts.
- Test mixed-language receipts.
- Test no-receipt manual entry.
- Test mobile camera upload.
- Test desktop upload.
- Test Gemini Flash-Lite extraction quality.
- Compare Gemini Flash if Flash-Lite is not accurate enough.
- Add loading states.
- Add error states.
- Add basic privacy copy.
- Improve AI prompt based on failed receipt examples.

Definition of done:

- A non-technical user can complete the main flow without help.
- Scan-to-saved-expense flow feels clear.
- Manual expense flow feels faster than opening a spreadsheet.
- The app has a clear AI provider strategy for MVP testing.

## Future ideas after MVP

Only consider these after the simple product is working:

- Native mobile app with Expo/React Native.
- PWA install prompt.
- Excel `.xlsx` export.
- Google Sheets sync.
- Tags/categories.
- Simple monthly totals.
- Multi-currency summaries.
- Offline-first mode.
- Shared household expenses.
- Batch receipt upload.
- Better duplicate detection.
- OpenAI fallback benchmarking.
- AWS provider research.

## Features to avoid for now

Avoid adding these before MVP validation:

- Bank syncing.
- Credit card syncing.
- Income tracking.
- Budget planning.
- Reimbursement approval.
- Team management.
- Tax filing.
- Complex charts.
- Heavy dashboards.
- Subscription management.
- Invoice verification.

The product should stay simple: scan, save, list, view receipt, export.
