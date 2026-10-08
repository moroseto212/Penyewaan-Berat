'use client'

import { useState } from 'react'

/**
 * Flash message sederhana: pesan sukses/error dikirim lewat query string
 * (`?success=` / `?error=`) oleh `flashSuccess()` / `flashError()` di
 * `src/lib/admin/form.ts`. Pendekatan ini menghindari session flash sehingga
 * tetap stateless dan aman di serverless Vercel.
 */
export function Flash({ success, error }: { success?: string; error?: string }) {
  const [visible, setVisible] = useState(true)

  if (!visible || (!success && !error)) return null

  const tone = error
    ? 'bg-red-100 border-red-500 text-red-700'
    : 'bg-green-100 border-green-500 text-green-700'
  const icon = error ? 'fa-exclamation-circle' : 'fa-check-circle'

  return (
    <div
      className={`mb-6 border-l-4 px-4 py-3 rounded shadow-sm flex items-center justify-between gap-4 ${tone}`}
    >
      <span>
        <i className={`fas ${icon} mr-2`} />
        {error ?? success}
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Tutup pesan"
        className="text-xl leading-none opacity-70 hover:opacity-100 transition"
      >
        &times;
      </button>
    </div>
  )
}