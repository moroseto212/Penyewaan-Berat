'use server'

import { revalidatePath } from 'next/cache'

import { dbError, flashError, flashSuccess, intValue } from '@/lib/admin/form'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/contacts'

export async function deleteContact(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Pesan tidak valid.')

  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) flashError(INDEX, dbError(error))

  revalidatePath(INDEX)
  flashSuccess(INDEX, 'Pesan berhasil dihapus.')
}

export async function toggleContactRead(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Pesan tidak valid.')

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('contacts')
    .select('is_read')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(INDEX, dbError(readError))

  const { error } = await supabase
    .from('contacts')
    .update({ is_read: !current?.is_read })
    .eq('id', id)

  if (error) flashError(INDEX, dbError(error))

  revalidatePath(INDEX)
  flashSuccess(INDEX, current?.is_read ? 'Pesan ditandai belum dibaca.' : 'Pesan ditandai sudah dibaca.')
}