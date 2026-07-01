'use client'

import { type FC } from 'react'

import { useItemDetailQuery } from '@/app/entities/api/items'
import { FavoriteButtonComponent } from '@/app/features/favorite-button'

interface IProps {
  id: string
}

const ItemDetailModule: FC<Readonly<IProps>> = (props) => {
  const { id } = props
  const { data: item, isLoading, error } = useItemDetailQuery(id)

  if (isLoading) return null // skeleton
  if (error || !item) return null // not-found state

  // detail layout: title + <FavoriteButtonComponent itemId={item.id} />
  // favoritesCount label (1 vs N) + description + formatted createdAt
  return <FavoriteButtonComponent itemId={item.id} />
}

export default ItemDetailModule
