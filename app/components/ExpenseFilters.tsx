'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

const CURRENCIES = ['USD', 'CAD', 'CNY', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD']

function thisMonth() {
  return new Date().toISOString().slice(0, 7)
}

function lastMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 7)
}

export default function ExpenseFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const get = (key: string) => searchParams.get(key) ?? ''

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams],
  )

  const clearAll = () => {
    startTransition(() => {
      router.replace(pathname)
    })
  }

  const hasFilters = ['search', 'month', 'source', 'receipt', 'currency'].some(k => searchParams.has(k))

  return (
    <div className="mb-6 space-y-3">
      <input
        type="search"
        placeholder="Search merchant or notes…"
        defaultValue={get('search')}
        onChange={e => update('search', e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={get('month')}
          onChange={e => update('month', e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All time</option>
          <option value={thisMonth()}>This month</option>
          <option value={lastMonth()}>Last month</option>
        </select>

        <select
          value={get('source')}
          onChange={e => update('source', e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All sources</option>
          <option value="scan">Scan</option>
          <option value="manual">Manual</option>
        </select>

        <select
          value={get('receipt')}
          onChange={e => update('receipt', e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All receipts</option>
          <option value="has">Has receipt</option>
          <option value="none">No receipt</option>
        </select>

        <select
          value={get('currency')}
          onChange={e => update('currency', e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All currencies</option>
          {CURRENCIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
