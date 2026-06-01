'use client'

import { deleteExpenseAction } from '@/app/actions/expenses'

export function DeleteExpenseButton({ id, receiptPath }: { id: string; receiptPath: string | null }) {
  async function handleDelete() {
    if (!confirm('Delete this expense?')) return
    await deleteExpenseAction(id, receiptPath)
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
    >
      Delete
    </button>
  )
}
