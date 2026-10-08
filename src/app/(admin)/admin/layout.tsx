import type { Metadata } from 'next'

import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopbar } from '@/components/admin/topbar'
import { requireAdmin } from '@/lib/auth'
import { getUnreadContactCount } from '@/lib/admin/queries'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin AlatBerat' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Otorisasi utama. Proxy hanya lapisan pertama; setiap layout & server
  // action tetap memvalidasi session + role di sini.
  const admin = await requireAdmin()
  const unreadCount = await getUnreadContactCount()

  return (
    <div className="bg-surface min-h-screen text-gray-700 font-sans">
      <AdminSidebar unreadCount={unreadCount} />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <AdminTopbar name={admin.name} email={admin.email} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}