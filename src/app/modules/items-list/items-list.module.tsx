'use client'

import { useSearchParams } from 'next/navigation'
import { type FC } from 'react'

import { useItemsListQuery } from '@/app/entities/api/items'
import { ItemsPaginationComponent } from '@/app/features/items-pagination'
import { ItemsSearchComponent } from '@/app/features/items-search'
import { ItemCardComponent } from '@/app/shared/components/item-card'

const favoritesLabel = (count: number): string =>
  count === 1 ? '1 user added this to favorites' : `${count} users added this to favorites`

const ItemsListModule: FC = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  const { data, isLoading, error } = useItemsListQuery({ search, page })
  const items = data?.data ?? []

  return (
    <div>
      <ItemsSearchComponent />

      {isLoading ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-72 animate-pulse rounded-xl bg-gray-100' />
          ))}
        </div>
      ) : error ? (
        <div className='py-12 text-center'>
          <p className='text-red-600'>Failed to load books. Please try again.</p>
        </div>
      ) : items.length === 0 ? (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>{search ? `No books match "${search}".` : 'No books found.'}</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((item) => (
              <ItemCardComponent
                key={item.id}
                href={`/items/${item.id}`}
                title={item.title}
                imageUrl={item.imageUrl}
                description={item.description}
                placeholder='📖'
                footer={favoritesLabel(item.favoritesCount)}
              />
            ))}
          </div>
          <ItemsPaginationComponent page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} />
        </>
      )}
    </div>
  )
}

export default ItemsListModule
