import Link from 'next/link'
import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Kembali',
  actions,
}: {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center text-xs text-gray-500 hover:text-brand transition mb-2"
          >
            <i className="fas fa-arrow-left mr-1" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
            {head.map((column) => (
              <th key={column} className="pb-3 font-medium whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Td({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return <td className={`py-3 pr-4 align-middle ${className}`}>{children}</td>
}