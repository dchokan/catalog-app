---
name: pagination
description: Add server-side pagination to the items list. Use when implementing the pagination controls component, URL-based page state, offset/limit logic in the API and service, and the PaginatedResponse type. Covers the full cycle from DB query to UI controls.
---

# Pagination

Pagination state lives in the URL (`?page=2`). The API returns a `PaginatedResponse` with `total`, `page`, `limit`, and `totalPages`. The UI shows Previous/Next buttons and current page indicator.

## File Layout

```
src/app/features/items-pagination/
└── items-pagination.component.tsx   # Prev/Next controls

src/app/shared/interfaces/
└── api-response.interface.ts        # PaginatedResponse<T> generic type
```

## `src/app/shared/interfaces/api-response.interface.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

This is the standard shape returned by all paginated API routes.

## Service — Offset Calculation

In `getAllItems({ page, search, limit })`:

```typescript
const offset = (page - 1) * limit
const totalPages = Math.ceil(total / limit)

return {
  data: items,
  total,
  page,
  limit,
  totalPages,
}
```

- `page` is 1-indexed (page 1 = offset 0)
- `total` is the count of filtered rows (without limit)
- Always compute `totalPages` server-side — client uses it to know when to disable Next button

## API Route

The API receives `page` as a query param (string), parses to number, defaults to 1:
```
const page = Math.max(1, Number(searchParams.get("page") ?? 1))
```

Enforce minimum of 1 with `Math.max` to handle `?page=0` or `?page=-1`.

Default `limit` is a fixed constant (e.g., `ITEMS_PER_PAGE = 12` from `shared/constants`) — not user-configurable. Define it as a named constant so it's changed in one place.

## `items-pagination.component.tsx`

Client Component (`"use client"`):

**Props:** `page: number`, `totalPages: number` — received from the parent module, NOT read from URL internally.

**Behavior:**
1. `useSearchParams()` — read current URL params (to preserve `search` when navigating)
2. `useRouter()` — push updated page to URL

**UI:**
- "← Previous" button: disabled when `page === 1`
- Current page indicator: "Page X of Y"
- "Next →" button: disabled when `page === totalPages`

**Navigation:**
```typescript
const goToPage = (newPage: number) => {
  const params = new URLSearchParams(searchParams.toString())
  params.set("page", String(newPage))
  router.push(`?${params.toString()}`)
}
```

Preserves the `search` param when changing page.

## Module Integration

In `items-list.module.tsx`:
- `const { data } = useItems({ search, page })`
- Pass data values down: `<ItemsPagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} />`
- The module owns the data; pagination component only handles navigation UI

## Page Component — Passing Page to Prefetch

In `items/page.tsx` (Server Component):
```typescript
const { page = "1", search = "" } = await searchParams
const filters = { page: Number(page), search }
```

The same `filters` object is used for both `prefetchQuery` and rendered to the client module.

## Items Entity — Fetch Function

`fetchItems` already includes `page` in the URL params:
```typescript
import { clientEnv } from "@/config/env"

const url = new URL("/api/items", clientEnv.NEXT_PUBLIC_APP_URL)
url.searchParams.set("page", String(filters.page ?? 1))
url.searchParams.set("search", filters.search ?? "")
```

## Hard Rules

- `page` is always passed as a URL param, never as React state — enables SSR and bookmarkable URLs
- `totalPages` comes from the API response, not calculated client-side — only the server knows the total count
- Default page is `1`, not `0` — all pagination is 1-indexed
- Previous button must be disabled at page 1; Next button disabled at `totalPages`
- Changing page preserves the `search` param in the URL
- `limit` is a fixed constant, not a user setting — define it once as `ITEMS_PER_PAGE` and import it everywhere

## Verification

- `/items` shows `ITEMS_PER_PAGE` items (or fewer if total < limit)
- `/items?page=2` shows the next page of items
- "← Previous" is disabled on page 1
- "Next →" is disabled on the last page
- Clicking Next updates the URL to `?page=2` (or `?page=2&search=<query>` if searching)
- Total page count is correct (total items ÷ `ITEMS_PER_PAGE`, rounded up)
- Refreshing with `?page=2` renders page 2 via SSR
