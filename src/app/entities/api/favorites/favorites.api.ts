import type { IFavorite } from '@/app/entities/models'
import { restApiFetcher } from '@/pkg/rest-api'

export async function fetchFavorites(cookie?: string): Promise<IFavorite[]> {
  const response = await restApiFetcher.get('favorites', { headers: cookie ? { cookie } : undefined })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}

export async function addFavorite(itemId: string): Promise<IFavorite> {
  const response = await restApiFetcher.post('favorites', { json: { itemId } })

  if (!response.ok) {
    if (response.status === 409) throw new Error('Already in favorites')
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to add favorite')
  }

  return response.json()
}

export async function removeFavorite(itemId: string): Promise<void> {
  const response = await restApiFetcher.delete(`favorites/${itemId}`)

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to remove favorite')
  }
}
