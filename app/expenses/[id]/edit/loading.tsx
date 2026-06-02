import { Spinner } from '@/app/components/Spinner'

export default function EditExpenseLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-slate-400">← Back</span>
        <h1 className="text-2xl font-bold text-slate-900">Edit Expense</h1>
      </div>
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
        <Spinner className="w-5 h-5" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  )
}
