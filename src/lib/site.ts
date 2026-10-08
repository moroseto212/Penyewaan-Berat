/**
 * Nomor WhatsApp dibaca dari env agar bisa diganti tanpa menyentuh kode.
 * Kosongkan `NEXT_PUBLIC_WHATSAPP_NUMBER` untuk menonaktifkan tombol WhatsApp
 * (versi Laravel asli juga tidak memiliki nomor yang terisi).
 */
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

export const SITE = {
  name: 'AlatBerat',
  title: 'AlatBerat - Solusi Penyewaan Alat Berat Terpercaya',
  description:
    'AlatBerat menyediakan layanan penyewaan alat berat untuk konstruksi, pertambangan, dan industri di seluruh Indonesia.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  whatsapp: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+62 800-0000-0000',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@alatberat.com',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Jl. Alat Berat No. 123, Jakarta Pusat, Indonesia',
  hours: process.env.NEXT_PUBLIC_CONTACT_HOURS ?? 'Senin - Sabtu: 08.00 - 17.00',
} as const

export type NavItem = { label: string; href: string; icon: string }

export const NAV_CATALOG: readonly NavItem[] = [
  { label: 'Semua Alat', href: '/katalog-alat', icon: 'fa-list' },
  { label: 'Excavator', href: '/katalog-alat?category=excavator', icon: 'fa-digging' },
  { label: 'Bulldozer', href: '/katalog-alat?category=bulldozer', icon: 'fa-tractor' },
  { label: 'Crane', href: '/katalog-alat?category=crane', icon: 'fa-truck-pickup' },
  { label: 'Dump Truck', href: '/katalog-alat?category=dump-truck', icon: 'fa-truck' },
  { label: 'Compactor', href: '/katalog-alat?category=compactor', icon: 'fa-road' },
]

export const NAV_SERVICES: readonly NavItem[] = [
  { label: 'Semua Layanan', href: '/layanan', icon: 'fa-cogs' },
  { label: 'Area Layanan', href: '/area-layanan', icon: 'fa-map-marked-alt' },
  { label: 'Penyewaan', href: '/layanan/penyewaan-alat-berat', icon: 'fa-calendar-check' },
  { label: 'Perawatan', href: '/layanan/perawatan-perbaikan', icon: 'fa-wrench' },
  { label: 'Transportasi', href: '/layanan/logistik-mobilisasi', icon: 'fa-truck-moving' },
]

export const STATUS_LABEL: Record<string, string> = {
  available: 'Tersedia',
  rented: 'Disewa',
  maintenance: 'Perawatan',
}

export const STATUS_COLOR: Record<string, string> = {
  available: 'bg-green-500',
  rented: 'bg-yellow-500',
  maintenance: 'bg-red-500',
}

export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `Rp ${Number(value).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  return []
}

export function toStringRecord(value: unknown): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, String(v)]),
    )
  }
  return {}
}

export function stripHtml(html: string | null | undefined, limit?: number): string {
  if (!html) return ''
  const text = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|h[1-6]|li|ul|ol|div)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!limit || text.length <= limit) return text
  return `${text.slice(0, limit).trimEnd()}...`
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/* ---------------------------------------------------------------- gambar */

export const FALLBACK = {
  equipment: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80',
  project: 'https://images.unsplash.com/photo-1541888946425-d81bb9a5c3d3?w=600&q=80',
  blog: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&q=80',
  category: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
} as const

/**
 * Gambar di database sudah berupa URL penuh (public URL Supabase Storage atau
 * URL eksternal), jadi tidak perlu fungsi `Storage::url()` seperti di Laravel.
 */
export function resolveImage(url: string | null | undefined, fallback: string): string {
  return url && url.trim() !== '' ? url : fallback
}

/** Judul kapitalisasi: "pertambangan" -> "Pertambangan". */
export function ucfirst(value: string | null | undefined): string {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Ambil nilai `page` dari searchParams dengan batas bawah 1. */
export function toPage(value: string | string[] | undefined): number {
  const parsed = Number.parseInt(Array.isArray(value) ? (value[0] ?? '1') : (value ?? '1'), 10)
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
}

/** Ambil satu nilai string dari searchParams. */
export function toParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return (value[0] ?? '').trim()
  return (value ?? '').trim()
}
