import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import {
  FALLBACK,
  formatDate,
  getPostCount,
  getPublishedPosts,
  resolveImage,
  stripHtml,
  toStringArray,
} from '@/lib/queries'
import { toPage, toParam } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Informasi dan tips seputar alat berat, konstruksi, pertambangan, dan industri dari AlatBerat.',
}

const PER_PAGE = 9

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const params = await searchParams
  const search = toParam(params.search)
  const tag = toParam(params.tag)
  const page = toPage(params.page)

  const [posts, total] = await Promise.all([
    getPublishedPosts({ search, tag, page, perPage: PER_PAGE }),
    getPostCount({ search, tag }),
  ])

  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE))
  const query: Record<string, string> = {}
  if (search) query.search = search
  if (tag) query.tag = tag

  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Informasi dan tips seputar alat berat dan industri konstruksi."
        backgroundImage="https://bctn.co.id/uploads/bctn/231205qW7TjaecvM9XUQz4npo1kgsELH6lJutZ8rGixdPmwSyhIOb0AY2BDC3FRNVf.jpg"
        size="sm"
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pencarian */}
          <div className="mb-10">
            <form action="/blog" method="GET" className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Cari artikel..."
                  className="w-full pl-12 pr-6 py-4 bg-surface border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Cari artikel"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                >
                  <i className="fas fa-search text-lg" />
                </button>
              </div>
            </form>

            {tag && (
              <p className="max-w-xl mx-auto mt-4 text-sm text-gray-500">
                Menampilkan artikel berlabel{' '}
                <Link
                  href="/blog"
                  className="inline-flex items-center bg-brand text-ink px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-400"
                >
                  {tag}
                  <i className="fas fa-times ml-1.5" />
                </Link>
              </p>
            )}
          </div>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {posts.map((post) => {
                  const tags = toStringArray(post.tags)

                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={resolveImage(post.image, FALLBACK.blog)}
                          alt={post.title}
                          width={600}
                          height={340}
                          unoptimized
                          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {tags.length > 0 && (
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-brand text-ink text-xs font-semibold rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-5 sm:p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                          <span>
                            <i className="far fa-user mr-1" />
                            {post.author}
                          </span>
                          <span>
                            <i className="far fa-calendar mr-1" />
                            {formatDate(post.published_at ?? post.created_at)}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-ink mb-3 group-hover:text-brand transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {stripHtml(post.excerpt ?? post.body, 150)}
                        </p>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-brand font-medium hover:text-yellow-500 transition-colors text-sm"
                        >
                          Baca Selengkapnya <i className="fas fa-arrow-right ml-2" />
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              <Pagination page={page} lastPage={lastPage} basePath="/blog" query={query} />
            </>
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-newspaper text-5xl sm:text-6xl text-gray-300 mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Tidak Ada Artikel</h2>
              <p className="text-gray-500">
                {search
                  ? 'Tidak ada artikel yang cocok dengan pencarian Anda.'
                  : 'Belum ada artikel yang dipublikasikan.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}