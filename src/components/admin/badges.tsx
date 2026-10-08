import { Badge } from './form-controls'

const STATUS: Record<string, { label: string; tone: 'green' | 'blue' | 'yellow' }> = {
  available: { label: 'Tersedia', tone: 'green' },
  rented: { label: 'Disewa', tone: 'blue' },
  maintenance: { label: 'Maintenance', tone: 'yellow' },
}

/** Badge status alat berat. */
export function StatusBadge({ status }: { status: string }) {
  const item = STATUS[status] ?? { label: status, tone: 'gray' as const }
  return <Badge tone={item.tone}>{item.label}</Badge>
}

/** Badge aktif/tidak aktif untuk modul yang punya `is_active`. */
export function ActiveBadge({ active }: { active: boolean }) {
  return <Badge tone={active ? 'green' : 'red'}>{active ? 'Aktif' : 'Nonaktif'}</Badge>
}

/** Badge terbit/draft untuk artikel blog. */
export function PublishedBadge({ published }: { published: boolean }) {
  return <Badge tone={published ? 'green' : 'gray'}>{published ? 'Terbit' : 'Draft'}</Badge>
}

/** Badge multidimensional (testimoni, proyek, alat). */
export function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) return <span className="text-xs text-gray-400">-</span>
  return (
    <Badge tone="yellow">
      <i className="fas fa-star mr-1" />
      Unggulan
    </Badge>
  )
}

/** Tanggal admin format Indonesia, fallback bila kosong. */
export function DateText({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-xs text-gray-400">-</span>
  return (
    <span className="text-xs text-gray-500">
      {new Date(value).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
    </span>
  )
}