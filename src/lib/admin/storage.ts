import { createClient } from '@/lib/supabase/server'

export const BUCKETS = {
  equipment: 'equipment',
  projects: 'projects',
  blog: 'blog',
  categories: 'categories',
  serviceAreas: 'service-areas',
  services: 'services',
  testimonials: 'testimonials',
} as const

export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS]

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 5 * 1024 * 1024

export type UploadResult = { url: string } | { error: string }

function safeName(file: File): string {
  const dot = file.name.lastIndexOf('.')
  const ext = dot > -1 ? file.name.slice(dot).toLowerCase().replace(/[^.a-z0-9]/g, '') : '.jpg'
  const base = (dot > -1 ? file.name.slice(0, dot) : file.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${base || 'gambar'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
}

/**
 * Upload satu file ke bucket Supabase Storage dan kembalikan public URL.
 * Bucket bersifat publik-read sehingga aman dipakai langsung di `<Image src>`.
 */
export async function uploadImage(bucket: Bucket, file: File): Promise<UploadResult> {
  if (!ACCEPTED.includes(file.type)) {
    return { error: `Format ${file.name} tidak didukung. Gunakan JPG, PNG, WEBP, atau AVIF.` }
  }
  if (file.size > MAX_SIZE) {
    return { error: `${file.name} melebihi batas 5MB.` }
  }

  const supabase = await createClient()
  const path = `${new Date().getFullYear()}/${safeName(file)}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}

/**
 * Hapus file di Storage. Hanya mencoba menghapus URL yang benar-benar milik
 * Supabase project ini; URL eksternal (mis. Unsplash) diabaikan.
 */
export async function deleteImage(bucket: Bucket, url: string | null | undefined): Promise<void> {
  if (!url) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !url.startsWith(supabaseUrl)) return

  const marker = '/storage/v1/object/public/'
  const index = url.indexOf(marker)
  if (index === -1) return

  const path = decodeURIComponent(url.slice(index + marker.length))
  const [pathBucket, ...rest] = path.split('/')
  if (pathBucket !== bucket || rest.length === 0) return

  await createClient().then((supabase) => supabase.storage.from(bucket).remove([rest.join('/')]))
}

/** True bila URL gambar disimpan di Supabase Storage project ini. */
export function isManagedUrl(url: string | null | undefined): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return Boolean(url && supabaseUrl && url.startsWith(supabaseUrl))
}