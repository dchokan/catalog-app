import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListQueryOptions } from '@/app/entities/api/items'
import { ItemsListModule } from '@/app/modules/items-list'
import type { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: 'Browse Books',
}

interface IProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { searchParams } = props
  const { search = '', page = '1' } = await searchParams
  const filters = { search, page: Math.max(1, Number(page) || 1) }
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemsListQueryOptions(filters))

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Browse Books</h1>
        <p className='mt-1 text-gray-500'>Discover your next favorite read</p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ItemsListModule />
      </HydrationBoundary>
    </div>
  )
}

export default Page
