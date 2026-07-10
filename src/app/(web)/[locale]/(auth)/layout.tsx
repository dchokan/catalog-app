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
        className='absolute top-4 left-4 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 sm:top-6 sm:left-6'
      >
        {t('backToCatalog')}
      </Link>

      {children}
    </main>
  )
}

export default AuthLayout
