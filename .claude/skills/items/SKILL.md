---
name: items
description: Build, extend, or debug the items (books) catalog — the items list and detail pages, the read-only items API routes (list with search+pagination, single item), the TanStack query layer, the list/detail modules, and the URL-driven search and pagination controls. Use when touching entities/api/items, (api)/api/items, modules/items-list, modules/item-detail, features/items-search, features/items-pagination, the item/api-response models, or the ITEMS_PER_PAGE constant. Skip for favorites/auth work (the favoritesCount shown here is owned by the favorites skill).
---

# items

The catalog lists books with server-side **search** and **pagination**, plus a detail page. It is **read-only**: items are seeded into the DB, never created through the app, so the items data layer has fetchers + query options but **no mutations**. The list endpoint returns a paginated envelope; search and page live in the **URL**, not component state, so results are shareable and SSR-prefetchable. Each item also carries a derived `favoritesCount` (the favorites skill owns how that's computed and invalidated).

This skill documents the real catalog as built in this repo — paths and symbols below are concrete.

## Layout

```
src/app/
├── (api)/api/items/
│   ├── route.ts                       # GET list: ilike search + offset pagination + count(favorites) → IPaginatedResponse
│   └── [id]/route.ts                  # GET one: item + favoritesCount, 404 if missing
├── (web)/[locale]/(public)/items/
│   ├── page.tsx                       # RSC: prefetch list + HydrationBoundary
│   └── [id]/page.tsx                  # RSC: generateMetadata + prefetch detail
├── entities/
│   ├── models/
│   │   ├── item.model.ts              # IItem, IItemsFilters, EItemKey
│   │   └── api-response.model.ts      # IPaginatedResponse<T>, IApiError, IApiSuccess
│   └── api/items/
│       ├── items.api.ts               # fetchItems / fetchItemById (force-cache + revalidate 60)
│       ├── items.query.ts             # itemsListQueryOptions / itemDetailQueryOptions + hooks
│       └── index.ts
├── modules/
│   ├── items-list/items-list.module.tsx     # 'use client' — reads URL, renders search + grid + pagination
│   └── item-detail/item-detail.module.tsx   # 'use client' — detail + FavoriteButton + favoritesCount label
├── features/
│   ├── items-search/items-search.component.tsx       # 'use client' — URL-driven search
│   └── items-pagination/items-pagination.component.tsx # 'use client' — URL-driven page controls
└── shared/constants/items.constant.ts        # ITEMS_PER_PAGE = 9
```

## Hard rules

1. **Read-only data layer.** `entities/api/items` exposes only fetchers and `queryOptions`/hooks — no `.mutation.ts`, no model with write shapes. Items come from the seed; the app never POSTs/PUTs items.
2. **The list endpoint returns the paginated envelope `IPaginatedResponse<IItem>`** (`data, total, page, limit, totalPages`). Consumers read `result.data` for the rows — never treat the response as a bare array.
3. **Search and page are URL searchParams, not state.** Features mutate them via `useRouter`/`usePathname` (`@/pkg/locale`) + `useSearchParams` (`next/navigation`); the list module reads them and passes `{ search, page }` to the query. **Changing the search resets `page`.**
4. **Query keys come from `EItemKey.QUERY`:** list = `[EItemKey.QUERY, 'list', filters]`, detail = `[EItemKey.QUERY, id]`. The enum lives in `item.model.ts`; never hardcode `'query-items'`.
5. **Item fetches are cached** (`cache: 'force-cache'`, `next: { revalidate: 60 }`). Don't switch these to no-store without reason.
6. **`ITEMS_PER_PAGE` (=9) is the single page size** (`shared/constants`). The route uses it for `limit`/`offset`; nothing else hardcodes a page size.

## Key files

- **`item.model.ts`** — `IItem { id, title, description, imageUrl, createdAt, favoritesCount }`, `IItemsFilters { search?, page? }`, `enum EItemKey { QUERY = 'query-items' }`.
- **`api-response.model.ts`** — `IPaginatedResponse<T> { data, total, page, limit, totalPages }` plus `IApiError`/`IApiSuccess`.
- **`items.api.ts`** — `fetchItems(filters)` builds `?search=&page=` (only page>1), `fetchItemById(id)` (404 → `Item not found`). All cached.
- **`items.query.ts`** — list + detail `queryOptions` (detail `enabled: Boolean(id)`) and the `useItemsListQuery`/`useItemDetailQuery` hooks, all in one file.
- **route handlers** — list: `ilike(items.title, %search%)` + `groupBy(items.id)` + `limit/offset`, total via a parallel `count()`. detail: single row + `favoritesCount`, 404.
- **`items-list.module.tsx`** — reads `search`/`page` from `useSearchParams`, renders `<ItemsSearchComponent>` + a grid of `<ItemCardComponent>` (footer = favorites label) + `<ItemsPaginationComponent>`.
- **`item-detail.module.tsx`** — `useItemDetailQuery(id)`, renders `<FavoriteButtonComponent>` and the favoritesCount label.

## Self-verification

After any change, confirm against `spec/`:
1. `spec/invariants.spec.md` — always-true rules (read-only, envelope shape, URL state, key naming, caching, page size).
2. The matching block in `spec/per-action.spec.md` — `+list`, `+detail`, `+search`, `+pagination`, or `+route`.

## Common mistakes

| Mistake | Reality |
|---|---|
| Adding a `items.mutation.ts` | The catalog is read-only — items are seeded, not created in-app. |
| Reading the list response as `IItem[]` | It's `IPaginatedResponse<IItem>`; use `result.data`. |
| Keeping search/page in `useState` | URL searchParams are the source of truth (shareable + SSR-prefetchable). |
| Not clearing `page` when search changes | Always `params.delete('page')` on a new search, or you land on an out-of-range page. |
| Hardcoding `9` (or any limit) | Use `ITEMS_PER_PAGE` from `shared/constants`. |
| `useRouter` from `next/navigation` for nav | Use `@/pkg/locale`; `useSearchParams` from `next/navigation` is fine (not navigation). |
| Hardcoding `'query-items'` | Use `EItemKey.QUERY`. |
| Invalidating items after a favorite toggle here | That cross-invalidation lives in the favorites mutations, not the items layer. |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Working on **search** (the search feature, URL params, the `ilike` filter) | `references/search.md` |
| Working on **pagination** (offset/limit math, the envelope, the page controls) | `references/pagination.md` |
| Need a copy-ready **shape** for an items file | `examples/` |
| **Verifying** a change | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/search.md`** — URL-driven search end to end.
- **`references/pagination.md`** — offset/limit + the paginated envelope + the controls.
- **`examples/`** — concrete shapes of the models, data layer, routes, modules, features, and pages.
- **`spec/`** — `invariants.spec.md` + `per-action.spec.md`.
