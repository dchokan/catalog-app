import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { Link } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string; id: string }>
}

const ItemDetailLayout: FC<Readonly<IProps>> = async (props) => {
  const { children, params } = props

  const { locale } = await params

  await setRequestLocale(locale)

  const t = await getTranslations('items')

  return (
    <div>
      <div className='mb-6'>
        <Link href='/items'>
          <Button variant='ghost' size='sm'>
            {t('detail.back')}
          </Button>
        </Link>
      </div>

      {children}
    </div>
  )
}

export default ItemDetailLayout
