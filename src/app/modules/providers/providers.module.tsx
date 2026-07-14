import { NextIntlClientProvider } from 'next-intl'
import type { FC, ReactNode } from 'react'

import { ToastProvider } from '@/app/shared/components/toast'
import { RestApiProvider } from '@/pkg/rest-api'
import { ThemeProvider } from '@/pkg/theme'

interface IProps {
  children: ReactNode
}

const ProvidersModule: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <ThemeProvider>
      <RestApiProvider>
        <ToastProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ToastProvider>
      </RestApiProvider>
    </ThemeProvider>
  )
}

export default ProvidersModule
