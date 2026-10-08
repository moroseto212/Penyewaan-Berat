import type { Metadata } from 'next'

import { FormShell } from '@/components/admin/form-shell'
import { getAllCategories } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { storeEquipment } from '../actions'
import { EquipmentFormFields } from '../equipment-form-fields'

export const metadata: Metadata = { title: 'Tambah Alat Berat' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EquipmentCreatePage({ searchParams }: Props) {
  const params = await searchParams
  const categories = await getAllCategories()

  return (
    <FormShell
      title="Tambah Alat Berat"
      description="Tambahkan alat berat ke katalog"
      backHref="/admin/equipment"
      action={storeEquipment}
      error={toParam(params.error)}
      maxWidth="max-w-4xl"
    >
      <EquipmentFormFields categories={categories} />
    </FormShell>
  )
}