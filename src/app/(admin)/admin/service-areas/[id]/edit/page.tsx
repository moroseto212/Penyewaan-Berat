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
import { getServiceAreaById } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updateServiceArea } from '../../actions'

export const metadata: Metadata = { title: 'Edit Area Layanan' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ServiceAreaEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const areaId = Number.parseInt(id, 10)
  const query = await searchParams

  const area = Number.isNaN(areaId) ? null : await getServiceAreaById(areaId)
  if (!area) notFound()

  return (
    <FormShell
      title="Edit Area Layanan"
      description="Ubah data wilayah layanan"
      backHref="/admin/service-areas"
      action={updateServiceArea}
      submitName="update"
      error={toParam(query.error)}
    >
      <HiddenId name="id" value={area.id} />

      <Field label="Nama" htmlFor="name" required>
        <TextInput name="name" defaultValue={area.name} required />
      </Field>

      <Field label="Deskripsi" htmlFor="description">
        <TextArea name="description" rows={4} defaultValue={area.description} />
      </Field>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" hint="Mengunggah file baru akan mengganti gambar lama." />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url">
        <TextInput name="image_url" type="url" defaultValue={area.image} />
      </Field>

      <Checkbox name="is_active" label="Aktif" defaultChecked={area.is_active} />
    </FormShell>
  )
}