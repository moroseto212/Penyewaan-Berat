import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/admin/form-controls'
import { Flash } from '@/components/admin/flash'
import { ListCard } from '@/components/admin/list-shell'
import { PageHeader, Td } from '@/components/admin/page-header'
import { SubmitButton } from '@/components/admin/submit-button'
import { PER_PAGE, getAdminContacts, getUnreadContactCount } from '@/lib/admin/queries'
import { toPage, toParam } from '@/lib/site'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteContact, toggleContactRead } from './actions'

export const metadata: Metadata = { title: 'Pesan Masuk' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'unread', label: 'Belum Dibaca' },
  { key: 'read', label: 'Sudah Dibaca' },
] as const

export default async function AdminContactsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = toPage(params.page)
  const filter = (toParam(params.filter) ?? 'all') as 'all' | 'unread' | 'read'
  const [result, unread] = await Promise.all([getAdminContacts(page, filter), getUnreadContactCount()])

  return (
    <>
      <Flash success={toParam(params.success)} error={toParam(params.error)} />

      <PageHeader
        title="Pesan Masuk"
        description={
          unread > 0 ? `${unread} pesan belum dibaca` : 'Semua pesan sudah dibaca'
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Link
            key={item.key}
            href={item.key === 'all' ? '/admin/contacts' : `/admin/contacts?filter=${item.key}`}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              filter === item.key
                ? 'bg-brand text-ink'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-surface'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <ListCard
        head={['No', 'Pengirim', 'Subjek', 'Status', 'Tanggal', 'Aksi']}
        page={page}
        perPage={PER_PAGE}
        total={result.total}
        query={{ filter: filter === 'all' ? undefined : filter }}
        isEmpty={result.items.length === 0}
        emptyIcon="fa-envelope-open"
        emptyMessage="Belum ada pesan masuk."
      >
        {result.items.map((contact, index) => (
          <tr
            key={contact.id}
            className={`border-b border-gray-100 last:border-0 hover:bg-surface ${
              contact.is_read ? '' : 'bg-brand/5'
            }`}
          >
            <Td className="text-gray-500 w-12">{(page - 1) * PER_PAGE + index + 1}</Td>
            <Td>
              <Link href={`/admin/contacts/${contact.id}`} className="block">
                <p className="font-medium text-ink hover:text-brand">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.email}</p>
              </Link>
            </Td>
            <Td className="text-gray-600 max-w-xs truncate">{contact.subject ?? '-'}</Td>
            <Td>
              <Badge tone={contact.is_read ? 'gray' : 'blue'}>
                {contact.is_read ? 'Dibaca' : 'Baru'}
              </Badge>
            </Td>
            <Td className="text-xs text-gray-500">
              {new Date(contact.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/contacts/${contact.id}`}
                  className="inline-flex items-center px-3 py-1.5 bg-brand/10 text-brand hover:bg-brand hover:text-ink rounded-lg text-xs font-medium transition duration-200"
                >
                  <i className="fas fa-eye mr-1" />
                  Detail
                </Link>
                <form action={toggleContactRead} className="inline">
                  <input type="hidden" name="id" value={contact.id} />
                  <SubmitButton
                    name="toggle"
                    label={contact.is_read ? 'Tandai Baru' : 'Tandai Dibaca'}
                    icon={contact.is_read ? 'fa-envelope' : 'fa-envelope-open'}
                    variant="ghost"
                    compact
                  />
                </form>
                <DeleteButton
                  action={deleteContact}
                  id={contact.id}
                  message={`Yakin ingin menghapus pesan dari "${contact.name}"?`}
                />
              </div>
            </Td>
          </tr>
        ))}
      </ListCard>
    </>
  )
}