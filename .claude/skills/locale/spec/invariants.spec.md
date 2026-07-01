# Locale invariants

Global rules that always hold for the i18n layer.

## pkg self-containment

- **MUST** keep all routing/navigation/request config inside `src/pkg/locale/`; the pkg imports only `next-intl/*`.
  - Check: `grep -rn "@/app" src/pkg/locale` → empty.
- **MUST** point the next-intl plugin at `./src/pkg/locale/request.ts`.
  - Check: `grep -n "createNextIntlPlugin" next.config.ts`.

## Navigation source

- **MUST** import `Link` / `useRouter` / `redirect` / `usePathname` from `@/pkg/locale` in app code.
  - Check: `grep -rn "from 'next/link'" src/app` → empty; `grep -rn "useRouter\|redirect.*from 'next/navigation'" src/app` → only non-navigation uses (`notFound`, `useSearchParams`, `useParams`) remain.

## Static rendering

- **MUST** call `setRequestLocale(locale)` (after awaiting `params`) in every page and layout under `[locale]`.
  - Check: `grep -rL "setRequestLocale" $(grep -rl "params: Promise<{ locale" "src/app/(web)/[locale]")` → empty (every locale page/layout that takes params sets it).
- **MUST** guard unknown locales and emit static params in `[locale]/layout.tsx`.
  - Check: `grep -n "hasLocale\|generateStaticParams\|notFound" "src/app/(web)/[locale]/layout.tsx"`.

## Single locale source

- **MUST** enumerate locales only in `routing.locales`; **MUST** have a matching `translations/<locale>.json` for each.
  - Check: locales in `src/pkg/locale/routing.ts` each have a file under `translations/`.
- **MUST NOT** add a `middleware.ts` unless multi-locale detection/prefixing is introduced.
  - Check: `find src -name middleware.ts` → empty while `localePrefix: 'as-needed'` + single locale + `localeDetection: false`.
