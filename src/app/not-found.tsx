import Link from 'next/link'

/**
 * 404 fallback untuk rute di luar layout publik (mis. /admin/*).
 * Dirender tanpa header/footer publik, jadi membawa header minimal sendiri.
 */
export default function NotFound() {
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
          <p className="text-brand font-bold text-6xl sm:text-7xl mb-4">404</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-5">
            Halaman Tidak Ditemukan
          </h1>
          <div className="w-20 h-1 bg-brand mx-auto mb-6" />
          <p className="text-gray-600 mb-10">
            Halaman yang Anda cari tidak ada, sudah dipindahkan, atau tidak memiliki akses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-ink text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-home mr-2" />
              Ke Beranda
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <i className="fas fa-sign-in-alt mr-2" />
              Login Admin
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
