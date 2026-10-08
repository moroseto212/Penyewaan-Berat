import { logoutAction } from '@/app/(admin)/actions'

export function AdminTopbar({ name, email }: { name: string; email: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'A'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <p className="text-sm text-gray-500 hidden sm:block lg:ml-14">
          Masuk sebagai <span className="font-medium text-gray-700">{email}</span>
        </p>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-ink font-semibold text-sm">
              {initial}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{name}</span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
            >
              <i className="fas fa-sign-out-alt mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}