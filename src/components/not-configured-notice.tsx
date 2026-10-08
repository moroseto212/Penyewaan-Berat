import Link from 'next/link'

/**
 * Halaman ramah yang ditampilkan ketika sebuah halaman detail tidak
 * menemukan data **karena Supabase belum dikonfigurasi**, bukan karena
 * URL-nya salah — supaya pengguna tidak mengira situsnya rusak (404).
 */
export function NotConfiguredNotice({ resource }: { resource: string }) {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-database text-3xl text-brand" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
          Data {resource} Belum Tersedia
        </h1>
        <div className="w-16 h-1 bg-brand mx-auto mb-6" />
        <p className="text-gray-600 mb-3">
          Halaman ini menampilkan data dari Supabase, dan kredensial Supabase belum diisi di
          proyek ini — jadi semua data masih kosong.
        </p>
        <p className="text-gray-600 mb-8 text-sm">
          Ikuti <span className="font-semibold text-ink">README bagian 4.0</span>: buat project
          Supabase gratis, jalankan file SQL di folder <code className="text-brand">supabase/</code>{' '}
          di SQL Editor, lalu isi <code className="text-brand">.env.local</code>. Seluruh halaman
          akan langsung tampil berisi data.
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
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-3 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className="fas fa-envelope mr-2" />
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  )
}
