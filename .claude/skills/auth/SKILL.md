---
name: auth
description: Work with authentication in this app — the better-auth server instance, the client auth instance, the email/password and Google OAuth flows, the auth catch-all API route, the useSession hook, the sign-in/sign-up data layer, and how routes/endpoints are protected. Use when configuring better-auth, adding a social provider, gating an API route or page, debugging sessions, or touching anything under shared/services/auth, pkg/auth, entities/api/auth, (api)/api/auth, or features/oauth-buttons. Skip for unrelated data features and for the generic form-building pattern (that is the forms-and-validation skill).
---

# auth

Authentication is built on **better-auth** with email/password + Google OAuth, backed by Drizzle/Postgres. There are two instances: a **server** instance (`authServer`, in `shared/services/auth`) that owns config, the DB adapter, and session verification; and a **client** instance (`authClient`, in `pkg/auth`) used by browser components for sign-in/up and the session hook. The only HTTP surface is one catch-all route. Protection is enforced at the **API** (401 JSON via `getSession`) and at the **client** (action gating via `useSession`) — there is no middleware.

This skill documents the real auth wiring in this repo — paths and symbols below are concrete.

## Layout

```
src/app/shared/services/auth/
├── auth.server.ts                    # authServer = betterAuth({ drizzleAdapter, emailAndPassword, socialProviders, accountLinking, secret, baseURL })
└── index.ts                          # exports authServer
src/pkg/auth/
├── auth.client.ts                    # 'use client' authClient = createAuthClient({ baseURL })
└── index.ts                          # exports authClient
src/app/(api)/api/auth/[...all]/
└── route.ts                          # export const { GET, POST } = toNextJsHandler(authServer)
src/app/shared/hooks/
└── use-session.hook.tsx              # 'use client' useSession() → authClient.useSession()
src/app/entities/api/auth/            # mutation-only slice (no query/model)
├── auth.api.ts                       # signIn / signUp via authClient (throw on error)
├── auth.mutation.ts                  # useSignInMutation / useSignUpMutation
└── index.ts
src/app/features/oauth-buttons/
└── oauth-buttons.component.tsx       # 'use client' authClient.signIn.social({ provider:'google', callbackURL:'/items' })
src/app/(web)/[locale]/(auth)/        # login + register pages (route group)
src/app/(web)/[locale]/(protected)/  # group for gated pages — layout currently pass-through (see references/route-protection.md)
src/config/env/env.server.ts         # BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID/SECRET, DATABASE_URL
```

Sign-in/up *forms* (`features/login-form`, `features/register-form`) and their Zod schemas follow the generic form pattern — owned by the **forms-and-validation** skill, not here.

## Hard rules

1. **Two instances, never crossed.** `authServer` (server-only, `shared/services/auth`) is imported by API routes and server session checks. `authClient` (`'use client'`, `pkg/auth`) is imported by browser components. Never import `authServer` in a client module or `authClient` in server code.
2. **One HTTP surface.** All auth requests go through `(api)/api/auth/[...all]/route.ts` = `toNextJsHandler(authServer)`. Do not hand-roll login/logout/session endpoints.
3. **Drizzle adapter wiring.** `authServer` uses `drizzleAdapter(db, { provider: 'pg', schema })` where `schema` is the **auth-tables** export (`user/session/account/verification`) from `@/app/shared/services/db` — not the items/favorites tables.
4. **Session reads have one server form and one client form.** Server: `authServer.api.getSession({ headers: request.headers })`. Client: `useSession()` from `@/app/shared/hooks` (wraps `authClient.useSession()`). Don't call `authClient` for sessions on the server or `getSession` in the browser.
5. **Config flows through `@/config/env`.** `envServer` for secrets (`BETTER_AUTH_SECRET` ≥32 chars, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_*`); `envClient.NEXT_PUBLIC_APP_URL` for the client `baseURL`. Never read `process.env` directly.
6. **Social sign-in is provider-declared.** `authClient.signIn.social({ provider, callbackURL })` only works for a provider configured in `authServer.socialProviders` (and listed in `account.accountLinking.trustedProviders` to allow linking).

## Key files

- **`auth.server.ts`** — the single `betterAuth({...})` config: `database: drizzleAdapter(db, { provider:'pg', schema })`, `emailAndPassword: { enabled: true, minPasswordLength: 8 }`, `socialProviders.google`, `account.accountLinking` (trusted `['google']`, `requireLocalEmailVerified: false`), `secret`, `baseURL`.
- **`auth.client.ts`** — `'use client'`; `createAuthClient({ baseURL: envClient.NEXT_PUBLIC_APP_URL })`.
- **`[...all]/route.ts`** — `export const { GET, POST } = toNextJsHandler(authServer)`. The catch-all serves every better-auth endpoint.
- **`use-session.hook.tsx`** — `'use client'` thin wrapper exposing `useSession()` to components.
- **`auth.api.ts` / `auth.mutation.ts`** — `signIn(values)` / `signUp(values)` call `authClient.signIn.email` / `authClient.signUp.email` and **throw** on `error`; the mutations wrap them. Note this slice has no `.query.ts`/`.model.ts` — auth is mutation-only; sessions come from the hook.
- **`oauth-buttons.component.tsx`** — local `isLoading` state, calls `authClient.signIn.social`.

## Self-verification

After any change, confirm against `spec/`:
1. `spec/invariants.spec.md` — always-true rules (instance separation, single HTTP surface, adapter schema, session forms, env gating).
2. The matching block in `spec/per-action.spec.md` — `+protect-api`, `+protect-page`, `+provider`, or `+auth-mutation`.

## Common mistakes

| Mistake | Reality |
|---|---|
| Importing `authServer` in a client component | Server-only. Use `authClient` / `useSession()` in the browser. |
| Adding a `/api/auth/login` route by hand | The catch-all `[...all]` already serves all endpoints via `toNextJsHandler`. |
| Passing the items/favorites tables to `drizzleAdapter` | Pass the auth-tables `schema` export (`user/session/account/verification`). |
| Expecting `(protected)/layout.tsx` to redirect | It currently renders children as-is. Protection is API-401 + client action-gating; see `references/route-protection.md`. |
| Looking for a `middleware.ts` auth gate | There is none. |
| Reading `process.env.BETTER_AUTH_SECRET` | Read `envServer.*` from `@/config/env`. |
| Calling `signIn.social` for an unconfigured provider | Declare it in `authServer.socialProviders` (+ `accountLinking.trustedProviders`) first. |
| Returning a redirect from a protected API route | API routes return `401` JSON; redirects belong to client/page flows. |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Adding/auditing a **social provider** (server config, account linking, the buttons, env, Google Cloud setup) | `references/oauth.md` |
| Deciding **how to protect** a route, endpoint, or page (the real enforcement model + the `(protected)` group) | `references/route-protection.md` |
| Need a copy-ready **shape** for an auth file | `examples/` |
| **Verifying** a change | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/oauth.md`** — Google OAuth end to end.
- **`references/route-protection.md`** — the API-401 + client-gating model, the `(protected)` group, and why there's no middleware.
- **`examples/`** — concrete shapes of the server/client instances, the catch-all route, the session hook, and the auth data slice.
- **`spec/`** — `invariants.spec.md` + `per-action.spec.md`.
