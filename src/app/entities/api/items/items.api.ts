import type { Item } from '@/app/entities/models'
import type { ItemsFilters } from './items.interface'
import { clientEnv } from '@/config/env'

const BASE_URL = clientEnv.NEXT_PUBLIC_APP_URL

export async function fetchItems(filters: ItemsFilters = {}): Promise<Item[]> {
  const params = new URLSearchParams()
  if (filters.search?.trim()) params.set('search', filters.search.trim())

  const query = params.toString()
  const response = await fetch(`${BASE_URL}/api/items${query ? `?${query}` : ''}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }

  return response.json()
}

export async function fetchItemById(id: string): Promise<Item> {
  const response = await fetch(`${BASE_URL}/api/items/${id}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    if (response.status === 404) throw new Error('Item not found')
    throw new Error('Failed to fetch item')
  }

  return response.json()
}
