import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { isAllowedAdminEmail, supabaseUrl } from '@/lib/supabase/config'
import type { Database } from '@/lib/supabase/types'

/**
 * Proxy (menggantikan middleware di Next.js 16).
 *
 * Hanya dijalankan untuk `/admin` dan `/login` (lihat `config.matcher`),
 * sehingga halaman publik TIDAK PERNAH menunggu call auth Supabase —
 * dulu tiap request publik membayar roundtrip ke Singapura dan bisa
 * menampilkan layar putih beberapa detik saat jaringan lambat.
 *
 * Tanggung jawab (khusus area admin):
 *  1. Refresh session Supabase.
 *  2. Guard awal untuk /admin dan /login.
 *
 * Pengecekan role di sini hanya lapisan pertama. Otorisasi yang sebenarnya
 * tetap dilakukan lagi di `requireAdmin()` (src/lib/auth.ts) untuk setiap
 * layout dan setiap server action, karena server action bisa dipanggil
 * langsung lewat POST tanpa melewati halaman.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'anon-key-belum-diisi',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/')
  const isLoginPage = pathname === '/login'

  if (!isAdminArea && !isLoginPage) return response

  if (!user) {
    if (isLoginPage) return response
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Sudah login: pastikan benar-benar admin (dan email-nya diizinkan `ADMIN_EMAIL`).
  const { data: profile } = await supabase
    .from('admin_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle<{ is_admin: boolean }>()

  const admin = profile?.is_admin === true && isAllowedAdminEmail(user.email)

  if (isLoginPage) {
    if (!admin) {
      await supabase.auth.signOut()
      return response
    }
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if (!admin) {
    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'Akun ini belum memiliki akses admin.')
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}