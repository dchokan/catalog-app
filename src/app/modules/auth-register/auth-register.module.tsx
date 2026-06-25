import Link from 'next/link'
import { FC } from 'react'
import { RegisterFormComponent } from '@/app/features/register-form'
import { OauthButtonsComponent } from '@/app/features/oauth-buttons'

const AuthRegisterModule: FC = () => {
  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Create account</h1>
          <p className='mt-1 text-gray-500'>Join BookShelf today</p>
        </div>

        <RegisterFormComponent />

        <div className='my-6 flex items-center gap-3'>
          <span className='h-px flex-1 bg-gray-200' />
          <span className='text-xs text-gray-400'>OR</span>
          <span className='h-px flex-1 bg-gray-200' />
        </div>

        <OauthButtonsComponent />

        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link href='/login' className='font-medium text-blue-600 hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthRegisterModule
