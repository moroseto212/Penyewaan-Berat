import { createPublicClient } from '@/lib/supabase/public'
import { toStringArray } from '@/lib/site'
import type {
  BlogPost,
  Category,
  Equipment,
  EquipmentImage,
  EquipmentWithCategory,
  Faq,
  Project,
  ProjectImage,
  Service,
  ServiceArea,
  Testimonial,
} from '@/lib/supabase/types'

export * from './site'

/**
 * Query untuk halaman publik.
 *
 * Semua memakai `createPublicClient()` (tanpa cookie session) supaya:
 *  - RLS hanya meloloskan baris yang aktif/terbit (dijamin oleh database),
 *  - hasil bisa di-cache & di-static-kan oleh Next.js/Vercel.
 *
 * Ganti ke `createClient()` dari `@/lib/supabase/server` bila butuh melihat
 * draft (halaman admin memakai `@/lib/admin/queries`).
 */

/* ------------------------------------------------------------ kategori */

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data as Category[]) ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return (data as Category) ?? null
}

/* ------------------------------------------------------------ equipment */

export type EquipmentSort = 'terbaru' | 'termurah' | 'termahal' | 'nama-asc' | 'nama-desc'

export type EquipmentFilters = {
  search?: string
  category?: string
  status?: string
  sort?: EquipmentSort
  page?: number
  perPage?: number
}

const EQUIPMENT_SELECT = '*, category:categories(id, name, slug, icon)'

export async function getEquipmentList(filters: EquipmentFilters): Promise<{
  items: EquipmentWithCategory[]
  total: number
  page: number
  perPage: number
  lastPage: number
}> {
  const supabase = createPublicClient()
  const page = Math.max(1, filters.page ?? 1)
  const perPage = filters.perPage ?? 12
  const from = (page - 1) * perPage

  // Filter kategori: cari id-nya dulu supaya bisa digabung dengan filter/sort
  // lain dalam satu query (tidak bisa mencampur `category.slug` dengan PostgREST).
  let categoryId: number | null = null
  if (filters.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .maybeSingle<{ id: number }>()

    if (!category) return { items: [], total: 0, page, perPage, lastPage: 1 }
    categoryId = category.id
  }

  let query = supabase
    .from('equipment')
    .select(EQUIPMENT_SELECT, { count: 'exact' })
    .range(from, from + perPage - 1)

  if (categoryId) query = query.eq('category_id', categoryId)

  if (filters.search) {
    const term = filters.search.replace(/[%,()]/g, ' ').trim()
    if (term) {
      const like = `%${term}%`
      query = query.or(
        `name.ilike.${like},brand.ilike.${like},model.ilike.${like},description.ilike.${like}`,
      )
    }
  }

  if (filters.status) {
    query = query.eq('status', filters.status as Equipment['status'])
  }

  switch (filters.sort) {
    case 'termurah':
      query = query.order('price', { ascending: true, nullsFirst: false })
      break
    case 'termahal':
      query = query.order('price', { ascending: false, nullsFirst: false })
      break
    case 'nama-asc':
      query = query.order('name', { ascending: true })
      break
    case 'nama-desc':
      query = query.order('name', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, count } = await query

  return {
    items: (data as EquipmentWithCategory[]) ?? [],
    total: count ?? 0,
    page,
    perPage,
    lastPage: Math.max(1, Math.ceil((count ?? 0) / perPage)),
  }
}

export async function getFeaturedEquipment(limit = 4): Promise<EquipmentWithCategory[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('equipment')
    .select(EQUIPMENT_SELECT)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as EquipmentWithCategory[]) ?? []
}

export async function getEquipmentBySlug(slug: string): Promise<EquipmentWithCategory | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('equipment')
    .select(EQUIPMENT_SELECT)
    .eq('slug', slug)
    .maybeSingle()
  return (data as EquipmentWithCategory) ?? null
}

export async function getEquipmentImages(equipmentId: number): Promise<EquipmentImage[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('equipment_images')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('sort_order')
  return (data as EquipmentImage[]) ?? []
}

export async function getRelatedEquipment(
  categoryId: number,
  excludeId: number,
  limit = 4,
): Promise<EquipmentWithCategory[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('equipment')
    .select(EQUIPMENT_SELECT)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(limit)
  return (data as EquipmentWithCategory[]) ?? []
}

/* -------------------------------------------------------------- layanan */

export async function getServices(limit?: number): Promise<Service[]> {
  const supabase = createPublicClient()
  let query = supabase.from('services').select('*').eq('is_active', true).order('id')

  if (limit) query = query.limit(limit)
  const { data } = await query
  return (data as Service[]) ?? []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return (data as Service) ?? null
}

export async function getRelatedServices(excludeId: number, limit = 3): Promise<Service[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .neq('id', excludeId)
    .order('id')
    .limit(limit)
  return (data as Service[]) ?? []
}

/* --------------------------------------------------------- area layanan */

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('service_areas')
    .select('*')
    .eq('is_active', true)
    .order('id')
  return (data as ServiceArea[]) ?? []
}

/* --------------------------------------------------------------- proyek */

