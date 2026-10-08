import Link from 'next/link'

type Props = {
  page: number
  lastPage: number
  /** Query string tanpa `?`, misal `kategori=excavator&sort=terbaru`. */
  basePath: string
  query?: Record<string, string>
}

/**
 * Pagination publik berbasis query string.
 *
 * Semua query filter dipertahankan antar halaman, jadi `page` ditambahkan
 * sebagai parameter terakhir agar URL tetap enak dibaca.
 */
export function Pagination({ page, lastPage, basePath, query = {} }: Props) {
  if (lastPage <= 1) return null

  const href = (target: number) => {
    const params = new URLSearchParams(query)
    if (target > 1) params.set('page', String(target))
    const search = params.toString()
    return search ? `${basePath}?${search}` : basePath
  }

  /** Window halaman: selalu tampilkan pierws, terakhir, dan sekitar halaman aktif. */
  const numbers = new Set<number>([1, lastPage])
  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = page + offset
    if (candidate >= 1 && candidate <= lastPage) numbers.add(candidate)
  }
  const visible = [...numbers].sort((a, b) => a - b)

  const itemClass =
    'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-colors'
  const idleClass = `${itemClass} bg-white text-ink border border-gray-200 hover:border-brand hover:text-brand`
  const activeClass = `${itemClass} bg-brand text-ink`

  return (
    <nav aria-label="Paginasi" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} className={idleClass} rel="prev" aria-label="Halaman sebelumnya">
              <i className="fas fa-chevron-left text-xs" />
            </Link>
          ) : (
            <span className={`${idleClass} opacity-40 cursor-not-allowed`}>
              <i className="fas fa-chevron-left text-xs" />
            </span>
          )}
        </li>

        {visible.map((number, index) => {
          const previous = visible[index - 1]
          return (
            <li key={number} className="flex items-center gap-2">
              {previous && number - previous > 1 && (
                <span className="px-1 text-gray-400 text-sm">…</span>
              )}
              {number === page ? (
                <span aria-current="page" className={activeClass}>
                  {number}
                </span>
              ) : (
                <Link href={href(number)} className={idleClass}>
                  {number}
                </Link>
              )}
            </li>
          )
        })}

        <li>
          {page < lastPage ? (
            <Link href={href(page + 1)} className={idleClass} rel="next" aria-label="Halaman berikutnya">
              <i className="fas fa-chevron-right text-xs" />
            </Link>
          ) : (
            <span className={`${idleClass} opacity-40 cursor-not-allowed`}>
              <i className="fas fa-chevron-right text-xs" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}