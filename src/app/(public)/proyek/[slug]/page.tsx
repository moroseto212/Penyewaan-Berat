import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HtmlContent } from '@/components/html-content'
import { NotConfiguredNotice } from '@/components/not-configured-notice'
import { ProjectCard } from '@/components/cards'
import {
  FALLBACK,
  formatDate,
  getProjectBySlug,
  getProjectImages,
  getRelatedProjects,
  resolveImage,
  ucfirst,
} from '@/lib/queries'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: isSupabaseConfigured ? 'Proyek Tidak Ditemukan' : 'Data Proyek Belum Tersedia',
    }
  }

  return {
    title: project.title,
    description: project.description?.slice(0, 160) ?? project.title,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    if (!isSupabaseConfigured) return <NotConfiguredNotice resource="Proyek" />
    notFound()
  }

  const [gallery, related] = await Promise.all([
    getProjectImages(project.id),
    getRelatedProjects(project.category, project.id, 3),
  ])

  const mainImage = resolveImage(
    project.image ?? gallery.find((image) => image.is_primary)?.image_path ?? gallery[0]?.image_path,
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
  )

  const equipment = (project.equipment_used ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const infoRows: [string, string][] = [
    ['Klien', project.client ?? '-'],
    ['Lokasi', project.location ?? '-'],
    ['Tanggal Mulai', formatDate(project.start_date)],
    ['Tanggal Selesai', formatDate(project.end_date)],
  ]
  if (project.category) infoRows.push(['Kategori', ucfirst(project.category)])

  return (
    <>
      <section
        className="relative bg-ink py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578996952310-7e65c40ca11a?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link
              href="/proyek"
              className="text-gray-400 hover:text-brand transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2" />
              Kembali ke Proyek
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {project.title}
          </h1>
          {project.category && (
            <span className="inline-block bg-brand text-ink px-4 py-1 rounded-full text-sm font-semibold">
              {ucfirst(project.category)}
            </span>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden mb-4">
                <Image
                  src={mainImage}
                  alt={project.title}
                  width={800}
                  height={520}
                  unoptimized
                  className="w-full h-64 sm:h-96 object-cover"
                />
              </div>

              {gallery.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {gallery.map((image, index) => (
                    <Image
                      key={image.id}
                      src={resolveImage(image.image_path, mainImage)}
                      alt={`Galeri ${project.title} - gambar ${index + 1}`}
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
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-4">Deskripsi Proyek</h2>
                <HtmlContent html={project.body ?? project.description ?? '<p>Detail proyek akan segera tersedia.</p>'} />
              </div>
            </div>

            <aside>
              <div className="bg-surface rounded-2xl p-6 sm:p-8 sticky top-28">
                <h2 className="text-lg sm:text-xl font-bold text-ink mb-6">Informasi Proyek</h2>
                <div className="space-y-5">
                  {infoRows.map(([label, value]) => (
                    <div key={label}>
                      <span className="text-sm text-gray-500 block">{label}</span>
                      <span className="font-semibold text-ink">{value}</span>
                    </div>
                  ))}

                  {equipment.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500 block">Alat yang Digunakan</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {equipment.map((name) => (
                          <span
                            key={name}
                            className="px-3 py-1 bg-white text-sm text-ink rounded-full border border-gray-200"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Proyek Terkait</h2>
              <div className="w-16 h-1 bg-brand mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} fallback={FALLBACK.project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Tertarik dengan Proyek Serupa?
          </h2>
          <p className="text-gray-300 mb-8">
            Hubungi kami untuk mendiskusikan kebutuhan proyek Anda.
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