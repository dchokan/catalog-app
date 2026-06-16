import type { Metadata } from 'next'
import { inter } from '@/config/fonts'
import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: {
    default: 'BookShelf',
    template: '%s | BookShelf',
  },
  description: 'Discover and save your favorite books',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
