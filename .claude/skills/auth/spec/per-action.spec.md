# Auth checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +protect-api — gating a route handler

- **MUST** resolve `authServer.api.getSession({ headers: request.headers })` first.
- **MUST** return `NextResponse.json({ error: 'Unauthorized' }, { status: 401 })` when there's no session — never a redirect.
- **MUST** scope every subsequent query by `session.user.id`.

## +protect-page — gating a page

- **MUST** place the page under `(web)/[locale]/(protected)/`.
- **MUST** decide enforcement explicitly: the `(protected)` layout is pass-through today, so anonymous users still render the page (seeing the data-error/empty state). For a hard server redirect, add `getSession` + `redirect('/login')` to `(protected)/layout.tsx`.
- **MUST** use `redirect` / `useRouter` from `@/pkg/locale` for any auth redirect.

## +provider — adding a social provider

- **MUST** add credentials to `envServer` (Zod schema + `runtimeEnv`).
- **MUST** add the provider block to `authServer.socialProviders` (+ `accountLinking.trustedProviders` if linking).
- **MUST** register the redirect URI `<BETTER_AUTH_URL>/api/auth/callback/<provider>` in that provider's console.
- **MUST** trigger via `authClient.signIn.social({ provider, callbackURL })`; **MUST NOT** add a new auth route.

## +auth-mutation — sign-in/up data layer

- **MUST** call `authClient.signIn.email` / `signUp.email` in `auth.api.ts` and **throw** on `error`.
- **MUST** keep the slice mutation-only (no `.query.ts` / `.model.ts`).
- **MUST** drive the form via `useSignInMutation` / `useSignUpMutation`; redirect on `onSuccess` (e.g. `router.push('/items')` + `router.refresh()`).
