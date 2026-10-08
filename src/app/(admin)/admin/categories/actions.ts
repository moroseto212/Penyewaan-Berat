'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth'
import { dbError, field, flashError, flashSuccess, intValue, longText } from '@/lib/admin/form'
import { slugify } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/categories'

type Payload = {
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
}

async function payload(form: FormData): Promise<Payload> {
  return {
    name: field(form, 'name'),
    description: longText(form, 'description'),
    icon: field(form, 'icon') || 'fa-tag',
    // Checkbox tidak terkirim saat tidak dicentang.
    is_active: form.get('is_active') === 'on' || form.get('is_active') === 'true',
  }
}

/** Revalidasi halaman publik yang menampilkan kategori. */
function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/katalog-alat')
}

export async function storeCategory(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (!data.name) flashError(`${INDEX}/create`, 'Nama wajib diisi.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .insert({ ...data, slug: slugify(data.name) })

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Kategori berhasil ditambahkan.')
}

export async function updateCategory(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Kategori tidak valid.')

  const data = await payload(form)
  if (!data.name) flashError(`${INDEX}/${id}/edit`, 'Nama wajib diisi.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update({ ...data, slug: slugify(data.name) })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Kategori berhasil diperbarui.')
}

export async function deleteCategory(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Kategori tidak valid.')

  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  // 23503 = masih ada equipment yang memakai kategori ini.
  if (error) flashError(INDEX, error.code === '23503' ? 'Kategori masih dipakai alat berat.' : dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Kategori berhasil dihapus.')
}