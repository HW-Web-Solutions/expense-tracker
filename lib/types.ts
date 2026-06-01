export type Expense = {
  id: string
  user_id: string
  merchant: string
  amount: number
  currency: string
  expense_date: string
  expense_time: string | null
  notes: string | null
  receipt_image_path: string | null
  source: 'scan' | 'manual'
  ai_provider: string | null
  ai_model: string | null
  ai_confidence: number | null
  raw_ai_result: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type ExtractedReceipt = {
  merchant: string
  expense_date: string
  expense_time: string | null
  amount: number
  currency: string
  confidence: number
  needs_review: boolean
  notes: string | null
}
