import Link from 'next/link'
import { RegisterForm } from '@/app/features/register-form'

export function AuthRegisterModule() {
  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Create account</h1>
          <p className='mt-1 text-gray-500'>Join BookShelf today</p>
        </div>

        <RegisterForm />

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
