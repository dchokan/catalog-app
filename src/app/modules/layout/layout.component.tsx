import { type FC, type ReactNode } from 'react'

import { ScrollToTopComponent } from '@/app/shared/components/scroll-to-top'
import { FooterComponent } from '@/app/widgets/footer'
import { HeaderComponent } from '@/app/widgets/header'

interface IProps {
  children: ReactNode
}

const LayoutComponent: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <>
      <HeaderComponent />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>{children}</main>
      <FooterComponent />
      <ScrollToTopComponent />
    </>
  )
}

export default LayoutComponent
