# Optimistic add/remove

Both favorite mutations apply the change to the cache *before* the server confirms, so the toggle and the favorites grid react instantly. The pattern is the standard TanStack Query optimistic cycle: **cancel → snapshot → write → (rollback on error) → invalidate on settle**. Both `useAddFavoriteMutation` and `useRemoveFavoriteMutation` follow it; they differ only in how they mutate the cached list.

## The four callbacks

**`mutationFn`** — calls the raw fetcher (`addFavorite(itemId)` / `removeFavorite(itemId)`). It does not touch the cache.

**`onMutate(itemId)`** — runs synchronously before the request:

1. `await queryClient.cancelQueries({ queryKey: [EFavoriteKey.QUERY] })` — cancels any in-flight favorites refetch so a slower response can't land *after* the optimistic write and clobber it.
2. `const previousFavorites = queryClient.getQueryData<IFavorite[]>([EFavoriteKey.QUERY])` — snapshots the current list. This snapshot is the rollback source.
3. `queryClient.setQueryData<IFavorite[]>([EFavoriteKey.QUERY], …)` — writes the optimistic list:
   - **add** appends a placeholder favorite. Its `item` is `null` and `id` is a synthetic `optimistic-${itemId}`; the real record (with the joined item) arrives on the next invalidation. `userId` is a placeholder (`'current'`) — it is never read by the UI, which keys off `itemId`.
   - **remove** filters out the entry whose `itemId` matches.
4. `return { previousFavorites }` — the return value becomes `context` in `onError`.

**`onError(_error, _itemId, context)`** — restores the snapshot: `if (context?.previousFavorites !== undefined) queryClient.setQueryData([EFavoriteKey.QUERY], context.previousFavorites)`. Guard on `!== undefined` so an absent snapshot (cache was empty) doesn't overwrite the list with `undefined`.

**`onSettled()`** — fires on success *and* error, and invalidates **two** keys:

```
queryClient.invalidateQueries({ queryKey: [EFavoriteKey.QUERY] })  // re-pull the authoritative list (real ids, joined item)
queryClient.invalidateQueries({ queryKey: [EItemKey.QUERY] })      // re-pull items so favoritesCount is correct
```

## Why each step matters

- **Cancel before snapshot** — without it, a refetch already in flight resolves later and overwrites the optimistic state with stale data, producing a flicker or a "didn't save" illusion.
- **Snapshot, not recompute** — rollback restores the exact prior array. Recomputing the inverse operation (e.g. "remove what I added") drifts if the cache changed underneath.
- **Optimistic placeholder is intentionally partial** — the UI only needs `itemId` to decide filled/empty state and to render the remove control. The placeholder's missing `item`/real `id` are reconciled by the settle-time invalidation, so there's no need to fabricate item data.
- **Invalidate on settle, not in `onSuccess`** — settling on both outcomes guarantees the cache re-syncs even when the request failed mid-flight (after the optimistic write but before a clean rollback path), and avoids leaving the synthetic `optimistic-*` id in the list.
- **The second invalidation is not optional** — `favoritesCount` is derived data owned by the items query. Skipping `EItemKey.QUERY` leaves the count on item cards and the detail page stale until something else refetches them.

## Failure modes this prevents

- Double-click spam: `cancelQueries` + the snapshot keep the list coherent across overlapping mutations.
- "Saved then vanished": caused by a late refetch overwriting the optimistic write — prevented by the cancel.
- Stale counts: prevented by the dual invalidation.
