import type { Metadata } from 'next'

import { Checkbox, Field, FileInput, Select, TextArea, TextInput } from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { toParam } from '@/lib/site'
import { storeTestimonial } from '../actions'

export const metadata: Metadata = { title: 'Tambah Testimoni' }

const RATINGS = [1, 2, 3, 4, 5].map((value) => ({ value, label: `${value} bintang` }))

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TestimonialCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah Testimoni"
      description="Tambahkan testimoni klien baru"
      backHref="/admin/testimonials"
      action={storeTestimonial}
      error={toParam(params.error)}
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nama Klien" htmlFor="client_name" required>
          <TextInput name="client_name" required />
        </Field>

        <Field label="Jabatan" htmlFor="client_position">
          <TextInput name="client_position" placeholder="Contoh: Manajer Proyek" />
        </Field>
      </div>

      <Field label="Perusahaan" htmlFor="company">
        <TextInput name="company" />
      </Field>

      <Field label="Isi Testimoni" htmlFor="content" required>
        <TextArea name="content" rows={5} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Rating" htmlFor="rating" required>
          <Select name="rating" options={RATINGS} defaultValue={5} />
        </Field>

        <Field label="Foto" htmlFor="photo" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
          <FileInput name="photo" />
        </Field>
      </div>

      <Field label="Atau URL foto" htmlFor="photo_url">
        <TextInput name="photo_url" type="url" placeholder="https://..." />
      </Field>

      <div className="flex flex-wrap gap-6 pt-2">
        <Checkbox name="is_active" label="Aktif" defaultChecked />
        <Checkbox name="is_featured" label="Jadikan unggulan" />
      </div>
    </FormShell>
  )
}