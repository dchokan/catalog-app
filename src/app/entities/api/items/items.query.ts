'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { itemsQueryKeys } from './items.keys'
import { fetchItems, fetchItemById } from './items.api'
import type { ItemsFilters } from './items.interface'

export function useItems(filters: ItemsFilters = {}) {
  return useQuery({
    queryKey: itemsQueryKeys.list(filters),
    queryFn: () => fetchItems(filters),
    placeholderData: keepPreviousData,
  })
}

export function useItem(id: string) {
  return useQuery({
    queryKey: itemsQueryKeys.detail(id),
    queryFn: () => fetchItemById(id),
    enabled: !!id,
  })
}
