import type { Json } from '@/lib/supabase/types'
import { redirect } from 'next/navigation'

/**
 * Pembacaan field FormData untuk server action admin.
 * Semua helper mengembalikan `null` bila input kosong supaya cocok dengan
 * kolom nullable di PostgreSQL (Laravel juga menyimpan `''` -> null via `nullable`).
 */

export function raw(form: FormData, name: string): FormDataEntryValue | null {
  return form.get(name)
}

/** String hasil `trim`, `''` bila tidak diisi. */
export function field(form: FormData, name: string): string {
  const value = form.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

/** String atau `null` bila kosong. */
export function nullableText(form: FormData, name: string): string | null {
  const value = field(form, name)
  return value === '' ? null : value
}

/** String wajib isi. Mengembalikan pesan error siap tampil. */
export function requiredText(form: FormData, name: string, label: string): string | null {
  const value = field(form, name)
  return value === '' ? `${label} wajib diisi.` : null
}

/** Teks panjang (textarea) tanpa trim aggressif supaya format HTML tetap utuh. */
export function longText(form: FormData, name: string): string | null {
  const value = form.get(name)
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : value
}

/** Integer atau `null`. Nilai tidak valid dianggap `null`. */
export function intValue(form: FormData, name: string): number | null {
  const value = field(form, name)
  if (value === '') return null
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

/** Integer minimal 1; fallback dipakai bila kosong. */
export function intWithDefault(form: FormData, name: string, fallback: number): number {
  return intValue(form, name) ?? fallback
}

/** Checkbox HTML: tidak ada key = false. */
export function boolValue(form: FormData, name: string): boolean {
  const value = form.get(name)
  return value === 'on' || value === 'true' || value === '1'
}

/** Checkbox "aktif" yang default-nya true bila key tidak dikirim sama sekali. */
export function boolWithDefault(form: FormData, name: string, fallback: boolean): boolean {
  if (!form.has(name)) return fallback
  return boolValue(form, name)
}

/** Semua nilai dari input berganti nama sama, mis. `gallery_urls`. */
export function allFields(form: FormData, name: string): string[] {
  return form
    .getAll(name)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value !== '')
}

/** File dari `<input type="file" name="x" multiple>`. */
export function files(form: FormData, name: string): File[] {
  return form.getAll(name).filter((value): value is File => value instanceof File)
}

/**
 * Pasangan key/value dinamis (`specs_keys[]` + `specs_values[]`) menjadi objek JSON,
 * sama seperti logika Laravel di EquipmentController.
 */
export function keyValuePairs(
  form: FormData,
  keyName: string,
  valueName: string,
): Json | null {
  const keys = form.getAll(keyName)
  const values = form.getAll(valueName)

  const result: Record<string, string> = {}
  keys.forEach((rawKey, index) => {
    if (typeof rawKey !== 'string') return
    const key = rawKey.trim()
    const rawValue = values[index]
    const value = typeof rawValue === 'string' ? rawValue.trim() : ''
    if (key !== '' && value !== '') result[key] = value
  })

  return Object.keys(result).length > 0 ? result : null
}

/* ------------------------------------------------------------------ redirect */

/** Redirect dengan query string flash (`?success=` / `?error=`), seperti session flash di Laravel. */
export function redirectWith(
  path: string,
  params: Record<string, string | undefined>,
): never {
  const [base, existing = ''] = path.split('?')
  const search = new URLSearchParams(existing)

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
    else search.delete(key)
  }

  const query = search.toString()
  redirect(query ? `${base}?${query}` : base)
}

export function flashSuccess(path: string, message: string): never {
  redirectWith(path, { success: message })
}

export function flashError(path: string, message: string): never {
  redirectWith(path, { error: message })
}

/** Pesan error Supabase yang lebih ramah untuk user akhir. */
export function dbError(error: { message: string; code?: string } | null): string {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui.'
  if (error.code === '23505') return 'Data dengan nilai unik tersebut sudah ada.'
  if (error.code === '23503') return 'Data masih dipakai oleh catatan lain.'
  return error.message
}