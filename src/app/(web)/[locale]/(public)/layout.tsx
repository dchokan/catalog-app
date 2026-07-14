import type { FC, ReactNode } from 'react'

import { LayoutModule } from '@/app/modules/layout'

interface IProps {
  children: ReactNode
}

const PublicLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <LayoutModule>{children}</LayoutModule>
}

export default PublicLayout
