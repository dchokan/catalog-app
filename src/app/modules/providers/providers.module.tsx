import { NextIntlClientProvider } from 'next-intl'
import type { FC, ReactNode } from 'react'

import { RestApiProvider } from '@/pkg/rest-api'
import { ThemeProvider } from '@/pkg/theme'
import { Toaster } from '@/pkg/theme/ui/sonner'

interface IProps {
  children: ReactNode
}

const ProvidersModule: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <ThemeProvider>
      <RestApiProvider>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster />
      </RestApiProvider>
    </ThemeProvider>
  )
}

export default ProvidersModule
