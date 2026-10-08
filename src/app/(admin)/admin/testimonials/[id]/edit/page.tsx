import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  Checkbox,
  Field,
  FileInput,
  HiddenId,
  Select,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { getTestimonialById } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updateTestimonial } from '../../actions'

export const metadata: Metadata = { title: 'Edit Testimoni' }

const RATINGS = [1, 2, 3, 4, 5].map((value) => ({ value, label: `${value} bintang` }))

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TestimonialEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const testimonialId = Number.parseInt(id, 10)
  const query = await searchParams

  const item = Number.isNaN(testimonialId) ? null : await getTestimonialById(testimonialId)
  if (!item) notFound()

  return (
    <FormShell
      title="Edit Testimoni"
      description="Ubah data testimoni"
      backHref="/admin/testimonials"
      action={updateTestimonial}
      submitName="update"
      error={toParam(query.error)}
    >
      <HiddenId name="id" value={item.id} />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nama Klien" htmlFor="client_name" required>
          <TextInput name="client_name" defaultValue={item.client_name} required />
        </Field>

        <Field label="Jabatan" htmlFor="client_position">
          <TextInput name="client_position" defaultValue={item.client_position} />
        </Field>
      </div>

      <Field label="Perusahaan" htmlFor="company">
        <TextInput name="company" defaultValue={item.company} />
      </Field>

      <Field label="Isi Testimoni" htmlFor="content" required>
        <TextArea name="content" rows={5} defaultValue={item.content} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Rating" htmlFor="rating" required>
          <Select name="rating" options={RATINGS} defaultValue={item.rating} />
        </Field>

        <Field label="Foto" htmlFor="photo" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
          <FileInput name="photo" hint="Mengunggah file baru akan mengganti foto lama." />
        </Field>
      </div>

      <Field label="Atau URL foto" htmlFor="photo_url">
        <TextInput name="photo_url" type="url" defaultValue={item.photo} />
      </Field>

      <div className="flex flex-wrap gap-6 pt-2">
        <Checkbox name="is_active" label="Aktif" defaultChecked={item.is_active} />
        <Checkbox name="is_featured" label="Jadikan unggulan" defaultChecked={item.is_featured} />
      </div>
    </FormShell>
  )
}