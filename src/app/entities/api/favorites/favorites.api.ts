import type { IFavorite } from '@/app/entities/models'
import { getApiBaseUrl } from '@/pkg/rest-api'

export async function fetchFavorites(cookie?: string): Promise<IFavorite[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/favorites`, {
    credentials: 'include',
    headers: cookie ? { cookie } : undefined,
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}

export async function addFavorite(itemId: string): Promise<IFavorite> {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ itemId }),
  })

  if (!response.ok) {
    if (response.status === 409) throw new Error('Already in favorites')
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to add favorite')
  }

  return response.json()
}

export async function removeFavorite(itemId: string): Promise<void> {
  const response = await fetch(`/api/favorites/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to remove favorite')
  }
}
