---
name: favorites
description: Build, extend, or debug the user favorites feature in this catalog app — the favorites API routes (GET/POST/DELETE), the TanStack query/mutation layer with optimistic add/remove, the favorite toggle button, the favorites page, and the derived favoritesCount shown on items. Use when touching anything under entities/api/favorites, (api)/api/favorites, modules/favorites, features/favorite-button, the favorite.model, or the favoritesCount aggregation in the items routes. Skip for unrelated item-catalog, auth, or pagination work.
---

# favorites

Users save items (books) to a personal favorites list. `favorites` is a junction table between `user` and `items` with a uniqueness constraint on `(userId, itemId)`. The feature spans five layers: an authenticated REST surface (`(api)/api/favorites`), a TanStack Query slice with optimistic mutations (`entities/api/favorites`), a toggle button (`features/favorite-button`), the favorites page module (`modules/favorites` + `(web)/[locale]/(protected)/favorites`), and a derived `favoritesCount` that the **items** layer computes and renders.

This skill documents the real feature as built in this repo — paths, symbols, and conventions below are concrete, not placeholders.

## Layout

```
src/app/
├── (api)/api/favorites/
│   ├── route.ts                       # GET list + POST add   (auth-gated, 401/409 JSON)
│   └── [itemId]/route.ts              # DELETE remove          (auth-gated)
├── (web)/[locale]/(protected)/favorites/
│   └── page.tsx                       # RSC: setRequestLocale + prefetch + HydrationBoundary
├── entities/
│   ├── models/favorite.model.ts       # IFavorite + EFavoriteKey
│   └── api/favorites/
│       ├── favorites.api.ts           # fetchFavorites / addFavorite / removeFavorite
│       ├── favorites.query.ts         # favoritesQueryOptions + useFavoritesQuery
│       ├── favorites.mutation.ts      # useAddFavoriteMutation / useRemoveFavoriteMutation ('use client')
│       └── index.ts                   # barrel
├── modules/favorites/
│   ├── favorites.module.tsx           # grid of saved items, inline remove ('use client')
│   └── index.ts
└── features/favorite-button/
    ├── favorite-button.component.tsx  # add/remove toggle ('use client')
    └── index.ts
```

The **count** lives outside this tree: `favoritesCount` is aggregated in `(api)/api/items/route.ts` and `(api)/api/items/[id]/route.ts`, typed on `IItem`, and rendered by the items modules. This skill owns the contract (`IFavorite.item` omits it; favorite mutations invalidate `EItemKey.QUERY`); see `references/favorites-count.md`.

## Hard rules

1. **Every favorites API route is auth-gated and returns JSON, never a redirect.** Resolve the session with `authServer.api.getSession({ headers: request.headers })` from `@/app/shared/services/auth`; no session → `401 { error: 'Unauthorized' }`. There is no server-side page redirect — `(protected)/layout.tsx` renders children as-is and there is no middleware; an anonymous visit to `/favorites` just renders with the fetch's error/empty state. See the **auth** skill's `references/route-protection.md`.
2. **Uniqueness is enforced by the DB index `unique_user_item_idx` on `(userId, itemId)`.** The POST handler inserts optimistically and maps that constraint error to `409`. Do not pre-check with a SELECT.
3. **The query key is `EFavoriteKey.QUERY`** (defined in `entities/models/favorite.model.ts`). Never hardcode `'query-favorites'` or reach for a `shared/interfaces` enum — that location no longer exists.
4. **Both mutations invalidate `EFavoriteKey.QUERY` AND `EItemKey.QUERY` in `onSettled`.** The second refresh is mandatory — it re-pulls the derived `favoritesCount` on item cards and detail.
5. **Only `favorites.mutation.ts` is `'use client'`.** `favorites.api.ts` and `favorites.query.ts` stay server-composable so the page can `prefetchQuery`. `fetchFavorites(cookie?)` accepts an optional cookie string so the server prefetch can forward the request cookie.
6. **Navigation goes through `@/pkg/locale`.** Use its `Link` and `useRouter` (locale-aware next-intl wrappers), not `next/link` / `next/navigation` directly.

## Key files

