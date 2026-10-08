import Image from 'next/image'

import { DeleteButton } from './delete-button'

export type GalleryItem = {
  id: number
  image_path: string
  is_primary: boolean
  sort_order: number
}

/**
 * Galeri gambar yang sudah tersimpan, lengkap dengan tombol hapus per gambar.
 * Dipakai di form edit proyek dan alat berat.
 */
export function ImageGallery({
  images,
  deleteAction,
  label = 'Galeri',
  emptyMessage = 'Belum ada gambar di galeri.',
}: {
  images: GalleryItem[]
  deleteAction: (form: FormData) => Promise<void>
  label?: string
  emptyMessage?: string
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-xs text-gray-400">({images.length} gambar)</span>
      </p>

      {images.length === 0 ? (
        <p className="text-xs text-gray-500 bg-surface rounded-lg px-4 py-6 text-center">
          {emptyMessage}
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image) => (
            <li
              key={image.id}
              className="relative border border-gray-200 rounded-lg overflow-hidden bg-surface"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.image_path}
                  alt={`Gambar galeri ${image.sort_order + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-1 px-2 py-1.5 bg-white">
                <span className="text-[10px] font-semibold text-gray-500">
                  {image.is_primary ? 'Utama' : `#${image.sort_order + 1}`}
                </span>
                <DeleteButton
                  action={deleteAction}
                  id={image.id}
                  message="Yakin ingin menghapus gambar ini?"
                  label="Hapus"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}