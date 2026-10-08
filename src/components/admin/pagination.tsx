import Link from 'next/link'

type Props = {
  page: number
  perPage: number
  total: number
  /** Query string lain yang harus dipertahankan (filter, kata kunci). */
  params?: Record<string, string | undefined>
}

/** Paginasi server-side memakai link biasa, jadi tetap jalan tanpa JavaScript. */
export function Pagination({ page, perPage, total, params = {} }: Props) {
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  if (lastPage <= 1) return null

  const build = (target: number) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value)
    }
    search.set('page', String(target))
    return `?${search.toString()}`
  }

  const items: (number | 'gap')[] = []
  for (let i = 1; i <= lastPage; i += 1) {
    const isEdge = i === 1 || i === lastPage
    const isNear = Math.abs(i - page) <= 1
    if (isEdge || isNear) {
      items.push(i)
    } else if (items[items.length - 1] !== 'gap') {
      items.push('gap')
    }
  }

  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <nav className="flex items-center justify-between gap-4 mt-6 flex-wrap">
      <p className="text-xs text-gray-500">
        Menampilkan {from}-{to} dari {total} data
      </p>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <Link
            href={build(page - 1)}
            aria-label="Halaman sebelumnya"
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-surface transition"
          >
            <i className="fas fa-chevron-left" />
          </Link>
        )}

        {items.map((item) =>
          item === 'gap' ? (
            <span key="gap" className="px-2 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={item}
              href={build(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                item === page
                  ? 'bg-brand text-ink border-brand'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-surface'
              }`}
            >
              {item}
            </Link>
          ),
        )}

        {page < lastPage && (
          <Link
            href={build(page + 1)}
            aria-label="Halaman berikutnya"
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-surface transition"
          >
            <i className="fas fa-chevron-right" />
          </Link>
        )}
      </div>
    </nav>
  )
}