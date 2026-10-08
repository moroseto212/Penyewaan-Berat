'use server'

import { submitContact } from '@/lib/queries'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

const SUBJECTS: Record<string, string> = {
  penyewaan: 'Penyewaan Alat',
  informasi: 'Informasi Produk',
  harga: 'Penawaran Harga',
  kerjasama: 'Kerjasama',
  lainnya: 'Lainnya',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function value(formData: FormData, key: string): string {
  const raw = formData.get(key)
  return typeof raw === 'string' ? raw.trim() : ''
}

/**
 * Kirim pesan form kontak publik.
 *
 * Tidak butuh session karena tabel `contacts` punya policy insert untuk peran
 * anon (`contacts_insert_public`), jadi cukup divalidasi di sini lalu diinsert
 * lewat public client.
 */
export async function contactAction(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bot mengisi semua field, manusia tidak melihat input ini.
  if (value(formData, 'website')) {
    return { status: 'success', message: 'Terima kasih! Pesan Anda telah kami terima.' }
  }

  const values = {
    name: value(formData, 'name'),
    email: value(formData, 'email'),
    phone: value(formData, 'phone'),
    company: value(formData, 'company'),
    subject: value(formData, 'subject'),
    message: value(formData, 'message'),
  }

  const errors: Record<string, string> = {}
  if (!values.name) errors.name = 'Nama lengkap wajib diisi.'
  else if (values.name.length > 255) errors.name = 'Nama terlalu panjang.'

  if (!values.email) errors.email = 'Email wajib diisi.'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Format email tidak valid.'

  if (values.phone && values.phone.length > 50) errors.phone = 'Nomor telepon terlalu panjang.'
  if (values.company && values.company.length > 255) errors.company = 'Nama perusahaan terlalu panjang.'

  if (!values.subject) errors.subject = 'Subjek wajib dipilih.'
  else if (!SUBJECTS[values.subject]) errors.subject = 'Subjek tidak valid.'

  if (!values.message) errors.message = 'Pesan wajib diisi.'
  else if (values.message.length < 10) errors.message = 'Pesan minimal 10 karakter.'
  else if (values.message.length > 5000) errors.message = 'Pesan maksimal 5000 karakter.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Periksa kembali isian formulir.', errors, values }
  }

  const result = await submitContact({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    company: values.company || null,
    // Simpan label yang terbaca di inbox admin, bukan slug select.
    subject: SUBJECTS[values.subject],
    message: values.message,
  })

  if (!result.ok) {
    return {
      status: 'error',
      message: 'Pesan gagal dikirim. Silakan coba beberapa saat lagi.',
      errors: {},
      values,
    }
  }

  return { status: 'success', message: 'Terima kasih! Pesan Anda telah kami terima.' }
}