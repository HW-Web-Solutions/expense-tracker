export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-10">
          {/* Logo/title */}
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">📊</div>
            <h1 className="text-xl font-bold text-slate-900">Sign in to Expense Sheet</h1>
            <p className="text-sm text-slate-500 mt-1">像 Excel 一样，每笔支出都有小票</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                disabled
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled
              className="w-full h-12 rounded-xl bg-slate-200 text-slate-400 font-semibold text-base cursor-not-allowed mt-2"
            >
              Auth coming soon
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Authentication will be powered by Supabase.
        </p>
      </div>
    </div>
  )
}
