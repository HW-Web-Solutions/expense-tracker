import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Expense Sheet</h1>
        <p className="mt-2 text-base text-slate-500">像 Excel 一样，每笔支出都有小票</p>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/scan"
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-sm hover:bg-blue-700 transition-colors"
          >
            📷 Scan Receipt
          </Link>
          <Link
            href="/expenses/new"
            className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 transition-colors"
          >
            ✏️ Manual Entry
          </Link>
          <Link
            href="/expenses"
            className="text-blue-600 text-sm font-medium hover:underline mt-1"
          >
            View Expenses →
          </Link>
        </div>
      </div>

      <div className="px-6 pb-24 md:pb-8">
        <div className="max-w-sm mx-auto space-y-2">
          {[
            { icon: '📷', text: 'Scan a receipt or add an expense manually.' },
            { icon: '🤖', text: 'AI reads the merchant, date, and amount.' },
            { icon: '✅', text: 'Review and save.' },
            { icon: '📋', text: 'Filter, search, and export anytime.' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <span className="text-lg">{step.icon}</span>
              <span className="text-sm text-slate-600">{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
