# Google OAuth

Google is the one configured social provider. It is wired in three code places plus the Google Cloud Console and env.

## 1. Server config (`auth.server.ts`)

Two blocks on the `betterAuth({...})` config:

```
socialProviders: {
  google: {
    clientId: envServer.GOOGLE_CLIENT_ID,
    clientSecret: envServer.GOOGLE_CLIENT_SECRET,
  },
},
account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ['google'],
    requireLocalEmailVerified: false,
  },
},
```

- `socialProviders.google` enables the provider and supplies credentials from `envServer`.
- `accountLinking` lets a Google sign-in attach to an existing email/password account with the same email. `trustedProviders: ['google']` marks Google as trusted for linking; `requireLocalEmailVerified: false` allows linking even when the local account's email isn't verified. Without linking, a Google sign-in for an email that already has a password account would error or create a duplicate.

## 2. Client trigger (`features/oauth-buttons`)

```
await authClient.signIn.social({ provider: 'google', callbackURL: '/items' })
```

A `'use client'` button with local `isLoading` state. `callbackURL` is where the user lands after the provider round-trip. The redirect to Google is a full navigation, so there's no success handler here — control returns via `callbackURL`.

## 3. Env (`env.server.ts`)

```
GOOGLE_CLIENT_ID: z.string().min(1),
GOOGLE_CLIENT_SECRET: z.string().min(1),
```

Both are server-only (no `NEXT_PUBLIC_`), declared in the Zod `server` schema and mapped in `runtimeEnv`. The app fails to boot if they're missing.

## 4. Google Cloud Console

Create an OAuth 2.0 Client ID (Web application) and set the **Authorized redirect URI** to better-auth's Google callback path on your `BETTER_AUTH_URL` origin — `<BETTER_AUTH_URL>/api/auth/callback/google`. Copy the client id/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. For local dev the origin is `http://localhost:3000`.

## Adding another provider

1. Add credentials to `envServer` (Zod schema + `runtimeEnv`).
2. Add the provider block under `socialProviders` in `auth.server.ts` (and to `accountLinking.trustedProviders` if linking should be allowed).
3. Register the redirect URI in that provider's console.
4. Add a button calling `authClient.signIn.social({ provider, callbackURL })`.

The catch-all auth route needs no change — `toNextJsHandler` already serves the new callback path.
