import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { isSupabaseConfigured, supabaseUrl } from './config'
import type { Database } from './types'

/**
 * Klien Supabase tanpa cookie session, khusus untuk pembacaan data publik.
 * Karena policy RLS mengizinkan `anon` membaca konten yang aktif/terbit,
 * halaman publik tidak perlu menunggu refresh session dan bisa di-cache
 * oleh Vercel (ISR).
 *
 * Jangan pakai ini untuk data yang butuh session (mis. panel admin).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'anon-key-belum-diisi',
    {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { retry: isSupabaseConfigured },
    },
  )
}
