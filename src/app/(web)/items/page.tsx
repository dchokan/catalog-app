import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { getAllItems } from '@/app/modules/items-list'
import { itemsQueryKeys } from '@/app/entities/api/items'
import { ItemsListModule } from '@/app/modules/items-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Books',
}

export default async function ItemsPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: itemsQueryKeys.all,
    queryFn: getAllItems,
  })

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
