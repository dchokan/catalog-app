import { type FC, type ReactNode } from 'react'

import { ScrollToTopComponent } from '@/app/shared/components/scroll-to-top'
import { FooterComponent } from '@/app/widgets/footer'
import { HeaderComponent } from '@/app/widgets/header'

interface IProps {
  children: ReactNode
}

const LayoutModule: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <div className='flex min-h-screen flex-col'>
      <HeaderComponent />
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8'>{children}</main>
      <FooterComponent />
      <ScrollToTopComponent />
    </div>
  )
}

export default LayoutModule
