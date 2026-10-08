import type { Metadata } from 'next'

import { Checkbox, Field, TextArea, TextInput } from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { toParam } from '@/lib/site'
import { storeFaq } from '../actions'

export const metadata: Metadata = { title: 'Tambah FAQ' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function FaqCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <FormShell
      title="Tambah FAQ"
      description="Buat pertanyaan baru"
      backHref="/admin/faqs"
      action={storeFaq}
      error={toParam(params.error)}
    >
      <Field label="Pertanyaan" htmlFor="question" required>
        <TextInput name="question" required />
      </Field>

      <Field label="Jawaban" htmlFor="answer" required>
        <TextArea name="answer" rows={5} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Kategori" htmlFor="category" hint="Contoh: Sewa, Pembelian, Pembayaran">
          <TextInput name="category" />
        </Field>

        <Field label="Urutan" htmlFor="sort_order" hint="Angka kecil tampil lebih dulu.">
          <TextInput name="sort_order" type="number" defaultValue={0} />
        </Field>
      </div>

      <Checkbox name="is_active" label="Aktif" defaultChecked />
    </FormShell>
  )
}