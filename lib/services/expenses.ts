import { createExpense, updateExpense, getExpense } from '@/lib/db/expenses'
import { uploadReceipt, deleteReceipt } from '@/lib/db/receipts'
import type { Expense } from '@/lib/types'

export interface CreatePayload {
  merchant: string
  amount: number
  currency: string
  expense_date: string
  expense_time: string | null
  notes: string | null
  source: 'manual' | 'scan'
  ai_provider?: string | null
  ai_model?: string | null
  ai_confidence?: number | null
  raw_ai_result?: Record<string, unknown> | null
}

export async function createExpenseWithReceipt(
  payload: CreatePayload,
  userId: string,
  receiptFile?: File | null,
): Promise<Expense> {
  let receipt_image_path: string | null = null
  if (receiptFile && receiptFile.size > 0) {
    receipt_image_path = await uploadReceipt(receiptFile, userId)
  }

  try {
    return await createExpense({
      ...payload,
      receipt_image_path,
      ai_provider: payload.ai_provider ?? null,
      ai_model: payload.ai_model ?? null,
      ai_confidence: payload.ai_confidence ?? null,
      raw_ai_result: payload.raw_ai_result ?? null,
    })
  } catch (e) {
    if (receipt_image_path) await deleteReceipt(receipt_image_path).catch(() => {})
    throw e
  }
}

export interface UpdatePayload {
  merchant: string
  amount: number
  currency: string
  expense_date: string
  expense_time: string | null
  notes: string | null
}

export async function updateExpenseWithReceipt(
  id: string,
  userId: string,
  payload: UpdatePayload,
  receiptFile: File | null | undefined,
  removeReceipt: boolean,
): Promise<Expense> {
  const existing = await getExpense(id)

  let receipt_image_path: string | null | undefined = undefined
  let newUploadPath: string | null = null

  if (removeReceipt) {
    receipt_image_path = null
  } else if (receiptFile && receiptFile.size > 0) {
    newUploadPath = await uploadReceipt(receiptFile, userId)
    receipt_image_path = newUploadPath
  }

  try {
    const expense = await updateExpense(id, {
      ...payload,
      ...(receipt_image_path !== undefined ? { receipt_image_path } : {}),
    })

    // Clean up old receipt only after DB success
    const oldPath = existing?.receipt_image_path
    if (oldPath && (removeReceipt || newUploadPath)) {
      await deleteReceipt(oldPath).catch(() => {})
    }

    return expense
  } catch (e) {
    // Roll back new upload if DB update failed
    if (newUploadPath) await deleteReceipt(newUploadPath).catch(() => {})
    throw e
  }
}
