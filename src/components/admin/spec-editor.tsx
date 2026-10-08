'use client'

import { useState } from 'react'

const CONTROL =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition'

type Pair = { key: string; value: string }

function toPairs(specifications: unknown): Pair[] {
  if (specifications && typeof specifications === 'object' && !Array.isArray(specifications)) {
    const entries = Object.entries(specifications as Record<string, unknown>)
    if (entries.length > 0) {
      return entries.map(([key, value]) => ({ key, value: String(value) }))
    }
  }
  return [
    { key: '', value: '' },
    { key: '', value: '' },
  ]
}

/**
 * Editor spesifikasi alat berat: pasangan label/nilai yang disimpan sebagai
 * objek JSON (sama seperti `specs_keys` + `specs_values` di Laravel).
 */
export function SpecEditor({ specifications }: { specifications: unknown }) {
  const [pairs, setPairs] = useState<Pair[]>(() => toPairs(specifications))

  const update = (index: number, next: Partial<Pair>) => {
    setPairs((current) => current.map((pair, i) => (i === index ? { ...pair, ...next } : pair)))
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">Spesifikasi Teknis</p>
      <p className="text-xs text-gray-500 mb-2">
        Tambahkan pasangan label dan nilai. Baris dengan label atau nilai kosong diabaikan.
      </p>

      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              type="text"
              name="specs_keys"
              value={pair.key}
              onChange={(event) => update(index, { key: event.target.value })}
              placeholder="Contoh: Berat Operasi"
              className={`${CONTROL} flex-1`}
            />
            <input
              type="text"
              name="specs_values"
              value={pair.value}
              onChange={(event) => update(index, { value: event.target.value })}
              placeholder="Contoh: 20 ton"
              className={`${CONTROL} flex-1`}
            />
            <button
              type="button"
              onClick={() => setPairs((current) => current.filter((_, i) => i !== index))}
              aria-label="Hapus baris spesifikasi"
              className="px-3 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPairs((current) => [...current, { key: '', value: '' }])}
        className="mt-3 inline-flex items-center px-3 py-2 rounded-lg bg-brand/10 text-brand hover:bg-brand hover:text-ink text-xs font-semibold transition"
      >
        <i className="fas fa-plus mr-1" />
        Tambah Baris
      </button>
    </div>
  )
}