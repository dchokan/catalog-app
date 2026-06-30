'use client'

import { type FC } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { useSession } from '@/app/shared/hooks'
import { authClient } from '@/pkg/auth'
import { Link, useRouter } from '@/pkg/locale'

const HeaderComponent: FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/login')
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
            <Link href='/items' className='text-sm font-medium text-gray-600 transition-colors hover:text-gray-900'>
              Library
            </Link>

            {isAuthenticated && (
              <Link
                href='/favorites'
                className='text-sm font-medium text-gray-600 transition-colors hover:text-gray-900'
              >
                Favorites
              </Link>
            )}
          </nav>

          <div className='flex items-center gap-3'>
            {isAuthenticated ? (
              <>
                <span className='hidden text-sm text-gray-600 sm:block'>{session.user.name}</span>
                <ButtonComponent variant='secondary' size='sm' onClick={handleSignOut}>
                  Sign out
                </ButtonComponent>
              </>
            ) : (
              <>
                <Link href='/login'>
                  <ButtonComponent variant='ghost' size='sm'>
                    Sign in
                  </ButtonComponent>
                </Link>
                <Link href='/register'>
                  <ButtonComponent size='sm'>Register</ButtonComponent>
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
