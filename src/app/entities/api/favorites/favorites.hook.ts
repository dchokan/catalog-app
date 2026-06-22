'use client'

import { useQuery } from '@tanstack/react-query'
import { favoritesQueryOptions } from './favorites.query'

export const useFavoritesQuery = () => useQuery(favoritesQueryOptions())
