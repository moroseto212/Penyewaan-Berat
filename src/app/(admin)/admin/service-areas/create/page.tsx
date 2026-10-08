import type { Metadata } from 'next'

import { Checkbox, Field, FileInput, TextArea, TextInput } from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { toParam } from '@/lib/site'
import { storeServiceArea } from '../actions'

export const metadata: Metadata = { title: 'Tambah Area Layanan' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ServiceAreaCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah Area Layanan"
      description="Buat wilayah layanan baru"
      backHref="/admin/service-areas"
      action={storeServiceArea}
      error={toParam(params.error)}
    >
      <Field label="Nama" htmlFor="name" required hint="Contoh: Jakarta, Bandung, Surabaya">
        <TextInput name="name" required />
      </Field>

      <Field label="Deskripsi" htmlFor="description">
        <TextArea name="description" rows={4} />
      </Field>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url">
        <TextInput name="image_url" type="url" placeholder="https://..." />
      </Field>

      <Checkbox name="is_active" label="Aktif" defaultChecked />
    </FormShell>
  )
}