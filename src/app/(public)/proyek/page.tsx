import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import {
  FALLBACK,
  formatDate,
  getProjectCount,
  getProjects,
  ucfirst,
} from '@/lib/queries'
import { toPage, toParam } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Proyek Kami',
  description:
    'Portofolio proyek yang telah kami selesaikan dengan sukses di sektor konstruksi, pertambangan, infrastruktur, industri, dan kelautan.',
}

const CATEGORIES = [
  { value: '', label: 'Semua' },
  { value: 'konstruksi', label: 'Konstruksi' },
  { value: 'pertambangan', label: 'Pertambangan' },
  { value: 'infrastruktur', label: 'Infrastruktur' },
  { value: 'industri', label: 'Industri' },
  { value: 'kelautan', label: 'Kelautan' },
] as const

const PER_PAGE = 9

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProjectsIndexPage({ searchParams }: Props) {
  const params = await searchParams
  const category = toParam(params.category)
  const page = toPage(params.page)

  const [projects, total] = await Promise.all([
    getProjects({ category: category || undefined, page, perPage: PER_PAGE }),
    getProjectCount(category || undefined),
  ])

  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE))
  const query: Record<string, string> = category ? { category } : {}

  return (
    <>
      <PageHero
        title="Proyek Kami"
        subtitle="Portofolio proyek yang telah kami selesaikan dengan sukses di berbagai sektor."
        backgroundImage="https://sumitomokenki-asean.com/wp-content/uploads/2019/04/SH210-6-Coal-Mining-1-1024x576.jpg"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter kategori */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-14">
            {CATEGORIES.map((item) => {
              const active = category === item.value
              return (
                <Link
                  key={item.value || 'all'}
                  href={item.value ? `/proyek?category=${item.value}` : '/proyek'}
                  aria-current={active ? 'page' : undefined}
                  className={`px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand text-ink'
                      : 'bg-surface text-gray-600 hover:bg-brand hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/proyek/${project.slug}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.image || FALLBACK.project}
                        alt={project.title}
                        width={600}
                        height={340}
                        unoptimized
                        className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      {project.category && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                          <span className="text-white text-sm font-medium">
                            {ucfirst(project.category)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-sm sm:text-lg font-bold text-ink mb-4">{project.title}</h2>
                      <div className="space-y-3 mb-5">
                        {project.client && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            <i className="fas fa-user mr-2 text-brand" />
                            {project.client}
                          </p>
                        )}
                        {project.location && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-2 text-brand" />
                            {project.location}
                          </p>
                        )}
                        {project.start_date && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            <i className="fas fa-calendar mr-2 text-brand" />
                            {formatDate(project.start_date)}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center text-brand font-medium group-hover:text-yellow-500 transition-colors text-xs sm:text-sm">
                        Lihat Detail <i className="fas fa-arrow-right ml-2" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Pagination page={page} lastPage={lastPage} basePath="/proyek" query={query} />
            </>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <i className="fas fa-folder-open text-5xl sm:text-6xl text-gray-300 mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Belum Ada Proyek</h2>
              <p className="text-sm sm:text-base text-gray-500">
                Portofolio proyek akan segera diperbarui.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Punya Proyek?</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-8 sm:mb-10">
            Kami siap mendukung keberhasilan proyek Anda dengan alat berat berkualitas dan tim
            profesional.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-all"
          >
            <i className="fas fa-phone-alt mr-2" />
            Diskusikan Proyek Anda
          </Link>
        </div>
      </section>
    </>
  )
}
