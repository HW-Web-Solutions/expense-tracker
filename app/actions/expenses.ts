'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteExpense } from '@/lib/db/expenses'
import { deleteReceipt } from '@/lib/db/receipts'
import { createClient } from '@/lib/supabase/server'
import { validateExpenseInput } from '@/lib/validation/expenses'
import { validateReceiptFile } from '@/lib/validation/receipts'
import { createExpenseWithReceipt, updateExpenseWithReceipt } from '@/lib/services/expenses'

export async function createExpenseAction(
  _state: { error: string } | undefined,
  formData: FormData,
) {
  const merchant = (formData.get('merchant') as string ?? '').trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = ((formData.get('notes') as string) ?? '').trim() || null
  const receiptFile = formData.get('receipt') as File | null

  const errors = validateExpenseInput({ merchant, amount, currency, expense_date, expense_time, notes, source: 'manual' })
  if (errors.length > 0) return { error: errors.join(' ') }

  if (receiptFile && receiptFile.size > 0) {
    const fileError = validateReceiptFile(receiptFile)
    if (fileError) return { error: fileError }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated.' }

    await createExpenseWithReceipt(
      { merchant, amount, currency, expense_date, expense_time, notes, source: 'manual' },
      user.id,
      receiptFile,
    )
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save expense.' }
  }

  revalidatePath('/expenses')
  redirect('/expenses')
}

export async function deleteExpenseAction(id: string, receiptPath: string | null) {
  try {
    if (receiptPath) await deleteReceipt(receiptPath)
    await deleteExpense(id)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to delete expense.' }
  }

  revalidatePath('/expenses')
  redirect('/expenses')
}

export async function updateExpenseAction(
  _state: { error: string } | undefined,
  formData: FormData,
) {
  const id = formData.get('id') as string
  const merchant = (formData.get('merchant') as string ?? '').trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = ((formData.get('notes') as string) ?? '').trim() || null
  const receiptFile = formData.get('receipt') as File | null
  const removeReceipt = formData.get('remove_receipt') === 'true'

  const errors = validateExpenseInput({ merchant, amount, currency, expense_date, expense_time, notes })
  if (errors.length > 0) return { error: errors.join(' ') }

  if (receiptFile && receiptFile.size > 0) {
    const fileError = validateReceiptFile(receiptFile)
    if (fileError) return { error: fileError }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated.' }

    await updateExpenseWithReceipt(
      id,
      user.id,
      { merchant, amount, currency, expense_date, expense_time, notes },
      receiptFile,
      removeReceipt,
    )
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update expense.' }
  }

  revalidatePath('/expenses')
  revalidatePath(`/expenses/${id}`)
  redirect(`/expenses/${id}`)
}
