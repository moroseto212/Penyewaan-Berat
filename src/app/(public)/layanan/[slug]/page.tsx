import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HtmlContent } from '@/components/html-content'
import { NotConfiguredNotice } from '@/components/not-configured-notice'
import { getRelatedServices, getServiceBySlug } from '@/lib/queries'
import { SITE } from '@/lib/site'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return {
      title: isSupabaseConfigured ? 'Layanan Tidak Ditemukan' : 'Data Layanan Belum Tersedia',
    }
  }

  return {
    title: service.title,
    description: service.description?.slice(0, 160) ?? `Informasi lengkap layanan ${service.title}.`,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    if (!isSupabaseConfigured) return <NotConfiguredNotice resource="Layanan" />
    notFound()
  }

  const related = await getRelatedServices(service.id, 3)

  return (
    <>
      <section
        className="relative bg-ink py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589939705384-1c6f4b4f1c0f?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link
              href="/layanan"
              className="text-gray-400 hover:text-brand transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2" />
              Kembali ke Layanan
            </Link>
          </nav>
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-2xl flex items-center justify-center mr-5 shrink-0">
              <i className={`${service.icon ?? 'fas fa-cogs'} text-xl sm:text-2xl text-ink`} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{service.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <HtmlContent
              html={
                service.body ??
                '<p>Detail layanan akan segera tersedia. Silakan hubungi kami untuk informasi lebih lanjut.</p>'
              }
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Layanan Lainnya</h2>
              <div className="w-16 h-1 bg-brand mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/layanan/${item.slug}`}
                  className="group p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mb-5 group-hover:bg-ink transition-colors">
                    <i
                      className={`${item.icon ?? 'fas fa-cogs'} text-xl text-ink group-hover:text-white transition-colors`}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{(item.description ?? '').slice(0, 100)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Tertarik dengan Layanan Ini?
          </h2>
          <p className="text-gray-300 mb-8">
            Hubungi kami untuk konsultasi gratis dan penawaran harga terbaik.
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