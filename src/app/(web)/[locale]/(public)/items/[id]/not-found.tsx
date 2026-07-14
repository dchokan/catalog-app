import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'

const ItemNotFound: FC = async () => {
  const t = await getTranslations('items')

  return (
    <div className='py-24 text-center'>
      <h1 className='text-foreground mb-2 text-2xl font-bold'>{t('detail.notFoundTitle')}</h1>
      <p className='text-muted-foreground mb-6'>{t('detail.notFoundSubtitle')}</p>
    </div>
  )
}

export default ItemNotFound
