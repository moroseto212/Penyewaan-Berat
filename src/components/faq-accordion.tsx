'use client'

import { useMemo, useState } from 'react'

import type { Faq } from '@/lib/supabase/types'

/**
 * FAQ dengan tab kategori + akordeon.
 *
 * Dulu diimplementasikan dengan vanilla JS di `app.js` Laravel
 * (tombol `.faq-btn` / `.faq-tab`). Di sini digantikan state React supaya
 * tidak perlu script tambahan dan tetap ramah keyboard/screen reader.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, Faq[]>()
    for (const faq of faqs) {
      const key = faq.category?.trim() || 'Umum'
      const list = map.get(key)
      if (list) list.push(faq)
      else map.set(key, [faq])
    }
    return [...map.entries()].map(([category, items]) => ({
      category,
      items: [...items].sort((a, b) => a.sort_order - b.sort_order),
    }))
  }, [faqs])

  const [activeCategory, setActiveCategory] = useState(() => groups[0]?.category ?? 'Umum')
  const [openIds, setOpenIds] = useState<number[]>([])

  const toggle = (id: number) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )

  return (
    <>
      <div className="mb-10">
        <div className="flex flex-wrap gap-3 justify-center" role="tablist" aria-label="Kategori FAQ">
          {groups.map(({ category }) => {
            const active = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveCategory(category)
                  setOpenIds([])
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand text-ink'
                    : 'bg-surface text-gray-600 hover:bg-brand hover:text-ink'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {groups
        .filter(({ category }) => category === activeCategory)
        .map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6">{category}</h2>
            <div className="space-y-4">
              {items.map((faq) => {
                const open = openIds.includes(faq.id)
                return (
                  <div key={faq.id} className="bg-surface rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggle(faq.id)}
                      aria-expanded={open}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    >
                      <span className="text-base sm:text-lg font-semibold text-ink pr-4">
                        {faq.question}
                      </span>
                      <i
                        className={`fas fa-chevron-down text-brand transition-transform shrink-0 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <div id={`faq-answer-${faq.id}`} className="px-5 sm:px-6 pb-5 sm:pb-6">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </>
  )
}