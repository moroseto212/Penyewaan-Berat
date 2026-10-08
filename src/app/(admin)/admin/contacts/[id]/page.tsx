import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Card } from '@/components/admin/form-controls'
import { Flash } from '@/components/admin/flash'
import { PageHeader } from '@/components/admin/page-header'
import { DeleteButton } from '@/components/admin/delete-button'
import { getContactById } from '@/lib/admin/queries'
import { createClient } from '@/lib/supabase/server'
import { toParam } from '@/lib/site'
import { deleteContact } from '../actions'

export const metadata: Metadata = { title: 'Detail Pesan' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Menyorot nilai tanpa meng-escape markup. */
function Value({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-ink mt-0.5 break-words">{value || '-'}</p>
    </div>
  )
}

export default async function ContactDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const contactId = Number.parseInt(id, 10)
  const query = await searchParams

  const contact = Number.isNaN(contactId) ? null : await getContactById(contactId)
  if (!contact) notFound()

  // Sama seperti Laravel: membuka detail otomatis menandai pesan sebagai dibaca.
  if (!contact.is_read) {
    const supabase = await createClient()
    await supabase.from('contacts').update({ is_read: true }).eq('id', contact.id)
  }

  return (
    <>
      <Flash success={toParam(query.success)} error={toParam(query.error)} />

      <PageHeader title={contact.subject ?? 'Pesan dari Situs'} backHref="/admin/contacts" />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Informasi Pengirim" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <Value label="Nama" value={contact.name} />
            <Value label="Email" value={contact.email} />
            <Value label="Telepon" value={contact.phone} />
            <Value label="Perusahaan" value={contact.company} />
            <Value label="Subjek" value={contact.subject} />
            <Value
              label="Waktu"
              value={new Date(contact.created_at).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            />
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-400">Pesan</p>
            <p className="text-sm text-ink mt-2 whitespace-pre-line leading-relaxed">{contact.message}</p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Aksi">
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  `Re: ${contact.subject ?? 'Pesan dari situs'}`,
                )}`}
                className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand text-ink font-semibold text-sm hover:bg-brand-dark transition"
              >
                <i className="fas fa-reply mr-2" />
                Balas via Email
              </a>

              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-surface transition"
                >
                  <i className="fas fa-phone mr-2" />
                  Telepon
                </a>
              )}

              <DeleteButton
                action={deleteContact}
                id={contact.id}
                message={`Yakin ingin menghapus pesan dari "${contact.name}"?`}
                label="Hapus Pesan"
              />

              <Link
                href="/admin/contacts"
                className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition"
              >
                Kembali ke daftar
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}