import type { ReactNode } from 'react'

const CONTROL =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition'

export function Field({
  label,
  htmlFor,
  hint,
  required,
  error,
  children,
  className = '',
}: {
  label: string
  htmlFor?: string
  hint?: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export function TextInput({
  name,
  defaultValue,
  placeholder,
  required,
  type = 'text',
  readOnly,
}: {
  name: string
  /** Angka diterima agar bisa dipakai langsung untuk input `type="number"`. */
  defaultValue?: string | number | null
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'url' | 'number' | 'date' | 'password' | 'tel'
  readOnly?: boolean
}) {
  return (
    <input
      type={type}
      id={name}
      name={name}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className={`${CONTROL} ${readOnly ? 'bg-surface text-gray-500' : ''}`}
    />
  )
}

export function TextArea({
  name,
  defaultValue,
  rows = 5,
  placeholder,
  required,
  mono,
}: {
  name: string
  defaultValue?: string | null
  rows?: number
  placeholder?: string
  required?: boolean
  mono?: boolean
}) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      className={`${CONTROL} ${mono ? 'font-mono text-xs' : ''}`}
    />
  )
}

export function Select({
  name,
  defaultValue,
  options,
  required,
  placeholder,
}: {
  name: string
  defaultValue?: string | number | null
  options: { value: string | number; label: string }[]
  required?: boolean
  placeholder?: string
}) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue ?? ''}
      required={required}
      className={CONTROL}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function Checkbox({
  name,
  label,
  defaultChecked = false,
  hint,
}: {
  name: string
  label: string
  defaultChecked?: boolean
  hint?: string
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
      />
      <span>
        <span className="text-sm text-gray-700">{label}</span>
        {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      </span>
    </label>
  )
}

export function FileInput({
  name,
  accept = 'image/jpeg,image/png,image/webp,image/avif',
  multiple,
  hint,
}: {
  name: string
  accept?: string
  multiple?: boolean
  hint?: string
}) {
  return (
    <div>
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        multiple={multiple}
        className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand file:text-ink file:font-semibold file:cursor-pointer hover:file:bg-brand-dark"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

export function HiddenId({ name, value }: { name: string; value: string | number }) {
  return <input type="hidden" name={name} value={value} />
}

export function Card({
  title,
  description,
  actions,
  children,
  className = '',
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-200">
          <div>
            {title && <h2 className="font-semibold text-ink">{title}</h2>}
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  )
}

export function EmptyState({ message, icon = 'fa-inbox' }: { message: string; icon?: string }) {
  return (
    <p className="text-gray-500 text-sm py-8 text-center">
      <i className={`fas ${icon} text-2xl text-gray-300 block mb-2`} />
      {message}
    </p>
  )
}

export function Badge({
  children,
  tone = 'gray',
}: {
  children: ReactNode
  tone?: 'gray' | 'green' | 'yellow' | 'red' | 'blue'
}) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}