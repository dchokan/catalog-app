---
name: project-setup
description: Bootstrap a new Next.js app from zero. Use when initializing the project, setting up folder structure, configuring TypeScript paths, Tailwind v4, env validation, prettier, and the FSD-inspired layer architecture used in this project. Skip when the project is already initialized.
---

# Project Setup

Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS v4. Architecture follows Feature-Sliced Design (FSD) layers inside `src/app/`, with infrastructure in `src/config/` and `src/pkg/`.

## Folder Layout

```
<root>/
├── src/
│   ├── app/
│   │   ├── (api)/               # API route group
│   │   │   └── api/
│   │   ├── (web)/               # Page route group
│   │   │   ├── layout.tsx       # Web layout (Header + Providers)
│   │   │   ├── page.tsx         # Root → redirect to /items
│   │   │   ├── items/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── favorites/
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx           # Root HTML layout
│   │   ├── entities/            # FSD: data models + client API hooks
│   │   ├── features/            # FSD: isolated UI features (forms, search, pagination)
│   │   ├── modules/             # FSD: page-level compositions (service + module component)
│   │   ├── widgets/             # FSD: reusable sections (header, item-card, favorite-button)
│   │   └── shared/              # FSD: base UI, hooks, interfaces
│   ├── config/
│   │   ├── env/                 # Server + client env validation
│   │   ├── fonts/               # Next.js font config
│   │   └── styles/              # global.css with Tailwind directives
│   └── pkg/
│       ├── db/                  # Drizzle client + schema + seed
│       ├── auth/                # Better Auth server + client
│       └── query/               # React Query client factory
├── drizzle/                     # Generated migration SQL files
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.example
├── .prettierrc
└── package.json
```

## Dependencies to Install

**Production:**
```
next react react-dom
@tanstack/react-query
better-auth
drizzle-orm postgres
react-hook-form zod @hookform/resolvers
@t3-oss/env-nextjs dotenv
```

**Dev:**
```
drizzle-kit
tailwindcss @tailwindcss/postcss
typescript @types/node @types/react @types/react-dom
eslint eslint-config-next
prettier
tsx
```

## Key Configuration Files

### `tsconfig.json`
- Enable path alias: `"@/*": ["./src/*"]`
- Target: `ES2017`, moduleResolution: `bundler`
- Strict mode on

### `next.config.ts`
- Add `images.remotePatterns` for any external image hosts used in the app (added per-feature as image sources are introduced)
- Export as `NextConfig` type

### `postcss.config.mjs`
- Single plugin: `@tailwindcss/postcss`

### `.prettierrc`
- `singleQuote: true`, `semi: false`, `trailingComma: "es5"`, `printWidth: 100`

### `.env.example`
Document all required env vars:
```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

OAuth provider vars (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are added by the `oauth-providers` skill.

## npm Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "db:seed": "npx tsx src/pkg/db/seed.ts"
}
```

## Root Layout (`src/app/layout.tsx`)

- Applies Inter font (via `src/config/fonts/font.ts`) to `<html>`
- Minimal: just `<html lang="en">` + `<body>` with font class applied
- Imports global.css

## Web Layout (`src/app/(web)/layout.tsx`)

- Renders `<Header />` widget at the top
- Wraps `{children}` in `<Providers />` (React Query provider)
- Main content area with consistent padding

## Global Styles (`src/config/styles/global.css`)

- `@import "tailwindcss"` directive (Tailwind v4 syntax)
- Any CSS custom properties or global resets go here

## Environment Validation (`src/config/env/`)

Use `@t3-oss/env-nextjs` to validate env vars at build/startup time — the app will throw if required vars are missing or malformed.

**`src/config/env/env.server.ts`** — server-only vars:
```typescript
import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    BETTER_AUTH_URL: z.url(),
    // Add provider-specific vars here as features are enabled (see oauth-providers skill)
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
})
```

**`src/config/env/env.client.ts`** — client-side (browser) vars:
```typescript
import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

**`src/config/env/index.ts`** — re-exports both:
```typescript
export { serverEnv } from "./env.server"
export { clientEnv } from "./env.client"
```

**Key rules for `createEnv`:**
- `server` block: server-only vars (no `NEXT_PUBLIC_` prefix)
- `client` block: only `NEXT_PUBLIC_` vars
- `runtimeEnv`: maps each key to `process.env.KEY` — required even though it looks redundant
- `emptyStringAsUndefined: true`: treats empty strings as missing (important for optional vars filled with "")
- Client vars get `z.url().default(...)` for local dev convenience; server vars have no default — they must be set

**Usage in app code:**
```typescript
import { serverEnv } from "@/config/env"   // in server-only files
import { clientEnv } from "@/config/env"   // in client-side files
```

Never import `serverEnv` in client components — Next.js will throw a build error.

## Hard Rules

- Route groups `(api)` and `(web)` isolate API routes from page routes — no shared layout between them
- `@/*` path alias maps to `src/` — use it everywhere, no relative `../../` imports
- `src/config/env/` is the single source for reading env vars — never use `process.env` directly in app code
- `src/pkg/` holds infrastructure only — no business logic, no UI
- FSD layer import direction: shared ← widgets ← features ← entities ← modules ← pages (no upward imports)
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities` directives

## Verification

- `npm run dev` starts without errors
- `http://localhost:3000` redirects to `/items`
- TypeScript compiles with `npx tsc --noEmit`
- `@/` imports resolve correctly
