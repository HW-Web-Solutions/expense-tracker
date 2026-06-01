import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createExpense } from '@/lib/db/expenses'
import { uploadReceipt } from '@/lib/db/receipts'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const merchant = (formData.get('merchant') as string).trim()
  const amount = parseFloat(formData.get('amount') as string)
  const currency = formData.get('currency') as string
  const expense_date = formData.get('expense_date') as string
  const expense_time = (formData.get('expense_time') as string) || null
  const notes = (formData.get('notes') as string)?.trim() || null
  const source = (formData.get('source') as string) || 'manual'
  const ai_provider = (formData.get('ai_provider') as string) || null
  const ai_model = (formData.get('ai_model') as string) || null
  const rawResult = formData.get('raw_ai_result') as string | null
  const receiptFile = formData.get('receipt') as File | null

  if (!merchant || isNaN(amount) || !currency || !expense_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let receipt_image_path: string | null = null
  if (receiptFile && receiptFile.size > 0) {
    receipt_image_path = await uploadReceipt(receiptFile, user.id)
  }

  let raw_ai_result = null
  try { raw_ai_result = rawResult ? JSON.parse(rawResult) : null } catch { /* ignore */ }

  const expense = await createExpense({
    merchant,
    amount,
    currency,
    expense_date,
    expense_time,
    notes,
    receipt_image_path,
    source: source as 'manual' | 'scan',
    ai_provider,
    ai_model,
    ai_confidence: raw_ai_result?.confidence ?? null,
    raw_ai_result,
  })

  return NextResponse.json({ id: expense.id })
}
