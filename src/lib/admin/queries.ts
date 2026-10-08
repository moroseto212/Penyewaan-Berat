import { createClient } from '@/lib/supabase/server'
import type {
  BlogPost,
  Category,
  Contact,
  EquipmentImage,
  EquipmentWithCategory,
  Faq,
  ProjectImage,
  Project,
  Service,
  ServiceArea,
  Testimonial,
} from '@/lib/supabase/types'

/**
 * Query khusus panel admin.
 *
 * Berbeda dengan `src/lib/queries.ts` (public client, cache-friendly), semua
 * query di file ini memakai client ber-cookie sehingga RLS `is_admin()` aktif
 * dan baris yang tidak aktif/published ikut terbaca.
 */

export const PER_PAGE = 10

type Paged<T> = { items: T[]; total: number; page: number; perPage: number }

function paginate<T>(rows: T[] | null, page: number, perPage: number, total: number | null): Paged<T> {
  return {
    items: rows ?? [],
    total: total ?? rows?.length ?? 0,
    page,
    perPage,
  }
}

export async function getUnreadContactCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  return count ?? 0
}

/* -------------------------------------------------------------- dashboard */

export type DashboardStats = {
  equipment: number
  categories: number
  services: number
  serviceAreas: number
  projects: number
  testimonials: number
  blogPosts: number
  faqs: number
  contactsTotal: number
  contactsUnread: number
  totalUnits: number
  availableUnits: number
  statusCounts: { available: number; rented: number; maintenance: number }
  recentContacts: Contact[]
}

async function countOf(table: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return count ?? 0
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const [
    equipment,
    categories,
    services,
    serviceAreas,
    projects,
    testimonials,
    blogPosts,
    faqs,
    contactsTotal,
    contactsUnread,
    statusRows,
    unitRows,
    recentContacts,
  ] = await Promise.all([
    countOf('equipment'),
    countOf('categories'),
    countOf('services'),
    countOf('service_areas'),
    countOf('projects'),
    countOf('testimonials'),
    countOf('blog_posts'),
    countOf('faqs'),
    countOf('contacts'),
    getUnreadContactCount(),
    supabase.from('equipment').select('status'),
    supabase.from('equipment').select('total_units, available_units'),
    supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const statusCounts = { available: 0, rented: 0, maintenance: 0 }
  for (const row of (statusRows.data ?? []) as { status: keyof typeof statusCounts }[]) {
    if (row.status in statusCounts) statusCounts[row.status] += 1
  }

  let totalUnits = 0
  let availableUnits = 0
  for (const row of (unitRows.data ?? []) as {
    total_units: number | null
    available_units: number | null
  }[]) {
    totalUnits += row.total_units ?? 0
    availableUnits += row.available_units ?? 0
  }

  return {
    equipment,
    categories,
    services,
    serviceAreas,
    projects,
    testimonials,
    blogPosts,
    faqs,
    contactsTotal,
    contactsUnread,
    totalUnits,
    availableUnits,
    statusCounts,
    recentContacts: (recentContacts.data as Contact[]) ?? [],
  }
}

/* ------------------------------------------------------------- categories */

export async function getAdminCategories(page = 1): Promise<Paged<Category>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })
    .order('sort_order')
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Category[] | null, page, PER_PAGE, count)
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data as Category[]) ?? []
}

export async function getCategory(id: number): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('id', id).maybeSingle()
  return (data as Category) ?? null
}

/* -------------------------------------------------------------- equipment */

export async function getAdminEquipment(page = 1): Promise<Paged<EquipmentWithCategory>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('equipment')
    .select('*, category:categories(id, name, slug, icon)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PER_PAGE - 1)

  return paginate(data as EquipmentWithCategory[] | null, page, PER_PAGE, count)
}

export async function getEquipmentById(id: number): Promise<EquipmentWithCategory | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('equipment')
    .select('*, category:categories(id, name, slug, icon)')
    .eq('id', id)
    .maybeSingle()
  return (data as EquipmentWithCategory) ?? null
}

export async function getEquipmentImages(equipmentId: number): Promise<EquipmentImage[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('equipment_images')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('sort_order')
  return (data as EquipmentImage[]) ?? []
}

/* --------------------------------------------------------------- services */

export async function getAdminServices(page = 1): Promise<Paged<Service>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('services')
    .select('*', { count: 'exact' })
    .order('id')
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Service[] | null, page, PER_PAGE, count)
}

export async function getServiceById(id: number): Promise<Service | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('*').eq('id', id).maybeSingle()
  return (data as Service) ?? null
}

/* ---------------------------------------------------------- service areas */

export async function getAdminServiceAreas(page = 1): Promise<Paged<ServiceArea>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('service_areas')
    .select('*', { count: 'exact' })
    .order('id')
    .range(from, from + PER_PAGE - 1)

  return paginate(data as ServiceArea[] | null, page, PER_PAGE, count)
}

export async function getServiceAreaById(id: number): Promise<ServiceArea | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('service_areas').select('*').eq('id', id).maybeSingle()
  return (data as ServiceArea) ?? null
}

/* --------------------------------------------------------------- projects */

export async function getAdminProjects(page = 1): Promise<Paged<Project>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Project[] | null, page, PER_PAGE, count)
}

export async function getProjectById(id: number): Promise<Project | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  return (data as Project) ?? null
}

export async function getProjectImages(projectId: number): Promise<ProjectImage[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  return (data as ProjectImage[]) ?? []
}

/* ----------------------------------------------------------- testimonials */

export async function getAdminTestimonials(page = 1): Promise<Paged<Testimonial>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact' })
    .order('id')
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Testimonial[] | null, page, PER_PAGE, count)
}

export async function getTestimonialById(id: number): Promise<Testimonial | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle()
  return (data as Testimonial) ?? null
}

/* ------------------------------------------------------------------- blog */

export async function getAdminPosts(page = 1): Promise<Paged<BlogPost>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PER_PAGE - 1)

  return paginate(data as BlogPost[] | null, page, PER_PAGE, count)
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  return (data as BlogPost) ?? null
}

/* ------------------------------------------------------------------- faqs */

export async function getAdminFaqs(page = 1): Promise<Paged<Faq>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  const { data, count } = await supabase
    .from('faqs')
    .select('*', { count: 'exact' })
    .order('sort_order')
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Faq[] | null, page, PER_PAGE, count)
}

export async function getFaqById(id: number): Promise<Faq | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle()
  return (data as Faq) ?? null
}

/* --------------------------------------------------------------- contacts */

export async function getAdminContacts(
  page = 1,
  filter: 'all' | 'unread' | 'read' = 'all',
): Promise<Paged<Contact>> {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE

  let query = supabase.from('contacts').select('*', { count: 'exact' })
  if (filter === 'unread') query = query.eq('is_read', false)
  if (filter === 'read') query = query.eq('is_read', true)

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + PER_PAGE - 1)

  return paginate(data as Contact[] | null, page, PER_PAGE, count)
}

export async function getContactById(id: number): Promise<Contact | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle()
  return (data as Contact) ?? null
}