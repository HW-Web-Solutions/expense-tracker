import Link from 'next/link'
import { Suspense } from 'react'
import { getExpenses } from '@/lib/db/expenses'
import type { Expense } from '@/lib/types'
import ExpenseFilters from '@/app/components/ExpenseFilters'

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const str = (v: unknown) => (typeof v === 'string' ? v : undefined)

  const filters = {
    search: str(params.search),
    month: str(params.month),
    source: str(params.source),
    receipt: str(params.receipt),
    currency: str(params.currency),
  }

  const expenses = await getExpenses(filters)

  // Build export URL with active filters
  const exportParams = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v) exportParams.set(k, v) })
  const exportHref = `/api/expenses/export${exportParams.size ? `?${exportParams}` : ''}`

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <a
          href={exportHref}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="flex gap-2 mb-5">
        <Link
          href="/scan"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          📷 Scan
        </Link>
        <Link
          href="/expenses/new"
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          ✏️ Manual
        </Link>
      </div>

      <Suspense>
        <ExpenseFilters />
      </Suspense>

      {expenses.length === 0 ? (
        <div className="text-center py-14 px-6 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-600 font-medium">No expenses found.</p>
          <p className="text-slate-400 text-sm mt-1">
            {Object.keys(params).length > 0
              ? 'Try clearing your filters.'
              : 'Scan a receipt or add one manually to get started.'}
          </p>
          {!Object.keys(params).length && (
            <Link href="/scan" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              📷 Scan Receipt
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="md:hidden space-y-2">
            {expenses.map(e => <ExpenseCard key={e.id} expense={e} />)}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Merchant</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Currency</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-medium">Receipt</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      <Link href={`/expenses/${expense.id}`} className="block">{expense.expense_date}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      <Link href={`/expenses/${expense.id}`} className="block">{expense.merchant}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-900 text-right tabular-nums">
                      <Link href={`/expenses/${expense.id}`} className="block">{expense.amount.toFixed(2)}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <Link href={`/expenses/${expense.id}`} className="block">{expense.currency}</Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {expense.receipt_image_path ? <span className="text-blue-500">📎</span> : <span className="text-slate-200">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate">
                      <Link href={`/expenses/${expense.id}`} className="block">{expense.notes ?? ''}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(d: string) {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Link
      href={`/expenses/${expense.id}`}
      className="flex items-start justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors active:bg-slate-100"
    >
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-slate-900 font-semibold truncate">{expense.merchant}</p>
        <p className="text-slate-400 text-xs mt-0.5">
          {formatDate(expense.expense_date)}
          {expense.source === 'scan' && ' · AI scan'}
          {expense.receipt_image_path && ' · 📎'}
        </p>
        {expense.notes && (
          <p className="text-slate-400 text-xs mt-0.5 truncate">{expense.notes}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-slate-900 font-semibold tabular-nums">{expense.amount.toFixed(2)}</p>
        <p className="text-slate-400 text-xs">{expense.currency}</p>
      </div>
    </Link>
  )
}
