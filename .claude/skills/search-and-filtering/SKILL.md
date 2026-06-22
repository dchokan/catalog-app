---
name: search-and-filtering
description: Add search/filtering to the items list. Use when implementing the search input component, URL-based search param state, ILIKE filtering in the API route and server service, and wiring the search component to update URL params without page reload.
---

# Search and Filtering

Search state lives in the URL (`?search=query`). The search input updates URL params; the page reads them for SSR prefetch; the client module reads them for React Query. Filtering happens in the DB query via SQL `ILIKE`.

## File Layout

```
src/app/features/items-search/
└── items-search.component.tsx   # Search input with clear button
```

`ItemsFilters` lives in `src/app/entities/models/item.model.ts` (exported via `src/app/entities/models/index.ts`), not in a separate interface file. The API route and service filtering logic lives in the existing items files (see `items-catalog` skill).

## `items-search.component.tsx`

Client Component (`"use client"`):

**Props:** none (reads/writes URL directly)

**Behavior:**
1. `useSearchParams()` — read current `search` value from URL
2. `useRouter()` — for pushing updated URL
3. Controlled `<input>` with value from URL params
4. On change: call `router.push` with updated `?search=<value>&page=1` (reset page to 1 on new search)
5. Clear button (×): visible when search is non-empty, sets `search=""` and `page=1`

**URL update approach:**
```typescript
const params = new URLSearchParams(searchParams.toString())
params.set("search", value)
params.set("page", "1")
router.push(`?${params.toString()}`)
```

This preserves other params (like `limit`) while updating `search` and resetting `page`.

**Important:** Do NOT use `router.replace` — use `router.push` to maintain browser history so Back button works.

## API Route — Reading Search Params

In `GET /api/items/route.ts`:
```typescript
const { searchParams } = new URL(request.url)
const page = Number(searchParams.get("page") ?? 1)
const search = searchParams.get("search") ?? ""
const limit = 12
```

Pass all three to the service function.

## Service — Filtering with ILIKE

In `getAllItems({ page, search, limit })`:

When `search` is non-empty, add a WHERE condition:
```typescript
import { ilike } from "drizzle-orm"

// In WHERE clause:
...(search ? [ilike(items.title, `%${search}%`)] : [])
```

Apply the same filter to both the data query and the count query so `total` reflects filtered results.

`ilike` is case-insensitive. Use it over `like` for user-facing search.

## Module — Reading Search from URL

In `ItemsListModule` (client component):

```typescript
const searchParams = useSearchParams()
const search = searchParams.get("search") ?? ""
const page = Number(searchParams.get("page") ?? 1)
```

Pass `{ search, page }` to `useItems({ search, page })`.

React Query will refetch automatically when the key changes (because `search` is part of the query key via `itemKeys.list({ search, page })`).

## SSR Page — Passing Search to Prefetch

In `items/page.tsx` (Server Component):

```typescript
export default async function ItemsPage({ searchParams }) {
  const { search = "", page = "1" } = await searchParams
  const filters = { search, page: Number(page) }
  // prefetch with the same filters...
}
```

In Next.js 15, `searchParams` is a Promise — always `await` it.

## `useSearchParams()` and Suspense

In Next.js App Router, any Client Component that calls `useSearchParams()` must be rendered inside a `<Suspense>` boundary at the Server Component level — otherwise Next.js throws a build error for statically generated routes.

**In this project:** `ItemsListModule` (which calls `useSearchParams()`) is rendered inside `<HydrationBoundary>` on a **dynamic** server page (because the page `await`s `searchParams`). This makes the route fully dynamic, so Next.js does not require a separate `<Suspense>` wrapper here.

**If you get this build error:**
```
Missing Suspense boundary with useSearchParams
```

Wrap the component that uses `useSearchParams()` in `<Suspense fallback={null}>` inside the server page:
```typescript
<HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense fallback={null}>
    <ItemsListModule />
  </Suspense>
</HydrationBoundary>
```

## Hard Rules

- Reset `page` to 1 whenever `search` changes — otherwise the user may land on a non-existent page
- The search input's value is always the URL param, not local state — makes it SSR-shareable and bookmarkable
- ILIKE filtering applies to `title` only — description search not needed and would be slower
- The count query must use the same WHERE filter as the data query — otherwise totalPages is wrong
- Avoid debouncing: this project does not debounce search — every keystroke pushes a URL update

## Verification

- Typing in the search box updates the URL to `?search=<value>&page=1`
- The items list filters to show matching titles (case-insensitive)
- Clearing the search shows all items again
- The × button appears only when there is search text
- Refreshing the page with `?search=harry` shows filtered results (SSR works)
- Total pages shown in pagination reflects the filtered count
