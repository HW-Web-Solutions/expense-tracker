import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Expense Sheet
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          像 Excel 一样，每笔支出都有小票
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Track every expense with a receipt attached.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/scan"
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span>📷</span> Scan Receipt
          </Link>
          <Link
            href="/expenses/new"
            className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-base hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <span>✏️</span> Manual Entry
          </Link>
        </div>

        {/* Secondary link */}
        <div className="mt-8">
          <Link
            href="/expenses"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All Expenses →
          </Link>
        </div>
      </div>

      {/* Feature summary */}
      <div className="px-6 pb-24 md:pb-8">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-2xl">📷</div>
            <div className="mt-1 text-xs text-slate-600 font-medium">Scan receipts</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-2xl">📋</div>
            <div className="mt-1 text-xs text-slate-600 font-medium">Track expenses</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div className="text-2xl">📊</div>
            <div className="mt-1 text-xs text-slate-600 font-medium">Export CSV</div>
          </div>
        </div>
      </div>
    </div>
  )
}
