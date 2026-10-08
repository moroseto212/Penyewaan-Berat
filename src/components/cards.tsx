'use client'

import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/motion'
import type { BlogPost, Project, Service, Testimonial } from '@/lib/supabase/types'

export function ProjectCard({
  project,
  fallback = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80',
}: {
  project: Project
  fallback?: string
}) {
  return (
    <FadeIn className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden">
        <Image
          src={project.image || fallback}
          alt={project.title}
          width={600}
          height={336}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-ink mb-2">{project.title}</h3>
        {project.client && (
          <p className="text-sm text-gray-500 mb-1">
            <i className="fas fa-user mr-2" />
            {project.client}
          </p>
        )}
        {project.location && (
          <p className="text-sm text-gray-500 mb-4">
            <i className="fas fa-map-marker-alt mr-2" />
            {project.location}
          </p>
        )}
        <Link
          href={`/proyek/${project.slug}`}
          className="text-brand font-medium hover:text-brand-dark transition-colors text-sm"
        >
          Lihat Detail <i className="fas fa-arrow-right ml-1" />
        </Link>
      </div>
    </FadeIn>
  )
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <FadeIn>
      <Link
        href={`/layanan/${service.slug}`}
        className="group p-8 bg-surface rounded-2xl hover:bg-ink transition-all duration-300 h-full block"
      >
        <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
          <i className={`${service.icon ?? 'fas fa-cogs'} text-2xl text-ink`} />
        </div>
        <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-white transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 group-hover:text-gray-300 transition-colors">
          {service.description?.slice(0, 120)}
        </p>
      </Link>
    </FadeIn>
  )
}

export function TestimonialStrip({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const items = [...testimonials, ...testimonials]

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">
            Apa Kata Klien Kami
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Testimoni dari klien yang telah mempercayakan proyeknya kepada kami.
          </p>
        </FadeIn>
      </div>
      <div className="relative">
        <div
          className="flex track-marquee gap-4 w-max px-4"
          style={{ animationDuration: `${testimonials.length * 6}s` }}
        >
          {items.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="w-56 flex-shrink-0">
              <div className="bg-surface p-4 rounded-xl text-center h-full border border-gray-100">
                <div className="text-left mb-2">
                  <h4 className="font-semibold text-ink text-xs">{testimonial.client_name}</h4>
                  <p className="text-[10px] text-gray-500">{testimonial.company}</p>
                </div>
                <div className="flex justify-start mb-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < testimonial.rating ? 'text-brand' : 'text-gray-300'}`}
                      style={{ fontSize: 10 }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic text-xs leading-relaxed text-left">
                  &quot;{testimonial.content.slice(0, 100)}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogCard({
  post,
  fallback = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
}: {
  post: BlogPost
  fallback?: string
}) {
  return (
    <FadeIn className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden">
        <Image
          src={post.image || fallback}
          alt={post.title}
          width={600}
          height={288}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
          <span>
            <i className="far fa-user mr-1" />
            {post.author}
          </span>
          <span>
            <i className="far fa-calendar mr-1" />
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '-'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{(post.excerpt ?? '').slice(0, 120)}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-brand font-medium hover:text-brand-dark transition-colors text-sm"
        >
          Baca Selengkapnya <i className="fas fa-arrow-right ml-1" />
        </Link>
      </div>
    </FadeIn>
  )
}
