'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp } from '@/app/actions/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || ''
  const message = searchParams.get('message')

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)
    if (next) formData.set('next', next)

    startTransition(async () => {
      const result = mode === 'signin'
        ? await signIn(formData)
        : await signUp(formData)
      if (result?.error) setErrorMsg(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-10">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">📊</div>
            <h1 className="text-xl font-bold text-slate-900">Expense Sheet</h1>
            <p className="text-sm text-slate-500 mt-1">像 Excel 一样，每笔支出都有小票</p>
          </div>

          {message && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending
                ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'signin' ? (
              <>
                No account?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMsg(null) }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMsg(null) }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Powered by Supabase Auth
        </p>
      </div>
    </div>
  )
}
