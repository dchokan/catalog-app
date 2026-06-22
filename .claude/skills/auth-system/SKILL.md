---
name: auth-system
description: Set up authentication with better-auth in a Next.js App Router project. Use when configuring email/password auth, creating the server auth config, client auth config, API catch-all route, and session hook. Covers src/pkg/auth/ and the auth API route.
---

# Auth System

`better-auth` with email/password provider (Google OAuth is a separate skill). Auth server lives in `src/pkg/auth/auth.ts`, the client in `src/pkg/auth/auth-client.ts`. A catch-all API route forwards all auth requests to better-auth's handler.

## File Layout

```
src/pkg/auth/
├── auth.ts           # Server: better-auth instance with providers and DB adapter
└── auth-client.ts    # Client: createAuthClient for browser-side hooks

src/app/(api)/api/auth/
└── [...all]/
    └── route.ts      # Catch-all: forwards to better-auth handler

src/app/shared/hooks/
└── use-session.hook.tsx  # Thin wrapper around authClient.useSession
```

## Dependencies

```
better-auth          # runtime
drizzle-orm          # required by better-auth drizzle adapter
```

## `src/pkg/auth/auth.ts`

Create a `betterAuth({...})` instance. Configure:

- **`database`**: use `drizzleAdapter(db, { provider: "pg" })` — pass the drizzle client from `src/pkg/db`
- **`emailAndPassword`**: `{ enabled: true }`
- **`baseURL`**: read from server env (`BETTER_AUTH_URL`)
- **`secret`**: read from server env (`BETTER_AUTH_SECRET`)

Export this instance as the default export or named `auth`.

Also export a type helper: `type Session = typeof auth.$Infer.Session`

## `src/pkg/auth/auth-client.ts`

Create a `createAuthClient({ baseURL })` instance where `baseURL` is the client-side env (`NEXT_PUBLIC_APP_URL`).

Export as `authClient`.

This file is imported in browser components only. Do not import it in server-side code.

## `src/app/(api)/api/auth/[...all]/route.ts`

```
import { auth } from "@/pkg/auth/auth"
export const { GET, POST } = auth.handler
```

This single export is all that's needed. better-auth handles all sub-paths internally.

## `src/app/shared/hooks/use-session.hook.tsx`

Thin wrapper:
```
import { authClient } from "@/pkg/auth/auth-client"
export const useSession = () => authClient.useSession()
```

Returns `{ data: session, isPending, error }`.

## Environment Variables Required

```
BETTER_AUTH_SECRET=<random 32+ char string>
BETTER_AUTH_URL=http://localhost:3000       # server-side
NEXT_PUBLIC_APP_URL=http://localhost:3000   # client-side
```

Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Session Access Patterns

**Server-side (API routes, Server Components):**
```
import { auth } from "@/pkg/auth/auth"
const session = await auth.api.getSession({ headers: await headers() })
// session is null if not authenticated
```

**Client-side (React components):**
```
const { data: session, isPending } = useSession()
// session.user.name, session.user.email, session.user.image
```

## Auth-Related Pages

- `app/(web)/login/page.tsx` — renders `<AuthLoginModule />`
- `app/(web)/register/page.tsx` — renders `<AuthRegisterModule />`

These pages are simple wrappers; all form logic is in `src/app/modules/auth-login/` and `src/app/modules/auth-register/`.

## Hard Rules

- `auth.ts` is server-only — never import it in client components or `auth-client.ts`
- `auth-client.ts` is client-only — never import it in server code or API routes
- All auth API paths are served under `/api/auth/` — the `[...all]` catch-all handles every sub-route
- `BETTER_AUTH_SECRET` must be the same value across all server instances — changing it invalidates all sessions
- The drizzle adapter needs the exact table shapes defined in `database-and-drizzle` skill — don't rename columns

## Verification

- `POST /api/auth/sign-up/email` with `{ name, email, password }` creates a user
- `POST /api/auth/sign-in/email` returns a session cookie
- `GET /api/auth/get-session` returns the current session
- Register page at `/register` submits without 500 errors
- Login page at `/login` redirects to `/items` on success
