'use client'

import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/motion'
import { formatRupiah, STATUS_COLOR, STATUS_LABEL } from '@/lib/site'
import type { EquipmentWithCategory } from '@/lib/supabase/types'

export function EquipmentCard({
  item,
  fallback = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
}: {
  item: EquipmentWithCategory
  fallback?: string
}) {
  return (
    <FadeIn className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden">
        <Image
          src={item.image || fallback}
          alt={item.name}
          width={400}
          height={208}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
              STATUS_COLOR[item.status] ?? 'bg-gray-500'
            }`}
          >
            {STATUS_LABEL[item.status] ?? item.status}
          </span>
        </div>
      </div>
      <div className="p-5">
        <span className="text-xs text-brand font-semibold uppercase tracking-wider">
          {item.category?.name ?? ''}
        </span>
        <h3 className="text-lg font-bold text-ink mt-1 mb-2">{item.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <i className="fas fa-tag mr-1" />
          {item.brand}
          <span className="mx-2">|</span>
          <i className="fas fa-cubes mr-1" />
          {item.available_units}/{item.total_units} unit
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand">
            {formatRupiah(item.price)}
            {item.price_unit ?? '/hari'}
          </span>
          <Link
            href={`/katalog-alat/${item.slug}`}
            className="text-sm text-ink hover:text-brand font-medium transition-colors"
          >
            Detail <i className="fas fa-arrow-right ml-1" />
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}
