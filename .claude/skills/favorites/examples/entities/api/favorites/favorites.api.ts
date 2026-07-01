import type { IFavorite } from '@/app/entities/models'
import { envClient } from '@/config/env'

const BASE_URL = envClient.NEXT_PUBLIC_APP_URL

// list — optional cookie lets the server prefetch forward auth; throws on 401
export async function fetchFavorites(cookie?: string): Promise<IFavorite[]> {
  // GET `${BASE_URL}/api/favorites`, credentials: 'include', headers: cookie ? { cookie } : undefined
  // !ok → 401 throws 'Unauthorized', else 'Failed to fetch favorites'
}

// add — relative URL (client-only); 409 (unique constraint) → 'Already in favorites'
export async function addFavorite(itemId: string): Promise<IFavorite> {
  // POST '/api/favorites', body { itemId }
  // !ok → 409 'Already in favorites' | 401 'Unauthorized' | 'Failed to add favorite'
}

// remove
export async function removeFavorite(itemId: string): Promise<void> {
  // DELETE `/api/favorites/${itemId}`
  // !ok → 401 'Unauthorized' | 'Failed to remove favorite'
}
