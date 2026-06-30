import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchItems, fetchItemById } from './items.api'
import { EItemKey, type IItemsFilters } from '@/app/entities/models'

export const itemsListQueryOptions = (filters: IItemsFilters = {}) =>
  queryOptions({
    queryKey: [EItemKey.QUERY, 'list', filters],
    queryFn: () => fetchItems(filters),
  })

export const itemDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [EItemKey.QUERY, id],
    queryFn: () => fetchItemById(id),
    enabled: Boolean(id),
  })

export const useItemsListQuery = (filters: IItemsFilters = {}) =>
  useQuery(itemsListQueryOptions(filters))

export const useItemDetailQuery = (id: string) =>
  useQuery(itemDetailQueryOptions(id))
