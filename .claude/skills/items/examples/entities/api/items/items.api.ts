import type { IItem, IItemsFilters, IPaginatedResponse } from '@/app/entities/models'
import { envClient } from '@/config/env'

const BASE_URL = envClient.NEXT_PUBLIC_APP_URL

// list — build ?search=&page= (page only when >1); cached with ISR-style revalidate
export async function fetchItems(filters: IItemsFilters = {}): Promise<IPaginatedResponse<IItem>> {
  const params = new URLSearchParams()
  if (filters.search?.trim()) params.set('search', filters.search.trim())
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  const query = params.toString()
  const response = await fetch(`${BASE_URL}/api/items${query ? `?${query}` : ''}`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  })
  if (!response.ok) throw new Error('Failed to fetch items')
  return response.json()
}

// single — 404 → 'Item not found'
export async function fetchItemById(id: string): Promise<IItem> {
  // GET `${BASE_URL}/api/items/${id}` (force-cache, revalidate 60); 404 throws 'Item not found'
}

// all ids — for generateStaticParams
export async function fetchItemIds(): Promise<string[]> {
  // GET `${BASE_URL}/api/items/ids` (force-cache, revalidate 60)
}
