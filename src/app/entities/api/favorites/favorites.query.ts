import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchFavorites } from './favorites.api'
import { EFavoriteKey } from '@/app/entities/models'

export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: [EFavoriteKey.QUERY],
    queryFn: () => fetchFavorites(),
  })

export const useFavoritesQuery = () => useQuery(favoritesQueryOptions())
