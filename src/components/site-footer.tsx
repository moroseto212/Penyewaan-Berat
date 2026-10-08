import Link from 'next/link'

import { SITE } from '@/lib/queries'

const QUICK_LINKS = [
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Katalog Alat', href: '/katalog-alat' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Proyek Kami', href: '/proyek' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
]

const SERVICE_LINKS = [
  { label: 'Penyewaan Alat', href: '/layanan/penyewaan-alat-berat' },
  { label: 'Perawatan & Servis', href: '/layanan/perawatan-perbaikan' },
  { label: 'Transportasi Alat', href: '/layanan/logistik-mobilisasi' },
  { label: 'Operator Berpengalaman', href: '/layanan/operator-tenaga-ahli' },
  { label: 'Konsultasi Proyek', href: '/layanan/konsultasi-proyek' },
]

const SOCIALS = ['fa-facebook-f', 'fa-instagram', 'fa-youtube', 'fa-linkedin-in']

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold text-brand mb-6">
              <i className="fas fa-tractor mr-2" />
              AlatBerat
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Penyedia layanan penyewaan alat berat terpercaya untuk berbagai sektor industri di
              Indonesia sejak 2010.
            </p>
            <div className="flex space-x-3">
              {SOCIALS.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="w-10 h-10 bg-ink-soft rounded-full flex items-center justify-center text-gray-400 hover:bg-brand hover:text-ink transition-all duration-300"
                >
                  <i className={`fab ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Tautan Cepat</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand transition-colors text-sm"
                  >
                    <i className="fas fa-chevron-right mr-2 text-brand text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Layanan</h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand transition-colors text-sm"
                  >
                    <i className="fas fa-chevron-right mr-2 text-brand text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-brand" />
                <span className="text-gray-400 text-sm">{SITE.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone-alt text-brand" />
                <span className="text-gray-400 text-sm">{SITE.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-brand" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-gray-400 hover:text-brand transition-colors text-sm"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-clock text-brand" />
                <span className="text-gray-400 text-sm">{SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} AlatBerat. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Kebijakan Privasi</span>
              <span className="text-gray-500 text-sm">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
