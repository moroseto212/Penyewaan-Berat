'use client'

import Link from 'next/link'

import { FadeIn } from '@/components/motion'

type Props = {
  title: string
  subtitle?: string
  backgroundImage?: string
  children?: React.ReactNode
  /** Padding vertikal section, default `py-20 sm:py-28`. */
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'py-16 sm:py-24',
  md: 'py-20 sm:py-28',
  lg: 'py-24',
} as const

/** Hero gelap dengan gradient + aksen kuning, dipakai di semua halaman publik. */
export function PageHero({ title, subtitle, backgroundImage, children, size = 'md' }: Props) {
  return (
    <section
      className={`relative bg-ink ${SIZES[size]} bg-cover bg-center`}
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/70" />
      <FadeIn
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        y={16}
      >
        {children}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <div className="w-20 h-1 bg-brand mx-auto mb-4" />
        {subtitle && (
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </FadeIn>
    </section>
  )
}

/** Ajakan bertindak di bagian bawah halaman, tema gelap. */
export function CtaSection({
  title,
  text,
  primaryLabel = 'Hubungi Kami',
  primaryHref = '/kontak',
  primaryIcon = 'fas fa-phone-alt',
}: {
  title: string
  text: string
  primaryLabel?: string
  primaryHref?: string
  primaryIcon?: string
}) {
  return (
    <section className="py-16 bg-ink">
      <FadeIn className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-sm sm:text-base text-gray-300 mb-8">{text}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-ink font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <i className={`${primaryIcon} mr-2`} />
            {primaryLabel}
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
