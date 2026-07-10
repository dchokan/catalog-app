'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { type ChangeEvent, type FC, useSyncExternalStore } from 'react'

const THEMES = ['light', 'dark'] as const

const selectClassName =
  'rounded-md border border-border bg-card px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'

const emptySubscribe = () => () => {}

const ThemeSwitcherComponent: FC = () => {
  const t = useTranslations('theme')
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setTheme(event.target.value)
  }

  return (
    <select
      value={mounted ? theme : 'light'}
      onChange={handleChange}
      disabled={!mounted}
      aria-label={t('label')}
      className={selectClassName}
    >
      {THEMES.map((value) => (
        <option key={value} value={value}>
          {t(value)}
        </option>
      ))}
    </select>
  )
}

export default ThemeSwitcherComponent
