'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EFavoriteKey, EItemKey, type IFavorite } from '@/app/entities/models'

import { addFavorite, removeFavorite } from './favorites.api'

// optimistic cycle: cancel → snapshot → write → rollback on error → invalidate on settle
export function useAddFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),

    onMutate: async (itemId: string) => {
      // cancelQueries([EFavoriteKey.QUERY]); snapshot previousFavorites;
      // optimistically APPEND placeholder { id: `optimistic-${itemId}`, itemId, item: null, ... }
      // return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      // restore context.previousFavorites (guard on !== undefined)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EFavoriteKey.QUERY] })
      queryClient.invalidateQueries({ queryKey: [EItemKey.QUERY] }) // refresh derived favoritesCount
    },
  })
}

// same cycle; onMutate FILTERS OUT the itemId instead of appending
export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeFavorite(itemId),
    onMutate: async (itemId: string) => {
      // cancel; snapshot; setQueryData(old => old.filter(f => f.itemId !== itemId)); return { previousFavorites }
    },
    onError: (_error, _itemId, context) => {
      // restore context.previousFavorites
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EFavoriteKey.QUERY] })
      queryClient.invalidateQueries({ queryKey: [EItemKey.QUERY] })
    },
  })
}
