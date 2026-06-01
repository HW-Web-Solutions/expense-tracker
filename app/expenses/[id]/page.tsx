import Link from 'next/link'

export default function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/expenses"
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Expense Detail</h1>
      </div>

      {/* Placeholder content */}
      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Merchant</span>
          <span className="text-sm text-slate-900 font-medium">—</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Amount</span>
          <span className="text-sm text-slate-900 font-medium">—</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Currency</span>
          <span className="text-sm text-slate-900 font-medium">—</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Date</span>
          <span className="text-sm text-slate-900 font-medium">—</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Source</span>
          <span className="text-sm text-slate-900 font-medium">—</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">Receipt</span>
          <span className="text-sm text-slate-400">No receipt</span>
        </div>
        <div className="px-4 py-3">
          <span className="text-sm text-slate-500">Notes</span>
          <p className="mt-1 text-sm text-slate-900">—</p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Full expense detail coming soon.
      </p>
    </div>
  )
}
