# URL-driven search

Search is a single text field whose value lives in the `?search=` URL param, not in component state. The flow is: the search feature writes the param → the page/module reads it → the query passes it to the API → the route applies a SQL `ilike`.

## The round trip

```
features/items-search (client)              (api)/api/items/route.ts (server)
  onSubmit(data):                             const search = sp.get('search')?.trim()
    params = new URLSearchParams(current)     const where = search ? ilike(items.title, `%${search}%`) : undefined
    search ? params.set('search', s)          ...select().where(where)
           : params.delete('search')
    params.delete('page')   ← reset paging
    router.push(`${pathname}?${params}`)
                  │
                  ▼
modules/items-list reads useSearchParams() → { search, page } → useItemsListQuery({ search, page })
  → entities/api/items fetchItems(filters) builds ?search=&page= → GET /api/items
```

## The search feature

`features/items-search/items-search.component.tsx` is `'use client'`. It uses React Hook Form for the single `search` field (default seeded from `searchParams.get('search')`), and on submit:

- clones the current params (`new URLSearchParams(searchParams.toString())`),
- `set`s `search` to the trimmed value, or `delete`s it when empty,
- **`delete`s `page`** — a new search must start at page 1, otherwise you can land on a now-empty page,
- `router.push(\`${pathname}?${params}\`)` using `useRouter`/`usePathname` from `@/pkg/locale`.

`onClear` resets the field and removes `search` the same way. `useSearchParams` comes from `next/navigation` (reading params isn't locale-aware navigation); the push uses the locale-aware router.

## The server filter

The list route reads `search` from `request.nextUrl.searchParams`, trims it, and builds `where = search ? ilike(items.title, \`%${search}%\`) : undefined`. `ilike` is Postgres case-insensitive LIKE; matching is on `title` only. The same `where` is reused for the `count()` total so pagination reflects the filtered set.

## Why URL, not state

- **Shareable / bookmarkable** — a filtered view is a URL.
- **SSR-prefetchable** — the page reads `searchParams` and prefetches the exact query the client will use, so the first paint is filtered with no client refetch.
- **Back/forward works** — navigation history is the search history.
- **Single source of truth** — the module derives everything from the URL; there's no state to keep in sync with the address bar.
