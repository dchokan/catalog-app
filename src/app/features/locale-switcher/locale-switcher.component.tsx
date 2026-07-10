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
      className='border-border bg-card text-muted-foreground hover:text-foreground rounded-md border px-2 py-1 text-sm font-medium transition-colors'
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
