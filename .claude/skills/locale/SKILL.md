---
name: locale
description: Work with the next-intl i18n layer in this app — the pkg/locale integration (routing, navigation wrappers, request config), the [locale] route segment, locale-aware navigation (Link/useRouter/redirect), setRequestLocale in pages/layouts, and the translations/ message catalogs. Use when adding a locale, wiring localized navigation, fixing static-rendering issues tied to locale, editing the next-intl plugin, or auditing why next/link must not be used directly. Skip for non-routing UI work and for server data fetching unrelated to i18n.
---

# locale

Internationalization is built on **next-intl**, isolated in the self-contained `src/pkg/locale/` integration and exposed to the app through the `[locale]` route segment. The app currently ships a single locale (`en`) with `localePrefix: 'as-needed'` and detection off, so there is **no middleware** — routing is entirely config-driven. All in-app navigation goes through the locale-aware wrappers from `@/pkg/locale`, and every page/layout under `[locale]` calls `setRequestLocale` so the tree can render statically.

This skill documents the real i18n wiring in this repo — paths and symbols below are concrete.

## Layout

```
next.config.ts                        # createNextIntlPlugin('./src/pkg/locale/request.ts')
translations/
└── en.json                           # message catalog per locale (currently {})
src/pkg/locale/                        # self-contained next-intl integration (liftable, imports no app/*)
├── routing.ts                         # defineRouting({ locales, localePrefix, localeDetection, defaultLocale })
├── navigation.ts                      # createNavigation(routing) → Link, redirect, usePathname, useRouter, getPathname
├── request.ts                         # getRequestConfig: resolve locale + load translations/<locale>.json
└── index.ts                           # barrel
src/app/(web)/[locale]/
├── layout.tsx                         # async RSC: hasLocale guard → notFound, setRequestLocale, generateStaticParams, NextIntlClientProvider
├── (public)/ (auth)/ (protected)/     # route groups nested UNDER [locale]
└── …/page.tsx                         # each: await params → setRequestLocale(locale) before render
```

## Hard rules

1. **All routing config lives in `pkg/locale/` and the pkg stays self-contained.** It imports only `next-intl/*` — never from `app/*`. The next-intl plugin in `next.config.ts` points at `./src/pkg/locale/request.ts`.
2. **App code imports navigation from `@/pkg/locale`, never `next/link` or `next/navigation`.** Use its `Link`, `useRouter`, `redirect`, `usePathname` so URLs stay locale-correct. (`next/navigation`'s `notFound`/`useSearchParams` are fine — they aren't locale-aware navigation.)
3. **Every `[locale]` page and layout is `async`, awaits `params` for `locale`, and calls `setRequestLocale(locale)` before rendering.** This opts the route into static rendering; omitting it forces dynamic rendering or throws.
4. **The layout owns the locale guard.** `[locale]/layout.tsx` validates `hasLocale(routing.locales, locale)` → `notFound()`, exports `generateStaticParams` from `routing.locales`, sets `<html lang={locale}>`, and wraps children in `NextIntlClientProvider`.
5. **Locales are the single `routing.locales` array; messages are `translations/<locale>.json`.** Add a locale by extending that array AND adding the matching catalog — nothing else enumerates locales.
6. **No middleware.** With one locale, `localePrefix: 'as-needed'`, and `localeDetection: false`, routing needs no `middleware.ts`. Introduce one only if multi-locale detection/prefixing is added later.

## Key files

- **`routing.ts`** — `defineRouting({ locales: ['en'], localePrefix: 'as-needed', localeDetection: false, defaultLocale: 'en' })`. The single source of truth for which locales exist.
- **`navigation.ts`** — `export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)`. These are the locale-aware replacements for `next/link` / `next/navigation`.
- **`request.ts`** — `getRequestConfig` resolves the requested locale (falls back to `defaultLocale` via `hasLocale`) and lazy-imports `translations/<locale>.json` as `messages`. This is the file the next-intl plugin is pointed at.
- **`index.ts`** — re-exports navigation, `getRequestConfig` (as default), and `routing`.
- **`[locale]/layout.tsx`** — the locale entry: guard, `setRequestLocale`, `generateStaticParams`, providers, `<html lang>`, font variable.

## Self-verification

After any change, confirm against `spec/`:
1. `spec/invariants.spec.md` — always-true rules (pkg self-containment, navigation source, `setRequestLocale` coverage, single locale source).
2. The matching block in `spec/per-action.spec.md` — `+page`, `+locale`, or `+navigation`.

## Common mistakes

| Mistake | Reality |
|---|---|
| `import Link from 'next/link'` / `useRouter from 'next/navigation'` | Import them from `@/pkg/locale` — they are locale-aware. |
| Forgetting `setRequestLocale(locale)` in a `[locale]` page | The route falls back to dynamic rendering or errors. Call it first, after awaiting `params`. |
| Adding a locale by only extending `routing.locales` | Also add `translations/<locale>.json`, or `request.ts` import fails. |
| Expecting a `middleware.ts` to exist | There is none — single locale + `as-needed` + detection off is config-only. |
| Putting routing/navigation config outside `pkg/locale` | All of it lives in the pkg; the pkg is liftable and imports no `app/*`. |
| Importing app code into `pkg/locale` | Breaks self-containment — the pkg may import only `next-intl/*`. |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Understanding **how the next-intl pieces fit** (plugin → request config → routing → navigation) and **why** | `references/next-intl-wiring.md` |
| Need a copy-ready **shape** for a `pkg/locale` file, the plugin, the layout, or a localized page | `examples/` |
| **Verifying** a change | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/next-intl-wiring.md`** — the data flow across the four pkg files + plugin, and why there's no middleware.
- **`examples/`** — concrete shapes of the `pkg/locale` files, the `next.config` plugin, and a `[locale]` layout/page.
- **`spec/`** — `invariants.spec.md` + `per-action.spec.md`.
