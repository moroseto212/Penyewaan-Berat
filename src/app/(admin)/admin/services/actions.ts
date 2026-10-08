'use server'

import { revalidatePath } from 'next/cache'

import {
  boolValue,
  dbError,
  field,
  flashError,
  flashSuccess,
  intValue,
  longText,
  nullableText,
} from '@/lib/admin/form'
import { BUCKETS, deleteImage, uploadImage } from '@/lib/admin/storage'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/services'

type Payload = {
  title: string
  description: string | null
  body: string | null
  icon: string | null
  is_active: boolean
}

async function payload(form: FormData): Promise<Payload> {
  return {
    title: field(form, 'title'),
    description: longText(form, 'description'),
    body: longText(form, 'body'),
    icon: nullableText(form, 'icon'),
    is_active: boolValue(form, 'is_active'),
  }
}

/** Foto layanan opsional: file diunggah lebih dulu, URL dipakai bila tidak ada file. */
async function resolveImage(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('image').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.services, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'image_url') }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/layanan')
}

export async function storeService(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (!data.title) flashError(`${INDEX}/create`, 'Judul wajib diisi.')

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .insert({ ...data, slug: slugify(data.title), image })

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Layanan berhasil ditambahkan.')
}

export async function updateService(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Layanan tidak valid.')

  const data = await payload(form)
  if (!data.title) flashError(`${INDEX}/${id}/edit`, 'Judul wajib diisi.')

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('services')
    .select('image')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase
    .from('services')
    .update({ ...data, slug: slugify(data.title), image })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (image && image !== current?.image) {
    await deleteImage(BUCKETS.services, current?.image)
  }

  revalidatePublic()
  flashSuccess(INDEX, 'Layanan berhasil diperbarui.')
}

export async function deleteService(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Layanan tidak valid.')

  const supabase = await createClient()
  const { data: current } = await supabase
    .from('services')
    .select('image')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.services, current?.image)

  revalidatePublic()
  flashSuccess(INDEX, 'Layanan berhasil dihapus.')
}