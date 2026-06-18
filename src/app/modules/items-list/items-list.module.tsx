'use client'

import { useSearchParams } from 'next/navigation'
import { useItems } from '@/app/entities/api/items'
import { ItemCard } from '@/app/widgets/item-card'
import { ItemsSearch } from '@/app/features/items-search'

export function ItemsListModule() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const { data: items = [], isLoading, error } = useItems({ search })

  return (
    <div>
      <ItemsSearch />

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
          <p className='text-gray-500'>{search ? `No books match “${search}”.` : 'No books found.'}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
