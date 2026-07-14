import type { FC, ReactNode } from 'react'

import { LayoutModule } from '@/app/modules/layout'

interface IProps {
  children: ReactNode
}

const ProtectedLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <LayoutModule>{children}</LayoutModule>
}

export default ProtectedLayout
