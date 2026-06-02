# Deployment Checklist

Run through this list before sharing the app with testers.

## Environment Variables

Set these in your Netlify / hosting dashboard:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Project Overview → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Project Settings → API → Legacy → anon public |
| `GEMINI_API_KEY` | Yes | https://aistudio.google.com/apikey — server-only, never prefix with `NEXT_PUBLIC_` |
| `AI_PROVIDER` | Yes | Set to `gemini` |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash-lite` |
| `SCAN_DAILY_LIMIT` | No | Max saved scans per user per day. Defaults to `20` |

## Supabase

- [ ] Migration SQL has been run (`supabase/migrations/20260601000000_create_expenses_and_storage.sql`)
- [ ] `expenses` table exists with all columns
- [ ] RLS is enabled on `expenses` table
- [ ] `receipts` storage bucket exists and is private
- [ ] Storage RLS policies are applied (owner-only read/write)
- [ ] Auth redirect URLs include your deployed URL:
  - Supabase → Authentication → URL Configuration
  - Add `https://your-app.netlify.app` to **Site URL** and **Redirect URLs**

## Gemini API

- [ ] `GEMINI_API_KEY` is set (server-side only)
- [ ] Key has Gemini API access enabled in Google AI Studio
- [ ] Key is **not** exposed in client bundles (verify: `NEXT_PUBLIC_` prefix is not used)

## Build

- [ ] `npm run build` succeeds locally with the same env vars
- [ ] Netlify build log shows no errors
- [ ] App loads at the deployed URL
- [ ] Sign in works (Supabase Auth redirect returns correctly)
- [ ] Scan receipt flow works end-to-end
- [ ] Manual entry works

## Before Sharing

- [ ] Privacy page (`/privacy`) is accessible
- [ ] Feedback email link works
- [ ] You have tested on mobile (iOS Safari + Android Chrome)
- [ ] You have tested with a Chinese receipt and an English receipt
