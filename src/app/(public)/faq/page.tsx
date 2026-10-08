import type { Metadata } from 'next'
import Link from 'next/link'

import { FaqAccordion } from '@/components/faq-accordion'
import { PageHero } from '@/components/page-hero'
import { getFaqs } from '@/lib/queries'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pertanyaan Umum',
  description:
    'Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan penyewaan alat berat kami.',
}

/** Dipakai hanya bila tabel `faqs` masih kosong, sama seperti fallback di Blade. */
const FALLBACK_FAQS = [
  {
    id: -1,
    question: 'Bagaimana cara menyewa alat berat?',
    answer:
      'Anda dapat menghubungi kami melalui telepon, WhatsApp, email, atau mengisi form kontak di website kami. Tim kami akan membantu Anda memilih alat yang sesuai dengan kebutuhan proyek Anda.',
    category: 'Umum',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: -2,
    question: 'Berapa lama minimal sewa alat berat?',
    answer:
      'Minimal sewa alat berat adalah 1 hari (24 jam) untuk sebagian besar alat. Untuk proyek jangka panjang, kami menyediakan paket khusus dengan harga lebih kompetitif.',
    category: 'Penyewaan',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: -3,
    question: 'Bagaimana cara pembayaran?',
    answer:
      'Kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BNI, BRI) dan dapat diatur sesuai kesepakatan bersama.',
    category: 'Pembayaran',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: -4,
    question: 'Berapa lama waktu pengiriman alat?',
    answer:
      'Waktu pengiriman tergantung lokasi proyek. Untuk wilayah Jabodetabek, pengiriman biasanya 1-2 hari kerja. Untuk luar pulau, diperlukan waktu 3-7 hari kerja.',
    category: 'Pengiriman',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

export default async function FaqPage() {
  const faqs = await getFaqs()
  const items = faqs.length > 0 ? faqs : FALLBACK_FAQS

  return (
    <>
      <PageHero
        title="Pertanyaan Umum"
        subtitle="Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan kami."
        backgroundImage="/images/hero-faq.jpg"
        size="sm"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion faqs={items} />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">Tidak Menemukan Jawaban?</h2>
          <p className="text-gray-600 mb-8">
            Tim kami siap membantu menjawab pertanyaan Anda secara langsung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <i className="fas fa-paper-plane mr-2" />
              Hubungi Kami
            </Link>
            {SITE.whatsapp && (
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}