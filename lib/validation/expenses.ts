const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

export const SUPPORTED_CURRENCIES = [
  'USD', 'CAD', 'CNY', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD',
  'TWD', 'KRW', 'MXN', 'BRL', 'INR', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD',
]

export interface ExpenseInput {
  merchant: string
  amount: number
  currency: string
  expense_date: string
  expense_time?: string | null
  notes?: string | null
  source?: string
}

export function validateExpenseInput(input: Partial<ExpenseInput>): string[] {
  const errors: string[] = []

  const merchant = input.merchant?.trim() ?? ''
  if (!merchant) errors.push('Merchant is required.')
  else if (merchant.length > 200) errors.push('Merchant name is too long (max 200 characters).')

  if (input.amount === undefined || input.amount === null || isNaN(input.amount)) {
    errors.push('Amount is required.')
  } else if (input.amount <= 0) {
    errors.push('Amount must be greater than zero.')
  }

  if (!input.currency) {
    errors.push('Currency is required.')
  } else if (!SUPPORTED_CURRENCIES.includes(input.currency.toUpperCase())) {
    errors.push(`Unsupported currency: ${input.currency}.`)
  }

  if (!input.expense_date) {
    errors.push('Date is required.')
  } else if (!DATE_RE.test(input.expense_date)) {
    errors.push('Date must be in YYYY-MM-DD format.')
  }

  if (input.expense_time && input.expense_time !== '') {
    if (!TIME_RE.test(input.expense_time)) {
      errors.push('Time must be in HH:MM format.')
    }
  }

  if (input.source && !['manual', 'scan'].includes(input.source)) {
    errors.push('Invalid source.')
  }

  if (input.notes && input.notes.length > 1000) {
    errors.push('Notes are too long (max 1000 characters).')
  }

  return errors
}
