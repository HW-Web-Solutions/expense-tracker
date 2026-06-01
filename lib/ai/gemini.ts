import { GoogleGenAI } from '@google/genai'
import type { ReceiptExtractor, ExtractedReceipt } from './types'
import { EXTRACTION_PROMPT } from './prompt'

export class GeminiReceiptExtractor implements ReceiptExtractor {
  readonly provider = 'gemini'
  readonly model: string
  private client: GoogleGenAI

  constructor() {
    this.model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  }

  async extract(imageBase64: string, mimeType: string): Promise<ExtractedReceipt> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: imageBase64, mimeType } },
            { text: EXTRACTION_PROMPT },
          ],
        },
      ],
    })

    const text = (response.text ?? '').trim()
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

    try {
      return JSON.parse(json) as ExtractedReceipt
    } catch {
      throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`)
    }
  }
}
