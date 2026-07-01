import { notFound } from 'next/navigation' // notFound is fine from next/navigation — it's not navigation
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { routing } from '@/pkg/locale'

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

// pre-render one branch per locale
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }))

const LocaleLayout: FC<Readonly<IProps>> = async (props) => {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound() // unknown locale → 404
  setRequestLocale(locale) // enable static rendering for this branch

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
