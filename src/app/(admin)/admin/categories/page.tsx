import type { Metadata } from 'next'

import { ActiveBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminCategories } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteCategory } from './actions'

export const metadata: Metadata = { title: 'Kategori' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminCategories(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Kategori"
        description="Kelola kategori alat berat"
        actions={<AddButton href="/admin/categories/create" label="Tambah Kategori" />}
      />

      <ListCard
        head={['No', 'Nama', 'Slug', 'Ikon', 'Aktif', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-tags"
        emptyMessage="Belum ada kategori."
      >
        {result.items.map((category, index) => (
          <tr key={category.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink">{category.name}</Td>
            <Td className="text-gray-500">{category.slug}</Td>
            <Td>
              <i className={`${category.icon ?? 'fa-tag'} text-brand`} />
            </Td>
            <Td>
              <ActiveBadge active={category.is_active} />
            </Td>
            <Td>
              <RowActions
                id={category.id}
                editHref={`/admin/categories/${category.id}/edit`}
                deleteAction={deleteCategory}
                deleteMessage={`Yakin ingin menghapus kategori "${category.name}"?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}