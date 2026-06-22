---
name: tanstack-query
description: Set up TanStack Query (React Query v5) in a Next.js App Router project. Use when configuring the QueryClient, Providers component, SSR prefetch pattern with HydrationBoundary, and the query/mutation hook structure in the entities layer. Skip when TanStack Query is already configured (src/pkg/query/ and Providers exist).
---

# TanStack Query

React Query v5 (`@tanstack/react-query`) with Next.js App Router SSR support. The query client is a server/browser-aware singleton. Pages prefetch data server-side; the client hydrates seamlessly from that cache.

## Dependencies

```
@tanstack/react-query
@tanstack/react-query-devtools   # optional, dev only
```

## File Layout

```
src/pkg/query/
└── query-client.ts             # QueryClient factory (server vs browser)

src/app/shared/components/providers/
└── providers.component.tsx     # QueryClientProvider wrapper
```

## `src/pkg/query/query-client.ts`

Two exports:

**Server-side: `getQueryClient()`**
- Uses React's `cache()` to create one QueryClient per server request
- Config: `staleTime: 60 * 1000` (1 minute)
- Import `cache` from `react`

**Browser-side: `browserQueryClient`**
- A module-level singleton: `let browserQueryClient: QueryClient | undefined`
- If not created yet, create one with the same config
- Export a function `getBrowserQueryClient()` that returns the singleton

Or use a single exported function that detects `typeof window === "undefined"` to choose between the server and browser path.

**Pattern:**
```typescript
function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })
}

const getServerQueryClient = cache(makeQueryClient)   // server: per-request
let browserClient: QueryClient | undefined
function getBrowserQueryClient() {
  if (!browserClient) browserClient = makeQueryClient()
  return browserClient
}

export function getQueryClient() {
  return typeof window === "undefined" ? getServerQueryClient() : getBrowserQueryClient()
}
```

Export one `getQueryClient()` function that works in both environments.

## `src/app/shared/components/providers/providers.component.tsx`

Client Component (`"use client"`):

- Call `getQueryClient()` to get the browser client
- Wrap `{children}` in `<QueryClientProvider client={queryClient}>`
- Optionally add `<ReactQueryDevtools />` inside (dev mode only)

Import this in `src/app/(web)/layout.tsx` to wrap all web pages.

## SSR Prefetch Pattern in Server Pages

In any Server Component page that fetches data:

```typescript
// 1. Get the per-request server QueryClient
const queryClient = getQueryClient()

// 2. Prefetch the query
await queryClient.prefetchQuery({
  queryKey: itemKeys.list(filters),
  queryFn: () => getAllItems(filters),   // direct DB call, no fetch()
})

// 3. Dehydrate and hand off to client
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ClientComponent />
  </HydrationBoundary>
)
```

Import `dehydrate`, `HydrationBoundary` from `@tanstack/react-query`.

The client component calls `useQuery` with the same key — React Query finds the hydrated data immediately, no loading flash.

## Query Key Pattern

Query keys use a shared `EEntityKey` enum (no separate `keys.ts` files per entity):

```typescript
// src/app/shared/interfaces/entities.interface.ts
export enum EEntityKey {
  QUERY_ITEMS = 'query-items',
  QUERY_FAVORITES = 'query-favorites',
}
```

Keys in practice:
- Items list: `[EEntityKey.QUERY_ITEMS, 'list', filters]`
- Item detail: `[EEntityKey.QUERY_ITEMS, id]`
- Favorites list: `[EEntityKey.QUERY_FAVORITES]`

Invalidating by base key (e.g., `[EEntityKey.QUERY_ITEMS]`) clears all items-related queries.

## `queryOptions` + Hook Split Pattern

Each entity splits into two files:

**`*.query.ts`** — exports `queryOptions` factories (no `"use client"` — can run server-side):
```typescript
import { queryOptions } from '@tanstack/react-query'
import { EEntityKey } from '@/app/shared/interfaces'

export const itemsListQueryOptions = (filters: ItemsFilters = {}) =>
  queryOptions({
    queryKey: [EEntityKey.QUERY_ITEMS, 'list', filters],
    queryFn: () => fetchItems(filters),
  })
```

**`*.hook.ts`** — client-only (`"use client"`) hooks that call `useQuery`:
```typescript
'use client'
export const useItemsListQuery = (filters: ItemsFilters = {}) =>
  useQuery(itemsListQueryOptions(filters))
```

Server pages use the `queryOptions` object directly in `prefetchQuery`. Client components import the hook from `*.hook.ts`.

## `useMutation` Hook Pattern

In entity's `*.mutation.ts` file:
```typescript
export function useAddFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_ITEMS] })
    },
  })
}
```

## Hard Rules

- Never create `new QueryClient()` inside a component — use the singleton/factory pattern
- Server pages use `prefetchQuery` + `dehydrate` + `HydrationBoundary` — never call `useQuery` in a Server Component
- Client-side `useQuery` must use the exact same key structure as `prefetchQuery` — key mismatch causes a double fetch
- `staleTime` should be > 0 — without it, React Query refetches immediately on hydration, defeating SSR
- `Providers` must be in the (web) layout, not the root layout — API routes don't need it

## Verification

- Items page loads without a loading state flash (data is hydrated from SSR)
- React Query Devtools show the hydrated queries in the browser
- Mutating (e.g., adding a favorite) invalidates and re-fetches the relevant queries
- No "QueryClient not found" errors in console
