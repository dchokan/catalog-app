import type { IItem, IItemsFilters, IPaginatedResponse } from '@/app/entities/models'
import { envClient } from '@/config/env'

const BASE_URL = envClient.NEXT_PUBLIC_APP_URL

export async function fetchItems(filters: IItemsFilters = {}): Promise<IPaginatedResponse<IItem>> {
  const params = new URLSearchParams()
  if (filters.search?.trim()) params.set('search', filters.search.trim())
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  const query = params.toString()
  const response = await fetch(`${BASE_URL}/api/items${query ? `?${query}` : ''}`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }

  return response.json()
}

export async function fetchItemById(id: string): Promise<IItem> {
  const response = await fetch(`${BASE_URL}/api/items/${id}`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    if (response.status === 404) throw new Error('Item not found')
    throw new Error('Failed to fetch item')
  }

  return response.json()
}

export async function fetchItemIds(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/items/ids`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch item ids')
  }

  return response.json()
}
