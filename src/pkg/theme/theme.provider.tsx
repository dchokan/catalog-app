'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ComponentProps, type FC, type ReactNode } from 'react'

interface IProps extends ComponentProps<typeof NextThemesProvider> {
  children: ReactNode
}

const ThemeProvider: FC<Readonly<IProps>> = (props) => {
  const { children, ...rest } = props

  return (
    <NextThemesProvider attribute='class' defaultTheme='light' enableSystem={false} disableTransitionOnChange {...rest}>
      {children}
    </NextThemesProvider>
  )
}

export default ThemeProvider
