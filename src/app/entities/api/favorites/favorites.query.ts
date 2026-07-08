import { queryOptions, useQuery } from '@tanstack/react-query'

import { EFavoriteKey } from '@/app/entities/models'

import { fetchFavorites } from './favorites.api'

export const favoritesQueryOptions = () => {
  return queryOptions({
    queryKey: [EFavoriteKey.QUERY],
    queryFn: () => fetchFavorites(),
  })
}

export const useFavoritesQuery = () => {
  return useQuery(favoritesQueryOptions())
}
