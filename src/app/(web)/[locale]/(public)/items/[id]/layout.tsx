import { getTranslations } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { Link } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'

interface IProps {
  children: ReactNode
}

const ItemDetailLayout: FC<Readonly<IProps>> = async (props) => {
  const { children } = props

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
