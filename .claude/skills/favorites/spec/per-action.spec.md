# Favorites checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +api — adding/changing a favorites route handler

- **MUST** resolve the session first and return `401` JSON before any DB work.
- **MUST** scope every query by `session.user.id` (GET filters by it; DELETE matches `and(userId, itemId)`).
- **MUST** in POST: validate `itemId` (→ `400` if missing), insert with `.returning()`, respond `201`, and translate `unique_user_item_idx` → `409`.
- **MUST** in GET: `leftJoin` items and select item columns WITHOUT `favoritesCount`.
- **MUST** wrap DB calls so failures return `500 { error }`, never an unhandled throw.

## +button — the favorite toggle (features/favorite-button)

- **MUST** derive `isFavorited` from `useFavoritesQuery` (`favorites.some(f => f.itemId === itemId)`), not from local state.
- **MUST** route unauthenticated users to `/login` via `@/pkg/locale` `useRouter` instead of mutating or throwing.
- **MUST** show pending state from `addFavorite.isPending || removeFavorite.isPending`.
- **MUST** call `addFavorite.mutate(itemId)` / `removeFavorite.mutate(itemId)` — the mutations own the optimistic update; the button does not touch the cache.

## +page — the favorites page (web)/[locale]/(protected)/favorites

- **MUST** be a Server Component that calls `setRequestLocale(locale)`.
- **MUST** prefetch with the forwarded cookie: `queryFn: () => fetchFavorites(requestHeaders.get('cookie') ?? undefined)`.
- **MUST** render `<FavoritesModule />` inside `<HydrationBoundary state={dehydrate(queryClient)}>`.
- **MUST NOT** add its own auth check/redirect — no route in this app performs a server-side auth redirect today (`(protected)/layout.tsx` is pass-through, no middleware); an anonymous visit renders the fetch's error/empty state instead.

## +count — touching the derived favoritesCount

- **MUST** compute it in the items routes as `count(favorites.id)` over a `leftJoin(favorites)` with `groupBy(items.id)` — never store a column.
- **MUST** keep `IItem.favoritesCount: number` and `IFavorite.item: Omit<IItem, 'favoritesCount'>` consistent.
- **MUST** ensure the favorites mutations invalidate `EItemKey.QUERY` so the count refreshes after add/remove.

## +mutation — optimistic add/remove (favorites.mutation.ts)

- **MUST** follow cancel → snapshot → optimistic write → rollback-on-error → invalidate-on-settle.
- **MUST** guard the rollback on `context?.previousFavorites !== undefined`.
- **MUST** append a placeholder (`item: null`, synthetic id) on add and `filter` on remove.
- **MUST** invalidate both `EFavoriteKey.QUERY` and `EItemKey.QUERY` in `onSettled`.
