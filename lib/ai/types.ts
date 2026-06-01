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

export interface ReceiptExtractor {
  extract(imageBase64: string, mimeType: string): Promise<ExtractedReceipt>
  readonly provider: string
  readonly model: string
}
