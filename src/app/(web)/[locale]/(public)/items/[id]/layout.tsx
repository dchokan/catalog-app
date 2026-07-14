import { getTranslations } from 'next-intl/server'
import type { FC, ReactNode } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { Link } from '@/pkg/locale'

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
          <ButtonComponent variant='ghost' size='sm'>
            {t('detail.back')}
          </ButtonComponent>
        </Link>
      </div>

      {children}
    </div>
  )
}

export default ItemDetailLayout
