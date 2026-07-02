# Items checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +list — list page/module

- **MUST** prefetch `itemsListQueryOptions(filters)` in the page (RSC) and wrap the module in `<HydrationBoundary>`.
- **MUST** read `search`/`page` from `useSearchParams` in the module and pass `{ search, page }` to `useItemsListQuery`.
- **MUST** render `<ItemsSearchComponent>` + grid + `<ItemsPaginationComponent page={data.page} totalPages={data.totalPages} />`.

## +detail — detail page/module

- **MUST** export `generateMetadata` (from `fetchItemById`, with a fallback title).
- **MUST** prefetch `itemDetailQueryOptions(id)`, then `notFound()` if the cache has no data.
- **MUST** render `<FavoriteButtonComponent itemId={item.id} />` and the favoritesCount label.

## +search — the search feature

- **MUST** seed the field default from `searchParams.get('search')`.
- **MUST** on submit: set/delete `search`, **delete `page`**, then `router.push(\`${pathname}?${params}\`)`.
- **MUST** apply the filter server-side as `ilike(items.title, \`%search%\`)`, reused for the total `count()`.

## +pagination — the pagination feature

- **MUST** accept `{ page, totalPages }` and return `null` when `totalPages <= 1`.
- **MUST** `delete('page')` for page 1 and `set('page', n)` otherwise; navigate via `@/pkg/locale`.
- **MUST** disable Previous at page 1 and Next at the last page.

## +route — a list/detail route handler

- **MUST** compute `favoritesCount` via `count(favorites.id)` over a `leftJoin` + `groupBy(items.id)`.
- **MUST** (list) clamp `page` to ≥1, derive `offset = (page-1)*ITEMS_PER_PAGE`, run rows + `count()` total in `Promise.all` with the same `where`, and return the envelope.
- **MUST** (detail) return `404` when the item is missing; (any) return `500 { error }` on failure.
