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

const INDEX = '/admin/service-areas'

type Payload = {
  name: string
  description: string | null
  is_active: boolean
}

async function payload(form: FormData): Promise<Payload> {
  return {
    name: field(form, 'name'),
    description: longText(form, 'description'),
    is_active: boolValue(form, 'is_active'),
  }
}

async function resolveImage(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('image').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.serviceAreas, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'image_url') }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/area-layanan')
}

export async function storeServiceArea(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (!data.name) flashError(`${INDEX}/create`, 'Nama wajib diisi.')

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { error } = await supabase
    .from('service_areas')
    .insert({ ...data, slug: slugify(data.name), image })

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Area layanan berhasil ditambahkan.')
}

export async function updateServiceArea(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Area layanan tidak valid.')

  const data = await payload(form)
  if (!data.name) flashError(`${INDEX}/${id}/edit`, 'Nama wajib diisi.')

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('service_areas')
    .select('image')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase
    .from('service_areas')
    .update({ ...data, slug: slugify(data.name), image })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (image && image !== current?.image) {
    await deleteImage(BUCKETS.serviceAreas, current?.image)
  }

  revalidatePublic()
  flashSuccess(INDEX, 'Area layanan berhasil diperbarui.')
}

export async function deleteServiceArea(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Area layanan tidak valid.')

  const supabase = await createClient()
  const { data: current } = await supabase
    .from('service_areas')
    .select('image')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('service_areas').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.serviceAreas, current?.image)

  revalidatePublic()
  flashSuccess(INDEX, 'Area layanan berhasil dihapus.')
}