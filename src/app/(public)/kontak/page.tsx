import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { SITE } from '@/lib/site'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Kami siap mendengarkan kebutuhan Anda. Hubungi tim AlatBerat untuk penyewaan alat berat, penawaran harga, dan kerja sama.',
}

const CONTACT_ITEMS = [
  {
    icon: 'fa-map-marker-alt',
    title: 'Alamat',
    lines: [SITE.address],
  },
  {
    icon: 'fa-phone-alt',
    title: 'Telepon',
    lines: [SITE.phone],
  },
  {
    icon: 'fa-envelope',
    title: 'Email',
    lines: [SITE.email],
  },
  {
    icon: 'fa-clock',
    title: 'Jam Kerja',
    lines: [SITE.hours, 'Minggu & Hari Libur: Tutup'],
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Hubungi Kami"
        subtitle="Kami siap mendengarkan kebutuhan Anda. Silakan hubungi tim kami."
        backgroundImage="https://cdn.8mediatech.com/gambar/42260198964-mulai_2027_kepatuhan_pajak_jadi_syarat_ajukan_rkab_tambang.jpeg"
        size="sm"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
                Kirim <span className="text-brand">Pesan</span>
              </h2>
              <div className="w-16 h-1 bg-brand mb-8" />
              <ContactForm />
            </div>

            <aside>
              <div className="bg-surface rounded-2xl p-6 sm:p-8 sticky top-28">
                <h2 className="text-xl font-bold text-ink mb-8">Informasi Kontak</h2>

                <div className="space-y-6">
                  {CONTACT_ITEMS.map((item) => (
                    <div key={item.title} className="flex items-start">
                      <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shrink-0">
                        <i className={`fas ${item.icon} text-ink`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-ink">{item.title}</h3>
                        {item.lines.map((line) => (
                          <p key={line} className="text-sm text-gray-600">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {SITE.whatsapp && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Link
                      href="/faq"
                      className="inline-flex items-center text-brand font-medium hover:text-yellow-500 transition-colors text-sm"
                    >
                      <i className="fas fa-question-circle mr-2" />
                      Lihat pertanyaan umum
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="h-80 sm:h-96 w-full">
          <iframe
            title="Peta lokasi AlatBerat"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.389551785749!2d106.827734!3d-6.208763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1f1f1f1f1%3A0x0!2sJakarta+Pusat!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {SITE.whatsapp && (
        <section className="py-16 bg-ink">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Butuh Respon Cepat?</h2>
            <p className="text-gray-300 mb-8">
              Hubungi kami langsung melalui WhatsApp untuk respon yang lebih cepat.
            </p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <i className="fab fa-whatsapp mr-2" />
              Chat WhatsApp
            </a>
          </div>
        </section>
      )}
    </>
  )
}
