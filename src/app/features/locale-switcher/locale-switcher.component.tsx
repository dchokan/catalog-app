'use client'

import { useLocale } from 'next-intl'
import { type ChangeEvent, type FC } from 'react'

import { routing, usePathname, useRouter } from '@/pkg/locale'

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  uk: 'UA',
}

const LocaleSwitcherComponent: FC = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: event.target.value })
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label='Language'
      className='rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900'
    >
      {routing.locales.map((code) => (
        <option key={code} value={code}>
          {LOCALE_LABELS[code] ?? code.toUpperCase()}
        </option>
      ))}
    </select>
  )
}

export default LocaleSwitcherComponent
