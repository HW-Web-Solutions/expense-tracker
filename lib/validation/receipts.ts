const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const HEIC_TYPES = ['image/heic', 'image/heif']

export function validateReceiptFile(file: File): string | null {
  const type = file.type.toLowerCase()
  if (HEIC_TYPES.includes(type)) {
    return 'HEIC/HEIF images are not supported. Please convert to JPG, PNG, or WebP before uploading.'
  }
  if (!SUPPORTED_TYPES.includes(type)) {
    return 'Unsupported image format. Please upload a JPG, PNG, or WebP image.'
  }
  if (file.size > MAX_SIZE) {
    return 'Image is too large. Please upload an image under 10 MB.'
  }
  return null
}

export const SUPPORTED_IMAGE_TYPES = SUPPORTED_TYPES
