import { queryOptions } from '@tanstack/react-query'
import { fetchItems, fetchItemById } from './items.api'
import { EItemKey, type ItemsFilters } from '@/app/entities/models'

export const itemsListQueryOptions = (filters: ItemsFilters = {}) =>
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
