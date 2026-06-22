import { Header } from '@/app/widgets/header'
import { Providers } from '@/app/shared/components/providers'

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>{children}</main>
    </Providers>
  )
}
