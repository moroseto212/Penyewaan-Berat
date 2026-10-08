import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Flash } from '@/components/admin/flash'
import { PageHeader } from '@/components/admin/page-header'
import { SubmitButton } from '@/components/admin/submit-button'
import { Card, Checkbox, Field, HiddenId, TextArea, TextInput } from '@/components/admin/form-controls'
import { getCategory } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updateCategory } from '../../actions'

export const metadata = { title: 'Edit Kategori' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CategoryEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const categoryId = Number.parseInt(id, 10)
  const query = await searchParams

  const category = Number.isNaN(categoryId) ? null : await getCategory(categoryId)
  if (!category) notFound()

  return (
    <>
      <Flash error={toParam(query.error)} />

      <PageHeader
        title="Edit Kategori"
        description="Ubah data kategori"
        backHref="/admin/categories"
      />

      <Card className="max-w-2xl">
        <form action={updateCategory} className="space-y-5">
          <HiddenId name="id" value={category.id} />

          <Field label="Nama" htmlFor="name" required>
            <TextInput name="name" defaultValue={category.name} required />
          </Field>

          <Field label="Deskripsi" htmlFor="description">
            <TextArea name="description" rows={4} defaultValue={category.description} />
          </Field>

          <Field
            label="Ikon (class Font Awesome)"
            htmlFor="icon"
            hint="Contoh: fa-tractor, fa-truck, fa-hard-hat"
          >
            <TextInput name="icon" defaultValue={category.icon ?? 'fa-tag'} />
          </Field>

          <Checkbox name="is_active" label="Aktif" defaultChecked={category.is_active} />

          <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
            <SubmitButton name="update" icon="fa-save" />
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