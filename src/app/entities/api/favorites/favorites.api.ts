import type { Favorite } from '@/app/entities/models'

export async function fetchFavorites(): Promise<Favorite[]> {
  const response = await fetch('/api/favorites', {
    credentials: 'include',
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
