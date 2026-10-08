'use server'

import { revalidatePath } from 'next/cache'

import type { EquipmentStatus, Json } from '@/lib/supabase/types'

import {
  allFields,
  boolValue,
  dbError,
  field,
  files,
  flashError,
  flashSuccess,
  intValue,
  keyValuePairs,
  longText,
  nullableText,
} from '@/lib/admin/form'
import { BUCKETS, deleteImage, uploadImage } from '@/lib/admin/storage'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/equipment'

const STATUSES: EquipmentStatus[] = ['available', 'rented', 'maintenance']

type Payload = {
  category_id: number
  name: string
  brand: string | null
  model: string | null
  year: number | null
  capacity: string | null
  description: string | null
  specifications: Json | null
  price: number | null
  price_unit: string | null
  status: EquipmentStatus
  is_featured: boolean
  total_units: number
  available_units: number
}

function numberValue(form: FormData, name: string): number | null {
  const value = field(form, name)
  if (value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

async function payload(form: FormData): Promise<Payload | string> {
  const name = field(form, 'name')
  if (!name) return 'Nama alat wajib diisi.'

  const categoryId = intValue(form, 'category_id')
  if (!categoryId) return 'Kategori wajib dipilih.'

  const status = field(form, 'status') as EquipmentStatus
  if (!STATUSES.includes(status)) return 'Status tidak valid.'

  const year = numberValue(form, 'year')
  if (year !== null && (year < 1900 || year > 2099)) return 'Tahun harus antara 1900 sampai 2099.'

  const price = numberValue(form, 'price')
  if (price !== null && price < 0) return 'Harga tidak boleh negatif.'

  const totalUnits = Math.max(1, intValue(form, 'total_units') ?? 1)
  const availableUnits = intValue(form, 'available_units') ?? totalUnits
  if (availableUnits < 0) return 'Jumlah tersedia tidak boleh negatif.'

  return {
    category_id: categoryId,
    name,
    brand: nullableText(form, 'brand'),
    model: nullableText(form, 'model'),
    year,
    capacity: nullableText(form, 'capacity'),
    description: longText(form, 'description'),
    specifications: keyValuePairs(form, 'specs_keys', 'specs_values'),
    price,
    price_unit: nullableText(form, 'price_unit'),
    status,
    is_featured: boolValue(form, 'is_featured'),
    total_units: totalUnits,
    // Unit tersedia tidak boleh melebihi total unit.
    available_units: Math.min(availableUnits, totalUnits),
  }
}

async function resolveMainImage(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('image').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.equipment, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'image_url') }
}

async function addGalleryImages(form: FormData, equipmentId: number, errorPath: string): Promise<void> {
  const supabase = await createClient()

  const { data: last } = await supabase
    .from('equipment_images')
    .select('sort_order')
    .eq('equipment_id', equipmentId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  let sortOrder = last?.sort_order ?? 0

  const uploads = await Promise.all(
    files(form, 'gallery_images').map((file) => uploadImage(BUCKETS.equipment, file)),
  )
  const failed = uploads.find((result) => 'error' in result)
  if (failed && 'error' in failed) flashError(errorPath, failed.error)

  const paths = [
    ...uploads.flatMap((result) => ('url' in result ? [result.url] : [])),
    ...allFields(form, 'gallery_urls'),
  ]

  if (paths.length === 0) return

  const rows = paths.map((path) => ({
    equipment_id: equipmentId,
    image_path: path,
    is_primary: false,
    sort_order: (sortOrder += 1),
  }))

  const { error } = await supabase.from('equipment_images').insert(rows)
  if (error) flashError(errorPath, dbError(error))
}

/**
 * Menghapus gambar utama lama. `equipment.image` tidak disentuh karena sudah
 * menunjuk gambar baru pada baris `equipment`.
 */
async function removePrimaryImage(equipmentId: number, currentImage: string | null): Promise<void> {
  const supabase = await createClient()

  const { data: primary } = await supabase
    .from('equipment_images')
    .select('id, image_path')
    .eq('equipment_id', equipmentId)
    .eq('is_primary', true)
    .maybeSingle()

  if (primary) {
    await deleteImage(BUCKETS.equipment, primary.image_path)
    await supabase.from('equipment_images').delete().eq('id', primary.id)
  } else {
    await deleteImage(BUCKETS.equipment, currentImage)
  }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/katalog-alat')
}

export async function storeEquipment(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/create`, data)

  const imageResult = await resolveMainImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('equipment')
    .insert({ ...data, slug: slugify(data.name), image })
    .select('id')
    .single()

  if (error || !created) flashError(`${INDEX}/create`, dbError(error))

  if (image) {
    const { error: primaryError } = await supabase.from('equipment_images').insert({
      equipment_id: created.id,
      image_path: image,
      is_primary: true,
      sort_order: 0,
    })
    if (primaryError) flashError(`${INDEX}/create`, dbError(primaryError))
  }

  await addGalleryImages(form, created.id, `${INDEX}/create`)

  revalidatePublic()
  flashSuccess(INDEX, 'Alat berat berhasil ditambahkan.')
}

export async function updateEquipment(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Alat berat tidak valid.')

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/${id}/edit`, data)

  const imageResult = await resolveMainImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('equipment')
    .select('image')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase
    .from('equipment')
    .update({ ...data, slug: slugify(data.name), image })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (image && image !== current?.image) {
    await removePrimaryImage(id, current?.image ?? null)

    const { error: primaryError } = await supabase.from('equipment_images').insert({
      equipment_id: id,
      image_path: image,
      is_primary: true,
      sort_order: 0,
    })
    if (primaryError) flashError(`${INDEX}/${id}/edit`, dbError(primaryError))
  }

  await addGalleryImages(form, id, `${INDEX}/${id}/edit`)

  revalidatePublic()
  flashSuccess(INDEX, 'Alat berat berhasil diperbarui.')
}

export async function deleteEquipmentImage(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Gambar tidak valid.')

  const supabase = await createClient()
  const { data: image, error: readError } = await supabase
    .from('equipment_images')
    .select('id, equipment_id, image_path, is_primary')
    .eq('id', id)
    .maybeSingle()
  if (readError || !image) flashError(INDEX, dbError(readError))

  const { error } = await supabase.from('equipment_images').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.equipment, image.image_path)

  if (image.is_primary) {
    await supabase.from('equipment').update({ image: null }).eq('id', image.equipment_id)
  }

  revalidatePath(`${INDEX}/${image.equipment_id}/edit`)
  revalidatePublic()
  flashSuccess(`${INDEX}/${image.equipment_id}/edit`, 'Gambar berhasil dihapus.')
}

export async function deleteEquipment(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Alat berat tidak valid.')

  const supabase = await createClient()
  const { data: images } = await supabase
    .from('equipment_images')
    .select('image_path')
    .eq('equipment_id', id)

  const { data: equipment } = await supabase
    .from('equipment')
    .select('image')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('equipment').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  for (const image of images ?? []) {
    await deleteImage(BUCKETS.equipment, image.image_path)
  }
  await deleteImage(BUCKETS.equipment, equipment?.image)

  revalidatePublic()
  flashSuccess(INDEX, 'Alat berat berhasil dihapus.')
}