import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { FALLBACK, getTestimonialCount, getTestimonials, resolveImage } from '@/lib/queries'
import { toPage } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Testimonial',
  description: 'Apa kata klien kami tentang layanan AlatBerat.',
}

const PER_PAGE = 9

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TestimonialsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)

  const [testimonials, total] = await Promise.all([
    getTestimonials({ page, perPage: PER_PAGE }),
    getTestimonialCount(),
  ])

  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <>
      <PageHero
        title="Testimonial"
        subtitle="Apa kata klien kami tentang layanan AlatBerat."
        backgroundImage="https://images.unsplash.com/photo-1580642797801-0ff274a105a2?w=1920&q=80"
        size="sm"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-surface rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-5">
                      <Image
                        src={resolveImage(testimonial.photo, FALLBACK.avatar)}
                        alt={testimonial.client_name}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-16 h-16 rounded-full object-cover border-2 border-brand"
                      />
                      <div className="ml-4">
                        <h2 className="font-bold text-ink">{testimonial.client_name}</h2>
                        <p className="text-sm text-gray-500">{testimonial.client_position}</p>
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex mb-4" aria-label={`Rating ${testimonial.rating} dari 5`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < testimonial.rating ? 'text-brand' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>
                ))}
              </div>

              <Pagination page={page} lastPage={lastPage} basePath="/testimoni" />
            </>
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-comment-dots text-5xl sm:text-6xl text-gray-300 mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Belum Ada Testimonial</h2>
              <p className="text-gray-500">Testimonial dari klien akan segera tersedia.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">Bagikan Pengalaman Anda</h2>
          <p className="text-gray-600 mb-8">
            Kami senang mendengar pengalaman Anda menggunakan layanan AlatBerat.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className="fas fa-pen mr-2" />
            Beri Testimonial
          </Link>
        </div>
      </section>
    </>
  )
}