'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createExpense } from '@/lib/db/expenses'

export async function createExpenseAction(
  _state: { error: string } | undefined,
  formData: FormData
) {
  const merchant = (formData.get('merchant') as string).trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = (formData.get('notes') as string).trim() || null

  if (!merchant || isNaN(amount) || !currency || !expense_date) {
    return { error: 'Please fill in all required fields.' }
  }

  try {
    await createExpense({
      merchant,
      amount,
      currency,
      expense_date,
      expense_time,
      notes,
      receipt_image_path: null,
      source: 'manual',
      ai_provider: null,
      ai_model: null,
      ai_confidence: null,
      raw_ai_result: null,
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save expense.' }
  }

  revalidatePath('/expenses')
  redirect('/expenses')
}
