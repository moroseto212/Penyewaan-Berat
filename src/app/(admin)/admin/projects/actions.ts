'use server'

import { revalidatePath } from 'next/cache'

import {
  allFields,
  boolValue,
  dbError,
  field,
  files,
  flashError,
  flashSuccess,
  intValue,
  longText,
  nullableText,
  requiredText,
} from '@/lib/admin/form'
import { BUCKETS, deleteImage, uploadImage } from '@/lib/admin/storage'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/projects'

type Payload = {
  title: string
  description: string | null
  body: string | null
  client: string | null
  location: string | null
  category: string | null
  equipment_used: string | null
  start_date: string | null
  end_date: string | null
  is_featured: boolean
  is_active: boolean
}

async function payload(form: FormData): Promise<Payload | string> {
  const title = requiredText(form, 'title', 'Judul')
  if (title) return title

  return {
    title: field(form, 'title'),
    description: longText(form, 'description'),
    body: longText(form, 'body'),
    client: nullableText(form, 'client'),
    location: nullableText(form, 'location'),
    category: nullableText(form, 'category'),
    equipment_used: longText(form, 'equipment_used'),
    start_date: nullableText(form, 'start_date'),
    end_date: nullableText(form, 'end_date'),
    is_featured: boolValue(form, 'is_featured'),
    is_active: boolValue(form, 'is_active'),
  }
}

/** File diunggah lebih dulu; bila tidak ada file, dipakai URL yang diisi. */
async function resolveMainImage(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('image').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.projects, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'image_url') }
}

/** Menambah gambar galeri (file dan/atau URL) dengan sort_order berlanjut. */
async function addGalleryImages(
  form: FormData,
  projectId: number,
  errorPath: string,
): Promise<void> {
  const supabase = await createClient()

  const { data: last } = await supabase
    .from('project_images')
    .select('sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  let sortOrder = last?.sort_order ?? 0

  const uploads = await Promise.all(
    files(form, 'gallery_images').map((file) => uploadImage(BUCKETS.projects, file)),
  )
  const failed = uploads.find((result) => 'error' in result)
  if (failed && 'error' in failed) flashError(errorPath, failed.error)

  const paths = [
    ...uploads.flatMap((result) => ('url' in result ? [result.url] : [])),
    ...allFields(form, 'gallery_urls'),
  ]

  if (paths.length === 0) return

  const rows = paths.map((path) => ({
    project_id: projectId,
    image_path: path,
    is_primary: false,
    sort_order: (sortOrder += 1),
  }))

  const { error } = await supabase.from('project_images').insert(rows)
  if (error) flashError(errorPath, dbError(error))
}

/**
 * Menghapus baris gambar utama lama beserta file Storage-nya.
 * `projects.image` tidak disentuh karena sudah menunjuk gambar baru.
 */
async function removePrimaryImage(projectId: number, currentImage: string | null): Promise<void> {
  const supabase = await createClient()

  const { data: primary } = await supabase
    .from('project_images')
    .select('id, image_path')
    .eq('project_id', projectId)
    .eq('is_primary', true)
    .maybeSingle()

  if (primary) {
    await deleteImage(BUCKETS.projects, primary.image_path)
    await supabase.from('project_images').delete().eq('id', primary.id)
  } else {
    await deleteImage(BUCKETS.projects, currentImage)
  }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/proyek')
}

export async function storeProject(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/create`, data)

  const imageResult = await resolveMainImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('projects')
    .insert({ ...data, slug: slugify(data.title), image })
    .select('id')
    .single()

  if (error || !created) flashError(`${INDEX}/create`, dbError(error))

  if (image) {
    const { error: primaryError } = await supabase.from('project_images').insert({
      project_id: created.id,
      image_path: image,
      is_primary: true,
      sort_order: 0,
    })
    if (primaryError) flashError(`${INDEX}/create`, dbError(primaryError))
  }

  await addGalleryImages(form, created.id, `${INDEX}/create`)

  revalidatePublic()
  flashSuccess(INDEX, 'Proyek berhasil ditambahkan.')
}

export async function updateProject(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Proyek tidak valid.')

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/${id}/edit`, data)

  const imageResult = await resolveMainImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('projects')
    .select('image')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase
    .from('projects')
    .update({ ...data, slug: slugify(data.title), image })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (image && image !== current?.image) {
    await removePrimaryImage(id, current?.image ?? null)

    const { error: primaryError } = await supabase.from('project_images').insert({
      project_id: id,
      image_path: image,
      is_primary: true,
      sort_order: 0,
    })
    if (primaryError) flashError(`${INDEX}/${id}/edit`, dbError(primaryError))
  }

  await addGalleryImages(form, id, `${INDEX}/${id}/edit`)

  revalidatePublic()
  flashSuccess(INDEX, 'Proyek berhasil diperbarui.')
}

export async function deleteProjectImage(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Gambar tidak valid.')

  const supabase = await createClient()
  const { data: image, error: readError } = await supabase
    .from('project_images')
    .select('id, project_id, image_path, is_primary')
    .eq('id', id)
    .maybeSingle()
  if (readError || !image) flashError(INDEX, dbError(readError))

  const { error } = await supabase.from('project_images').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.projects, image.image_path)

  if (image.is_primary) {
    await supabase.from('projects').update({ image: null }).eq('id', image.project_id)
  }

  revalidatePath(`${INDEX}/${image.project_id}/edit`)
  revalidatePublic()
  flashSuccess(`${INDEX}/${image.project_id}/edit`, 'Gambar berhasil dihapus.')
}

export async function deleteProject(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Proyek tidak valid.')

  const supabase = await createClient()
  const { data: images } = await supabase
    .from('project_images')
    .select('image_path')
    .eq('project_id', id)

  const { data: project } = await supabase
    .from('projects')
    .select('image')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  for (const image of images ?? []) {
    await deleteImage(BUCKETS.projects, image.image_path)
  }
  await deleteImage(BUCKETS.projects, project?.image)

  revalidatePublic()
  flashSuccess(INDEX, 'Proyek berhasil dihapus.')
}