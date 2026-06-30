import { redirect } from 'next/navigation'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  redirect('/items')
}

export default Page
