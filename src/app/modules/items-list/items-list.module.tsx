'use client'

import { useItems } from '@/app/entities/api/items'
import { ItemCard } from '@/app/widgets/item-card'

export function ItemsListModule() {
  const { data: items = [], isLoading, error } = useItems()

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='h-72 animate-pulse rounded-xl bg-gray-100' />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-12 text-center'>
        <p className='text-red-600'>Failed to load books. Please try again.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-gray-500'>No books found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
