import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { isSupabaseConfigured, supabaseUrl } from './config'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'anon-key-belum-diisi',
    {
      db: { retry: isSupabaseConfigured },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Di luar Server Component, `set` akan gagal.
            // Middleware yang menangani refresh token.
          }
        },
      },
    },
  )
}
