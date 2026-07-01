# Pagination

Pagination is server-side offset/limit, driven by the `?page=` URL param, with `ITEMS_PER_PAGE` (=9) as the fixed page size. The list endpoint returns a paginated envelope so the client knows the total page count without a second request.

## The math (server, list route)

```
const page   = Math.max(1, Number(sp.get('page')) || 1)
const limit  = ITEMS_PER_PAGE
const offset = (page - 1) * limit

const [rows, [{ value: total }]] = await Promise.all([
  db.select({ ...cols, favoritesCount: count(favorites.id) })
    .from(items).leftJoin(favorites, ...).where(where)
    .groupBy(items.id).orderBy(desc(items.createdAt))
    .limit(limit).offset(offset),
  db.select({ value: count() }).from(items).where(where),  // total for the SAME filter
])

return NextResponse.json({ data: rows, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) })
```

- `page` is clamped to ≥1.
- The rows query and the `total` count run together in one `Promise.all`; both apply the same `where` so the count matches the filter.
- `totalPages = ceil(total / limit)`, floored at 1.

## The envelope

`IPaginatedResponse<T> { data: T[]; total: number; page: number; limit: number; totalPages: number }` (in `api-response.model.ts`). `fetchItems` returns `IPaginatedResponse<IItem>`. The list module reads `data?.data ?? []` for rows and passes `data?.page` / `data?.totalPages` to the controls.

## The controls feature

`features/items-pagination/items-pagination.component.tsx` is `'use client'` with props `{ page, totalPages }`. It:

- returns `null` when `totalPages <= 1` (nothing to paginate),
- `goTo(n)` clones the current params, **`delete`s `page` when `n <= 1`** (page 1 is the clean URL) else `set`s it, then `router.push` via `@/pkg/locale`,
- disables Previous at page 1 and Next at the last page.

Because `page` is a URL param, the page.tsx prefetches the right page server-side and the controls just navigate.

## Why offset/limit (not cursor)

The catalog is small, seeded, and sorted by `createdAt desc`; offset/limit is simple and supports jump-to-page semantics and a total page count, which the UI shows ("Page X of Y"). Cursor pagination would trade that away for scale the catalog doesn't need.
