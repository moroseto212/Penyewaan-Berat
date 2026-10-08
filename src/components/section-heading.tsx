'use client'

import { FadeIn } from '@/components/motion'

export function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <FadeIn className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-4">{title}</h2>
      <div className="w-20 h-1 bg-brand mx-auto mb-4" />
      {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </FadeIn>
  )
}
