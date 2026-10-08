import Link from 'next/link'
import type { ReactNode } from 'react'

import { DeleteButton } from './delete-button'
import { Pagination } from './pagination'
import { Table } from './page-header'

/** Tombol tambah di header halaman list. */
export function AddButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-brand hover:bg-brand-dark text-ink font-semibold px-5 py-2.5 rounded-lg transition duration-200 inline-flex items-center"
    >
      <i className="fas fa-plus mr-2" />
      {label}
    </Link>
  )
}

/**
 * Kartu pembungkus tabel: header kolom, isi (children), dan paginasi.
 * `query` dipakai untuk mempertahankan filter saat berpindah halaman.
 */
export function ListCard({
  head,
  page,
  perPage,
  total,
  query = {},
  isEmpty = false,
  emptyIcon = 'fa-inbox',
  emptyMessage = 'Belum ada data.',
  children,
}: {
  head: string[]
  page: number
  perPage: number
  total: number
  query?: Record<string, string | undefined>
  isEmpty?: boolean
  emptyIcon?: string
  emptyMessage?: string
  children?: ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {isEmpty ? (
        <div className="px-6 py-16 text-center text-gray-500 text-sm">
          <i className={`fas ${emptyIcon} text-4xl mb-3 text-gray-300 block`} />
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="p-6">
            <Table head={head}>{children}</Table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={page} perPage={perPage} total={total} params={query} />
          </div>
        </>
      )}
    </div>
  )
}

/** Aksi baris tabel: edit + hapus (dengan konfirmasi). */
export function RowActions({
  id,
  editHref,
  deleteAction,
  deleteMessage,
}: {
  id: number
  editHref: string
  deleteAction: (form: FormData) => Promise<void>
  deleteMessage: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={editHref}
        className="inline-flex items-center px-3 py-1.5 bg-brand/10 text-brand hover:bg-brand hover:text-ink rounded-lg text-xs font-medium transition duration-200"
      >
        <i className="fas fa-edit mr-1" />
        Edit
      </Link>
      <DeleteButton action={deleteAction} id={id} message={deleteMessage} />
    </div>
  )
}