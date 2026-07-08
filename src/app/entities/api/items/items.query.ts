import { queryOptions, useQuery } from '@tanstack/react-query'

import { EItemKey, type IItemsFilters } from '@/app/entities/models'

import { fetchItemById, fetchItems } from './items.api'

export const itemsListQueryOptions = (filters: IItemsFilters = {}) => {
  return queryOptions({
    queryKey: [EItemKey.QUERY, 'list', filters],
    queryFn: () => fetchItems(filters),
  })
}

export const itemDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [EItemKey.QUERY, id],
    queryFn: () => fetchItemById(id),
    enabled: Boolean(id),
  })
}

export const useItemsListQuery = (filters: IItemsFilters = {}) => {
  return useQuery(itemsListQueryOptions(filters))
}

export const useItemDetailQuery = (id: string) => {
  return useQuery(itemDetailQueryOptions(id))
}
