import { AuthLoginModule } from '@/app/modules/auth-login'
import type { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

const Page: NextPage = () => {
  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <AuthLoginModule />
    </div>
  )
}

export default Page
