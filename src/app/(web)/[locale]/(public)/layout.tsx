import { setRequestLocale } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { LayoutModule } from '@/app/modules/layout'

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const PublicLayout: FC<Readonly<IProps>> = async (props) => {
  const { children, params } = props

  const { locale } = await params

  setRequestLocale(locale)

  return <LayoutModule>{children}</LayoutModule>
}

export default PublicLayout
