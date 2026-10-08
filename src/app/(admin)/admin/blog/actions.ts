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

const INDEX = '/admin/blog'

type Payload = {
  title: string
  excerpt: string | null
  body: string | null
  author: string | null
  tags: string[] | null
  is_published: boolean
}

/** Tags dikirim sebagai satu string dipisah koma, lalu dibersihkan. */
function parseTags(value: string): string[] | null {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')
  return tags.length > 0 ? tags : null
}

async function payload(form: FormData): Promise<Payload | string> {
  const title = field(form, 'title')
  if (!title) return 'Judul wajib diisi.'

  return {
    title,
    excerpt: longText(form, 'excerpt'),
    body: longText(form, 'body'),
    author: nullableText(form, 'author'),
    tags: parseTags(field(form, 'tags')),
    is_published: boolValue(form, 'is_published'),
  }
}

async function resolveImage(form: FormData): Promise<{ url: string | null } | { error: string }> {
  const [file] = form.getAll('image').filter((value): value is File => value instanceof File)
  if (file && file.size > 0) {
    const result = await uploadImage(BUCKETS.blog, file)
    return 'error' in result ? { error: result.error } : { url: result.url }
  }
  return { url: nullableText(form, 'image_url') }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/blog')
}

export async function storePost(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/create`, data)

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/create`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').insert({
    ...data,
    slug: slugify(data.title),
    image,
    published_at: data.is_published ? new Date().toISOString() : null,
  })

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'Artikel berhasil ditambahkan.')
}

export async function updatePost(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Artikel tidak valid.')

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/${id}/edit`, data)

  const imageResult = await resolveImage(form)
  if ('error' in imageResult) flashError(`${INDEX}/${id}/edit`, imageResult.error)
  const image = imageResult.url

  const supabase = await createClient()
  const { data: current, error: readError } = await supabase
    .from('blog_posts')
    .select('image, published_at')
    .eq('id', id)
    .maybeSingle()
  if (readError) flashError(`${INDEX}/${id}/edit`, dbError(readError))

  const { error } = await supabase
    .from('blog_posts')
    .update({
      ...data,
      slug: slugify(data.title),
      image,
      // Tanggal terbit diisi saat pertama kali dipublikasikan.
      published_at: data.is_published ? current?.published_at ?? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  if (image && image !== current?.image) {
    await deleteImage(BUCKETS.blog, current?.image)
  }

  revalidatePublic()
  flashSuccess(INDEX, 'Artikel berhasil diperbarui.')
}

export async function deletePost(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'Artikel tidak valid.')

  const supabase = await createClient()
  const { data: current } = await supabase
    .from('blog_posts')
    .select('image')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) flashError(INDEX, dbError(error))

  await deleteImage(BUCKETS.blog, current?.image)

  revalidatePublic()
  flashSuccess(INDEX, 'Artikel berhasil dihapus.')
}