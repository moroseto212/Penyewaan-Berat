/**
 * Deteksi konfigurasi Supabase.
 *
 * Selama `.env.local` masih berisi placeholder, setiap query akan gagal —
 * dan `postgrest-js` melakukan retry otomatis dengan backoff 1s/2s/4s
 * (`db.retry` default `true`), sehingga tiap halaman memakan ±7 detik.
 *
 * Agar situs tetap ringan sebelum kredensial diisi, klien memakai alamat
 * lokal yang langsung menolak koneksi **dan** retry dimatikan, sehingga
 * query gagal <200ms dan halaman dirender dengan data kosong.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes('xxxx'))

export const supabaseUrl = isSupabaseConfigured ? (url as string) : 'http://127.0.0.1:54321'

/**
 * Satu-satunya email yang diizinkan masuk panel admin (env `ADMIN_EMAIL`).
 * Tidak diset -> semua user yang punya baris `admin_users` boleh masuk.
 * Hanya dibaca di sisi server (proxy & requireAdmin), tidak pernah di-split ke browser.
 */
export const adminEmail =
  (typeof process !== 'undefined' && process.env.ADMIN_EMAIL?.trim().toLowerCase()) || null

/** Cek apakah email user diizinkan menjadi admin. */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!adminEmail) return true
  return (email ?? '').trim().toLowerCase() === adminEmail
}

if (!isSupabaseConfigured && typeof window === 'undefined') {
  console.warn(
    '[supabase] Belum dikonfigurasi — isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local (lihat README bagian 4.0).',
  )
}
