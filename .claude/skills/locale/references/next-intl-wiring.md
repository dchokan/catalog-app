# How the next-intl wiring fits together

The i18n setup is four small files in `pkg/locale/` plus one plugin line in `next.config.ts`. Each file has one job; together they turn a `[locale]` URL segment into a resolved locale + a loaded message catalog, and give the app locale-aware navigation.

## The data flow

```
next.config.ts                request comes in for /[locale]/...
  └─ createNextIntlPlugin('./src/pkg/locale/request.ts')
                                        │
        Next.js calls the plugin's request config per request
                                        ▼
request.ts  getRequestConfig({ requestLocale })
  • requested = await requestLocale
  • locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  • messages = (await import(`../../../translations/${locale}.json`)).default
  → returns { locale, messages }
                                        ▼
[locale]/layout.tsx (RSC)
  • hasLocale guard → notFound() for unknown locales
  • setRequestLocale(locale)        ← makes locale available to the static render
  • <NextIntlClientProvider>        ← hands messages/locale to client components
```

`routing.ts` is the shared source of truth (`locales`, `defaultLocale`, prefix policy) imported by both `request.ts` and `navigation.ts`. `navigation.ts` calls `createNavigation(routing)` once and exports the locale-aware `Link` / `useRouter` / `redirect` / `usePathname` / `getPathname`. `index.ts` is the public barrel.

## Why each piece exists

- **`routing.ts` separate from everything** — it has no dependencies, so both the request side (server) and the navigation side (client) can import it without pulling in the other. It's the one place locales are enumerated.
- **`request.ts` is what the plugin points at** — the plugin needs a single entry that returns `{ locale, messages }` per request. Resolving through `hasLocale` means an unrecognized locale degrades to the default instead of crashing the config (the *layout* is what turns an unknown segment into a 404).
- **`navigation.ts` wrappers** — `createNavigation` produces `Link`/`useRouter`/etc. that know the locale prefix policy. Using them instead of `next/link` keeps generated hrefs consistent with `localePrefix` (e.g. they won't prepend `/en` when the policy is `as-needed`).
- **`index.ts` barrel** — consumers import from `@/pkg/locale`, never reach into the individual files; keeps the pkg liftable.

## Why there is no middleware

next-intl typically uses `middleware.ts` to detect the request locale and rewrite/redirect to a prefixed path. This app opts out of all three things that need it:

- `locales: ['en']` — a single locale, so there's nothing to negotiate.
- `localePrefix: 'as-needed'` — the default locale isn't prefixed, so no rewrite is required to strip/add `/en`.
- `localeDetection: false` — no `Accept-Language` sniffing, so no per-request decision to make.

The `[locale]` segment is still real (it's how the layout receives `locale` and how `generateStaticParams` pre-renders), but resolution is static/config-driven. The moment a second locale with detection or forced prefixing is introduced, that's when a `next-intl/middleware` `middleware.ts` becomes necessary.

## setRequestLocale and static rendering

`setRequestLocale(locale)` stores the active locale in next-intl's per-request context so server components can render their messages without the request being marked dynamic. Next.js renders `[locale]` pages statically only if every page/layout in the branch declares its locale this way — that's why both the layout and each page call it, immediately after awaiting `params`. Skipping it on a page typically surfaces as that route silently opting into dynamic rendering, or an error that the locale wasn't set.
