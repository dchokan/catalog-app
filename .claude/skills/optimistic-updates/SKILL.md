---
name: optimistic-updates
description: Implement optimistic UI updates with TanStack Query for the favorites mutations. Use when adding instant UI feedback for add/remove favorite actions, with automatic rollback on error. Covers the onMutate/onError/onSettled pattern in useAddFavorite and useRemoveFavorite.
---

# Optimistic Updates

Mutations that update the favorites list use React Query's optimistic update pattern: update the cache immediately before the server responds, then rollback if the request fails. This removes perceived latency when toggling favorites.

## File

```
src/app/entities/api/favorites/favorites.mutation.ts
```

Both `useAddFavorite` and `useRemoveFavorite` implement this pattern.

## The Pattern: onMutate / onError / onSettled

```
useMutation({
  mutationFn: ...,

  onMutate: async (variables) => {
    // 1. Cancel any in-flight queries for this key (prevents race conditions)
    await queryClient.cancelQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })

    // 2. Snapshot the current cache value (for rollback)
    const previousFavorites = queryClient.getQueryData([EEntityKey.QUERY_FAVORITES])

    // 3. Optimistically update the cache
    queryClient.setQueryData([EEntityKey.QUERY_FAVORITES], (old) => /* updated value */)

    // 4. Return snapshot as context (passed to onError)
    return { previousFavorites }
  },

  onError: (error, variables, context) => {
    // Rollback to snapshot
    queryClient.setQueryData([EEntityKey.QUERY_FAVORITES], context.previousFavorites)
  },

  onSettled: () => {
    // Always refetch after mutation settles (success or error) to sync with server
    queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
    queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_ITEMS] })
  },
})
```

`EEntityKey` is imported from `@/app/shared/interfaces`.

## `useAddFavorite` Implementation

**`mutationFn`:** `(itemId: string) => addFavorite(itemId)`

**`onMutate`:**
1. Cancel queries for `[EEntityKey.QUERY_FAVORITES]`
2. Snapshot current favorites array via `queryClient.getQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES])`
3. Optimistically add a fake Favorite object to the array:
   - `id`: temporary string (e.g., `"optimistic-" + itemId`)
   - `itemId`: the passed itemId
   - `userId`: `"current"` (placeholder — real value comes after server response)
   - `createdAt`: `new Date().toISOString()`
   - `item`: `null` (Favorite.item is `Item | null`)
4. Return `{ previousFavorites }`

**`onError`:** restore `previousFavorites`

**`onSettled`:** invalidate both `[EEntityKey.QUERY_FAVORITES]` and `[EEntityKey.QUERY_ITEMS]`

## `useRemoveFavorite` Implementation

**`mutationFn`:** `(itemId: string) => removeFavorite(itemId)`

**`onMutate`:**
1. Cancel queries for `[EEntityKey.QUERY_FAVORITES]`
2. Snapshot current favorites array
3. Optimistically filter out the favorite with matching `itemId`:
   ```typescript
   queryClient.setQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES], (old = []) =>
     old.filter((fav) => fav.itemId !== itemId)
   )
   ```
4. Return `{ previousFavorites }`

**`onError`:** restore `previousFavorites`

**`onSettled`:** invalidate both `[EEntityKey.QUERY_FAVORITES]` and `[EEntityKey.QUERY_ITEMS]`

## Why Invalidate on Settled (Not Just onSuccess)

`onSettled` runs whether the mutation succeeds or fails. After an error + rollback, you still want to re-sync with the server to confirm the true state. Invalidating in `onSettled` handles both cases in one place.

## Why Cancel Queries First

Without `cancelQueries`, an in-flight `GET /api/favorites` response could land AFTER the optimistic update, overwriting it with stale data. Cancelling prevents this race condition.

## Why Return Context

`onMutate` returns `context`. React Query passes this exact object as the third argument to `onError`. This is the only way to pass the snapshot from `onMutate` to `onError` for rollback.

## FavoriteButton — Using the Mutations

```typescript
const { mutate: addFavorite, isPending: isAdding } = useAddFavorite()
const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite()
const { data: favorites } = useFavoritesQuery()

const isFavorited = favorites?.some((f) => f.itemId === itemId)
const isLoading = isAdding || isRemoving
```

Show loading spinner while `isLoading` is true. Disable button during loading.

## Hard Rules

- Always `cancelQueries` before `setQueryData` in `onMutate` — prevents race with in-flight fetches
- Snapshot must happen AFTER `cancelQueries` — otherwise you might snapshot stale data that was about to be updated
- Use `onSettled` for invalidation, NOT `onSuccess` — ensures sync even after rollback
- Invalidate `[EEntityKey.QUERY_ITEMS]` after favorite changes — `favoritesCount` on item cards must update
- `Favorite.item` is `Item | null` and `createdAt` is `Date | string` — use matching types in optimistic objects
- Don't await the mutation in the component — `mutate()` is fire-and-forget, the UI updates via React Query cache

## Verification

- Clicking Add Favorite: favorite button changes state immediately (before server responds)
- Clicking Remove Favorite: item disappears from favorites list immediately
- If server returns error: UI reverts to previous state
- After settling: React Query refetches to confirm final state
- Favorites count on item cards updates after adding/removing a favorite
