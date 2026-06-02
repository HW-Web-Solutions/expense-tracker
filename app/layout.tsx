import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Expense Sheet',
  description: '像 Excel 一样，每笔支出都有小票',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        {/* Private beta banner */}
        <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
          Private beta — please review AI results before saving.{' '}
          <a href="mailto:hwwebsolutions@gmail.com?subject=Expense+Sheet+Feedback" className="font-medium underline hover:text-amber-900">
            Send feedback
          </a>
        </div>

        <div className="flex min-h-screen">
          {/* Sidebar — hidden on mobile */}
          <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200 bg-slate-50">
            <div className="flex flex-col flex-1 p-4 gap-1">
              <div className="mb-6 px-2 pt-2">
                <span className="text-lg font-semibold text-slate-900">Expense Sheet</span>
                <p className="text-xs text-slate-500 mt-0.5">像 Excel 一样</p>
              </div>
              <NavLink href="/" label="Home" icon="🏠" />
              <NavLink href="/expenses" label="Expenses" icon="📋" />
              <NavLink href="/scan" label="Scan Receipt" icon="📷" accent />
              <NavLink href="/expenses/new" label="Manual Entry" icon="✏️" />
              <NavLink href="/privacy" label="Privacy" icon="🔒" />
              <a
                href="mailto:hwwebsolutions@gmail.com?subject=Expense+Sheet+Feedback"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <span>💬</span><span>Feedback</span>
              </a>

              <div className="mt-auto pt-4 border-t border-slate-200">
                {user ? (
                  <>
                    <p className="px-3 py-1 text-xs text-slate-500 truncate">{user.email}</p>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <NavLink href="/login" label="Sign In" icon="👤" />
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 md:ml-56 pb-20 md:pb-0">
            {children}
          </main>
        </div>

        {/* Bottom nav — visible on mobile only */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50">
          <div className="flex items-center justify-around h-16">
            <BottomNavLink href="/" label="Home" icon="🏠" />
            <BottomNavLink href="/expenses" label="Expenses" icon="📋" />
            <BottomNavScanButton />
            {user ? (
              <BottomNavSignOut />
            ) : (
              <BottomNavLink href="/login" label="Sign In" icon="👤" />
            )}
          </div>
        </nav>
      </body>
    </html>
  )
}

function NavLink({
  href,
  label,
  icon,
  accent,
}: {
  href: string
  label: string
  icon: string
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        accent
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'text-slate-700 hover:bg-slate-200'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function BottomNavLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: string
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-600">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}

function BottomNavScanButton() {
  return (
    <Link
      href="/scan"
      className="flex flex-col items-center gap-0.5 -mt-4 px-3"
    >
      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg">
        📷
      </span>
      <span className="text-[10px] text-slate-600">Scan</span>
    </Link>
  )
}

function BottomNavSignOut() {
  return (
    <form action={signOut}>
      <button type="submit" className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-600">
        <span className="text-xl">🚪</span>
        <span className="text-[10px]">Sign Out</span>
      </button>
    </form>
  )
}
