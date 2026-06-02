import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getExpense } from '@/lib/db/expenses'
import { getReceiptUrl } from '@/lib/db/receipts'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const expense = await getExpense(id)
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const receiptUrl = expense.receipt_image_path
    ? await getReceiptUrl(expense.receipt_image_path)
    : null

  return NextResponse.json({ expense, receiptUrl })
}
