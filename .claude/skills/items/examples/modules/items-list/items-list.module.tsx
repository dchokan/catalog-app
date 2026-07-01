'use client'

import { useSearchParams } from 'next/navigation' // reading params is not locale-aware navigation
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
  const items = data?.data ?? [] // envelope → rows

  // loading / error / empty branches, then:
  return (
    <div>
      <ItemsSearchComponent />
      {items.map((item) => (
        <ItemCardComponent key={item.id} href={`/items/${item.id}`} title={item.title} footer={favoritesLabel(item.favoritesCount)} />
      ))}
      <ItemsPaginationComponent page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} />
    </div>
  )
}

export default ItemsListModule
