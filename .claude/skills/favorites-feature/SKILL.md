---
name: favorites-feature
description: Implement the user favorites feature. Use when building the favorites API routes, server-side service, client-side query/mutation hooks, favorite button widget, and the favorites page. Depends on auth-system and items-catalog being in place.
---

# Favorites Feature

Users can save items to their favorites list. The favorites table is a junction between `user` and `items`. The API supports get-all, add, and remove. The UI shows a toggle button on item detail and a separate favorites page.

## File Layout

```
src/app/
├── (api)/api/favorites/
│   ├── route.ts              # GET (list) + POST (add)
│   └── [itemId]/
│       └── route.ts          # DELETE (remove)
│
├── (web)/favorites/
│   └── page.tsx              # Protected page: user's saved items
│
├── entities/
│   ├── models/
│   │   └── favorite.model.ts
│   └── api/favorites/
│       ├── favorites.api.ts       # fetch/mutate functions
│       ├── favorites.query.ts     # queryOptions factory
│       ├── favorites.hook.ts      # useFavoritesQuery hook
│       └── favorites.mutation.ts  # useAddFavorite, useRemoveFavorite hooks
│
├── modules/favorites/
│   ├── favorites.module.tsx       # Grid of favorited items (client)
│   └── favorites.service.ts       # getUserFavorites (server DB query)
│
└── widgets/favorite-button/
    └── favorite-button.component.tsx  # Toggle button (add/remove)
```

## `src/app/entities/models/favorite.model.ts`

```typescript
interface Favorite {
  id: string
  itemId: string
  userId: string
  createdAt: Date | string
  item: Item | null
}
```

Query keys use `EEntityKey` enum from `src/app/shared/interfaces/entities.interface.ts`:
```typescript
export enum EEntityKey {
  QUERY_ITEMS = 'query-items',
  QUERY_FAVORITES = 'query-favorites',
}
```

No separate `favorites.keys.ts` file — all query key references use `[EEntityKey.QUERY_FAVORITES]`.

## `src/app/entities/api/favorites/favorites.api.ts`

Three async functions:

**`fetchFavorites()`** — `GET /api/favorites` → returns `Favorite[]`

**`addFavorite(itemId: string)`** — `POST /api/favorites` with body `{ itemId }` → returns created favorite

**`removeFavorite(itemId: string)`** — `DELETE /api/favorites/:itemId` → returns success

All functions use `fetch` with the base URL from `NEXT_PUBLIC_APP_URL`.

## `src/app/entities/api/favorites/favorites.query.ts`

Exports a `queryOptions` factory (not a hook):

```typescript
import { queryOptions } from '@tanstack/react-query'
import { EEntityKey } from '@/app/shared/interfaces'

export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_FAVORITES],
    queryFn: fetchFavorites,
  })
```

## `src/app/entities/api/favorites/favorites.hook.ts`

Client-only hook that wraps the queryOptions:

```typescript
'use client'
export const useFavoritesQuery = () => useQuery(favoritesQueryOptions())
```

## `src/app/entities/api/favorites/favorites.mutation.ts`

See `optimistic-updates` skill for the full optimistic pattern. At minimum:

**`useAddFavorite()`**
- `mutationFn: (itemId) => addFavorite(itemId)`
- On settled: invalidate `[EEntityKey.QUERY_FAVORITES]` and `[EEntityKey.QUERY_ITEMS]` (to refresh favoritesCount)

**`useRemoveFavorite()`**
- `mutationFn: (itemId) => removeFavorite(itemId)`
- On settled: invalidate `[EEntityKey.QUERY_FAVORITES]` and `[EEntityKey.QUERY_ITEMS]`

See `optimistic-updates` skill for the full `onMutate`/`onError`/`onSettled` pattern.

## `src/app/(api)/api/favorites/route.ts`

**GET handler:**
1. Get session via `auth.api.getSession({ headers })`
2. If no session: return 401
3. Query DB: `WHERE userId = session.user.id`, join with items table
4. Return `NextResponse.json(favorites)`

**POST handler:**
1. Get session — return 401 if missing
2. Parse body: `{ itemId }`
3. Insert into favorites table with `userId` + `itemId`
4. If unique constraint violation: return 409 (already favorited)
5. Return the created record (201)

## `src/app/(api)/api/favorites/[itemId]/route.ts`

**DELETE handler:**
1. Get session — return 401 if missing
2. Extract `itemId` from params
3. Delete: `WHERE userId = session.user.id AND itemId = itemId`
4. Return 200

## `src/app/modules/favorites/favorites.service.ts`

Server-side function `getUserFavorites(userId: string)`:
- Query favorites table WHERE userId = userId
- Join with items to get item details
- Return array of favorites with nested item objects

## `src/app/(web)/favorites/page.tsx`

Server Component:
1. Get session via `auth.api.getSession` — if no session, `redirect("/login")`
2. Prefetch `favoriteKeys.list()` with `getUserFavorites(session.user.id)`
3. Wrap in `<HydrationBoundary>`

## `src/app/modules/favorites/favorites.module.tsx`

Client Component:
- `useFavoritesQuery()` for data
- If empty: show "No favorites yet" message with link to `/items`
- Render grid of `<ItemCard />` for each favorited item

## `src/app/widgets/favorite-button/favorite-button.component.tsx`

Client Component:
- Props: `itemId: string`
- `useFavoritesQuery()` to check if this item is already favorited
- `useAddFavorite()` + `useRemoveFavorite()` mutations
- `useSession()` to check auth state
- If user is not logged in: clicking redirects to `/login`
- If favorited: render filled heart / "Remove" button → calls `useRemoveFavorite`
- If not favorited: render empty heart / "Save" button → calls `useAddFavorite`
- Show loading state while mutation is pending

## Hard Rules

- All favorites API routes require authentication — return 401 (not redirect) for unauthorized API calls
- Unique constraint on `(userId, itemId)` at DB level prevents duplicate favorites — catch the constraint error in POST route
- `FavoriteButton` handles the "not logged in" case gracefully — redirect to login, don't throw
- Invalidate both `[EEntityKey.QUERY_FAVORITES]` AND `[EEntityKey.QUERY_ITEMS]` after add/remove — items list shows updated `favoritesCount`
- `favorites.service.ts` is server-only — call it from Server Components and API routes, never from client
- `favorites.query.ts` exports `queryOptions` factories; `favorites.hook.ts` exports `useFavoritesQuery` hook

## Verification

- `GET /api/favorites` returns 401 when not authenticated
- `POST /api/favorites` with `{ itemId }` adds to favorites
- `POST /api/favorites` with duplicate `itemId` returns 409
- `DELETE /api/favorites/:itemId` removes the favorite
- `/favorites` page redirects to `/login` when not authenticated
- Favorite button shows correct filled/empty state based on user's favorites
- Adding a favorite updates `favoritesCount` on the item card
