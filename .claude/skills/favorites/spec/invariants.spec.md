# Favorites invariants

Global rules that always hold for the favorites feature. Confirm each after any change.

## Auth & API contract

- **MUST** gate every favorites route on a session resolved via `authServer.api.getSession({ headers: request.headers })`.
  - Check: `grep -rn "getSession" "src/app/(api)/api/favorites"` → present in `route.ts` (GET+POST) and `[itemId]/route.ts` (DELETE).
- **MUST** return `401 { error: 'Unauthorized' }` JSON (not a redirect) when there is no session.
  - Check: `grep -rn "status: 401" "src/app/(api)/api/favorites"` → one per handler.
- **MUST NOT** import auth/db from anywhere but the shared services.
  - Check: imports are `@/app/shared/services/auth` and `@/app/shared/services/db`.
- **MUST** map the `unique_user_item_idx` constraint error to `409` in POST; **MUST NOT** pre-check duplicates with a SELECT.
  - Check: `grep -rn "unique_user_item_idx" "src/app/(api)/api/favorites/route.ts"` and `grep -rn "409"` same file.

## Query keys & invalidation

- **MUST** key the favorites query on `EFavoriteKey.QUERY` (from `entities/models/favorite.model.ts`); **MUST NOT** hardcode `'query-favorites'` or import a `shared/interfaces` enum.
  - Check: `grep -rn "EFavoriteKey.QUERY" src/app/entities/api/favorites` ; `grep -rn "query-favorites" src/app/entities/api` → no string literal outside the enum definition.
- **MUST** invalidate BOTH `EFavoriteKey.QUERY` and `EItemKey.QUERY` in each mutation's `onSettled`.
  - Check: `grep -n "invalidateQueries" src/app/entities/api/favorites/favorites.mutation.ts` → both keys appear in each mutation.

## Client/server boundary

- **MUST** mark only `favorites.mutation.ts` with `'use client'`; `favorites.api.ts` and `favorites.query.ts` stay server-composable.
  - Check: `grep -rln "use client" src/app/entities/api/favorites` → only `favorites.mutation.ts`.
- **MUST** let `fetchFavorites` accept an optional cookie and forward it.
  - Check: `grep -n "fetchFavorites" src/app/entities/api/favorites/favorites.api.ts` → signature `(cookie?: string)`.

## Typing & placement

- **MUST** type `IFavorite.item` as `Omit<IItem, 'favoritesCount'> | null` (the join carries no count).
  - Check: `grep -n "Omit<IItem" src/app/entities/models/favorite.model.ts`.
- **MUST** keep the toggle in `features/favorite-button/` (a feature), **MUST NOT** place it under `widgets/`.
  - Check: `ls src/app/features/favorite-button`.
- **MUST** expose the api slice through its `index.ts` barrel; consumers import from `@/app/entities/api/favorites`.

## Locale-aware navigation

- **MUST** use `Link` / `useRouter` from `@/pkg/locale` in favorites UI; **MUST NOT** import `next/link` or `next/navigation` directly.
  - Check: `grep -rn "from 'next/link'\|from 'next/navigation'" src/app/modules/favorites src/app/features/favorite-button` → empty.
