'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { updateExpenseAction } from '@/app/actions/expenses'
import { ReceiptUpload } from '@/app/components/ReceiptUpload'
import type { Expense } from '@/lib/types'

const CURRENCIES = ['CAD', 'USD', 'CNY', 'HKD', 'EUR', 'GBP']

export default function EditExpensePage() {
  const params = useParams()
  const id = params.id as string
  const [expense, setExpense] = useState<Expense | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [state, action, pending] = useActionState(updateExpenseAction, undefined)

  useEffect(() => {
    fetch(`/api/expenses/${id}`).then(r => r.json()).then(data => {
      setExpense(data.expense)
      setReceiptUrl(data.receiptUrl ?? null)
    })
  }, [id])

  if (!expense) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="text-center py-12 text-slate-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/expenses/${id}`} className="text-slate-500 hover:text-slate-700 transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Expense</h1>
      </div>

      {state?.error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Merchant <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="merchant"
            defaultValue={expense.merchant}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              defaultValue={expense.amount}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              defaultValue={expense.currency}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expense_date"
              defaultValue={expense.expense_date}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Time <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="time"
              name="expense_time"
              defaultValue={expense.expense_time ?? ''}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="notes"
            defaultValue={expense.notes ?? ''}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Receipt Image <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <ReceiptUpload name="receipt" defaultImageUrl={receiptUrl ?? undefined} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-base transition-colors"
        >
          {pending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
