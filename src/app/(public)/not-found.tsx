import Link from 'next/link'

const QUICK_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog Alat', href: '/katalog-alat' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontak', href: '/kontak' },
]

/** 404 bermerek untuk semua rute publik (dirender di dalam layout publik). */
export default function NotFound() {
  return (
    <section className="relative bg-ink py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink to-ink-soft" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand font-bold text-6xl sm:text-7xl mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5">
          Halaman Tidak Ditemukan
        </h1>
        <div className="w-20 h-1 bg-brand mx-auto mb-6" />
        <p className="text-gray-300 mb-10 max-w-xl mx-auto">
          Halaman yang Anda cari tidak ada, sudah dipindahkan, atau mungkin salah ketik.
          Silakan pilih tujuan di bawah ini.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-lg"
          >
            <i className="fas fa-home mr-2" />
            Ke Beranda
          </Link>
          <Link
            href="/katalog-alat"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-ink transition-colors text-lg"
          >
            <i className="fas fa-tractor mr-2" />
            Lihat Katalog
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-gray-300 bg-white/5 hover:bg-brand hover:text-ink rounded-full transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
