'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SuccessBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)
  const router = useRouter()

  if (!visible) return null

  function dismiss() {
    setVisible(false)
    // Remove the query param from the URL without a full navigation
    router.replace('/expenses', { scroll: false })
  }

  return (
    <div className="mb-5 flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
      <span>✓ {message}</span>
      <button onClick={dismiss} className="ml-3 text-green-600 hover:text-green-800 text-lg leading-none" aria-label="Dismiss">×</button>
    </div>
  )
}
