'use client'

import { useActionState } from 'react'

import { contactAction, type ContactState } from './actions'

const SUBJECTS = [
  { value: '', label: 'Pilih subjek pesan' },
  { value: 'penyewaan', label: 'Penyewaan Alat' },
  { value: 'informasi', label: 'Informasi Produk' },
  { value: 'kerjasama', label: 'Kerja Sama' },
  { value: 'lainnya', label: 'Lainnya' },
]

const INITIAL: ContactState = { status: 'idle' }

const inputClass =
  'w-full px-5 py-3.5 bg-surface border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors'
const errorClass = 'border-red-500'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(contactAction, INITIAL)
  const errors = state.errors ?? {}
  const values = state.values ?? {}

  if (state.status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center">
        <i className="fas fa-check-circle text-green-500 mr-3 text-xl" />
        {state.message}
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === 'error' && state.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">
          {state.message}
        </div>
      )}

      {/* Honeypot — disembunyikan dari pengguna, biasanya diisi bot. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={values.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`${inputClass} ${errors.name ? errorClass : ''}`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-xs mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={values.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`${inputClass} ${errors.email ? errorClass : ''}`}
            placeholder="contoh@email.com"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">
            No. Telepon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={values.phone}
            className={inputClass}
            placeholder="+62 8xx-xxxx-xxxx"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-ink mb-2">
            Perusahaan
          </label>
          <input
            type="text"
            id="company"
            name="company"
            defaultValue={values.company}
            className={inputClass}
            placeholder="Nama perusahaan"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">
          Subjek <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          defaultValue={values.subject ?? ''}
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={`${inputClass} ${errors.subject ? errorClass : ''}`}
        >
          {SUBJECTS.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" className="text-red-500 text-xs mt-1">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={values.message}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${inputClass} ${errors.message ? errorClass : ''}`}
          placeholder="Tulis pesan Anda di sini..."
        />
        {errors.message && (
          <p id="message-error" className="text-red-500 text-xs mt-1">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-4 bg-brand text-ink font-semibold rounded-xl hover:bg-yellow-400 transition-colors inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <i className={`fas fa-paper-plane mr-2 ${pending ? 'fa-spinner fa-spin' : ''}`} />
          {pending ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </div>
    </form>
  )
}
