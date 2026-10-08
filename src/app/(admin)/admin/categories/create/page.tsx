import Link from 'next/link'

import { Flash } from '@/components/admin/flash'
import { PageHeader } from '@/components/admin/page-header'
import { SubmitButton } from '@/components/admin/submit-button'
import { Card, Checkbox, Field, TextArea, TextInput } from '@/components/admin/form-controls'
import { toParam } from '@/lib/site'
import { storeCategory } from '../actions'

export const metadata = { title: 'Tambah Kategori' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CategoryCreatePage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <>
      <Flash error={toParam(params.error)} />

      <PageHeader
        title="Tambah Kategori"
        description="Buat kategori baru"
        backHref="/admin/categories"
      />

      <Card className="max-w-2xl">
        <form action={storeCategory} className="space-y-5">
          <Field label="Nama" htmlFor="name" required>
            <TextInput name="name" required />
          </Field>

          <Field label="Deskripsi" htmlFor="description">
            <TextArea name="description" rows={4} />
          </Field>

          <Field
            label="Ikon (class Font Awesome)"
            htmlFor="icon"
            hint="Contoh: fa-tractor, fa-truck, fa-hard-hat"
          >
            <TextInput name="icon" defaultValue="fa-tag" />
          </Field>

          <Checkbox name="is_active" label="Aktif" defaultChecked />

          <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
            <SubmitButton name="store" icon="fa-save" />
            <Link
              href="/admin/categories"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition duration-200"
            >
              Batal
            </Link>
          </div>
        </form>
      </Card>
    </>
  )
}