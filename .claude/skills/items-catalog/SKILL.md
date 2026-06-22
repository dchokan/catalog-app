---
name: items-catalog
description: Build the items (books) catalog feature. Use when implementing the items list page, item detail page, API routes for items, server-side service, item card widget, and the entity model. Covers everything from the items DB table to the rendered list.
---

# Items Catalog

The core catalog feature: a paginated, searchable list of items (books) with individual detail pages. Data flows from PostgreSQL (via Drizzle) → server-side service → API route → client React Query hook → page component.

## File Layout

```
src/app/
├── (api)/api/items/
│   ├── route.ts              # GET /api/items?page=1&search=query
│   └── [id]/
│       └── route.ts          # GET /api/items/:id
│
├── (web)/items/
│   ├── page.tsx              # SSR prefetch + renders ItemsListModule
│   └── [id]/
│       └── page.tsx          # SSR prefetch + renders ItemDetailModule
│
├── entities/
│   ├── models/
│   │   └── item.model.ts     # Item + ItemsFilters interfaces
│   └── api/items/
│       ├── items.api.ts      # Fetch functions (client-side)
│       ├── items.query.ts    # queryOptions factories
│       └── items.hook.ts     # useItemsListQuery, useItemDetailQuery hooks
│
├── modules/
│   ├── items-list/
│   │   ├── items-list.module.tsx   # Grid of ItemCard + Search + Pagination
│   │   └── items-list.service.ts  # Server: DB query with favorites count
│   └── item-detail/
│       ├── item-detail.module.tsx  # Single item layout
│       └── item-detail.service.ts  # Server: fetch one item
│
└── widgets/
    └── item-card/
        └── item-card.component.tsx  # Card: image + title + description + favorites count
```

## `src/app/entities/models/item.model.ts`

Define the `Item` interface and `ItemsFilters` interface:

```typescript
export interface Item {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date | string
  favoritesCount: number
}

export interface ItemsFilters {
  page?: number
  search?: string
}
```

Export both from `src/app/entities/models/index.ts`.

Query keys use `EEntityKey` enum from `src/app/shared/interfaces/entities.interface.ts`:
```typescript
export enum EEntityKey {
  QUERY_ITEMS = 'query-items',
  QUERY_FAVORITES = 'query-favorites',
}
```

## `src/app/entities/api/items/items.api.ts`

Two async fetch functions (use `fetch` with full URL from client env):

**`fetchItems(filters: ItemsFilters)`**
- `GET /api/items?page=<n>&search=<q>`
- Returns `PaginatedResponse<Item>`

**`fetchItemById(id: string)`**
- `GET /api/items/<id>`
- Returns `Item`

## `src/app/entities/api/items/items.query.ts`

Exports `queryOptions` factories (not hooks — hooks live in `items.hook.ts`):

```typescript
import { queryOptions } from '@tanstack/react-query'
import { EEntityKey } from '@/app/shared/interfaces'

export const itemsListQueryOptions = (filters: ItemsFilters = {}) =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_ITEMS, 'list', filters],
    queryFn: () => fetchItems(filters),
  })

export const itemDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_ITEMS, id],
    queryFn: () => fetchItemById(id),
    enabled: Boolean(id),
  })
```

## `src/app/entities/api/items/items.hook.ts`

Client-only (`"use client"`) hooks that wrap the queryOptions:

```typescript
export const useItemsListQuery = (filters: ItemsFilters = {}) =>
  useQuery(itemsListQueryOptions(filters))

export const useItemDetailQuery = (id: string) =>
  useQuery(itemDetailQueryOptions(id))
```

All three files (`items.api.ts`, `items.query.ts`, `items.hook.ts`) are re-exported from `src/app/entities/api/items/index.ts`.

## `src/app/modules/items-list/items-list.service.ts`

Server-side function `getAllItems({ page, search, limit })`:
- Query `items` table with Drizzle
- `WHERE title ILIKE %search%` when search is provided (use `ilike` from `drizzle-orm`)
- Count total matching rows with a separate `COUNT(*)` query
- Offset: `(page - 1) * limit`
- For `favoritesCount`: join favorites with `count(favorites.id)`, group by `items.id`, LEFT JOIN so items with 0 favorites appear
- Returns `{ items, total, page, limit, totalPages }`

## `src/app/(api)/api/items/route.ts`

```
GET handler:
1. Parse searchParams: page (default 1), search (default ""), limit (default 12)
2. Call getAllItems({ page, search, limit })
3. Return NextResponse.json(result)
```

## `src/app/(api)/api/items/[id]/route.ts`

```
GET handler:
1. Extract id from params
2. Query DB: SELECT from items WHERE id = id
3. If not found: return NextResponse.json({ error: "Not found" }, { status: 404 })
4. Return NextResponse.json(item)
```

## `src/app/(web)/items/page.tsx`

Server Component:
1. Get `searchParams` (page, search)
2. Call `getQueryClient()`
3. `prefetchQuery` with `itemKeys.list(filters)` using `getAllItems(filters)`
4. Return `<HydrationBoundary state={dehydrate(queryClient)}><ItemsListModule /></HydrationBoundary>`

## `src/app/modules/items-list/items-list.module.tsx`

Client Component (`"use client"`):
1. Read URL search params with `useSearchParams()`
2. Parse `page` and `search` from URL
3. Call `useItemsListQuery({ page, search })`
4. Render `<ItemsSearch />` at top
5. Render grid of `<ItemCard />` for each item
6. Render `<ItemsPagination />` at bottom
7. Handle loading and empty states

## `src/app/widgets/item-card/item-card.component.tsx`

- Wrapped in `<Link href={/items/${item.id}}>` from `next/link`
- `<Image>` from `next/image` for `item.imageUrl` (set explicit width/height)
- Title, description (truncated with `line-clamp-2`)
- Favorites count display (e.g., "♥ 3")
- Uses `<Card />` shared component as wrapper

## `src/app/(web)/items/[id]/page.tsx`

Server Component:
- Prefetch single item with `itemKeys.detail(id)`
- Return `<HydrationBoundary><ItemDetailModule id={id} /></HydrationBoundary>`

## `src/app/modules/item-detail/item-detail.module.tsx`

Client Component:
- `useItemDetailQuery(id)` for data
- Show full image, title, full description
- `<FavoriteButton itemId={id} />` widget

## Hard Rules

- `getAllItems` is server-only — never import it in client components
- `fetchItems` and `fetchItemById` are client-only fetch functions — they use `NEXT_PUBLIC_APP_URL`
- `ItemsFilters` lives in `src/app/entities/models/item.model.ts`, not in a separate `items.interface.ts`
- Query keys use `EEntityKey` enum (`QUERY_ITEMS`) — no separate `items.keys.ts` file
- `items.query.ts` exports `queryOptions` factories; `items.hook.ts` exports the `useQuery` hooks
- favoritesCount is computed at DB query time (SQL aggregation) not in JavaScript
- `ilike` is case-insensitive LIKE — use it for search (not `like`)
- Items page reads `searchParams` from the URL, not React state — this enables SSR and bookmarkable URLs
- Item images require `remotePatterns` in `next.config.ts` to load from external URLs

## Verification

- `GET /api/items` returns `{ data: [...], total, page, limit, totalPages }`
- `GET /api/items?search=harry` filters results
- `GET /api/items?page=2` returns next page
- `GET /api/items/:id` returns single item
- `/items` page renders a grid of books
- Each book card links to `/items/:id`
- Item detail page shows full content
