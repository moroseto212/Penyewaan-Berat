'use server'

import { revalidatePath } from 'next/cache'

import {
  boolValue,
  dbError,
  field,
  flashError,
  flashSuccess,
  intWithDefault,
  intValue,
  longText,
  nullableText,
} from '@/lib/admin/form'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const INDEX = '/admin/faqs'

type Payload = {
  question: string
  answer: string
  category: string | null
  sort_order: number
  is_active: boolean
}

async function payload(form: FormData): Promise<Payload | string> {
  const question = field(form, 'question')
  const answer = longText(form, 'answer')
  if (!question) return 'Pertanyaan wajib diisi.'
  if (!answer) return 'Jawaban wajib diisi.'

  return {
    question,
    answer,
    category: nullableText(form, 'category'),
    sort_order: intWithDefault(form, 'sort_order', 0),
    is_active: boolValue(form, 'is_active'),
  }
}

function revalidatePublic() {
  revalidatePath(INDEX)
  revalidatePath('/')
  revalidatePath('/faq')
}

export async function storeFaq(form: FormData): Promise<void> {
  await requireAdmin()

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/create`, data)

  const supabase = await createClient()
  const { error } = await supabase.from('faqs').insert(data)

  if (error) flashError(`${INDEX}/create`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'FAQ berhasil ditambahkan.')
}

export async function updateFaq(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'FAQ tidak valid.')

  const data = await payload(form)
  if (typeof data === 'string') flashError(`${INDEX}/${id}/edit`, data)

  const supabase = await createClient()
  const { error } = await supabase.from('faqs').update(data).eq('id', id)

  if (error) flashError(`${INDEX}/${id}/edit`, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'FAQ berhasil diperbarui.')
}

export async function deleteFaq(form: FormData): Promise<void> {
  await requireAdmin()

  const id = intValue(form, 'id')
  if (!id) flashError(INDEX, 'FAQ tidak valid.')

  const supabase = await createClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)

  if (error) flashError(INDEX, dbError(error))

  revalidatePublic()
  flashSuccess(INDEX, 'FAQ berhasil dihapus.')
}