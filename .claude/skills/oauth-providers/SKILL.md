---
name: oauth-providers
description: Add Google OAuth to the auth system. Use when extending better-auth with a Google social provider, creating the OAuth buttons component, and configuring the Google Cloud Console credentials. Depends on auth-system being set up first.
---

# OAuth Providers

Extends the existing better-auth config with Google OAuth. One extra config block in `auth.ts`, one new client method, and an OAuth buttons component in the features layer.

## What Changes

| File | Change |
|---|---|
| `src/pkg/auth/auth.ts` | Add `socialProviders.google` config |
| `src/config/env/env.server.ts` | Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `src/app/features/oauth-buttons/oauth-buttons.component.tsx` | New: Google sign-in button |
| `src/app/modules/auth-login/auth-login.module.tsx` | Add `<OAuthButtons />` |
| `src/app/modules/auth-register/auth-register.module.tsx` | Add `<OAuthButtons />` |

## `src/pkg/auth/auth.ts` — Add Google Provider

Add to `betterAuth({...})`:

```typescript
socialProviders: {
  google: {
    clientId: serverEnv.GOOGLE_CLIENT_ID,
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
  },
},
```

No other changes to `auth.ts` — better-auth handles the OAuth flow internally.

## Environment Variables

Add to `src/config/env/env.server.ts`:
```typescript
GOOGLE_CLIENT_ID: z.string().min(1),
GOOGLE_CLIENT_SECRET: z.string().min(1),
```

Add to `.env.example`:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## `src/app/features/oauth-buttons/oauth-buttons.component.tsx`

Client Component (`"use client"`):

```typescript
import { authClient } from "@/pkg/auth/auth-client"

export function OAuthButtons() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/items",
    })
  }

  return (
    <button onClick={handleGoogleSignIn}>
      Continue with Google
    </button>
  )
}
```

Style the button to match the project's button variants. The `callbackURL` is where better-auth redirects after successful OAuth.

## Module Integration

In both `auth-login.module.tsx` and `auth-register.module.tsx`:

```
<form>...</form>
<div>OR</div>
<OAuthButtons />
```

Place the OAuth buttons after the email/password form with a visual separator ("or continue with").

## Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name: `<your-app-name> (dev)` or similar
7. Add **Authorized JavaScript origins:**
   - `http://localhost:3000` (dev)
8. Add **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
9. Click **Create** — copy Client ID and Client Secret to `.env`

## The OAuth Callback Route

better-auth automatically handles `GET /api/auth/callback/google` through the `[...all]` catch-all route. No extra route file needed.

## Account Linking

better-auth automatically links Google accounts to existing email/password accounts if the email matches. The `account` table stores the `providerId: "google"` record. Users who sign up via Google get a user row with `emailVerified: true`.

## Hard Rules

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are server-only — never expose them client-side
- The callback URI in Google Console must exactly match the better-auth path: `/api/auth/callback/google`
- `callbackURL: "/items"` in `signIn.social` must be a relative path or same-origin absolute URL
- `authClient.signIn.social` is async — await it or handle the promise; don't fire-and-forget
- For production: add the production domain to both Authorized Origins and Redirect URIs in Google Console

## Verification

- "Continue with Google" button appears on login and register pages
- Clicking it redirects to Google's consent screen
- After approving, user is redirected to `/items`
- User record created in DB with `emailVerified: true`
- `account` table has a row with `providerId: "google"` for the user
- Existing email/password users can sign in with Google if emails match
