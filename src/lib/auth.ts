import { createClient } from '@/lib/supabase/server'
import { isAllowedAdminEmail, isSupabaseConfigured } from '@/lib/supabase/config'
import type { AdminUser } from '@/lib/supabase/types'
import { cache } from 'react'
import { redirect } from 'next/navigation'

/**
 * Semua halaman publik memakai `createPublicClient()` (tanpa cookie) agar tetap
 * bisa di-cache. Panel admin memakai `createClient()` di file ini karena
 * butuh session Supabase Auth + RLS berbasis `auth.uid()`.
 */

/** User Supabase Auth yang sedang login (di-dedupe per request). */
export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
})

/** Baris `admin_users` milik user yang sedang login. */
export const getAdminProfile = cache(async (): Promise<AdminUser | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<AdminUser>()

  return data ?? null
})

/** `true` hanya bila user login, email-nya diizinkan `ADMIN_EMAIL`, DAN ter-promote di `admin_users`. */
export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getUser()
  if (!isAllowedAdminEmail(user?.email)) return false

  const profile = await getAdminProfile()
  return profile?.is_admin === true
})

/**
 * Guard untuk layout & server action admin.
 * - Tanpa session  -> /login
 * - Session ada tapi bukan admin -> /login?error=Akses ditolak
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getAdminProfile()
  if (!profile?.is_admin || !isAllowedAdminEmail(user.email)) {
    // Hentikan session supaya user tidak terjebak di loop redirect.
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=Akun%20ini%20belum%20memiliki%20akses%20admin.')
  }

  return profile
}

export type SignInResult = { error: string | null }

/** Login memakai Supabase Auth. Pesan error dibuat generik agar tidak membocorkan akun mana yang terdaftar. */
export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  // Kredensial Supabase belum diisi -> login mustahil berhasil; beri pesan
  // yang jelas supaya tidak disalahartikan sebagai email/password salah.
  if (!isSupabaseConfigured) {
    return {
      error:
        'Login belum aktif: Supabase belum dikonfigurasi. Ikuti README bagian 4.0 (buat project Supabase, jalankan SQL, isi .env.local), lalu coba lagi.',
    }
  }

  // Hanya `ADMIN_EMAIL` yang boleh login; lainnya ditolak dengan pesan generik
  // supaya tidak membocorkan email mana yang diizinkan.
  if (!isAllowedAdminEmail(email)) {
    return { error: 'Email atau password salah.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email atau password salah.' }
  }

  return { error: null }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}