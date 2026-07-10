import { useTranslations } from 'next-intl'
import { type FC } from 'react'

const FooterComponent: FC = () => {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className='border-t border-gray-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-center sm:text-left'>
            <p className='mt-1 text-sm text-gray-500'>{t('tagline')}</p>
          </div>
          <p className='text-sm text-gray-500'>{t('rights', { year })}</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