export async function getProjects(options?: {
  featured?: boolean
  category?: string
  limit?: number
  page?: number
  perPage?: number
}): Promise<Project[]> {
  const supabase = createPublicClient()
  let query = supabase.from('projects').select('*').eq('is_active', true)

  if (options?.featured) query = query.eq('is_featured', true)
  if (options?.category) query = query.eq('category', options.category)
  query = query.order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  } else if (options?.page && options?.perPage) {
    const from = (options.page - 1) * options.perPage
    query = query.range(from, from + options.perPage - 1)
  }

  const { data } = await query
  return (data as Project[]) ?? []
}

export async function getProjectCount(category?: string): Promise<number> {
  const supabase = createPublicClient()
  let query = supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_active', true)
  if (category) query = query.eq('category', category)
  const { count } = await query
  return count ?? 0
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return (data as Project) ?? null
}

export async function getProjectImages(projectId: number): Promise<ProjectImage[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  return (data as ProjectImage[]) ?? []
}

export async function getRelatedProjects(
  category: string | null,
  excludeId: number,
  limit = 3,
): Promise<Project[]> {
  const supabase = createPublicClient()
  let query = supabase.from('projects').select('*').eq('is_active', true).neq('id', excludeId)

  if (category) query = query.eq('category', category)
  else query = query.order('created_at', { ascending: false })

  const { data } = await query.limit(limit)
  return (data as Project[]) ?? []
}

export const PROJECT_CATEGORIES = [
  'konstruksi',
  'pertambangan',
  'infrastruktur',
  'industri',
  'kelautan',
] as const

/* ------------------------------------------------------------ testimoni */

export async function getTestimonials(options?: {
  featuredOnly?: boolean
  page?: number
  perPage?: number
}): Promise<Testimonial[]> {
  const supabase = createPublicClient()
  let query = supabase.from('testimonials').select('*').eq('is_active', true)
  if (options?.featuredOnly) query = query.eq('is_featured', true)
  query = query.order('id')

  if (options?.page && options?.perPage) {
    const from = (options.page - 1) * options.perPage
    query = query.range(from, from + options.perPage - 1)
  }

  const { data } = await query
  return (data as Testimonial[]) ?? []
}

export async function getTestimonialCount(): Promise<number> {
  const supabase = createPublicClient()
  const { count } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  return count ?? 0
}

/* ----------------------------------------------------------------- blog */

export async function getPublishedPosts(options?: {
  search?: string
  tag?: string
  limit?: number
  page?: number
  perPage?: number
}): Promise<BlogPost[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .not('published_at', 'is', null)

  if (options?.search) {
    const term = options.search.replace(/[%,()]/g, ' ').trim()
    if (term) {
      const like = `%${term}%`
      query = query.or(`title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`)
    }
  }

  if (options?.tag) query = query.contains('tags', [options.tag])

  query = query.order('published_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  } else if (options?.page && options?.perPage) {
    const from = (options.page - 1) * options.perPage
    query = query.range(from, from + options.perPage - 1)
  }

  const { data } = await query
  return (data as BlogPost[]) ?? []
}

export async function getPostCount(options?: { search?: string; tag?: string }): Promise<number> {
  const supabase = createPublicClient()
  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .not('published_at', 'is', null)

  if (options?.search) {
    const term = options.search.replace(/[%,()]/g, ' ').trim()
    if (term) {
      const like = `%${term}%`
      query = query.or(`title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`)
    }
  }
  if (options?.tag) query = query.contains('tags', [options.tag])

  const { count } = await query
  return count ?? 0
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .maybeSingle()
  return (data as BlogPost) ?? null
}

export async function getRecentPosts(excludeId?: number, limit = 5): Promise<BlogPost[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query.limit(limit)
  return (data as BlogPost[]) ?? []
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const supabase = createPublicClient()
  const tags = toStringArray(post.tags)

  if (tags.length > 0) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .not('published_at', 'is', null)
      .neq('id', post.id)
      .contains('tags', [tags[0]])
      .order('published_at', { ascending: false })
      .limit(limit)

    const rows = (data as BlogPost[]) ?? []
    if (rows.length > 0) return rows
  }

  return getRecentPosts(post.id, limit)
}

/** Semua tag yang dipakai artikel terbit, untuk link tag di halaman detail. */
export async function getAllPostTags(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const tags = new Set<string>()
  for (const post of posts) {
    for (const tag of toStringArray(post.tags)) tags.add(tag)
  }
  return [...tags].sort()
}

/* ------------------------------------------------------------------ faq */

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data as Faq[]) ?? []
}

/* --------------------------------------------------------------- kontak */

/**
 * Pesan dari form kontak publik.
 *
 * Sengaja memakai public client (anon) karena tabel `contacts` memiliki policy
 * `contacts_insert_public`. Isi form tetap divalidasi lebih dulu di server
 * action-nya (`src/app/(public)/kontak/actions.ts`).
 */
export async function submitContact(payload: {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  subject?: string | null
  message: string
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = createPublicClient()
  const { error } = await supabase.from('contacts').insert({
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    company: payload.company ?? null,
    subject: payload.subject ?? null,
    message: payload.message,
  })

  return error ? { ok: false, error: error.message } : { ok: true }
}