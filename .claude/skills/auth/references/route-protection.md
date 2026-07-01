# How routes are protected

Protection in this app is enforced at **two real points**, plus one structural-only grouping. There is **no middleware** and **no server-side redirect**. Document and extend what's actually here rather than assuming a guard exists.

## Point 1 — API routes return 401 (authoritative)

Every protected route handler resolves the session and bails with JSON before doing work:

```
const session = await authServer.api.getSession({ headers: request.headers })
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// ...then scope queries by session.user.id
```

This is the real gate: data never leaves the server without a valid session, regardless of what the UI does. The favorites routes (GET/POST/DELETE) are the worked example. An unauthenticated client fetch therefore *throws* (the fetcher maps 401 → an error), which surfaces as an error state in the consuming query — not a redirect.

## Point 2 — Client action gating (UX)

Client components read the session via `useSession()` (from `@/app/shared/hooks`) and gate actions:

```
const { data: session } = useSession()
if (!session?.user) { router.push('/login'); return }   // @/pkg/locale useRouter
```

The favorite button does exactly this — an unauthenticated click routes to `/login` instead of firing the mutation. This is UX, not security; the API 401 is what actually protects the data.

## The `(protected)` route group (structural only, today)

`(web)/[locale]/(protected)/` groups pages that are *conceptually* logged-in-only (e.g. favorites). **Its `layout.tsx` currently renders `children` with no session check** — it does not redirect. So today the group is organizational; it does not enforce anything on its own.

If a server-side page redirect is wanted, the natural place is that layout:

```
// (protected)/layout.tsx — IF server redirect is desired (not currently implemented)
const session = await authServer.api.getSession({ headers: await headers() })
if (!session) redirect('/login')   // redirect from @/pkg/locale
```

Until that's added, a protected page still renders for anonymous users; what they see is the empty/error state produced by the failing data fetch (e.g. the favorites grid's error branch).

## Why no middleware

The app has no `src/middleware.ts`. Session cookies are issued/read by the better-auth catch-all route, server checks use `getSession` per route, and locale routing is config-driven (single locale, `as-needed`). None of those need an edge middleware. A middleware would only be introduced to centralize gating across many paths or to add locale detection.

## Choosing where to protect a new thing

- **New data endpoint** → add the `getSession` → 401 guard at the top of the handler. Always.
- **New action that requires login in the UI** → gate it with `useSession()` and route to `/login`.
- **A whole page that must be logged-in** → put it under `(protected)`; if you need a hard server redirect (not just the soft data-error state), implement the `getSession`/`redirect` in `(protected)/layout.tsx`.
