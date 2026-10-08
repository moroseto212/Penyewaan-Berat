import type { Metadata } from 'next'
import Link from 'next/link'

import { EquipmentCard } from '@/components/equipment-card'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { toPage, toParam } from '@/lib/site'
import { getCategories, getEquipmentList } from '@/lib/queries'
import type { EquipmentSort } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Katalog Alat Berat',
  description:
    'Temukan alat berat yang sesuai dengan kebutuhan proyek Anda: excavator, bulldozer, dump truck, crane, forklift, dan lainnya. Tersedia untuk disewa dengan harga terbaik.',
}

const SORTS: { value: EquipmentSort; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'termurah', label: 'Harga Termurah' },
  { value: 'termahal', label: 'Harga Termahal' },
  { value: 'nama-asc', label: 'Nama A-Z' },
  { value: 'nama-desc', label: 'Nama Z-A' },
]

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'available', label: 'Tersedia' },
  { value: 'rented', label: 'Disewa' },
  { value: 'maintenance', label: 'Dalam Perawatan' },
]

const PER_PAGE = 12

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EquipmentIndexPage({ searchParams }: Props) {
  const params = await searchParams
  const search = toParam(params.search)
  const category = toParam(params.category)
  const status = toParam(params.status)
  const sortParam = toParam(params.sort)
  const page = toPage(params.page)

  const sort = SORTS.find((item) => item.value === sortParam)?.value ?? 'terbaru'

  const [categories, result] = await Promise.all([
    getCategories(),
    getEquipmentList({ search, category, status, sort, page, perPage: PER_PAGE }),
  ])

  const query: Record<string, string> = {}
  if (search) query.search = search
  if (category) query.category = category
  if (status) query.status = status
  if (sort !== 'terbaru') query.sort = sort

  return (
    <>
      <PageHero
        title="Katalog Alat Berat"
        subtitle="Temukan alat berat yang sesuai dengan kebutuhan proyek Anda."
        backgroundImage="https://sefasgroup.com/upload/blogs/blog_image_14122023_9588.jpeg"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10">
            {/* Filter sidebar */}
            <aside className="lg:w-60 shrink-0">
              <div className="bg-surface rounded-2xl p-3 sm:p-4 sticky top-28">
                <h2 className="text-base font-bold text-ink mb-2.5">
                  <i className="fas fa-filter mr-2 text-brand" />
                  Filter
                </h2>

                <form action="/katalog-alat" method="GET">
                  <div className="mb-3">
                    <label htmlFor="filter-search" className="block text-sm font-medium text-ink mb-1.5">
                      Cari
                    </label>
                    <div className="relative">
                      <input
                        id="filter-search"
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Nama alat..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                      />
                      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="filter-category"
                      className="block text-sm font-medium text-ink mb-1.5"
                    >
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        id="filter-category"
                        name="category"
                        defaultValue={category}
                        className="w-full px-4 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                      >
                        <option value="">Semua Kategori</option>
                        {categories.map((item) => (
                          <option key={item.id} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                    </div>
                  </div>

                  <fieldset className="mb-3">
                    <legend className="block text-sm font-medium text-ink mb-1.5">Status</legend>
                    <div className="flex flex-wrap gap-1.5">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value=""
                          defaultChecked={!status}
                          className="peer sr-only"
                        />
                        <span className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 transition-all hover:border-brand peer-checked:bg-brand peer-checked:text-ink peer-checked:border-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
                          Semua
                        </span>
                      </label>
                      {STATUS_OPTIONS.map((option) => (
                        <label key={option.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={option.value}
                            defaultChecked={status === option.value}
                            className="peer sr-only"
                          />
                          <span className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 transition-all hover:border-brand peer-checked:bg-brand peer-checked:text-ink peer-checked:border-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mb-3">
                    <label htmlFor="filter-sort" className="block text-sm font-medium text-ink mb-1.5">
                      Urutkan
                    </label>
                    <div className="relative">
                      <select
                        id="filter-sort"
                        name="sort"
                        defaultValue={sort}
                        className="w-full px-4 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                      >
                        {SORTS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-2 bg-brand text-ink text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-all"
                  >
                    <i className="fas fa-search mr-2" />
                    Terapkan Filter
                  </button>

                  <Link
                    href="/katalog-alat"
                    className="block w-full text-center mt-1.5 px-6 py-2 bg-white border border-gray-200 text-sm text-gray-500 font-medium rounded-lg hover:bg-gray-50 hover:text-brand transition-all"
                  >
                    <i className="fas fa-undo mr-1" />
                    Reset Filter
                  </Link>
                </form>
              </div>
            </aside>

            {/* Hasil */}
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-6" aria-live="polite">
                Menampilkan <span className="font-semibold text-ink">{result.total}</span> alat berat
              </p>

              {result.items.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {result.items.map((item) => (
                      <EquipmentCard key={item.id} item={item} />
                    ))}
                  </div>

                  <Pagination
                    page={result.page}
                    lastPage={result.lastPage}
                    basePath="/katalog-alat"
                    query={query}
                  />
                </>
              ) : (
                <div className="text-center py-12 sm:py-20">
                  <i className="fas fa-search text-5xl sm:text-6xl text-gray-300 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">
                    Tidak Ada Alat Ditemukan
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">
                    Coba ubah filter atau kata kunci pencarian Anda.
                  </p>
                  <Link
                    href="/katalog-alat"
                    className="inline-flex items-center px-6 py-3 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <i className="fas fa-undo mr-2" />
                    Reset Filter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}