'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useItemsListQuery } from '@/app/entities/api/items'
import { EItemsSort } from '@/app/entities/models'
import { ItemsPaginationComponent } from '@/app/features/items-pagination'
import { ItemsSearchComponent } from '@/app/features/items-search'
import { ItemsSortComponent } from '@/app/features/items-sort'
import { ItemCardComponent } from '@/app/shared/components/item-card'

const ItemsListModule: FC = () => {
  const t = useTranslations('items')
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const sort = (searchParams.get('sort') as EItemsSort) ?? undefined

  const { data, isLoading, error } = useItemsListQuery({ search, page, sort })
  const items = data?.data ?? []

  return (
    <div>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='flex-1'>
          <ItemsSearchComponent />
        </div>
        <ItemsSortComponent />
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-64 animate-pulse rounded-xl bg-gray-100' />
          ))}
        </div>
      ) : error ? (
        <div className='py-12 text-center'>
          <p className='text-red-600'>{t('loadError')}</p>
        </div>
      ) : items.length === 0 ? (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>{search ? t('noMatch', { search }) : t('empty')}</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
            {items.map((item) => (
              <ItemCardComponent
                key={item.id}
                href={`/items/${item.id}`}
                title={item.title}
                imageUrl={item.imageUrl}
                description={item.description}
                placeholder='📖'
                footer={
                  <span className='text-sm text-gray-400'>{t('favoritesCount', { count: item.favoritesCount })}</span>
                }
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
