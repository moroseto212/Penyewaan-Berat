/**
 * Render konten HTML dari CMS.
 *
 * Sama seperti `{!! $service->body !!}` di Blade: isi field `body` ditulis
 * hanya oleh admin (dijaga RLS `admin_users`), jadi aman ditampilkan apa adanya.
 * Jangan pernah arahkan input pengguna (mis. pesan kontak) ke komponen ini.
 */
export function HtmlContent({ html, className = '' }: { html: string | null | undefined; className?: string }) {
  if (!html) return null

  return (
    <div
      className={`prose-content text-gray-600 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}