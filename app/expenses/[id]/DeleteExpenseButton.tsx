'use client'

import { useState } from 'react'
import { Spinner } from '@/app/components/Spinner'
import { deleteExpenseAction } from '@/app/actions/expenses'

export function DeleteExpenseButton({ id, receiptPath }: { id: string; receiptPath: string | null }) {
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this expense?')) return
    setPending(true)
    await deleteExpenseAction(id, receiptPath)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending && <Spinner className="w-3.5 h-3.5" />}
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
