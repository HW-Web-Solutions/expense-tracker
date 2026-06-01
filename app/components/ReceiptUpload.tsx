'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ReceiptUploadProps {
  name: string
  defaultImageUrl?: string
}

export function ReceiptUpload({ name, defaultImageUrl }: ReceiptUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImageUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  function handleRemove() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200">
          <Image
            src={preview}
            alt="Receipt preview"
            width={400}
            height={300}
            className="w-full object-contain max-h-64"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-500 shadow text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
          <span className="text-2xl">📎</span>
          <span className="mt-1 text-sm text-slate-400">Upload or take a photo</span>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