- **`favorite.model.ts`** — `IFavorite { id, userId, itemId, createdAt, item }` where `item: Omit<IItem, 'favoritesCount'> | null` (the join returns the item without its own derived count). Plus `enum EFavoriteKey { QUERY = 'query-favorites' }`.
- **`favorites.api.ts`** — three fetchers. `fetchFavorites(cookie?)` GETs the list (forwards cookie for SSR, throws on 401). `addFavorite(itemId)` POSTs (maps 409→`Already in favorites`). `removeFavorite(itemId)` DELETEs. Base URL from `envClient.NEXT_PUBLIC_APP_URL` for the list fetch.
- **`favorites.query.ts`** — `favoritesQueryOptions()` (keyed on `[EFavoriteKey.QUERY]`) and the `useFavoritesQuery()` hook in the same file. No separate `.hook.ts`.
- **`favorites.mutation.ts`** — `useAddFavoriteMutation` / `useRemoveFavoriteMutation`, each with the full optimistic `onMutate`/`onError`/`onSettled` cycle. See `references/optimistic-updates.md`.
- **route handlers** — GET left-joins `items` and filters by `session.user.id`; POST inserts + returns 201; DELETE matches `and(userId, itemId)`.
- **`favorite-button.component.tsx`** — reads `useSession()` (from `@/app/shared/hooks`); unauthenticated click routes to `/login`; otherwise toggles via the mutations, deriving `isFavorited` from `useFavoritesQuery`.
- **`favorites.module.tsx`** — `'use client'` grid; loading/error/empty states; inline remove via `useRemoveFavoriteMutation`.
- **`page.tsx`** — RSC; `setRequestLocale(locale)`, `getQueryClient()`, prefetch with the forwarded cookie, render `<FavoritesModule />` inside `<HydrationBoundary>`.

## Self-verification

After any change, confirm against `spec/`:
1. `spec/invariants.spec.md` — the rules that always hold for this feature (auth gating, key naming, dual invalidation, client/server boundary).
2. The matching block in `spec/per-action.spec.md` — `+api`, `+button`, `+page`, or `+count`.

Each item is a `MUST`/`MUST NOT` with a **Check** grep hint.

## Common mistakes

| Mistake | Reality |
|---|---|
| `EEntityKey.QUERY_FAVORITES` from `shared/interfaces` | It's `EFavoriteKey.QUERY` in `entities/models/favorite.model.ts`. `shared/interfaces` was removed. |
| Placing the button under `widgets/` | The toggle is a **feature** (`features/favorite-button/`) — single-purpose, composes only entities/shared. |
| A separate `favorites.hook.ts` | `useFavoritesQuery` lives in `favorites.query.ts` alongside `favoritesQueryOptions`. |
| Redirecting on an unauthorized API call | API routes return `401` JSON; there is no server-side redirect — `(protected)` is organizational only, and there's no middleware. |
| Invalidating only `EFavoriteKey.QUERY` | Also invalidate `EItemKey.QUERY`, or `favoritesCount` on cards goes stale. |
| Pre-checking duplicates with a SELECT | Insert and catch `unique_user_item_idx` → 409. |
| `import Link from 'next/link'` | Use `Link` / `useRouter` from `@/pkg/locale`. |
| Prefetching without the cookie | `page.tsx` must pass `requestHeaders.get('cookie')` into `fetchFavorites`, or SSR fetch 401s. |
| `'use client'` on `favorites.api.ts` / `.query.ts` | Only `favorites.mutation.ts` is a client module; the rest stay server-composable. |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Writing/auditing the optimistic add/remove cycle (cancel, snapshot, rollback, settle) and **why** | `references/optimistic-updates.md` |
| Working on the derived **favoritesCount** (SQL aggregation, the `IItem`/`IFavorite` typing split, cross-invalidation) | `references/favorites-count.md` |
| Need a copy-ready **shape** for any favorites file | `examples/` |
| **Verifying** a change | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/optimistic-updates.md`** — the `onMutate`/`onError`/`onSettled` pattern and the reasoning behind each step.
- **`references/favorites-count.md`** — how `favoritesCount` is derived and kept fresh.
- **`examples/`** — concrete shapes of every favorites file (this repo's real layout).
- **`spec/`** — `invariants.spec.md` (always-true rules) + `per-action.spec.md` (checks per action).
