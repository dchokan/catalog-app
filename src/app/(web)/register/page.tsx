import { AuthRegisterModule } from '@/app/modules/auth-register'
import type { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
}

const Page: NextPage = () => {
  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <AuthRegisterModule />
    </div>
  )
}

export default Page
