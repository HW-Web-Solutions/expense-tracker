import { createClient } from '@/lib/supabase/server'

const BUCKET = 'receipts'

export async function uploadReceipt(file: File, userId: string): Promise<string> {
  const supabase = await createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

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
