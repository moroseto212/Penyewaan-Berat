'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type NavLink = { href: string; icon: string; label: string; match?: string }

const LINKS: NavLink[] = [
  { href: '/admin', icon: 'fa-chart-pie', label: 'Dashboard' },
  { href: '/admin/categories', icon: 'fa-tags', label: 'Kategori' },
  { href: '/admin/equipment', icon: 'fa-tractor', label: 'Alat Berat' },
  { href: '/admin/services', icon: 'fa-cogs', label: 'Layanan' },
  { href: '/admin/service-areas', icon: 'fa-map-marked-alt', label: 'Area Layanan' },
  { href: '/admin/projects', icon: 'fa-helmet-safety', label: 'Proyek' },
  { href: '/admin/testimonials', icon: 'fa-comment-dots', label: 'Testimoni' },
  { href: '/admin/blog', icon: 'fa-newspaper', label: 'Blog' },
  { href: '/admin/faqs', icon: 'fa-question-circle', label: 'FAQ' },
  {
    href: '/admin/contacts',
    icon: 'fa-envelope',
    label: 'Pesan Masuk',
    match: '/admin/contacts',
  },
]

function isActive(pathname: string, link: NavLink) {
  const base = link.match ?? link.href
  if (base === '/admin') return pathname === '/admin'
  return pathname === base || pathname.startsWith(`${base}/`)
}

export function AdminSidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${open ? 'block' : 'hidden'}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Buka menu navigasi"
        aria-expanded={open}
        className="fixed top-4 left-4 z-40 lg:hidden w-10 h-10 rounded-lg bg-white text-ink shadow border border-gray-200"
      >
        <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} />
      </button>

      <aside
        className={`w-64 bg-ink text-white flex flex-col fixed inset-y-0 left-0 z-30 transition-transform duration-300 max-lg:-translate-x-full ${
          open ? 'max-lg:translate-x-0' : ''
        }`}
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <Link href="/admin" className="text-xl font-bold tracking-wide">
            <i className="fas fa-tractor text-brand mr-2" />
            AlatBerat Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {LINKS.map((link) => {
            const active = isActive(pathname, link)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition duration-200 ${
                  active
                    ? 'bg-brand text-ink font-semibold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <i className={`fas ${link.icon} w-5 text-center mr-3`} />
                <span>{link.label}</span>
                {link.href === '/admin/contacts' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <Link
            href="/"
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            <i className="fas fa-globe w-5 text-center mr-3" />
            <span>Lihat Situs</span>
          </Link>
        </div>
      </aside>
    </>
  )
}