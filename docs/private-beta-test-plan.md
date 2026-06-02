# Private Beta Test Plan

## Tester info (fill in per session)

| Field | Value |
|---|---|
| Tester name | |
| Device | e.g. iPhone 15, Samsung S24, MacBook |
| Browser | e.g. Safari, Chrome |
| Date tested | |
| Receipt language tested | Chinese / English / Both |

---

## Flows to test

### 1. Sign up / Sign in
- [ ] Sign up with a new email
- [ ] Receive confirmation email and click link
- [ ] Sign in with existing account
- [ ] Sign out and sign back in

### 2. Scan receipt — English
- [ ] Take a photo or upload a JPG/PNG/WebP receipt
- [ ] Wait for AI extraction
- [ ] Verify: merchant name looks correct
- [ ] Verify: date looks correct
- [ ] Verify: amount matches the receipt total
- [ ] Edit any incorrect fields
- [ ] Save the expense
- [ ] View the saved expense detail (check receipt image is visible)

### 3. Scan receipt — Chinese
- [ ] Upload a Chinese receipt (e.g. supermarket, restaurant)
- [ ] Verify: merchant name extracted correctly
- [ ] Verify: amount matches 合计/实收/应收
- [ ] Verify: currency detected as CNY

### 4. Manual expense entry
- [ ] Tap "Manual Entry"
- [ ] Fill in all required fields
- [ ] Upload a receipt photo (optional)
- [ ] Save and view in list

### 5. Edit expense
- [ ] Open an existing expense
- [ ] Tap Edit
- [ ] Change merchant name, amount, or date
- [ ] Save and confirm changes

### 6. Delete expense
- [ ] Open an expense
- [ ] Tap Delete and confirm
- [ ] Confirm it no longer appears in the list

### 7. Expense list filters
- [ ] Filter by "This month"
- [ ] Search by merchant name
- [ ] Filter by source: Scan
- [ ] Filter by: Has receipt
- [ ] Clear all filters

### 8. CSV export
- [ ] Tap "Export CSV" on the expense list
- [ ] Open the downloaded file in Excel or Google Sheets
- [ ] Confirm columns: date, time, merchant, amount, currency, notes, source

### 9. Mobile experience
- [ ] Test on a real phone (not just desktop)
- [ ] Verify scan flow works with camera
- [ ] Verify bottom navigation is usable

---

## Feedback questions

Please answer after testing:

1. Was it easier than your current method (Excel, photo album, notes app)?
2. Which part felt confusing or slow?
3. Did the AI detect merchant / date / amount correctly for your receipts?
4. Did you see any errors or crashes? What were you doing?
5. Was the Chinese receipt extraction accurate?
6. Would you use this app regularly if it were ready?
7. What one feature would make this more useful for you?

---

## Reporting issues

- Use the **Feedback** link in the app (email)
- Or email hwwebsolutions@gmail.com directly
- Or open a GitHub issue if you have a GitHub account
