import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'

import { LayoutModule } from '@/app/modules/layout'
import { Link } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'

const NotFoundModule: FC = async () => {
  const t = await getTranslations('notFound')

  return (
    <LayoutModule>
      <div className='py-24 text-center'>
        <h1 className='text-foreground mb-2 text-2xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground mb-6'>{t('subtitle')}</p>
        <Link href='/items'>
          <Button>{t('home')}</Button>
        </Link>
      </div>
    </LayoutModule>
  )
}

export default NotFoundModule
