'use client'

import { useFormStatus } from 'react-dom'

const LABELS: Record<string, string> = {
  store: 'Simpan',
  update: 'Perbarui',
  delete: 'Hapus',
  upload: 'Upload',
  toggle: 'Perbarui',
}

export function SubmitButton({
  label,
  name,
  variant = 'primary',
  icon,
  compact = false,
  className = '',
}: {
  label?: string
  name?: string
  variant?: 'primary' | 'ghost' | 'danger'
  icon?: string
  compact?: boolean
  className?: string
}) {
  const { pending } = useFormStatus()
  const text = label ?? LABELS[name ?? 'store'] ?? 'Kirim'

  const variants: Record<string, string> = {
    primary: 'bg-brand text-ink hover:bg-brand-dark',
    ghost: 'bg-white text-gray-700 border border-gray-300 hover:bg-surface',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = compact ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'

  return (
    <button
      type="submit"
      name={name}
      value={name}
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes} ${className}`}
    >
      {pending ? (
        <i className="fas fa-spinner fa-spin mr-2" />
      ) : (
        icon && <i className={`fas ${icon} mr-2`} />
      )}
      {pending ? 'Memproses...' : text}
    </button>
  )
}

/** Tombol hapus dengan konfirmasi browser (dipakai di dalam tabel/list). */
export function ConfirmSubmit({
  message,
  label = 'Hapus',
  icon = 'fa-trash',
  className = '',
}: {
  message: string
  label?: string
  icon?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault()
      }}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition disabled:opacity-60 ${className}`}
    >
      <i className={`fas ${pending ? 'fa-spinner fa-spin' : icon} mr-1`} />
      {pending ? '...' : label}
    </button>
  )
}