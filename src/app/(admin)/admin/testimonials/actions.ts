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
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/testimonials'

type Payload = {
  client_name: string
  client_position: string | null
  company: string | null
  content: string
  rating: number
  is_active: boolean
  is_featured: boolean
}

async function payload(form: FormData): Promise<Payload | string> {
  const clientName = field(form, 'client_name')
  const content = longText(form, 'content')
  if (!clientName) return 'Nama klien wajib diisi.'
  if (!content) return 'Isi testimoni wajib diisi.'

  const rating = intValue(form, 'rating') ?? 5
  if (rating < 1 || rating > 5) return 'Rating harus antara 1 sampai 5.'

  return {
    client_name: clientName,
    client_position: nullableText(form, 'client_position'),
    company: nullableText(form, 'company'),
    content,
    rating,
    is_active: boolValue(form, 'is_active'),
    is_featured: boolValue(form, 'is_featured'),
  }
}

async function resolvePhoto(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('photo').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.testimonials, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'photo_url') }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/testimoni')
}

export async function storeTestimonial(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/create`, data)

  const imageResult = await resolvePhoto(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const photo = imageResult.url

  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert({ ...data, photo })

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Testimoni berhasil ditambahkan.')
}

export async function updateTestimonial(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Testimoni tidak valid.')

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/${id}/edit`, data)

  const imageResult = await resolvePhoto(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const photo = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('testimonials')
    .select('photo')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase.from('testimonials').update({ ...data, photo }).eq('id', id)
  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (photo && photo !== current?.photo) {
    await deleteImage(BUCKETS.testimonials, current?.photo)
  }

  revalidatePublic()
  flashSuccess(INDEX, 'Testimoni berhasil diperbarui.')
}

export async function deleteTestimonial(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Testimoni tidak valid.')

  const supabase = await createClient()
  const { data: current } = await supabase
    .from('testimonials')
    .select('photo')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.testimonials, current?.photo)

  revalidatePublic()
  flashSuccess(INDEX, 'Testimoni berhasil dihapus.')
}