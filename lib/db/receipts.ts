import { createClient } from '@/lib/supabase/server'

const BUCKET = 'receipts'

function mimeToExt(mime: string): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}

export async function uploadReceipt(file: File, userId: string): Promise<string> {
  const supabase = await createClient()
  const ext = mimeToExt(file.type)
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) throw error
  return path
}

export async function getReceiptUrl(path: string): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60) // 1 hour

  if (error) throw error
  return data.signedUrl
}

export async function deleteReceipt(path: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
