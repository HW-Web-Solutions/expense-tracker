import Link from 'next/link'

export default function ScanPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Scan Receipt</h1>
      </div>

      {/* Upload area */}
      <label className="flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 cursor-not-allowed">
        <div className="text-5xl mb-4">📷</div>
        <p className="text-slate-700 font-semibold">Take a Photo</p>
        <p className="text-slate-500 text-sm mt-1">or upload an image</p>
        <p className="mt-4 text-xs text-slate-400">Supports JPG, PNG, HEIC</p>
        <input type="file" accept="image/*" capture="environment" disabled className="hidden" />
      </label>

      {/* Upload from file */}
      <label className="mt-4 flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium cursor-not-allowed bg-white hover:bg-slate-50">
        <span>🖼️</span> Upload Image
        <input type="file" accept="image/*" disabled className="hidden" />
      </label>

      {/* AI note */}
      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <p className="text-sm text-amber-800 font-medium">🤖 AI extraction coming soon</p>
        <p className="text-xs text-amber-700 mt-1">
          Once implemented, AI will automatically extract merchant, amount, date, and currency from your receipt.
        </p>
      </div>

      {/* Manual entry fallback */}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">Prefer to enter manually?</p>
        <Link
          href="/expenses/new"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Manual Entry →
        </Link>
      </div>
    </div>
  )
}
