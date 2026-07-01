# Auth invariants

Global rules that always hold for authentication.

## Instance separation

- **MUST** keep `authServer` server-only (`shared/services/auth`) and `authClient` client-only (`pkg/auth`, `'use client'`).
  - Check: `grep -rn "shared/services/auth" src/app | grep -i "use client"` → no client file imports the server instance; `grep -rln "use client" src/pkg/auth/auth.client.ts` → present.
- **MUST NOT** import `authClient` in server code or `authServer` in a client component.

## Single HTTP surface

- **MUST** serve auth only via the catch-all `(api)/api/auth/[...all]/route.ts` using `toNextJsHandler(authServer)`.
  - Check: `find "src/app/(api)/api/auth" -name route.ts` → only `[...all]/route.ts`.

## Adapter & config

- **MUST** wire `drizzleAdapter(db, { provider: 'pg', schema })` with the auth-tables `schema` export.
  - Check: `grep -n "drizzleAdapter" src/app/shared/services/auth/auth.server.ts`.
- **MUST** read all secrets/URLs from `@/config/env` (`envServer` / `envClient`), never `process.env`.
  - Check: `grep -rn "process.env" src/app/shared/services/auth src/pkg/auth` → empty.

## Session reads

- **MUST** use `authServer.api.getSession({ headers })` on the server and `useSession()` (from `@/app/shared/hooks`) on the client.
  - Check: `grep -rn "getSession" "src/app/(api)"` (server) ; `grep -rn "useSession" src/app/features src/app/modules` (client).

## Protection

- **MUST** gate every protected API route with a session check returning `401` JSON.
  - Check: each protected handler has `getSession` + `status: 401` before data access.
- **MUST NOT** add a `middleware.ts` for auth or assume `(protected)/layout.tsx` redirects (it currently does not).

## Social providers

- **MUST** declare any provider used by `authClient.signIn.social` in `authServer.socialProviders`.
  - Check: providers in `oauth-buttons` / other social calls each appear in `auth.server.ts`.
