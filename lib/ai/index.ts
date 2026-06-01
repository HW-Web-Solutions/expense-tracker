import { GeminiReceiptExtractor } from './gemini'
import type { ReceiptExtractor } from './types'

export function getReceiptExtractor(): ReceiptExtractor {
  const provider = process.env.AI_PROVIDER ?? 'gemini'
  if (provider === 'gemini') return new GeminiReceiptExtractor()
  throw new Error(`Unknown AI provider: ${provider}`)
}

export type { ExtractedReceipt, ReceiptExtractor } from './types'
