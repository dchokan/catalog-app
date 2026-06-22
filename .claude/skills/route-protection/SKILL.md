---
name: route-protection
description: Protect routes and API endpoints with authentication in Next.js App Router. Use when adding auth guards to API routes (401 JSON responses), server page redirects, and client-side session checks with redirect to login. Covers both server-side and client-side protection patterns.
---

# Route Protection

Two protection contexts: **API routes** (return JSON 401) and **page routes** (redirect to `/login`). Both use better-auth's `getSession` with the request headers.

## Protection Patterns

### Pattern 1 — API Route Guard

In any API route handler that requires authentication:

```typescript
import { auth } from "@/pkg/auth/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // session.user.id, session.user.email available here
  // ...proceed with handler
}
```

- Use `await headers()` from `next/headers` — it returns a `Headers` object
- Return `{ error: "Unauthorized" }` with status 401 (not a redirect)
- The `session` object contains `session.user` (id, name, email, image)

### Pattern 2 — Server Page Redirect

In Server Component pages that require auth (e.g., `/favorites`):

```typescript
import { auth } from "@/pkg/auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  // Use session.user.id for SSR data fetching
}
```

- Use `redirect()` from `next/navigation` — throws internally, no need for `return`
- Redirect to `/login` — the login page doesn't need a `callbackURL` param (post-login always goes to `/items`)

### Pattern 3 — Client Component Guard

In client components that conditionally act based on auth (e.g., `FavoriteButton`):

```typescript
const { data: session } = useSession()

const handleAction = () => {
  if (!session) {
    router.push("/login")
    return
  }
  // perform action
}
```

- Don't redirect automatically on mount — only on user action
- `useSession()` returns `{ data, isPending }` — check `isPending` before deciding
- Show the UI in an unauthenticated state (empty heart, disabled), don't hide it

### Pattern 4 — Client Page Guard

For client pages that must redirect if not authed (not used in this project — prefer server pattern):

```typescript
const { data: session, isPending } = useSession()
const router = useRouter()

useEffect(() => {
  if (!isPending && !session) {
    router.push("/login")
  }
}, [session, isPending])

if (isPending) return null
```

## Which Pattern to Use

| Context | Pattern | Why |
|---|---|---|
| API route | Pattern 1 (401 JSON) | API clients expect JSON errors |
| Server page | Pattern 2 (redirect) | No flash, SEO safe |
| Client component action | Pattern 3 (conditional redirect) | Only redirect on intent |
| Client-only page | Pattern 4 (useEffect redirect) | Fallback, prefer server redirect |

## Hard Rules

- API routes return 401 JSON — never `redirect()` in an API handler
- Server page redirects happen before any DB query — check session first, then fetch data
- `await headers()` is required (not just `headers()`) in Next.js 15 — `headers()` is now async
- Auth is handled per-route (not via `middleware.ts`) in this project — better-auth's `getSession` is called directly in each handler; this is a deliberate choice over centralized middleware
- `session.user.id` is the canonical user identifier — use it for all user-scoped DB queries

## Verification

- `GET /api/favorites` without a cookie returns `{ error: "Unauthorized" }` with status 401
- Visiting `/favorites` when logged out redirects to `/login`
- Clicking the favorite button when logged out redirects to `/login`
- All protected routes work correctly when authenticated
- Items list at `/items` is accessible without authentication
