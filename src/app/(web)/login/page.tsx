import { AuthLoginModule } from '@/app/modules/auth-login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function LoginPage() {
  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <AuthLoginModule />
    </div>
  )
}
