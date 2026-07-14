import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'

import { LayoutModule } from '@/app/modules/layout'
import { ButtonComponent } from '@/app/shared/components/button'
import { Link } from '@/pkg/locale'

const NotFoundModule: FC = async () => {
  const t = await getTranslations('notFound')

  return (
    <LayoutModule>
      <div className='py-24 text-center'>
        <h1 className='text-foreground mb-2 text-2xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground mb-6'>{t('subtitle')}</p>
        <Link href='/items'>
          <ButtonComponent>{t('home')}</ButtonComponent>
        </Link>
      </div>
    </LayoutModule>
  )
}

export default NotFoundModule
