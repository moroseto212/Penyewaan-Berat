import type { Metadata } from 'next'

import { ActiveBadge, DateText, FeaturedBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminTestimonials } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteTestimonial } from './actions'

export const metadata: Metadata = { title: 'Testimoni' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminTestimonialsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminTestimonials(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Testimoni"
        description="Kelola testimoni klien"
        actions={<AddButton href="/admin/testimonials/create" label="Tambah Testimoni" />}
      />

      <ListCard
        head={['No', 'Klien', 'Perusahaan', 'Rating', 'Unggulan', 'Aktif', 'Tanggal', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-comment-dots"
        emptyMessage="Belum ada testimoni."
      >
        {result.items.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td>
              <p className="font-medium text-ink">{item.client_name}</p>
              {item.client_position && (
                <p className="text-xs text-gray-500">{item.client_position}</p>
              )}
            </Td>
            <Td className="text-gray-600">{item.company ?? '-'}</Td>
            <Td className="text-brand">
              <i className="fas fa-star" /> {item.rating}
            </Td>
            <Td>
              <FeaturedBadge featured={item.is_featured} />
            </Td>
            <Td>
              <ActiveBadge active={item.is_active} />
            </Td>
            <Td>
              <DateText value={item.created_at} />
            </Td>
            <Td>
              <RowActions
                id={item.id}
                editHref={`/admin/testimonials/${item.id}/edit`}
                deleteAction={deleteTestimonial}
                deleteMessage={`Yakin ingin menghapus testimoni dari "${item.client_name}"?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}