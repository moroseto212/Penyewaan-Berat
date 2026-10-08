import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { getServices } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Layanan',
  description:
    'Solusi lengkap untuk kebutuhan alat berat Anda: penyewaan, perawatan dan perbaikan, serta logistik dan mobilisasi di seluruh Indonesia.',
}

const ADVANTAGES = [
  {
    title: 'Armada Terlengkap',
    text: 'Lebih dari 500 unit alat berat siap pakai untuk berbagai kebutuhan.',
  },
  {
    title: 'Operator Profesional',
    text: 'Tim operator berpengalaman dan bersertifikat untuk setiap proyek.',
  },
  {
    title: 'Perawatan Rutin',
    text: 'Setiap alat menjalani perawatan berkala untuk performa optimal.',
  },
  {
    title: 'Harga Kompetitif',
    text: 'Penawaran harga terbaik dengan berbagai pilihan paket sewa.',
  },
  {
    title: 'Cakupan Nasional',
    text: 'Melayani proyek di seluruh Indonesia dengan jaringan logistik luas.',
  },
]

export default async function ServicesIndexPage() {
  const services = await getServices()

  return (
    <>
      <PageHero
        title="Layanan Kami"
        subtitle="Solusi lengkap untuk kebutuhan alat berat Anda, dari penyewaan hingga perawatan."
        backgroundImage="https://sumitomokenki-asean.com/wp-content/uploads/2023/07/banjarmasin_phot1_DSC2818-1024x722.jpg"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group p-6 sm:p-10 bg-surface rounded-2xl hover:bg-ink transition-all duration-300"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                    <i className={`${service.icon ?? 'fas fa-cogs'} text-xl sm:text-2xl text-ink`} />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-ink mb-3 group-hover:text-white transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-300 transition-colors mb-4">
                    {(service.description ?? '').slice(0, 150)}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-brand">
                    Selengkapnya <i className="fas fa-arrow-right ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <i className="fas fa-cogs text-5xl sm:text-6xl text-gray-300 mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Belum Ada Layanan</h2>
              <p className="text-sm sm:text-base text-gray-500">
                Informasi layanan akan segera tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-6">
                Mengapa Memilih <span className="text-brand">Kami?</span>
              </h2>
              <div className="w-16 h-1 bg-brand mb-6" />
              <ul className="space-y-4 sm:space-y-5">
                {ADVANTAGES.map((advantage) => (
                  <li key={advantage.title} className="flex items-start">
                    <i className="fas fa-check-circle text-brand mt-1 mr-3 sm:mr-4 text-lg sm:text-xl shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-ink">{advantage.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{advantage.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"
              alt="Mengapa memilih AlatBerat"
              width={600}
              height={600}
              className="rounded-2xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Butuh Bantuan?</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            Tim kami siap membantu Anda memilih layanan yang tepat untuk proyek Anda.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-brand text-ink font-semibold rounded-xl hover:bg-yellow-400 transition-all"
          >
            <i className="fas fa-phone-alt mr-2" />
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  )
}