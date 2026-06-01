import { NextResponse } from 'next/server'
import { getExpense } from '@/lib/db/expenses'
import { getReceiptUrl } from '@/lib/db/receipts'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const expense = await getExpense(id)
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const receiptUrl = expense.receipt_image_path
    ? await getReceiptUrl(expense.receipt_image_path)
    : null

  return NextResponse.json({ expense, receiptUrl })
}
