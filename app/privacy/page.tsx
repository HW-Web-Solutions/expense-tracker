import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">← Back</Link>

      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-6">Privacy & Data</h1>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">What we store</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Expense records (merchant, amount, date, currency, notes) — stored in Supabase Postgres</li>
            <li>Receipt images — stored in Supabase Storage (private bucket, only accessible to you)</li>
            <li>Your account email — managed by Supabase Auth</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">AI processing</h2>
          <p className="text-slate-600">
            When you scan a receipt, the image is sent to Google Gemini to extract merchant, date, and amount.
            Google&apos;s{' '}
            <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="underline">
              API terms
            </a>{' '}
            apply. Avoid uploading receipts that contain full card numbers, bank account details, or other highly sensitive personal information.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">Private beta notice</h2>
          <p className="text-slate-600">
            This is an early test version shared with invited friends. The app may change, and test data is not guaranteed to be preserved.
            Please do not use it to store data you cannot afford to lose during the beta period.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">Deleting your data</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>You can delete individual expenses from the expense detail page.</li>
            <li>Deleting an expense also removes its receipt image from storage.</li>
            <li>
              To request deletion of all your data (expenses + receipt images + account), email{' '}
              <a href="mailto:hwwebsolutions@gmail.com?subject=Data+Deletion+Request" className="underline">
                hwwebsolutions@gmail.com
              </a>{' '}
              with the subject line <em>Data Deletion Request</em>.
            </li>
            <li>Requests will be completed within 7 days.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-2">Contact</h2>
          <p className="text-slate-600">
            Questions or feedback?{' '}
            <a href="mailto:hwwebsolutions@gmail.com?subject=Expense+Sheet+Feedback" className="underline">
              hwwebsolutions@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
