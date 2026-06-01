import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getExpense } from '@/lib/db/expenses'
import { getReceiptUrl } from '@/lib/db/receipts'
import { DeleteExpenseButton } from './DeleteExpenseButton'

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const expense = await getExpense(id)
  if (!expense) notFound()

  const receiptUrl = expense.receipt_image_path
    ? await getReceiptUrl(expense.receipt_image_path)
    : null

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/expenses" className="text-slate-500 hover:text-slate-700 transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Expense</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/expenses/${id}/edit`}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Edit
          </Link>
          <DeleteExpenseButton id={id} receiptPath={expense.receipt_image_path} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 mb-6">
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Merchant</span>
          <span className="text-sm text-slate-900 font-medium">{expense.merchant}</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Amount</span>
          <span className="text-sm text-slate-900 font-medium tabular-nums">
            {expense.amount.toFixed(2)} {expense.currency}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Date</span>
          <span className="text-sm text-slate-900">{expense.expense_date}</span>
        </div>
        {expense.expense_time && (
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-slate-500">Time</span>
            <span className="text-sm text-slate-900">{expense.expense_time}</span>
          </div>
        )}
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Source</span>
          <span className="text-sm text-slate-900 capitalize">{expense.source}</span>
        </div>
        {expense.notes && (
          <div className="px-4 py-3">
            <span className="text-sm text-slate-500">Notes</span>
            <p className="mt-1 text-sm text-slate-900">{expense.notes}</p>
          </div>
        )}
      </div>

      {receiptUrl ? (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Receipt</p>
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <Image
              src={receiptUrl}
              alt="Receipt"
              width={600}
              height={800}
              className="w-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
          No receipt attached
        </div>
      )}
    </div>
  )
}
