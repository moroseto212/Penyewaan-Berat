import Link from 'next/link'

import { BlogCard, ProjectCard, ServiceCard, TestimonialStrip } from '@/components/cards'
import { EquipmentCard } from '@/components/equipment-card'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import {
  getFeaturedEquipment,
  getProjects,
  getPublishedPosts,
  getServices,
  getTestimonials,
} from '@/lib/queries'

const STATS = [
  { value: '15+', label: 'Tahun Pengalaman' },
  { value: '500+', label: 'Unit Alat Tersedia' },
  { value: '1000+', label: 'Proyek Selesai' },
  { value: '300+', label: 'Klien Terpercaya' },
]

export default async function HomePage() {
  const [equipment, services, projects, testimonials, posts] = await Promise.all([
    getFeaturedEquipment(4),
    getServices(),
    getProjects({ featured: true, limit: 3 }),
    getTestimonials(),
    getPublishedPosts({ limit: 3 }),
  ])

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-ink overflow-hidden"
        style={{
          backgroundImage:
            "url('https://psualatberat.com/wp-content/uploads/2024/09/10-Jenis-Alat-Berat-Konstruksi-Fungsi-dan-Gambarnya-Yuk-Pahami.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 to-ink/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-40">
          <div className="max-w-3xl">
            <FadeIn y={32}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Solusi Penyewaan Alat Berat Terpercaya untuk{' '}
                <span className="text-brand">Konstruksi, Pertambangan & Industri</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                Dengan armada alat berat terlengkap dan operator profesional, kami siap mendukung
                keberhasilan proyek Anda di seluruh Indonesia.
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/katalog-alat"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-lg"
                >
                  <i className="fas fa-search mr-2" />
                  Lihat Katalog Alat
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-ink transition-colors text-lg"
                >
                  <i className="fas fa-phone-alt mr-2" />
                  Hubungi Kami
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Statistik — Stagger jadi grid-nya langsung (jangan pakai display:contents,
          karena elemen tanpa kotak layout tidak pernah terpicu IntersectionObserver) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center p-5 sm:p-8 rounded-2xl bg-surface hover:shadow-lg transition-shadow h-full">
                  <div className="text-3xl sm:text-4xl font-bold text-brand mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-sm text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Alat unggulan */}
      {equipment.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Alat Berat Unggulan"
              subtitle="Temukan berbagai pilihan alat berat berkualitas tinggi untuk kebutuhan proyek Anda."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {equipment.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/katalog-alat"
                className="inline-flex items-center px-8 py-3 bg-ink text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lihat Semua Alat <i className="fas fa-arrow-right ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Layanan */}
      {services.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Layanan Kami"
              subtitle="Berbagai layanan lengkap untuk mendukung kebutuhan alat berat Anda."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proyek */}
      {projects.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Proyek Terbaru"
              subtitle="Beberapa proyek yang telah kami selesaikan dengan sukses."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/proyek"
                className="inline-flex items-center px-8 py-3 bg-ink text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lihat Semua Proyek <i className="fas fa-arrow-right ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      {testimonials.length > 0 && <TestimonialStrip testimonials={testimonials} />}

      {/* Artikel */}
      {posts.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Artikel Terbaru"
              subtitle="Informasi dan tips seputar alat berat dan industri konstruksi."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-3 bg-ink text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lihat Semua Artikel <i className="fas fa-arrow-right ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="relative py-24 bg-ink overflow-hidden"
        style={{
          backgroundImage: "url('https://lngrisk.co.id/wp-content/uploads/2024/12/excavator2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Proyek Anda?
            </h2>
            <p className="text-sm sm:text-lg text-white mb-10 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran harga terbaik
              untuk kebutuhan alat berat Anda.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-lg"
            >
              <i className="fas fa-paper-plane mr-2" />
              Hubungi Kami
            </Link>
            <Link
              href="/katalog-alat"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-lg"
            >
              <i className="fas fa-truck mr-2" />
              Lihat Armada
            </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
