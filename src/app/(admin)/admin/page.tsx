import Link from 'next/link'

import { Card, EmptyState } from '@/components/admin/form-controls'
import { Flash } from '@/components/admin/flash'
import { PageHeader, Table, Td } from '@/components/admin/page-header'
import { getDashboardStats } from '@/lib/admin/queries'
import { formatDate } from '@/lib/site'

export const dynamic = 'force-dynamic'

const STAT_CARDS = [
  { key: 'equipment', label: 'Total Alat', icon: 'fa-tractor', href: '/admin/equipment' },
  { key: 'categories', label: 'Kategori', icon: 'fa-tags', href: '/admin/categories' },
  { key: 'services', label: 'Layanan', icon: 'fa-cogs', href: '/admin/services' },
  {
    key: 'serviceAreas',
    label: 'Area Layanan',
    icon: 'fa-map-marked-alt',
    href: '/admin/service-areas',
  },
  { key: 'projects', label: 'Proyek', icon: 'fa-helmet-safety', href: '/admin/projects' },
  { key: 'testimonials', label: 'Testimoni', icon: 'fa-comment-dots', href: '/admin/testimonials' },
  { key: 'blogPosts', label: 'Blog', icon: 'fa-newspaper', href: '/admin/blog' },
  { key: 'faqs', label: 'FAQ', icon: 'fa-question-circle', href: '/admin/faqs' },
  { key: 'contacts', label: 'Pesan Masuk', icon: 'fa-envelope', href: '/admin/contacts' },
] as const

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [{ success, error }, stats] = await Promise.all([searchParams, getDashboardStats()])

  const cardValue = (key: string) => {
    if (key === 'contacts') return `${stats.contactsUnread}/${stats.contactsTotal}`
    return String(stats[key as keyof typeof stats] ?? 0)
  }

  const statusTotal =
    stats.statusCounts.available + stats.statusCounts.rented + stats.statusCounts.maintenance
  const percent = (value: number) => (statusTotal > 0 ? Math.round((value / statusTotal) * 100) : 0)

  const statusRows = [
    { key: 'available', label: 'Tersedia', dot: 'bg-green-500', count: stats.statusCounts.available },
    { key: 'rented', label: 'Disewa', dot: 'bg-brand', count: stats.statusCounts.rented },
    {
      key: 'maintenance',
      label: 'Perawatan',
      dot: 'bg-red-500',
      count: stats.statusCounts.maintenance,
    },
  ] as const

  return (
    <>
      <PageHeader title="Dashboard" description="Ringkasan konten dan aktivitas situs." />
      <Flash success={success} error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center space-x-4 hover:border-brand transition"
          >
            <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <i className={`fas ${card.icon} text-brand text-xl`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{card.label}</p>
              <p className="text-2xl font-bold text-ink">{cardValue(card.key)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Status Alat Berat">
          <div className="space-y-4">
            {statusRows.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${row.dot}`} />
                    <span className="text-sm text-gray-600">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink">{row.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${row.dot} h-2.5 rounded-full`}
                    style={{ width: `${percent(row.count)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Ringkasan Cepat">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-ink">{stats.totalUnits}</p>
              <p className="text-xs text-gray-500 mt-1">Total Unit</p>
            </div>
            <div className="bg-surface rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-ink">{stats.availableUnits}</p>
              <p className="text-xs text-gray-500 mt-1">Unit Tersedia</p>
            </div>
            <div className="bg-surface rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-ink">{stats.projects}</p>
              <p className="text-xs text-gray-500 mt-1">Proyek</p>
            </div>
            <div className="bg-surface rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-ink">{stats.contactsUnread}</p>
              <p className="text-xs text-gray-500 mt-1">Pesan Belum Dibaca</p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Pesan Terbaru"
        actions={
          <Link href="/admin/contacts" className="text-sm text-brand hover:underline">
            Lihat Semua
          </Link>
        }
      >
        {stats.recentContacts.length === 0 ? (
          <EmptyState message="Belum ada pesan masuk." icon="fa-envelope-open" />
        ) : (
          <Table head={['Nama', 'Email', 'Subjek', 'Tanggal']}>
            {stats.recentContacts.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-100 hover:bg-surface">
                <Td className={contact.is_read ? '' : 'font-semibold'}>
                  <Link href={`/admin/contacts/${contact.id}`} className="hover:text-brand">
                    {contact.name}
                  </Link>
                </Td>
                <Td className="text-gray-600">{contact.email}</Td>
                <Td className="text-gray-600">{contact.subject ?? '-'}</Td>
                <Td className="text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(contact.created_at)}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  )
}