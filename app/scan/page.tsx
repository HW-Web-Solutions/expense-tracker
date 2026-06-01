'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { ExtractedReceipt } from '@/lib/ai/types'

const CURRENCIES = ['CAD', 'USD', 'CNY', 'HKD', 'EUR', 'GBP']

type State =
  | { step: 'upload' }
  | { step: 'extracting'; previewUrl: string }
  | { step: 'review'; previewUrl: string; result: ExtractedReceipt & { ai_provider: string; ai_model: string; raw_ai_result: unknown } }
  | { step: 'saving' }
  | { step: 'error'; message: string }

export default function ScanPage() {
  const [state, setState] = useState<State>({ step: 'upload' })
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFile(file: File) {
    const previewUrl = URL.createObjectURL(file)
    setState({ step: 'extracting', previewUrl })

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/scan', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Extraction failed')
      setState({ step: 'review', previewUrl, result: data })
    } catch (e) {
      setState({ step: 'error', message: e instanceof Error ? e.message : 'Something went wrong' })
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state.step !== 'review') return
    setState({ step: 'saving' })

    const form = e.currentTarget
    const fd = new FormData(form)

    // Add the receipt image blob
    const blob = await fetch(state.previewUrl).then(r => r.blob())
    fd.append('receipt', blob, 'receipt.jpg')

    const res = await fetch('/api/expenses', { method: 'POST', body: fd })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/expenses/${id}`)
    } else {
      const { error } = await res.json()
      setState({ step: 'error', message: error ?? 'Failed to save' })
    }
  }

  if (state.step === 'upload') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/expenses" className="text-slate-500 hover:text-slate-700 transition-colors">← Back</Link>
          <h1 className="text-2xl font-bold text-slate-900">Scan Receipt</h1>
        </div>

        <label
          className="flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-5xl mb-4">📷</div>
          <p className="text-slate-700 font-semibold">Take a Photo</p>
          <p className="text-slate-500 text-sm mt-1">or upload an image</p>
          <p className="mt-4 text-xs text-slate-400">Supports JPG, PNG, HEIC</p>
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        <label className="mt-4 flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium cursor-pointer bg-white hover:bg-slate-50 transition-colors">
          <span>🖼️</span> Upload from Library
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>

        <div className="mt-4 text-center">
          <Link href="/expenses/new" className="text-blue-600 text-sm font-medium hover:underline">
            Manual Entry →
          </Link>
        </div>
      </div>
    )
  }

  if (state.step === 'extracting') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/expenses" className="text-slate-500 hover:text-slate-700 transition-colors">← Back</Link>
          <h1 className="text-2xl font-bold text-slate-900">Scan Receipt</h1>
        </div>
        <div className="rounded-xl overflow-hidden border border-slate-200 mb-6">
          <Image src={state.previewUrl} alt="Receipt" width={600} height={400} className="w-full object-contain max-h-64" />
        </div>
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="text-3xl animate-pulse">🤖</div>
          <p className="text-slate-700 font-medium">Extracting receipt data…</p>
          <p className="text-slate-400 text-sm">This usually takes a few seconds</p>
        </div>
      </div>
    )
  }

  if (state.step === 'error') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/scan" className="text-slate-500 hover:text-slate-700 transition-colors">← Back</Link>
          <h1 className="text-2xl font-bold text-slate-900">Scan Receipt</h1>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-4 mb-6">
          <p className="text-red-700 font-medium">Extraction failed</p>
          <p className="text-red-600 text-sm mt-1">{state.message}</p>
        </div>
        <button
          onClick={() => setState({ step: 'upload' })}
          className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (state.step === 'review' || state.step === 'saving') {
    const { result, previewUrl } = state.step === 'review' ? state : (state as unknown as typeof state & { result: ExtractedReceipt & { ai_provider: string; ai_model: string } ; previewUrl: string })
    const r = (state as Extract<typeof state, { step: 'review' }>).result

    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setState({ step: 'upload' })} className="text-slate-500 hover:text-slate-700 transition-colors">← Back</button>
          <h1 className="text-2xl font-bold text-slate-900">Review & Save</h1>
        </div>

        {r.needs_review && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            ⚠️ Some fields may be uncertain — please review before saving.
          </div>
        )}

        <div className="rounded-xl overflow-hidden border border-slate-200 mb-6">
          <Image src={(state as Extract<typeof state, { step: 'review' }>).previewUrl} alt="Receipt" width={600} height={400} className="w-full object-contain max-h-48" />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <input type="hidden" name="ai_provider" value={r.ai_provider} />
          <input type="hidden" name="ai_model" value={r.ai_model} />
          <input type="hidden" name="raw_ai_result" value={JSON.stringify(r.raw_ai_result)} />
          <input type="hidden" name="source" value="scan" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Merchant <span className="text-red-500">*</span></label>
            <input type="text" name="merchant" defaultValue={r.merchant} required
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount <span className="text-red-500">*</span></label>
              <input type="number" name="amount" defaultValue={r.amount} min="0" step="0.01" required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency <span className="text-red-500">*</span></label>
              <select name="currency" defaultValue={r.currency}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date <span className="text-red-500">*</span></label>
              <input type="date" name="expense_date" defaultValue={r.expense_date} required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Time <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="time" name="expense_time" defaultValue={r.expense_time ?? ''}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea name="notes" defaultValue={r.notes ?? ''} rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <p className="text-xs text-slate-400">AI confidence: {Math.round(r.confidence * 100)}% · {r.ai_provider} / {r.ai_model}</p>

          <button type="submit" disabled={state.step === 'saving'}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-base transition-colors">
            {state.step === 'saving' ? 'Saving…' : 'Save Expense'}
          </button>
        </form>
      </div>
    )
  }

  return null
}
