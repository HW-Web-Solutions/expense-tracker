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

export type ExpenseInsert = Omit<Expense, 'id' | 'created_at' | 'updated_at'>
export type ExpenseUpdate = Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

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

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: Expense
        Insert: ExpenseInsert & { id?: string; created_at?: string; updated_at?: string }
        Update: ExpenseUpdate
      }
    }
  }
}
