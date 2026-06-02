import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReceiptExtractor } from '@/lib/ai'
import { validateReceiptFile } from '@/lib/validation/receipts'
import { logError, logInfo } from '@/lib/logger'

const SCAN_DAILY_LIMIT = parseInt(process.env.SCAN_DAILY_LIMIT ?? '20', 10)

async function getScanCountToday(userId: string): Promise<number> {
  const supabase = await createClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('expenses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('source', 'scan')
    .gte('created_at', since)
  return count ?? 0
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

  // Rate limit: count saved scans in last 24 hours as a proxy for API usage
  try {
    const todayCount = await getScanCountToday(user.id)
    if (todayCount >= SCAN_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily scan limit reached (${SCAN_DAILY_LIMIT} scans per day). Please try again tomorrow.` },
        { status: 429 },
      )
    }
  } catch {
    // Non-fatal — proceed if rate limit check fails
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  logInfo('scan.start', { userId: user.id, fileType: file.type, fileSize: file.size })

  const extractor = getReceiptExtractor()
  let result
  try {
    result = await extractor.extract(base64, file.type)
  } catch (e) {
    logError('scan.extract', e, { userId: user.id, fileType: file.type, fileSize: file.size, aiProvider: extractor.provider, aiModel: extractor.model })
    const msg = e instanceof Error ? e.message : 'AI extraction failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  logInfo('scan.success', { userId: user.id, confidence: result.confidence, needsReview: result.needs_review })

  return NextResponse.json({
    ...result,
    ai_provider: extractor.provider,
    ai_model: extractor.model,
    raw_ai_result: result,
  })
}
