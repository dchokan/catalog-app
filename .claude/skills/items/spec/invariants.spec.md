# Items invariants

Global rules that always hold for the catalog.

## Read-only data layer

- **MUST NOT** add a `items.mutation.ts` or any write fetcher — the catalog is seeded, not created in-app.
  - Check: `find src/app/entities/api/items -name "*.mutation.ts"` → empty.

## Response envelope

- **MUST** return `IPaginatedResponse<IItem>` (`data, total, page, limit, totalPages`) from the list route, and read rows via `.data` on the client.
  - Check: `grep -n "totalPages" "src/app/(api)/api/items/route.ts"` ; `grep -n "data?.data" src/app/modules/items-list/items-list.module.tsx`.

## URL-driven state

- **MUST** keep `search` and `page` in the URL; **MUST NOT** hold them in component state.
  - Check: `grep -rn "useState" src/app/features/items-search src/app/features/items-pagination` → none holding search/page.
- **MUST** delete `page` whenever `search` changes.
  - Check: `grep -n "delete('page')" src/app/features/items-search/items-search.component.tsx`.
- **MUST** navigate with `@/pkg/locale` `useRouter`/`usePathname`; reading via `useSearchParams` from `next/navigation` is allowed.
  - Check: `grep -rn "from 'next/navigation'" src/app/features/items-*` → only `useSearchParams`.

## Query keys

- **MUST** key list as `[EItemKey.QUERY, 'list', filters]` and detail as `[EItemKey.QUERY, id]`; **MUST NOT** hardcode `'query-items'`.
  - Check: `grep -n "EItemKey.QUERY" src/app/entities/api/items/items.query.ts`.

## Caching & page size

- **MUST** fetch items with `cache: 'force-cache'` + `next: { revalidate: 60 }`.
  - Check: `grep -n "force-cache" src/app/entities/api/items/items.api.ts`.
- **MUST** use `ITEMS_PER_PAGE` for the page size everywhere.
  - Check: `grep -rn "ITEMS_PER_PAGE" "src/app/(api)/api/items/route.ts" src/app/shared/constants`.
- **MUST** pre-render detail pages via `generateStaticParams` over `/api/items/ids`.
  - Check: `grep -n "generateStaticParams\|fetchItemIds" "src/app/(web)/[locale]/(public)/items/[id]/page.tsx"`.
