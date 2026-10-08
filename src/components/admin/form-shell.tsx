import Link from 'next/link'
import type { ReactNode } from 'react'

import { Card } from './form-controls'
import { Flash } from './flash'
import { PageHeader } from './page-header'
import { SubmitButton } from './submit-button'

type Props = {
  title: string
  description: string
  backHref: string
  action: (form: FormData) => Promise<void>
  submitName?: 'store' | 'update'
  submitIcon?: string
  error?: string
  maxWidth?: string
  children: ReactNode
  /** Konten di luar form (mis. galeri gambar yang punya form hapus sendiri). */
  after?: ReactNode
}

/**
 * Kerangka form admin: flash error, header dengan tombol kembali, kartu form,
 * serta tombol simpan/batal. Server action dan isi form dikirim sebagai props
 * supaya halaman `create` dan `[id]/edit` tinggal berbeda pada nilai default.
 */
export function FormShell({
  title,
  description,
  backHref,
  action,
  submitName = 'store',
  submitIcon = 'fa-save',
  error,
  maxWidth = 'max-w-2xl',
  children,
  after,
}: Props) {
  return (
    <>
      <Flash error={error} />

      <PageHeader title={title} description={description} backHref={backHref} />

      <Card className={maxWidth}>
        <form action={action} className="space-y-5">
          {children}

          <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
            <SubmitButton name={submitName} icon={submitIcon} />
            <Link
              href={backHref}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition duration-200"
            >
              Batal
            </Link>
          </div>
        </form>
      </Card>

      {after && <div className={`${maxWidth} mt-6`}>{after}</div>}
    </>
  )
}