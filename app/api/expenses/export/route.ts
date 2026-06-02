import { createClient } from '@/lib/supabase/server'
import { getExpenses } from '@/lib/db/expenses'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const expenses = await getExpenses()

  const headers = ['date', 'time', 'merchant', 'amount', 'currency', 'notes', 'source', 'receipt_image_path']
  const rows = expenses.map(e => [
    e.expense_date,
    e.expense_time ?? '',
    `"${(e.merchant ?? '').replace(/"/g, '""')}"`,
    e.amount,
    e.currency,
    `"${(e.notes ?? '').replace(/"/g, '""')}"`,
    e.source,
    e.receipt_image_path ?? '',
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="expenses.csv"',
    },
  })
}
