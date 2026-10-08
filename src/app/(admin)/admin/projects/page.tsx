import type { Metadata } from 'next'

import { ActiveBadge, DateText, FeaturedBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminProjects } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteProject } from './actions'

export const metadata: Metadata = { title: 'Proyek' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminProjectsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminProjects(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Proyek"
        description="Kelola daftar proyek yang dikerjakan"
        actions={<AddButton href="/admin/projects/create" label="Tambah Proyek" />}
      />

      <ListCard
        head={['No', 'Judul', 'Klien', 'Lokasi', 'Unggulan', 'Aktif', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-helmet-safety"
        emptyMessage="Belum ada proyek."
      >
        {result.items.map((project, index) => (
          <tr key={project.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink max-w-xs">
              {project.title}
              <p className="text-xs text-gray-500 font-normal mt-0.5">{project.slug}</p>
            </Td>
            <Td className="text-gray-600">{project.client ?? '-'}</Td>
            <Td className="text-gray-600">{project.location ?? '-'}</Td>
            <Td>
              <FeaturedBadge featured={project.is_featured} />
            </Td>
            <Td>
              <ActiveBadge active={project.is_active} />
            </Td>
            <Td>
              <div className="flex flex-col gap-1">
                <RowActions
                  id={project.id}
                  editHref={`/admin/projects/${project.id}/edit`}
                  deleteAction={deleteProject}
                  deleteMessage={`Yakin ingin menghapus proyek "${project.title}" beserta galerinya?`}
                />
                <DateText value={project.created_at} />
              </div>
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}