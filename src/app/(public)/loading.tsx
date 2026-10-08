'use client'

import { usePathname } from 'next/navigation'

import { DetailSkeleton, HomeSkeleton, ListSkeleton } from '@/components/skeleton'

/**
 * Skeleton untuk seluruh rute di bawah `(public)`.
 * Varian dipilih dari path saat ini supaya bentuknya menyerupai halaman
 * yang sedang dimuat (beranda / daftar / detail).
 */
export default function PublicLoading() {
  const pathname = usePathname()

  if (pathname === '/') return <HomeSkeleton />

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length >= 2) return <DetailSkeleton />

  if (pathname === '/katalog-alat') return <ListSkeleton sidebar />

  return <ListSkeleton />
}
