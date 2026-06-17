'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite, removeFavorite } from './favorites.api'
import { favoritesQueryKeys } from './favorites.query'
import type { Favorite } from '@/app/entities/models'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKeys.all })
      const previousFavorites = queryClient.getQueryData<Favorite[]>(favoritesQueryKeys.all)
      queryClient.setQueryData<Favorite[]>(favoritesQueryKeys.all, (old = []) => [
        ...old,
        {
          id: `optimistic-${itemId}`,
          userId: 'current',
          itemId,
          createdAt: new Date().toISOString(),
          item: null,
        },
      ])

      return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(favoritesQueryKeys.all, context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKeys.all })
      const previousFavorites = queryClient.getQueryData<Favorite[]>(favoritesQueryKeys.all)
      queryClient.setQueryData<Favorite[]>(favoritesQueryKeys.all, (old = []) =>
        old.filter((fav) => fav.itemId !== itemId),
      )

      return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(favoritesQueryKeys.all, context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all })
    },
  })
}
