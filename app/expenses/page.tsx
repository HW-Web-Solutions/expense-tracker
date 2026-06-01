import Link from 'next/link'
import { getExpenses } from '@/lib/db/expenses'

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <button
          disabled
          className="text-sm text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 cursor-not-allowed"
          title="Coming soon"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <Link
          href="/scan"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>📷</span> Scan Receipt
        </Link>
        <Link
          href="/expenses/new"
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <span>✏️</span> Add Manually
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-600 font-medium">No expenses yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Scan a receipt or add manually to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Merchant</th>
                <th className="text-right px-4 py-3 text-slate-600 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Currency</th>
                <th className="text-center px-4 py-3 text-slate-600 font-medium">Receipt</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.expense_date}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.merchant}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-900 text-right tabular-nums">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.amount.toFixed(2)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.currency}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {expense.receipt_image_path ? (
                      <span className="text-blue-600">📎</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.notes ?? ''}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
