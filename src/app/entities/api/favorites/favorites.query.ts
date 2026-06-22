import { queryOptions } from '@tanstack/react-query'
import { fetchFavorites } from './favorites.api'
import { EEntityKey } from '@/app/shared/interfaces'

export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_FAVORITES],
    queryFn: fetchFavorites,
  })
