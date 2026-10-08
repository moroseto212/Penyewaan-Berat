'use client'

import { ConfirmSubmit } from './submit-button'

/**
 * Form hapus siap pakai untuk dipakai di dalam tabel/list.
 * Server action diteruskan sebagai prop supaya tiap modul tetap punya
 * aksi `delete`-nya sendiri (dengan validasi `requireAdmin` di dalamnya).
 */
export function DeleteButton({
  action,
  id,
  message,
  label = 'Hapus',
  icon = 'fa-trash',
}: {
  action: (form: FormData) => Promise<void>
  id: number | string
  message: string
  label?: string
  icon?: string
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmit message={message} label={label} icon={icon} />
    </form>
  )
}