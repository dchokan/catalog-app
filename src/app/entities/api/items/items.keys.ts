import type { ItemsFilters } from './items.interface'

export const itemsQueryKeys = {
  all: ['items'] as const,
  list: (filters: ItemsFilters) => ['items', 'list', filters] as const,
  detail: (id: string) => ['items', id] as const,
}
