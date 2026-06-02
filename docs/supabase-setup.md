# Supabase Setup

Run the migration SQL in `supabase/migrations/20260601000000_create_expenses_and_storage.sql` against your Supabase project.

You can do this in one of two ways:

## Option A — Supabase CLI (recommended)

```bash
supabase db push --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

## Option B — SQL Editor

1. Go to your Supabase project → **SQL Editor**
2. Paste the contents of the migration file
3. Click **Run**

---

## What the migration creates

### `expenses` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `user_id` | uuid | References `auth.users(id)`, cascade delete |
| `merchant` | text | Required |
| `amount` | numeric | Required |
| `currency` | text | Default `USD` |
| `expense_date` | date | Required |
| `expense_time` | time | Optional |
| `notes` | text | Optional |
| `receipt_image_path` | text | Path in `receipts` storage bucket |
| `source` | text | `manual` or `scan` |
| `ai_provider` | text | e.g. `gemini` |
| `ai_model` | text | e.g. `gemini-2.5-flash-lite` |
| `ai_confidence` | numeric | 0–1 |
| `raw_ai_result` | jsonb | Full AI response for debugging |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Auto-updated via trigger |

### Row-level security (RLS)

RLS is enabled. Each user can only read, insert, update, and delete their own rows (`auth.uid() = user_id`).

### `receipts` storage bucket

- Private bucket (not public)
- Files stored under `{user_id}/{timestamp}.{ext}`
- RLS policies restrict access to the file owner only

---

## Required environment variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Overview → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → Legacy → anon public |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `AI_PROVIDER` | Set to `gemini` |
| `GEMINI_MODEL` | Optional — defaults to `gemini-2.5-flash-lite` |
