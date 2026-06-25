import Link from 'next/link'
import { FC } from 'react'
import { LoginFormComponent } from '@/app/features/login-form'
import { OauthButtonsComponent } from '@/app/features/oauth-buttons'

const AuthLoginModule: FC = () => {
  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Welcome back</h1>
          <p className='mt-1 text-gray-500'>Sign in to your account</p>
        </div>

        <LoginFormComponent />

        <div className='my-6 flex items-center gap-3'>
          <span className='h-px flex-1 bg-gray-200' />
          <span className='text-xs text-gray-400'>OR</span>
          <span className='h-px flex-1 bg-gray-200' />
        </div>

        <OauthButtonsComponent />

        <p className='mt-6 text-center text-sm text-gray-500'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='font-medium text-blue-600 hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthLoginModule
