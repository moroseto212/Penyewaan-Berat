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
import { storePost } from '../actions'

export const metadata: Metadata = { title: 'Tambah Artikel' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah Artikel"
      description="Tulis artikel baru"
      backHref="/admin/blog"
      action={storePost}
      error={toParam(params.error)}
    >
      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" required />
      </Field>

      <Field label="Ringkasan" htmlFor="excerpt" hint="Tampil di daftar artikel dan meta description.">
        <TextArea name="excerpt" rows={3} />
      </Field>

      <Field label="Isi Artikel" htmlFor="body" hint="Mendukung HTML dasar.">
        <TextArea name="body" rows={14} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Penulis" htmlFor="author">
          <TextInput name="author" />
        </Field>

        <Field label="Tags" htmlFor="tags" hint="Pisahkan dengan koma.">
          <TextInput name="tags" placeholder="excavator, sewa alat berat" />
        </Field>
      </div>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url">
        <TextInput name="image_url" type="url" placeholder="https://..." />
      </Field>

      <Checkbox
        name="is_published"
        label="Terbitkan"
        hint="Tanggal terbit diisi otomatis saat pertama kali diterbitkan."
      />
    </FormShell>
  )
}