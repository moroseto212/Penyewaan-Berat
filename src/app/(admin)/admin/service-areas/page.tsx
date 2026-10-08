import type { Metadata } from 'next'

import { ActiveBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminServiceAreas } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteServiceArea } from './actions'

export const metadata: Metadata = { title: 'Area Layanan' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminServiceAreasPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminServiceAreas(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Area Layanan"
        description="Kelola wilayah yang dilayani"
        actions={<AddButton href="/admin/service-areas/create" label="Tambah Area" />}
      />

      <ListCard
        head={['No', 'Nama', 'Slug', 'Deskripsi', 'Aktif', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-map-marker-alt"
        emptyMessage="Belum ada area layanan."
      >
        {result.items.map((area, index) => (
          <tr key={area.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink">{area.name}</Td>
            <Td className="text-gray-500">{area.slug}</Td>
            <Td className="text-gray-600 max-w-xs truncate">{area.description ?? '-'}</Td>
            <Td>
              <ActiveBadge active={area.is_active} />
            </Td>
            <Td>
              <RowActions
                id={area.id}
                editHref={`/admin/service-areas/${area.id}/edit`}
                deleteAction={deleteServiceArea}
                deleteMessage={`Yakin ingin menghapus area layanan "${area.name}"?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}