'use client'

import { useQuery } from '@tanstack/react-query'
import { itemsQueryKeys } from './items.keys'
import { fetchItems, fetchItemById } from './items.api'

export function useItems() {
  return useQuery({
    queryKey: itemsQueryKeys.all,
    queryFn: fetchItems,
  })
}

export function useItem(id: string) {
  return useQuery({
    queryKey: itemsQueryKeys.detail(id),
    queryFn: () => fetchItemById(id),
    enabled: !!id,
  })
}
