'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { LocaleSwitcherComponent } from '@/app/features/locale-switcher'
import { ButtonComponent } from '@/app/shared/components/button'
import { useSession } from '@/app/shared/hooks'
import { authClient } from '@/app/shared/services/auth/client'
import { Link, usePathname, useRouter } from '@/pkg/locale'

const HeaderComponent: FC = () => {
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  function navLinkClassName(href: string): string {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)

    return `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <header className='sticky top-0 z-50 border-b border-gray-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/items' className='text-xl font-bold text-blue-600 transition-colors hover:text-blue-700'>
            BookShelf
          </Link>

          <nav className='flex items-center gap-6'>
            <Link href='/items' className={navLinkClassName('/items')}>
              {t('library')}
            </Link>

            {isAuthenticated && (
              <Link href='/favorites' className={navLinkClassName('/favorites')}>
                {t('favorites')}
              </Link>
            )}
          </nav>

          <div className='flex items-center gap-3'>
            <LocaleSwitcherComponent />

            {isAuthenticated ? (
              <>
                <span className='hidden text-sm text-gray-600 sm:block'>{session.user.name}</span>
                <ButtonComponent variant='secondary' size='sm' onClick={handleSignOut}>
                  {t('signOut')}
                </ButtonComponent>
              </>
            ) : (
              <>
                <Link href='/sign-in'>
                  <ButtonComponent variant='ghost' size='sm'>
                    {t('signIn')}
                  </ButtonComponent>
                </Link>
                <Link href='/sign-up'>
                  <ButtonComponent size='sm'>{t('register')}</ButtonComponent>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
