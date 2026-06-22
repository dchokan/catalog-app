import Link from 'next/link'
import { Button } from '@/app/shared/components/button'

export default function NotFound() {
  return (
    <div className='py-24 text-center'>
      <h1 className='mb-2 text-2xl font-bold text-gray-900'>Page not found</h1>
      <p className='mb-6 text-gray-500'>The page you are looking for does not exist</p>
      <Link href='/items'>
        <Button>Go to homepage</Button>
      </Link>
    </div>
  )
}
