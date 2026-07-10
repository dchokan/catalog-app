import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { OauthButtonsComponent } from '@/app/features/oauth-buttons'
import { RegisterFormComponent } from '@/app/features/register-form'
import { Link } from '@/pkg/locale'

const AuthRegisterModule: FC = () => {
  const t = useTranslations('auth')

  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='border-border bg-card rounded-2xl border p-8 shadow-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-card-foreground text-2xl font-bold'>{t('register.title')}</h1>
          <p className='text-muted-foreground mt-1'>{t('register.subtitle')}</p>
        </div>

        <RegisterFormComponent />

        <div className='my-6 flex items-center gap-3'>
          <span className='bg-border h-px flex-1' />
          <span className='text-muted-foreground text-xs'>{t('or')}</span>
          <span className='bg-border h-px flex-1' />
        </div>

        <OauthButtonsComponent />

        <p className='text-muted-foreground mt-6 text-center text-sm'>
          {t('register.haveAccount')}{' '}
          <Link href='/sign-in' className='text-primary font-medium hover:underline'>
            {t('register.signInLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthRegisterModule
