import type { Category } from '@/lib/supabase/types'

import {
  Checkbox,
  Field,
  FileInput,
  Select,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { SpecEditor } from '@/components/admin/spec-editor'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Tersedia' },
  { value: 'rented', label: 'Disewa' },
  { value: 'maintenance', label: 'Maintenance' },
]

const PRICE_UNITS = ['per jam', 'per hari', 'per bulan', 'per tahun', 'per unit'].map((unit) => ({
  value: unit,
  label: unit,
}))

export type EquipmentDefaults = {
  category_id?: number | null
  name?: string | null
  brand?: string | null
  model?: string | null
  year?: number | null
  capacity?: string | null
  description?: string | null
  specifications?: unknown
  price?: number | null
  price_unit?: string | null
  status?: string | null
  is_featured?: boolean | null
  total_units?: number | null
  image?: string | null
}

/**
 * Isi form alat berat, dipakai bersama oleh halaman tambah dan edit.
 * Nilai awal berasal dari record yang sudah ada (mode edit).
 */
export function EquipmentFormFields({
  categories,
  defaults = {},
}: {
  categories: Category[]
  defaults?: EquipmentDefaults
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Kategori" htmlFor="category_id" required>
          <Select
            name="category_id"
            required
            placeholder="Pilih kategori"
            defaultValue={defaults.category_id ?? ''}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />
        </Field>

        <Field label="Nama Alat" htmlFor="name" required>
          <TextInput name="name" required defaultValue={defaults.name} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-4 gap-5">
        <Field label="Merek" htmlFor="brand">
          <TextInput name="brand" defaultValue={defaults.brand} />
        </Field>

        <Field label="Model" htmlFor="model">
          <TextInput name="model" defaultValue={defaults.model} />
        </Field>

        <Field label="Tahun" htmlFor="year">
          <TextInput name="year" type="number" defaultValue={defaults.year ?? ''} />
        </Field>

        <Field label="Kapasitas" htmlFor="capacity">
          <TextInput name="capacity" defaultValue={defaults.capacity} placeholder="20 ton" />
        </Field>
      </div>

      <Field label="Deskripsi" htmlFor="description">
        <TextArea name="description" rows={4} defaultValue={defaults.description} />
      </Field>

      <SpecEditor specifications={defaults.specifications} />

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Harga" htmlFor="price" hint="Tanpa titik pemisah.">
          <TextInput name="price" type="number" defaultValue={defaults.price ?? ''} />
        </Field>

        <Field label="Satuan Harga" htmlFor="price_unit">
          <Select
            name="price_unit"
            placeholder="Pilih satuan"
            defaultValue={defaults.price_unit ?? ''}
            options={PRICE_UNITS}
          />
        </Field>

        <Field label="Status" htmlFor="status" required>
          <Select
            name="status"
            required
            defaultValue={defaults.status ?? 'available'}
            options={STATUS_OPTIONS}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Total Unit" htmlFor="total_units" hint="Minimal 1.">
          <TextInput name="total_units" type="number" defaultValue={defaults.total_units ?? 1} />
        </Field>

        <Field
          label="Unit Tersedia"
          htmlFor="available_units"
          hint="Dikosongkan berarti sama dengan total unit."
        >
          <TextInput name="available_units" type="number" />
        </Field>
      </div>

      <Field label="Gambar Utama" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" />
      </Field>

      <Field label="Atau URL gambar utama" htmlFor="image_url" hint="Dipakai bila tidak ada file diunggah.">
        <TextInput name="image_url" type="url" defaultValue={defaults.image} />
      </Field>

      <Field label="Tambah Gambar Galeri" htmlFor="gallery_images" hint="Bisa pilih beberapa file sekaligus.">
        <FileInput name="gallery_images" multiple />
      </Field>

      <Field
        label="Atau URL gambar galeri"
        htmlFor="gallery_urls"
        hint="Satu URL per baris. Baris kosong diabaikan."
      >
        <div className="space-y-2">
          {[1, 2, 3].map((row) => (
            <TextInput key={row} name="gallery_urls" type="url" placeholder="https://..." />
          ))}
        </div>
      </Field>

      <Checkbox name="is_featured" label="Jadikan unggulan" defaultChecked={defaults.is_featured ?? false} />
    </>
  )
}