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
import { getServiceById } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updateService } from '../../actions'

export const metadata: Metadata = { title: 'Edit Layanan' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ServiceEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const serviceId = Number.parseInt(id, 10)
  const query = await searchParams

  const service = Number.isNaN(serviceId) ? null : await getServiceById(serviceId)
  if (!service) notFound()

  return (
    <FormShell
      title="Edit Layanan"
      description="Ubah data layanan"
      backHref="/admin/services"
      action={updateService}
      submitName="update"
      error={toParam(query.error)}
    >
      <HiddenId name="id" value={service.id} />

      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" defaultValue={service.title} required />
      </Field>

      <Field label="Ringkasan" htmlFor="description">
        <TextArea name="description" rows={3} defaultValue={service.description} />
      </Field>

      <Field label="Isi Lengkap" htmlFor="body">
        <TextArea name="body" rows={10} defaultValue={service.body} />
      </Field>

      <Field label="Ikon (class Font Awesome)" htmlFor="icon">
        <TextInput name="icon" defaultValue={service.icon} />
      </Field>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" hint="Mengunggah file baru akan mengganti gambar lama." />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url" hint="Dipakai bila tidak ada file yang diunggah.">
        <TextInput name="image_url" type="url" defaultValue={service.image} />
      </Field>

      <Checkbox name="is_active" label="Aktif" defaultChecked={service.is_active} />
    </FormShell>
  )
}