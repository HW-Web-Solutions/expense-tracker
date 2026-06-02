'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createExpense, updateExpense, getExpense } from '@/lib/db/expenses'
import { uploadReceipt, deleteReceipt } from '@/lib/db/receipts'
import { createClient } from '@/lib/supabase/server'

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
  const receiptFile = formData.get('receipt') as File | null

  if (!merchant || isNaN(amount) || !currency || !expense_date) {
    return { error: 'Please fill in all required fields.' }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated.' }

    let receipt_image_path: string | null = null
    if (receiptFile && receiptFile.size > 0) {
      receipt_image_path = await uploadReceipt(receiptFile, user.id)
    }

    await createExpense({
      merchant,
      amount,
      currency,
      expense_date,
      expense_time,
      notes,
      receipt_image_path,
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

export async function deleteExpenseAction(id: string, receiptPath: string | null) {
  try {
    if (receiptPath) await deleteReceipt(receiptPath)
    const { deleteExpense } = await import('@/lib/db/expenses')
    await deleteExpense(id)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to delete expense.' }
  }

  revalidatePath('/expenses')
  redirect('/expenses')
}

export async function updateExpenseAction(
  _state: { error: string } | undefined,
  formData: FormData
) {
  const id = formData.get('id') as string
  const merchant = (formData.get('merchant') as string).trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = (formData.get('notes') as string).trim() || null
  const receiptFile = formData.get('receipt') as File | null

  if (!merchant || isNaN(amount) || !currency || !expense_date) {
    return { error: 'Please fill in all required fields.' }
  }

  const removeReceipt = formData.get('remove_receipt') === 'true'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated.' }

    const existing = await getExpense(id)
    let receipt_image_path: string | null | undefined = undefined

    if (removeReceipt) {
      if (existing?.receipt_image_path) await deleteReceipt(existing.receipt_image_path)
      receipt_image_path = null
    } else if (receiptFile && receiptFile.size > 0) {
      if (existing?.receipt_image_path) await deleteReceipt(existing.receipt_image_path)
      receipt_image_path = await uploadReceipt(receiptFile, user.id)
    }

    await updateExpense(id, {
      merchant,
      amount,
      currency,
      expense_date,
      expense_time,
      notes,
      ...(receipt_image_path !== undefined ? { receipt_image_path } : {}),
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update expense.' }
  }

  revalidatePath('/expenses')
  revalidatePath(`/expenses/${id}`)
  redirect(`/expenses/${id}`)
}
