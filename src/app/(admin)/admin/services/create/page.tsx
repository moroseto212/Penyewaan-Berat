import type { Metadata } from 'next'

import { Checkbox, Field, FileInput, TextArea, TextInput } from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { toParam } from '@/lib/site'
import { storeService } from '../actions'

export const metadata: Metadata = { title: 'Tambah Layanan' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ServiceCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah Layanan"
      description="Buat layanan baru"
      backHref="/admin/services"
      action={storeService}
      error={toParam(params.error)}
    >
      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" required placeholder="Contoh: Sewa Excavator" />
      </Field>

      <Field label="Ringkasan" htmlFor="description" hint="Tampil di kartu layanan dan meta description.">
        <TextArea name="description" rows={3} />
      </Field>

      <Field label="Isi Lengkap" htmlFor="body" hint="Mendukung HTML dasar.">
        <TextArea name="body" rows={10} />
      </Field>

      <Field label="Ikon (class Font Awesome)" htmlFor="icon" hint="Contoh: fa-truck, fa-hard-hat">
        <TextInput name="icon" placeholder="fa-cogs" />
      </Field>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" hint="Biarkan kosong bila tidak ada gambar baru." />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url">
        <TextInput name="image_url" type="url" placeholder="https://..." />
      </Field>

      <Checkbox name="is_active" label="Aktif" hint="Layanan nonaktif tidak tampil di situs." defaultChecked />
    </FormShell>
  )
}