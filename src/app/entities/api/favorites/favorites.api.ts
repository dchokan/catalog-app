import type { Favorite } from '@/app/entities/models'
import { clientEnv } from '@/config/env'

const BASE_URL = clientEnv.NEXT_PUBLIC_APP_URL

export async function fetchFavorites(cookie?: string): Promise<Favorite[]> {
  const response = await fetch(`${BASE_URL}/api/favorites`, {
    credentials: 'include',
    headers: cookie ? { cookie } : undefined,
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}

export async function addFavorite(itemId: string): Promise<Favorite> {
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
