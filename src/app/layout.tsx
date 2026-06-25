import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import { inter } from '@/config/fonts'
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
}

const RootLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <html lang='en' className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout
