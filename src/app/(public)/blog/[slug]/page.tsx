import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HtmlContent } from '@/components/html-content'
import { NotConfiguredNotice } from '@/components/not-configured-notice'
import {
  FALLBACK,
  formatDate,
  getPostBySlug,
  getRecentPosts,
  getRelatedPosts,
  resolveImage,
  stripHtml,
  toStringArray,
} from '@/lib/queries'
import { SITE } from '@/lib/site'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: isSupabaseConfigured ? 'Artikel Tidak Ditemukan' : 'Data Artikel Belum Tersedia',
    }
  }

  return {
    title: post.title,
    description: stripHtml(post.excerpt ?? post.body, 160) || post.title,
    openGraph: {
      title: post.title,
      description: stripHtml(post.excerpt ?? post.body, 160) || post.title,
      images: post.image ? [post.image] : undefined,
      type: 'article',
    },
  }
}

/** Kartu ringkasan artikel di sidebar. */
function PostSummary({ href, title, date, image }: { href: string; title: string; date: string; image: string }) {
  return (
    <Link href={href} className="flex items-start space-x-3 group">
      <Image
        src={image}
        alt={title}
        width={64}
        height={64}
        unoptimized
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />
      <div>
        <h4 className="text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
          {title}
        </h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </Link>
  )
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    if (!isSupabaseConfigured) return <NotConfiguredNotice resource="Artikel" />
    notFound()
  }

  const [recent, related] = await Promise.all([
    getRecentPosts(post.id, 5),
    getRelatedPosts(post, 3),
  ])

  const tags = toStringArray(post.tags)
  const currentUrl = `${SITE.url}/blog/${post.slug}`

  const shareLinks = [
    {
      label: 'Bagikan di Facebook',
      icon: 'fab fa-facebook-f',
      className: 'bg-blue-600 hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      label: 'Bagikan di X',
      icon: 'fab fa-twitter',
      className: 'bg-sky-400 hover:bg-sky-500',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`,
    },
    {
      label: 'Bagikan di WhatsApp',
      icon: 'fab fa-whatsapp',
      className: 'bg-green-500 hover:bg-green-600',
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${currentUrl}`)}`,
    },
    {
      label: 'Bagikan di LinkedIn',
      icon: 'fab fa-linkedin-in',
      className: 'bg-blue-700 hover:bg-blue-800',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`,
    },
  ]

  return (
    <>
      <section
        className="relative bg-ink py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590650151155-1b4e6d0c1f5f?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/70" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link href="/blog" className="text-gray-400 hover:text-brand transition-colors text-sm">
              <i className="fas fa-arrow-left mr-2" />
              Kembali ke Blog
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center text-gray-400 text-sm gap-x-6 gap-y-2">
            <span>
              <i className="far fa-user mr-2" />
              {post.author ?? 'Penulis'}
            </span>
            <span>
              <i className="far fa-calendar mr-2" />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
            {tags.length > 0 && (
              <span className="flex flex-wrap items-center">
                <i className="fas fa-tags mr-2" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-brand/20 text-brand px-2 py-0.5 rounded-full text-xs font-medium mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={450}
                  unoptimized
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-10 shadow-lg"
                />
              )}

              <article>
                <HtmlContent html={post.body ?? '<p>Konten artikel akan segera tersedia.</p>'} />
              </article>

              {tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink mr-2">Tags:</span>
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-4 py-2 bg-surface text-sm text-gray-600 rounded-full hover:bg-brand hover:text-ink transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="font-semibold text-ink mb-4">Bagikan Artikel:</h2>
                <div className="flex space-x-3">
                  {shareLinks.map((share) => (
                    <a
                      key={share.label}
                      href={share.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={share.label}
                      className={`w-10 h-10 ${share.className} text-white rounded-full flex items-center justify-center transition-colors`}
                    >
                      <i className={share.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <div className="sticky top-28 space-y-8">
                {recent.length > 0 && (
                  <div className="bg-surface rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-ink mb-5">
                      <i className="fas fa-clock mr-2 text-brand" />
                      Artikel Terbaru
                    </h2>
                    <div className="space-y-4">
                      {recent.map((item) => (
                        <PostSummary
                          key={item.id}
                          href={`/blog/${item.slug}`}
                          title={item.title}
                          date={formatDate(item.published_at ?? item.created_at)}
                          image={resolveImage(item.image, FALLBACK.blog)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {related.length > 0 && (
                  <div className="bg-surface rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-ink mb-5">
                      <i className="fas fa-link mr-2 text-brand" />
                      Artikel Terkait
                    </h2>
                    <div className="space-y-4">
                      {related.map((item) => (
                        <PostSummary
                          key={item.id}
                          href={`/blog/${item.slug}`}
                          title={item.title}
                          date={formatDate(item.published_at ?? item.created_at)}
                          image={resolveImage(item.image, FALLBACK.blog)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-ink rounded-2xl p-6 sm:p-8 text-center">
                  <i className="fas fa-envelope text-3xl sm:text-4xl text-brand mb-4" />
                  <h2 className="text-lg font-bold text-white mb-2">Hubungi Kami</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Konsultasi gratis untuk kebutuhan alat berat Anda.
                  </p>
                  <Link
                    href="/kontak"
                    className="inline-block px-6 py-3 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                  >
                    <i className="fas fa-phone-alt mr-2" />
                    Hubungi
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Artikel Menarik Lainnya</h2>
          <p className="text-gray-300 mb-8">Jelajahi artikel-artikel lainnya di blog kami.</p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className="fas fa-newspaper mr-2" />
            Lihat Semua Artikel
          </Link>
        </div>
      </section>
    </>
  )
}