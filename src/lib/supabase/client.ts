import { createBrowserClient } from '@supabase/ssr'

import { isSupabaseConfigured, supabaseUrl } from './config'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'anon-key-belum-diisi',
    { db: { retry: isSupabaseConfigured } },
  )
}
