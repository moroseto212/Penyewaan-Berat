import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HiddenId } from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { ImageGallery } from '@/components/admin/image-gallery'
import { getAllCategories, getEquipmentById, getEquipmentImages } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { deleteEquipmentImage, updateEquipment } from '../../actions'
import { EquipmentFormFields } from '../../equipment-form-fields'

export const metadata: Metadata = { title: 'Edit Alat Berat' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EquipmentEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const equipmentId = Number.parseInt(id, 10)
  const query = await searchParams

  const equipment = Number.isNaN(equipmentId) ? null : await getEquipmentById(equipmentId)
  if (!equipment) notFound()

  const [categories, images] = await Promise.all([
    getAllCategories(),
    getEquipmentImages(equipment.id),
  ])

  return (
    <FormShell
      title="Edit Alat Berat"
      description="Ubah data alat berat"
      backHref="/admin/equipment"
      action={updateEquipment}
      submitName="update"
      error={toParam(query.error)}
      maxWidth="max-w-4xl"
      after={
        <ImageGallery
          images={images}
          deleteAction={deleteEquipmentImage}
          label="Galeri Tersimpan"
          emptyMessage="Belum ada gambar di galeri alat ini."
        />
      }
    >
      <HiddenId name="id" value={equipment.id} />

      <EquipmentFormFields
        categories={categories}
        defaults={{
          category_id: equipment.category_id,
          name: equipment.name,
          brand: equipment.brand,
          model: equipment.model,
          year: equipment.year,
          capacity: equipment.capacity,
          description: equipment.description,
          specifications: equipment.specifications,
          price: equipment.price,
          price_unit: equipment.price_unit,
          status: equipment.status,
          is_featured: equipment.is_featured,
          total_units: equipment.total_units,
          image: equipment.image,
        }}
      />
    </FormShell>
  )
}