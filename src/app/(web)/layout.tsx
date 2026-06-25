import type { FC, ReactNode } from 'react'
import { HeaderComponent } from '@/app/widgets/header'
import { ProvidersComponent } from '@/app/shared/components/providers'

interface IProps {
  children: ReactNode
}

const WebLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return (
    <ProvidersComponent>
      <HeaderComponent />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>{children}</main>
    </ProvidersComponent>
  )
}

export default WebLayout
