'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Error boundary bermerek — menangani kegagalan tak terduga di seluruh
 * aplikasi (mis. database down, bug runtime) tanpa memunculkan layar
 * error polos Next.js.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error-page]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-ink h-20 flex items-center shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Link href="/" className="text-2xl font-bold text-brand tracking-wide">
            <i className="fas fa-tractor mr-2" />
            AlatBerat
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xl py-20">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-triangle-exclamation text-3xl text-brand" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-5">
            Terjadi Kesalahan
          </h1>
          <div className="w-20 h-1 bg-brand mx-auto mb-6" />
          <p className="text-gray-600 mb-10">
            Mohon maaf, terjadi gangguan saat memuat halaman ini. Silakan coba lagi, atau kembali
            ke beranda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center px-8 py-3 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <i className="fas fa-redo mr-2" />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-ink text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-home mr-2" />
              Ke Beranda
            </Link>
          </div>
          {error.digest && (
            <p className="text-xs text-gray-400 mt-8">Kode gangguan: {error.digest}</p>
          )}
        </div>
      </main>
    </div>
  )
}
