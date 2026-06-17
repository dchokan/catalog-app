import { AuthRegisterModule } from '@/app/modules/auth-register'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function RegisterPage() {
  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <AuthRegisterModule />
    </div>
  )
}
