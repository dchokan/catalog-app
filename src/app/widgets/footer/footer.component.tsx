import { useTranslations } from 'next-intl'
import { type FC } from 'react'

const FooterComponent: FC = () => {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className='border-border bg-card border-t'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-center sm:text-left'>
            <p className='text-muted-foreground mt-1 text-sm'>{t('tagline')}</p>
          </div>
          <p className='text-muted-foreground text-sm'>{t('rights', { year: String(year) })}</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
