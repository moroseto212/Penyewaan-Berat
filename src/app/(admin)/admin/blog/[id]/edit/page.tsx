import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  Checkbox,
  Field,
  FileInput,
  HiddenId,
  TextArea,
  TextInput,
} from '@/components/admin/form-controls'
import { FormShell } from '@/components/admin/form-shell'
import { getPostById } from '@/lib/admin/queries'
import { toParam } from '@/lib/site'
import { updatePost } from '../../actions'

export const metadata: Metadata = { title: 'Edit Artikel' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogEditPage({ params, searchParams }: Props) {
  const { id } = await params
  const postId = Number.parseInt(id, 10)
  const query = await searchParams

  const post = Number.isNaN(postId) ? null : await getPostById(postId)
  if (!post) notFound()

  const tags = Array.isArray(post.tags) ? (post.tags as string[]).join(', ') : ''

  return (
    <FormShell
      title="Edit Artikel"
      description="Ubah isi artikel"
      backHref="/admin/blog"
      action={updatePost}
      submitName="update"
      error={toParam(query.error)}
    >
      <HiddenId name="id" value={post.id} />

      <Field label="Judul" htmlFor="title" required>
        <TextInput name="title" defaultValue={post.title} required />
      </Field>

      <Field label="Ringkasan" htmlFor="excerpt">
        <TextArea name="excerpt" rows={3} defaultValue={post.excerpt} />
      </Field>

      <Field label="Isi Artikel" htmlFor="body">
        <TextArea name="body" rows={14} defaultValue={post.body} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Penulis" htmlFor="author">
          <TextInput name="author" defaultValue={post.author} />
        </Field>

        <Field label="Tags" htmlFor="tags" hint="Pisahkan dengan koma.">
          <TextInput name="tags" defaultValue={tags} />
        </Field>
      </div>

      <Field label="Gambar" htmlFor="image" hint="JPG, PNG, WEBP, atau AVIF. Maksimal 5MB.">
        <FileInput name="image" hint="Mengunggah file baru akan mengganti gambar lama." />
      </Field>

      <Field label="Atau URL gambar" htmlFor="image_url">
        <TextInput name="image_url" type="url" defaultValue={post.image} />
      </Field>

      <Checkbox name="is_published" label="Terbitkan" defaultChecked={post.is_published} />
    </FormShell>
  )
}