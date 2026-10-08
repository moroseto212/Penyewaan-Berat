/** Blok abu-abu berkedip (pulse) untuk skeleton loading. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

/** Blok pulse untuk latar gelap (hero). */
export function DarkSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
}

/** Hero gelap + judul palsu, dipakai semua variant. */
function HeroSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <section className={`bg-ink ${tall ? 'py-28 sm:py-36' : 'py-16 sm:py-24'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DarkSkeleton className="h-10 w-2/3 sm:w-1/2 mb-5" />
        <DarkSkeleton className="h-1 w-20 mb-5" />
        <DarkSkeleton className="h-4 w-3/4 sm:w-1/2" />
      </div>
    </section>
  )
}

/** Kartu placeholder: gambar + dua baris teks. */
function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <Skeleton className="h-52 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton beranda: hero + statistik + grid unggulan. */
export function HomeSkeleton() {
  return (
    <>
      <HeroSkeleton tall />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 sm:h-36 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto mb-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/** Skeleton daftar: hero + grid kartu (list page). */
export function ListSkeleton({ sidebar = false }: { sidebar?: boolean }) {
  return (
    <>
      <HeroSkeleton />
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={sidebar ? 'flex gap-8' : ''}>
            {sidebar && (
              <aside className="w-full lg:w-72 shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <div className="space-y-3 pt-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </aside>
            )}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: sidebar ? 6 : 6 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/** Skeleton detail: hero + dua kolom (galeri + informasi). */
export function DetailSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Skeleton className="h-72 sm:h-96 w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-40 rounded-lg" />
                <Skeleton className="h-12 w-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
