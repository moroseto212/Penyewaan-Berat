'use client'

import { useActionState } from 'react'

import { loginAction, type LoginState } from '@/app/(admin)/actions'

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {
    error: initialError ?? null,
  })

  const error = state.error

  return (
    <form action={formAction} className="space-y-5">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
          <ul className="list-disc list-inside text-sm">
            <li>{error}</li>
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <i className="fas fa-envelope" />
          </span>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="admin@alatberat.com"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <i className="fas fa-lock" />
          </span>
          <input
            type="password"
            name="password"
            id="password"
            required
            autoComplete="current-password"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand hover:bg-brand-dark text-ink font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-60"
      >
        <i className={`fas ${pending ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'} mr-2`} />
        {pending ? 'Memproses...' : 'Login'}
      </button>
    </form>
  )
}