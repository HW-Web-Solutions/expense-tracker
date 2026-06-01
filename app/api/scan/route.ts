import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReceiptExtractor } from '@/lib/ai'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  const extractor = getReceiptExtractor()
  const result = await extractor.extract(base64, file.type || 'image/jpeg')

  return NextResponse.json({
    ...result,
    ai_provider: extractor.provider,
    ai_model: extractor.model,
    raw_ai_result: result,
  })
}
