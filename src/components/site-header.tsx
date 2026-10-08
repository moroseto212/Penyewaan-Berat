'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { NAV_CATALOG, NAV_SERVICES } from '@/lib/site'

type NavItem = { label: string; href: string }

const DESKTOP_LINKS: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Proyek Kami', href: '/proyek' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/kontak' },
]

function isActive(pathname: string, href: string, prefix = false) {
  if (href === '/') return pathname === '/'
  return prefix ? pathname.startsWith(href) : pathname === href
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openCatalog, setOpenCatalog] = useState(false)
  const [openServices, setOpenServices] = useState(false)

  return (
    <nav className="bg-ink sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-brand tracking-wide">
            <i className="fas fa-tractor mr-2" />
            AlatBerat
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {DESKTOP_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-brand ${
                  isActive(pathname, link.href) ? 'text-brand' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative group">
              <button
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-brand flex items-center ${
                  isActive(pathname, '/katalog-alat', true) ? 'text-brand' : 'text-white'
                }`}
              >
                Katalog Alat
                <i className="fas fa-chevron-down ml-1 text-xs" />
              </button>
              <div className="absolute left-0 w-56 bg-white rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-2 border-brand">
                {NAV_CATALOG.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-sm text-[#333333] hover:bg-surface hover:text-brand transition-colors"
                  >
                    <i className={`fas ${item.icon} mr-2 text-brand`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-brand flex items-center ${
                  isActive(pathname, '/layanan', true) ||
                  isActive(pathname, '/area-layanan')
                    ? 'text-brand'
                    : 'text-white'
                }`}
              >
                Layanan
                <i className="fas fa-chevron-down ml-1 text-xs" />
              </button>
              <div className="absolute left-0 w-56 bg-white rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-2 border-brand">
                {NAV_SERVICES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-sm text-[#333333] hover:bg-surface hover:text-brand transition-colors"
                  >
                    <i className={`fas ${item.icon} mr-2 text-brand`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {DESKTOP_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-brand ${
                  isActive(pathname, link.href) ? 'text-brand' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <form action="/katalog-alat" className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Cari alat..."
                className="w-48 pl-10 pr-4 py-2 bg-ink-soft text-white text-sm rounded-full border border-gray-600 focus:outline-none focus:border-brand transition-colors placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </form>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen((value) => !value)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="text-white hover:text-brand focus:outline-none p-2"
            >
              <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'} text-2xl`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-ink border-t border-gray-700">
          <div className="px-4 py-3">
            <form action="/katalog-alat">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Cari alat..."
                  className="w-full pl-10 pr-4 py-2 bg-ink-soft text-white text-sm rounded-full border border-gray-600 focus:outline-none focus:border-brand transition-colors placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <i className="fas fa-search" />
                </button>
              </div>
            </form>
          </div>

          {DESKTOP_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? 'text-brand bg-ink-soft'
                  : 'text-white hover:text-brand hover:bg-ink-soft'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div>
            <button
              onClick={() => setOpenCatalog((value) => !value)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:text-brand hover:bg-ink-soft transition-colors"
            >
              <span>Katalog Alat</span>
              <i
                className={`fas fa-chevron-down text-xs transition-transform ${openCatalog ? 'rotate-180' : ''}`}
              />
            </button>
            {openCatalog && (
              <div className="bg-ink-soft">
                {NAV_CATALOG.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-8 py-2 text-sm text-gray-300 hover:text-brand transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setOpenServices((value) => !value)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:text-brand hover:bg-ink-soft transition-colors"
            >
              <span>Layanan</span>
              <i
                className={`fas fa-chevron-down text-xs transition-transform ${openServices ? 'rotate-180' : ''}`}
              />
            </button>
            {openServices && (
              <div className="bg-ink-soft">
                {NAV_SERVICES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-8 py-2 text-sm text-gray-300 hover:text-brand transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {DESKTOP_LINKS.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? 'text-brand bg-ink-soft'
                  : 'text-white hover:text-brand hover:bg-ink-soft'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
