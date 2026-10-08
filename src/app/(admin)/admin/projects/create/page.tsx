import type { Metadata } from 'next'

import {
  Checkbox,
  Field,
  FileInput,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { toParam } from '@/lib/site'
import { storeProject } from '../actions'

export const metadata: Metadata = { title: 'Tambah Proyek' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProjectCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah Proyek"
      description="Buat proyek baru"
      backHref="/admin/projects"
      action={storeProject}
      error={toParam(params.error)}
    >
      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" required />
      </Field>

      <Field label="Ringkasan" htmlFor="description">
        <TextArea name="description" rows={3} />
      </Field>

      <Field label="Isi Lengkap" htmlFor="body" hint="Mendukung HTML dasar.">
        <TextArea name="body" rows={10} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Klien" htmlFor="client">
          <TextInput name="client" />
        </Field>

        <Field label="Lokasi" htmlFor="location">
          <TextInput name="location" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Kategori" htmlFor="category">
          <TextInput name="category" placeholder="Kontruksi" />
        </Field>

        <Field label="Mulai" htmlFor="start_date">
          <TextInput name="start_date" type="date" />
        </Field>

        <Field label="Selesai" htmlFor="end_date">
          <TextInput name="end_date" type="date" />
        </Field>
      </div>

      <Field label="Alat yang Digunakan" htmlFor="equipment_used">
        <TextArea name="equipment_used" rows={2} />
      </Field>

      <Field label="Gambar Utama" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" />
      </Field>

      <Field label="Atau URL gambar utama" htmlFor="image_url">
        <TextInput name="image_url" type="url" placeholder="https://..." />
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

      <div className="flex flex-wrap gap-6 pt-2">
        <Checkbox name="is_active" label="Aktif" defaultChecked />
        <Checkbox name="is_featured" label="Jadikan unggulan" />
      </div>
    </FormShell>
  )
}