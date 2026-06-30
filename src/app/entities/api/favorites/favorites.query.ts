import { queryOptions, useQuery } from '@tanstack/react-query'

import { EFavoriteKey } from '@/app/entities/models'

import { fetchFavorites } from './favorites.api'

export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: [EFavoriteKey.QUERY],
    queryFn: () => fetchFavorites(),
  })

export const useFavoritesQuery = () => useQuery(favoritesQueryOptions())
