import type { Metadata } from 'next'

import { DateText, FeaturedBadge, StatusBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminEquipment } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteEquipment } from './actions'

export const metadata: Metadata = { title: 'Alat Berat' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminEquipmentPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminEquipment(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Alat Berat"
        description="Kelola katalog alat berat"
        actions={<AddButton href="/admin/equipment/create" label="Tambah Alat" />}
      />

      <ListCard
        head={['No', 'Nama', 'Kategori', 'Merek', 'Status', 'Unit', 'Unggulan', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-tractor"
        emptyMessage="Belum ada alat berat."
      >
        {result.items.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink">
              {item.name}
              <p className="text-xs text-gray-500 font-normal mt-0.5">{item.slug}</p>
            </Td>
            <Td className="text-gray-600">{item.category?.name ?? '-'}</Td>
            <Td className="text-gray-600">
              {item.brand ?? '-'}
              {item.model && <span className="text-xs text-gray-400"> {item.model}</span>}
            </Td>
            <Td>
              <StatusBadge status={item.status} />
            </Td>
            <Td className="text-xs text-gray-600">
              {item.available_units}/{item.total_units}
              <span className="block text-gray-400">
                <DateText value={item.created_at} />
              </span>
            </Td>
            <Td>
              <FeaturedBadge featured={item.is_featured} />
            </Td>
            <Td>
              <RowActions
                id={item.id}
                editHref={`/admin/equipment/${item.id}/edit`}
                deleteAction={deleteEquipment}
                deleteMessage={`Yakin ingin menghapus alat "${item.name}" beserta galerinya?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}