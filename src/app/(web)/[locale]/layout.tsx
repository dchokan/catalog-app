import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { ProvidersComponent } from '@/app/shared/components/providers'
import { HeaderComponent } from '@/app/widgets/header'
import { inter } from '@/config/fonts'
import { routing } from '@/pkg/locale'

import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: {
    default: 'BookShelf',
    template: '%s | BookShelf',
  },
  description: 'Discover and save your favorite books',
}

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }))
}

const LocaleLayout: FC<Readonly<IProps>> = async (props) => {
  const { children, params } = props

  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} className={inter.variable}>
      <body className={inter.className}>
        <ProvidersComponent>
          <NextIntlClientProvider>
            <HeaderComponent />
            <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>{children}</main>
          </NextIntlClientProvider>
        </ProvidersComponent>
      </body>
    </html>
  )
}

export default LocaleLayout
