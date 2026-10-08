import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  Checkbox,
  Field,
  HiddenId,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { getFaqById } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updateFaq } from '../../actions'

export const metadata: Metadata = { title: 'Edit FAQ' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function FaqEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const faqId = Number.parseInt(id, 10)
  const query = await searchParams

  const faq = Number.isNaN(faqId) ? null : await getFaqById(faqId)
  if (!faq) notFound()

  return (
    <FormShell
      title="Edit FAQ"
      description="Ubah pertanyaan dan jawaban"
      backHref="/admin/faqs"
      action={updateFaq}
      submitName="update"
      error={toParam(query.error)}
    >
      <HiddenId name="id" value={faq.id} />

      <Field label="Pertanyaan" htmlFor="question" required>
        <TextInput name="question" defaultValue={faq.question} required />
      </Field>

      <Field label="Jawaban" htmlFor="answer" required>
        <TextArea name="answer" rows={5} defaultValue={faq.answer} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Kategori" htmlFor="category">
          <TextInput name="category" defaultValue={faq.category} />
        </Field>

        <Field label="Urutan" htmlFor="sort_order">
          <TextInput name="sort_order" type="number" defaultValue={faq.sort_order} />
        </Field>
      </div>

      <Checkbox name="is_active" label="Aktif" defaultChecked={faq.is_active} />
    </FormShell>
  )
}