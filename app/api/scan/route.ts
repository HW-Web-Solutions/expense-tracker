import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReceiptExtractor } from '@/lib/ai'
import { validateReceiptFile } from '@/lib/validation/receipts'
import { logError, logInfo } from '@/lib/logger'

const SCAN_DAILY_LIMIT = parseInt(process.env.SCAN_DAILY_LIMIT ?? '20', 10)

async function getScanAttemptsToday(userId: string): Promise<number> {
  const supabase = await createClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('scan_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since)
  return count ?? 0
}

async function insertScanEvent(userId: string, provider: string, model: string, status: string) {
  const supabase = await createClient()
  await supabase.from('scan_events').insert({ user_id: userId, provider, model, status }).throwOnError()
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  const fileError = validateReceiptFile(file)
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })

  // Rate limit: count actual scan attempts in last 24 hours
  try {
    const todayCount = await getScanAttemptsToday(user.id)
    if (todayCount >= SCAN_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily scan limit reached (${SCAN_DAILY_LIMIT} per day). Please try again tomorrow.` },
        { status: 429 },
      )
    }
  } catch {
    // Non-fatal — proceed if rate limit check fails
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  const extractor = getReceiptExtractor()
  logInfo('scan.start', { userId: user.id, fileType: file.type, fileSize: file.size })

  // Record the attempt before calling Gemini
  try {
    await insertScanEvent(user.id, extractor.provider, extractor.model, 'attempted')
  } catch {
    // Non-fatal
  }

  let result
  try {
    result = await extractor.extract(base64, file.type)
  } catch (e) {
    logError('scan.extract', e, { userId: user.id, fileType: file.type, aiProvider: extractor.provider, aiModel: extractor.model })
    // Update status to error (best-effort)
    insertScanEvent(user.id, extractor.provider, extractor.model, 'error').catch(() => {})
    const msg = e instanceof Error ? e.message : 'AI extraction failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Update status to success (best-effort)
  insertScanEvent(user.id, extractor.provider, extractor.model, 'success').catch(() => {})
  logInfo('scan.success', { userId: user.id, confidence: result.confidence, needsReview: result.needs_review })

  return NextResponse.json({
    ...result,
    ai_provider: extractor.provider,
    ai_model: extractor.model,
    raw_ai_result: result,
  })
}
