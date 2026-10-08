import type { Metadata } from 'next'

import { DateText, PublishedBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminPosts } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deletePost } from './actions'

export const metadata: Metadata = { title: 'Artikel' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminBlogPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminPosts(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Artikel"
        description="Kelola artikel blog"
        actions={<AddButton href="/admin/blog/create" label="Tambah Artikel" />}
      />

      <ListCard
        head={['No', 'Judul', 'Penulis', 'Status', 'Terbit', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-newspaper"
        emptyMessage="Belum ada artikel."
      >
        {result.items.map((post, index) => (
          <tr key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink max-w-md">
              {post.title}
              {post.excerpt && (
                <p className="text-xs text-gray-500 font-normal mt-0.5 line-clamp-2">{post.excerpt}</p>
              )}
            </Td>
            <Td className="text-gray-600">{post.author ?? '-'}</Td>
            <Td>
              <PublishedBadge published={post.is_published} />
            </Td>
            <Td>
              <DateText value={post.published_at} />
            </Td>
            <Td>
              <RowActions
                id={post.id}
                editHref={`/admin/blog/${post.id}/edit`}
                deleteAction={deletePost}
                deleteMessage={`Yakin ingin menghapus artikel "${post.title}"?`}
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}