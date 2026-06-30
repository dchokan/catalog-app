import type { FC } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { Link } from '@/pkg/locale'

const NotFound: FC = () => {
  return (
    <div className='py-24 text-center'>
      <h1 className='mb-2 text-2xl font-bold text-gray-900'>Page not found</h1>
      <p className='mb-6 text-gray-500'>The page you are looking for does not exist</p>
      <Link href='/items'>
        <ButtonComponent>Go to homepage</ButtonComponent>
      </Link>
    </div>
  )
}

export default NotFound
