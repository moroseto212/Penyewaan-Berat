export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type EquipmentStatus = 'available' | 'rented' | 'maintenance'

export type AdminUser = {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Equipment = {
  id: number
  category_id: number
  name: string
  slug: string
  brand: string | null
  model: string | null
  year: number | null
  capacity: string | null
  description: string | null
  specifications: Json | null
  price: number | null
  price_unit: string | null
  image: string | null
  images: Json | null
  status: EquipmentStatus
  is_featured: boolean
  total_units: number
  available_units: number
  created_at: string
  updated_at: string
}

export type EquipmentWithCategory = Equipment & {
  category: Pick<Category, 'id' | 'name' | 'slug' | 'icon'> | null
}

export type EquipmentImage = {
  id: number
  equipment_id: number
  image_path: string
  is_primary: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Service = {
  id: number
  title: string
  slug: string
  description: string | null
  body: string | null
  icon: string | null
  image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ServiceArea = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Project = {
  id: number
  title: string
  slug: string
  description: string | null
  body: string | null
  client: string | null
  location: string | null
  category: string | null
  equipment_used: string | null
  start_date: string | null
  end_date: string | null
  image: string | null
  images: Json | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProjectImage = {
  id: number
  project_id: number
  image_path: string
  is_primary: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  image: string | null
  author: string | null
  tags: Json | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Testimonial = {
  id: number
  client_name: string
  client_position: string | null
  company: string | null
  photo: string | null
  content: string
  rating: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type Contact = {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export type Faq = {
  id: number
  question: string
  answer: string
  category: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/* -------------------------------------------------------------------------- */
/* Helper untuk Insert/Update                                                  */
/* -------------------------------------------------------------------------- */

/** Kunci yang tipenya bisa `null` — kolom nullable di PostgreSQL. */
type NullableKeys<Row> = {
  [K in keyof Row]: null extends Row[K] ? K : never
}[keyof Row]

/**
 * Bentuk payload insert.
 *
 * Kolom yang nullable di database otomatis menjadi opsional, sehingga tidak
 * perlu mengirim `null` eksplisit (atau `image: null`) saat memang tidak diisi.
 */
type InsertShape<Row, RequiredKeys extends keyof Row, OptionalKeys extends keyof Row> = {
  [K in RequiredKeys as K extends NullableKeys<Row> ? never : K]: Row[K]
} & {
  [K in RequiredKeys as K extends NullableKeys<Row> ? K : never]?: Row[K]
} &
  Partial<Pick<Row, OptionalKeys>> &
  { id?: number; created_at?: string; updated_at?: string }

type UpdateShape<Row> = Partial<Omit<Row, 'id'>>

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser
        Insert: {
          id: string
          email: string
          name: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: UpdateShape<AdminUser>
        Relationships: []
      }
      categories: {
        Row: Category
        Insert: InsertShape<
          Category,
          'name' | 'slug' | 'description' | 'icon' | 'image',
          'is_active' | 'sort_order'
        >
        Update: UpdateShape<Category>
        Relationships: []
      }
      equipment: {
        Row: Equipment
        Insert: InsertShape<
          Equipment,
          'category_id' | 'name' | 'slug' | 'brand' | 'model' | 'year' | 'capacity' | 'description' | 'specifications' | 'price' | 'price_unit' | 'image' | 'images',
          'status' | 'is_featured' | 'total_units' | 'available_units'
        >
        Update: UpdateShape<Equipment>
        Relationships: [
          {
            foreignKeyName: 'equipment_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      equipment_images: {
        Row: EquipmentImage
        Insert: InsertShape<
          EquipmentImage,
          'equipment_id' | 'image_path',
          'is_primary' | 'sort_order'
        >
        Update: UpdateShape<EquipmentImage>
        Relationships: [
          {
            foreignKeyName: 'equipment_images_equipment_id_fkey'
            columns: ['equipment_id']
            isOneToOne: false
            referencedRelation: 'equipment'
            referencedColumns: ['id']
          },
        ]
      }
      services: {
        Row: Service
        Insert: InsertShape<
          Service,
          'title' | 'slug' | 'description' | 'body' | 'icon' | 'image',
          'is_active'
        >
        Update: UpdateShape<Service>
        Relationships: []
      }
      service_areas: {
        Row: ServiceArea
        Insert: InsertShape<ServiceArea, 'name' | 'slug' | 'description' | 'image', 'is_active'>
        Update: UpdateShape<ServiceArea>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: InsertShape<
          Project,
          | 'title'
          | 'slug'
          | 'description'
          | 'body'
          | 'client'
          | 'location'
          | 'category'
          | 'equipment_used'
          | 'start_date'
          | 'end_date'
          | 'image'
          | 'images',
          'is_featured' | 'is_active'
        >
        Update: UpdateShape<Project>
        Relationships: []
      }
      project_images: {
        Row: ProjectImage
        Insert: InsertShape<ProjectImage, 'project_id' | 'image_path', 'is_primary' | 'sort_order'>
        Update: UpdateShape<ProjectImage>
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      blog_posts: {
        Row: BlogPost
        Insert: InsertShape<
          BlogPost,
          'title' | 'slug' | 'excerpt' | 'body' | 'image' | 'author' | 'tags' | 'published_at',
          'is_published'
        >
        Update: UpdateShape<BlogPost>
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: InsertShape<
          Testimonial,
          'client_name' | 'client_position' | 'company' | 'photo' | 'content',
          'rating' | 'is_active' | 'is_featured'
        >
        Update: UpdateShape<Testimonial>
        Relationships: []
      }
      contacts: {
        Row: Contact
        Insert: InsertShape<
          Contact,
          'name' | 'email' | 'phone' | 'company' | 'subject' | 'message',
          'is_read'
        >
        Update: UpdateShape<Contact>
        Relationships: []
      }
      faqs: {
        Row: Faq
        Insert: InsertShape<Faq, 'question' | 'answer' | 'category', 'sort_order' | 'is_active'>
        Update: UpdateShape<Faq>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: { equipment_status: EquipmentStatus }
    CompositeTypes: Record<string, never>
  }
}
