import { queryOptions } from '@tanstack/react-query'
import { fetchItems, fetchItemById } from './items.api'
import type { ItemsFilters } from '@/app/entities/models'
import { EEntityKey } from '@/app/shared/interfaces'

export const itemsListQueryOptions = (filters: ItemsFilters = {}) =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_ITEMS, 'list', filters],
    queryFn: () => fetchItems(filters),
  })

export const itemDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_ITEMS, id],
    queryFn: () => fetchItemById(id),
    enabled: Boolean(id),
  })
