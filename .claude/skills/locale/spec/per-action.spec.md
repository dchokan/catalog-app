# Locale checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +page — adding a page/layout under [locale]

- **MUST**, for a statically-rendered page, type `params: Promise<{ locale: string }>`, `await` it, and call `setRequestLocale(locale)` before rendering any module (the login/register/favorites pages do this).
- **MAY** omit `locale`/`setRequestLocale` for a page that doesn't render locale-dependent content and isn't opting into the static-render path — e.g. the items list page (dynamic via `searchParams`) and the items detail page (pre-rendered per `id`) both skip it. Match the sibling pages in the same route group.
- **MUST** use `@/pkg/locale` `Link` / `useRouter` for any in-app navigation it performs.

## +navigation — performing locale-aware navigation

- **MUST** import the navigation primitive from `@/pkg/locale`, not `next/link` / `next/navigation`.
- **MUST** pass plain app paths (e.g. `/items`, `/login`) — the wrapper applies the locale prefix per `localePrefix`.
- **MAY** still use `notFound`, `useSearchParams`, `useParams` from `next/navigation` (not locale-aware navigation).

## +locale — adding a new locale

- **MUST** add the code to `routing.locales` in `src/pkg/locale/routing.ts`.
- **MUST** add `translations/<locale>.json` (matching key shape of the existing catalog).
- **MUST** reconsider middleware: more than one locale with detection or forced prefixing requires a `next-intl/middleware` `middleware.ts`; a second locale under `as-needed` without detection still does not.
- **MUST NOT** enumerate the locale anywhere except `routing.locales` (e.g. no hardcoded lists in components).
