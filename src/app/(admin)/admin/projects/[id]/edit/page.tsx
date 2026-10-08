import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  Checkbox,
  Field,
  FileInput,
  HiddenId,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { ImageGallery } from '@/components/admin/image-gallery'
import { getProjectById, getProjectImages } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { deleteProjectImage, updateProject } from '../../actions'

export const metadata: Metadata = { title: 'Edit Proyek' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProjectEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const projectId = Number.parseInt(id, 10)
  const query = await searchParams

  const project = Number.isNaN(projectId) ? null : await getProjectById(projectId)
  if (!project) notFound()

  const images = await getProjectImages(project.id)

  return (
    <FormShell
      title="Edit Proyek"
      description="Ubah data proyek"
      backHref="/admin/projects"
      action={updateProject}
      submitName="update"
      error={toParam(query.error)}
      maxWidth="max-w-4xl"
      after={
        <ImageGallery
          images={images}
          deleteAction={deleteProjectImage}
          label="Galeri Tersimpan"
          emptyMessage="Belum ada gambar di galeri proyek ini."
        />
      }
    >
      <HiddenId name="id" value={project.id} />

      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" defaultValue={project.title} required />
      </Field>

      <Field label="Ringkasan" htmlFor="description">
        <TextArea name="description" rows={3} defaultValue={project.description} />
      </Field>

      <Field label="Isi Lengkap" htmlFor="body">
        <TextArea name="body" rows={10} defaultValue={project.body} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Klien" htmlFor="client">
          <TextInput name="client" defaultValue={project.client} />
        </Field>

        <Field label="Lokasi" htmlFor="location">
          <TextInput name="location" defaultValue={project.location} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Kategori" htmlFor="category">
          <TextInput name="category" defaultValue={project.category} />
        </Field>

        <Field label="Mulai" htmlFor="start_date">
          <TextInput name="start_date" type="date" defaultValue={project.start_date} />
        </Field>

        <Field label="Selesai" htmlFor="end_date">
          <TextInput name="end_date" type="date" defaultValue={project.end_date} />
        </Field>
      </div>

      <Field label="Alat yang Digunakan" htmlFor="equipment_used">
        <TextArea name="equipment_used" rows={2} defaultValue={project.equipment_used} />
      </Field>

      <Field
        label="Ganti Gambar Utama"
        htmlFor="image"
        hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB. Kosongkan bila tidak ingin diganti."
      >
        <FileInput name="image" />
      </Field>

      <Field label="Atau URL gambar utama" htmlFor="image_url" hint="Dipakai bila tidak ada file diunggah.">
        <TextInput name="image_url" type="url" defaultValue={project.image} />
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
        <Checkbox name="is_active" label="Aktif" defaultChecked={project.is_active} />
        <Checkbox name="is_featured" label="Jadikan unggulan" defaultChecked={project.is_featured} />
      </div>
    </FormShell>
  )
}