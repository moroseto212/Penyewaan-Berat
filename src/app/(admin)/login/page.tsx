import type { Metadata } from 'next'

import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Login Admin',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="bg-ink min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand mb-4">
              <i className="fas fa-tractor text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Login Admin</h1>
            <p className="text-gray-500 text-sm mt-1">AlatBerat Heavy Equipment</p>
          </div>

          <LoginForm initialError={error ?? null} />
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          &copy; {new Date().getFullYear()} AlatBerat. All rights reserved.
        </p>
      </div>
    </div>
  )
}