import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { getServiceAreas, stripHtml } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Area Layanan',
  description:
    'Kami melayani berbagai wilayah di seluruh Indonesia dengan jaringan logistik luas untuk proyek konstruksi, pertambangan, dan industri.',
}

const BENEFITS = [
  {
    icon: 'fa-truck',
    title: 'Logistik Nasional',
    text: 'Jaringan logistik yang luas memungkinkan kami mengirim alat ke seluruh pelosok Indonesia.',
  },
  {
    icon: 'fa-headset',
    title: 'Dukungan 24/7',
    text: 'Tim dukungan pelanggan siap membantu Anda kapan pun diperlukan.',
  },
  {
    icon: 'fa-tools',
    title: 'Layanan Darurat',
    text: 'Layanan perbaikan darurat tersedia untuk meminimalkan downtime proyek Anda.',
  },
]

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas()

  return (
    <>
      <PageHero
        title="Area Layanan"
        subtitle="Kami melayani berbagai wilayah di seluruh Indonesia."
        backgroundImage="https://images.unsplash.com/photo-1590650151155-1b4e6d0c1f5f?w=1920&q=80"
        size="sm"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
              Peta <span className="text-brand">Cakupan</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wilayah operasional kami mencakup kota-kota besar dan daerah industri di seluruh
              Indonesia.
            </p>
          </div>

          {areas.length > 0 && (
            <>
              <div className="bg-surface rounded-2xl p-6 sm:p-10 mb-12 sm:mb-14">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <i className="fas fa-map-marker-alt text-xl sm:text-2xl text-brand mb-2" />
                      <h3 className="font-bold text-sm sm:text-base text-ink">{area.name}</h3>
                      {area.description && (
                        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2">
                          {stripHtml(area.description, 60)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                  Detail <span className="text-brand">Area</span>
                </h2>
                <div className="w-16 h-1 bg-brand mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    className="bg-surface p-6 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <i className="fas fa-map-pin text-brand mr-3" />
                      <h3 className="font-bold text-ink">{area.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {area.description ??
                        'Kami melayani penyewaan alat berat di wilayah ini dengan berbagai pilihan alat dan layanan pendukung.'}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 sm:p-8 rounded-2xl text-center shadow-sm">
                <i className={`fas ${benefit.icon} text-3xl sm:text-4xl text-brand mb-4`} />
                <h3 className="text-base sm:text-lg font-bold text-ink mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Apakah Area Anda Belum Terdaftar?
          </h2>
          <p className="text-gray-300 mb-8">
            Hubungi kami untuk informasi ketersediaan layanan di wilayah Anda.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className="fas fa-phone-alt mr-2" />
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  )
}