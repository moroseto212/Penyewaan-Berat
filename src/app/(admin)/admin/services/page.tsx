import type { Metadata } from 'next'

import { ActiveBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminServices } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteService } from './actions'

export const metadata: Metadata = { title: 'Layanan' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminServicesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminServices(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Layanan"
        description="Kelola jenis layanan yang ditawarkan"
        actions={<AddButton href="/admin/services/create" label="Tambah Layanan" />}
      />

      <ListCard
        head={['No', 'Judul', 'Slug', 'Ikon', 'Aktif', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-concierge-bell"
        emptyMessage="Belum ada layanan."
      >
        {result.items.map((service, index) => (
          <tr key={service.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink">{service.title}</Td>
            <Td className="text-gray-500">{service.slug}</Td>
            <Td>
              <i className={`${service.icon ?? 'fa-cogs'} text-brand`} />
            </Td>
            <Td>
              <ActiveBadge active={service.is_active} />
            </Td>
            <Td>
              <RowActions
                id={service.id}
                editHref={`/admin/services/${service.id}/edit`}
                deleteAction={deleteService}
                deleteMessage={`Yakin ingin menghapus layanan "${service.title}"?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}