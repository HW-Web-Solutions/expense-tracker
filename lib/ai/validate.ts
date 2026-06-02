import type { ExtractedReceipt } from './types'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/
const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'CNY', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD', 'TWD', 'KRW', 'MXN', 'BRL', 'INR', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD']

export function validateExtractedReceipt(raw: unknown): ExtractedReceipt {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI returned empty or non-object result')
  }

  const r = raw as Record<string, unknown>
  const issues: string[] = []

  // merchant
  const merchant = typeof r.merchant === 'string' && r.merchant.trim()
    ? r.merchant.trim()
    : (() => { issues.push('merchant missing'); return 'Unknown' })()

  // expense_date — null means not visible on receipt; user must fill it in
  let expense_date: string | null = null
  if (typeof r.expense_date === 'string' && DATE_RE.test(r.expense_date)) {
    expense_date = r.expense_date
  } else {
    issues.push('date missing or invalid')
  }

  // expense_time
  let expense_time: string | null = null
  if (typeof r.expense_time === 'string' && TIME_RE.test(r.expense_time)) {
    expense_time = r.expense_time
  }

  // amount
  let amount = 0
  const rawAmount = typeof r.amount === 'string' ? parseFloat(r.amount) : r.amount
  if (typeof rawAmount === 'number' && isFinite(rawAmount) && rawAmount >= 0) {
    amount = rawAmount
  } else {
    issues.push('amount missing or invalid')
  }

  // currency
  const rawCurrency = typeof r.currency === 'string' ? r.currency.toUpperCase().trim() : ''
  const currency = SUPPORTED_CURRENCIES.includes(rawCurrency) ? rawCurrency : (() => {
    issues.push(`unknown currency: ${rawCurrency || 'empty'}`)
    return 'USD'
  })()

  // confidence
  const confidence = typeof r.confidence === 'number' && r.confidence >= 0 && r.confidence <= 1
    ? r.confidence
    : 0.5

  // notes
  const notes = typeof r.notes === 'string' && r.notes.trim() ? r.notes.trim() : null

  const needs_review = Boolean(r.needs_review) || issues.length > 0

  return { merchant, expense_date, expense_time, amount, currency, confidence, needs_review, notes }
}
