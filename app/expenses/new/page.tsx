import Link from 'next/link'

const CURRENCIES = ['CAD', 'USD', 'CNY', 'HKD', 'EUR', 'GBP']

export default function NewExpensePage() {
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
        <h1 className="text-2xl font-bold text-slate-900">New Expense</h1>
      </div>

      <form className="space-y-5">
        {/* Merchant */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Merchant <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Starbucks"
            disabled
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
          />
        </div>

        {/* Amount + Currency */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm bg-slate-50 cursor-not-allowed"
              defaultValue="CAD"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date + Time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Time <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="time"
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Any additional notes..."
            rows={3}
            disabled
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm bg-slate-50 cursor-not-allowed resize-none"
          />
        </div>

        {/* Receipt upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Receipt Image <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed">
            <span className="text-2xl">📎</span>
            <span className="mt-1 text-sm text-slate-400">Upload receipt image</span>
            <input type="file" accept="image/*" disabled className="hidden" />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled
          className="w-full h-12 rounded-xl bg-slate-200 text-slate-400 font-semibold text-base cursor-not-allowed"
        >
          Coming soon
        </button>
      </form>
    </div>
  )
}
