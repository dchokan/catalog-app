import type { FC, ReactNode } from 'react'

import { LayoutComponent } from '@/app/modules/layout'

interface IProps {
  children: ReactNode
}

const PublicLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <LayoutComponent>{children}</LayoutComponent>
}

export default PublicLayout
