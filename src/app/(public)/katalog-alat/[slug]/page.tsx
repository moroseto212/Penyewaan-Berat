import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EquipmentCard } from '@/components/equipment-card'
import { NotConfiguredNotice } from '@/components/not-configured-notice'
import {
  FALLBACK,
  formatRupiah,
  getEquipmentBySlug,
  getEquipmentImages,
  getRelatedEquipment,
  resolveImage,
  toStringRecord,
} from '@/lib/queries'
import { SITE } from '@/lib/site'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getEquipmentBySlug(slug)

  if (!item) {
    return {
      title: isSupabaseConfigured ? 'Alat Tidak Ditemukan' : 'Data Alat Belum Tersedia',
    }
  }

  return {
    title: item.name,
    description:
      item.description?.slice(0, 160) ??
      `Sewa ${item.name}${item.brand ? ` (${item.brand})` : ''} bersama AlatBerat. Ketersediaan dan harga terbaik.`,
  }
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { slug } = await params
  const item = await getEquipmentBySlug(slug)

  if (!item) {
    if (!isSupabaseConfigured) return <NotConfiguredNotice resource="Alat" />
    notFound()
  }

  const [gallery, related] = await Promise.all([
    getEquipmentImages(item.id),
    item.category_id
      ? getRelatedEquipment(item.category_id, item.id, 4)
      : Promise.resolve([]),
  ])

  const specs = toStringRecord(item.specifications)
  const mainImage = resolveImage(
    item.image ?? gallery.find((image) => image.is_primary)?.image_path ?? gallery[0]?.image_path,
    'https://images.unsplash.com/photo-1590650151155-1b4e6d0c1f5f?w=800&q=80',
  )
  const thumbnails = gallery.length > 0 ? gallery : []
  const price = item.price ?? 0

  const whatsappText = encodeURIComponent(
    `Halo AlatBerat, saya tertarik menyewa ${item.name} (${item.brand ?? '-'}). Mohon informasi ketersediaan dan harga.`,
  )

  const specRows: [string, string][] = [
    ['Merek', item.brand ?? '-'],
    ['Model', item.model ?? '-'],
    ['Tahun', item.year ? String(item.year) : '-'],
    ['Kapasitas', item.capacity ?? '-'],
    ['Total Unit', `${item.total_units} unit`],
    ['Unit Tersedia', `${item.available_units} unit`],
  ]

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-ink py-24 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link
              href="/katalog-alat"
              className="text-gray-400 hover:text-brand transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2" />
              Kembali ke Katalog
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{item.name}</h1>
          <div className="flex flex-wrap items-center text-gray-300 gap-4">
            <span className="bg-brand text-ink px-3 py-1 rounded-full text-sm font-semibold">
              {item.category?.name ?? 'Alat Berat'}
            </span>
            {item.brand && (
              <span className="text-sm">
                <i className="fas fa-tag mr-1" />
                {item.brand}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <Image
                  src={mainImage}
                  alt={item.name}
                  width={800}
                  height={520}
                  unoptimized
                  className="w-full h-64 sm:h-96 object-cover"
                />
              </div>

              {thumbnails.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {thumbnails.map((image, index) => (
                    <Image
                      key={image.id}
                      src={resolveImage(image.image_path, mainImage)}
                      alt={`${item.name} - gambar ${index + 1}`}
                      width={96}
                      height={80}
                      unoptimized
                      className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                        index === 0 ? 'border-brand' : 'border-transparent hover:border-brand'
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="mt-10">
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-4">Deskripsi</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description ??
                    'Deskripsi alat berat ini akan ditampilkan di sini. Silakan hubungi kami untuk informasi lebih lanjut tentang spesifikasi dan ketersediaan alat.'}
                </p>
              </div>

              <div className="mt-10">
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6">Spesifikasi</h2>
                <div className="bg-surface rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {specRows.map(([label, value], index) => (
                        <tr key={label} className={index % 2 === 0 ? 'bg-white' : 'bg-surface'}>
                          <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-500 w-1/3">
                            {label}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-ink">{value}</td>
                        </tr>
                      ))}
                      {Object.entries(specs).map(([label, value]) => (
                        <tr key={label} className="bg-white">
                          <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-500 w-1/3">
                            {label}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-ink">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar booking */}
            <aside>
              <div className="bg-surface rounded-2xl p-6 sm:p-8 sticky top-28">
                <div className="text-center mb-6">
                  <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-gray-500 text-white">
                    {item.status === 'available'
                      ? 'Tersedia'
                      : item.status === 'rented'
                        ? 'Disewa'
                        : item.status === 'maintenance'
                          ? 'Dalam Perawatan'
                          : item.status}
                  </span>
                </div>

                <div className="mb-6 p-4 bg-white rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Unit</span>
                    <span className="font-bold text-ink">{item.total_units} unit</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Unit Tersedia</span>
                    <span
                      className={`font-bold ${item.available_units > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {item.available_units} unit
                    </span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500">Harga Sewa</span>
                  <div className="text-2xl sm:text-3xl font-bold text-brand break-words">
                    {formatRupiah(price)}
                  </div>
                  <span className="text-sm text-gray-500">{item.price_unit ?? 'per hari'}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sewa Mingguan</span>
                    <span className="font-semibold text-ink">{formatRupiah(price * 6)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sewa Bulanan</span>
                    <span className="font-semibold text-ink">{formatRupiah(price * 22)}</span>
                  </div>
                </div>

                <Link
                  href="/kontak"
                  className="block w-full text-center px-6 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors mb-3"
                >
                  <i className="fas fa-paper-plane mr-2" />
                  Sewa Sekarang
                </Link>
                {SITE.whatsapp && (
                  <a
                    href={`${SITE.whatsapp}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <i className="fab fa-whatsapp mr-2" />
                    Hubungi via WhatsApp
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Alat Terkait</h2>
              <div className="w-16 h-1 bg-brand mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((relatedItem) => (
                <EquipmentCard
                  key={relatedItem.id}
                  item={relatedItem}
                  fallback={FALLBACK.equipment}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Tertarik dengan Alat Ini?</h2>
          <p className="text-gray-300 mb-8">
            Hubungi tim kami untuk konsultasi dan penawaran harga terbaik.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className="fas fa-phone-alt mr-2" />
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  )
}