'use server'

import { isAdmin, signInWithPassword, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type LoginState = { error: string | null }

/**
 * Server action untuk login admin.
 *
 * Catatan keamanan:
 *  - Password dicek lewat Supabase Auth (hash, tidak pernah plain text).
 *  - Setelah login berhasil, role dicek di tabel `admin_users`.
 *  - User yang tidak punya `is_admin = true` langsung di-logout lagi supaya
 *    tidak bisa menyentuh halaman /admin.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const { error } = await signInWithPassword(email, password)
  if (error) return { error }

  if (!(await isAdmin())) {
    await signOut()
    return {
      error: 'Akun ini sudah terdaftar di Supabase Auth tetapi belum di-promote jadi admin.',
    }
  }

  redirect('/admin')
}

export async function logoutAction() {
  await signOut()
  redirect('/login')
}