import Link from 'next/link'
import { LoginForm } from '@/app/features/login-form'

export function AuthLoginModule() {
  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Welcome back</h1>
          <p className='mt-1 text-gray-500'>Sign in to your account</p>
        </div>

        <LoginForm />

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
