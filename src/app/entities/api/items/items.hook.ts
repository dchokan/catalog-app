'use client'

import { useQuery } from '@tanstack/react-query'
import { itemsListQueryOptions, itemDetailQueryOptions } from './items.query'
import type { ItemsFilters } from '@/app/entities/models'

export const useItemsListQuery = (filters: ItemsFilters = {}) =>
  useQuery(itemsListQueryOptions(filters))

export const useItemDetailQuery = (id: string) =>
  useQuery(itemDetailQueryOptions(id))
