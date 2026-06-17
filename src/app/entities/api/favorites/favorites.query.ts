'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFavorites } from './favorites.api'
import { favoritesQueryKeys } from './favorites.keys'

export { favoritesQueryKeys }

export function useFavorites() {
  return useQuery({
    queryKey: favoritesQueryKeys.all,
    queryFn: fetchFavorites,
  })
}
