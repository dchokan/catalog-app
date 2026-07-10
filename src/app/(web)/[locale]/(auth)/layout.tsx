import { getTranslations } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { Link } from '@/pkg/locale'

interface IProps {
  children: ReactNode
}

const AuthLayout: FC<Readonly<IProps>> = async (props) => {
  const { children } = props

  const t = await getTranslations('auth')

  return (
    <main className='relative flex min-h-screen items-center justify-center px-4'>
      <Link
        href='/items'
        className='text-muted-foreground hover:text-foreground absolute top-4 left-4 text-sm font-medium transition-colors sm:top-6 sm:left-6'
      >
        {t('backToCatalog')}
      </Link>

      {children}
    </main>
  )
}

export default AuthLayout
