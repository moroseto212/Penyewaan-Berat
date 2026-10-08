import type { Metadata } from 'next'

import { ActiveBadge } from '@/components/admin/badges'
import { Flash } from '@/components/admin/flash'
import { AddButton, ListCard, RowActions } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { PER_PAGE, getAdminFaqs } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { deleteFaq } from './actions'

export const metadata: Metadata = { title: 'FAQ' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminFaqsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const result = await getAdminFaqs(page)
  const offset = (page - 1) * PER_PAGE

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="FAQ"
        description="Kelola pertanyaan yang sering diajukan"
        actions={<AddButton href="/admin/faqs/create" label="Tambah FAQ" />}
      />

      <ListCard
        head={['No', 'Pertanyaan', 'Kategori', 'Urutan', 'Aktif', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-question-circle"
        emptyMessage="Belum ada FAQ."
      >
        {result.items.map((faq, index) => (
          <tr key={faq.id} className="border-b border-gray-100 last:border-0 hover:bg-surface">
            <Td className="text-gray-500 w-12">{offset + index + 1}</Td>
            <Td className="font-medium text-ink max-w-md">
              {faq.question}
              <p className="text-xs text-gray-500 font-normal mt-0.5 line-clamp-2">{faq.answer}</p>
            </Td>
            <Td className="text-gray-600">{faq.category ?? '-'}</Td>
            <Td className="text-gray-500">{faq.sort_order}</Td>
            <Td>
              <ActiveBadge active={faq.is_active} />
            </Td>
            <Td>
              <RowActions
                id={faq.id}
                editHref={`/admin/faqs/${faq.id}/edit`}
                deleteAction={deleteFaq}
                deleteMessage="Yakin ingin menghapus FAQ ini?"
              />
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}