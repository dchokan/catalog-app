'use client'

import Image from 'next/image'
import { useItem } from '@/app/entities/api/items'

interface ItemDetailModuleProps {
  id: string
}

export function ItemDetailModule({ id }: ItemDetailModuleProps) {
  const { data: item, isLoading, error } = useItem(id)

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-4'>
        <div className='h-64 rounded-xl bg-gray-100' />
        <div className='h-8 w-3/4 rounded bg-gray-100' />
        <div className='h-4 w-full rounded bg-gray-100' />
        <div className='h-4 w-5/6 rounded bg-gray-100' />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className='py-12 text-center'>
        <p className='text-red-600'>Book not found.</p>
      </div>
    )
  }

  return (
    <article className='mx-auto max-w-2xl'>
      {item.imageUrl && (
        <div className='relative mb-6 aspect-2/3 w-64 overflow-hidden rounded-xl bg-gray-50'>
          <Image src={item.imageUrl} alt={item.title} fill className='object-cover' priority />
        </div>
      )}

      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <h1 className='text-3xl font-bold text-gray-900'>{item.title}</h1>
        </div>

        {item.description && <p className='text-lg leading-relaxed text-gray-600'>{item.description}</p>}

        <p className='text-sm text-gray-400'>
          Added on{' '}
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </article>
  )
}
