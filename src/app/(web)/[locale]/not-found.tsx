import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { Link } from '@/pkg/locale'

const NotFound: FC = async () => {
  const t = await getTranslations('notFound')

  return (
    <div className='py-24 text-center'>
      <h1 className='mb-2 text-2xl font-bold text-gray-900'>{t('title')}</h1>
      <p className='mb-6 text-gray-500'>{t('subtitle')}</p>
      <Link href='/items'>
        <ButtonComponent>{t('home')}</ButtonComponent>
      </Link>
    </div>
  )
}

export default NotFound
