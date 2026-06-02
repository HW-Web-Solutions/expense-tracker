# Data Deletion — Beta Tester Guide

## What data the app stores

| Data | Location |
|---|---|
| Expense records | Supabase Postgres (`expenses` table) |
| Receipt images | Supabase Storage (`receipts` bucket) |
| Account email | Supabase Auth |

Receipt images are private — only accessible to the account that uploaded them.

## Deleting individual expenses

1. Open any expense from the expense list.
2. Tap **Delete** at the bottom of the detail page.
3. Confirm deletion. This removes both the expense record and the attached receipt image from storage.

## Requesting full account data deletion

Email **hwwebsolutions@gmail.com** with:

- Subject: `Data Deletion Request`
- Your registered email address

We will delete:
- All expenses linked to your account
- All receipt images in storage under your user ID
- Your Supabase Auth account

Requests are completed within **7 days**.

## Questions

For other questions or feedback, email hwwebsolutions@gmail.com or use the **Feedback** link in the app.
