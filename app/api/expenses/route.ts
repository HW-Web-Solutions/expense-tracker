import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateExpenseInput } from '@/lib/validation/expenses'
import { validateReceiptFile } from '@/lib/validation/receipts'
import { createExpenseWithReceipt } from '@/lib/services/expenses'
import { logError } from '@/lib/logger'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const merchant = ((formData.get('merchant') as string) ?? '').trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = ((formData.get('notes') as string) ?? '').trim() || null
  const source = ((formData.get('source') as string) || 'manual') as 'manual' | 'scan'
  const ai_provider = (formData.get('ai_provider') as string) || null
  const ai_model = (formData.get('ai_model') as string) || null
  const rawResult = formData.get('raw_ai_result') as string | null
  const receiptFile = formData.get('receipt') as File | null

  const errors = validateExpenseInput({ merchant, amount, currency, expense_date, expense_time, notes, source })
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 })
  }

  if (receiptFile && receiptFile.size > 0) {
    const fileError = validateReceiptFile(receiptFile)
    if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })
  }

  let raw_ai_result: Record<string, unknown> | null = null
  try { raw_ai_result = rawResult ? JSON.parse(rawResult) : null } catch { /* ignore */ }

  const ai_confidence = typeof raw_ai_result?.confidence === 'number' ? raw_ai_result.confidence : null

  try {
    const expense = await createExpenseWithReceipt(
      { merchant, amount, currency, expense_date, expense_time, notes, source, ai_provider, ai_model, ai_confidence, raw_ai_result },
      user.id,
      receiptFile,
    )
    return NextResponse.json({ id: expense.id })
  } catch (e) {
    logError('expenses.create', e, { userId: user.id, source })
    const msg = e instanceof Error ? e.message : 'Failed to save expense'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
