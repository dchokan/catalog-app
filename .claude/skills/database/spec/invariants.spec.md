# Database invariants

Global rules that always hold for the DB layer.

## Location & imports

- **MUST** keep the client/schema/seed under `src/app/shared/services/db/`, not `pkg/`.
  - Check: `find src -path "*services/db/*.ts"` ; `find src/pkg -name "schema.ts"` → empty.
- **MUST** import `db` and tables from `@/app/shared/services/db`.
  - Check: `grep -rn "from '@/app/shared/services/db'" src/app | head`.

## Connection & env

- **MUST** create the app client as `postgres(envServer.DATABASE_URL, { prepare: false })`.
  - Check: `grep -n "prepare: false" src/app/shared/services/db/index.ts`.
- **MUST** read `DATABASE_URL` via `envServer` in app code; `process.env` is allowed only in `drizzle.config.ts` / `seed.ts` (standalone scripts loading `.env.local`).
  - Check: `grep -rn "process.env.DATABASE_URL" src/app/shared/services/db/index.ts` → empty.

## The two schema bindings

- **MUST** keep `index.ts` passing the module namespace (`import * as schema`) to `drizzle()`.
- **MUST** keep the named `schema` export limited to the auth tables (`user/session/account/verification`) for `drizzleAdapter`.
  - Check: `grep -n "export const schema" src/app/shared/services/db/schema.ts` → contains only the four auth tables.

## Naming & generated files

- **MUST** name auth tables singular (`user`, ...) and domain tables plural (`items`, `favorites`); domain PKs `uuid().defaultRandom()`, uniqueness via `uniqueIndex`.
- **MUST NOT** hand-edit files in `drizzle/` — regenerate via `db:generate`.

## Seed

- **MUST** keep `seed.ts` self-contained (own client, `client.end()`, `process.exit(1)` on error) and items-only.
  - Check: `grep -n "client.end\|process.exit\|db.delete(items)" src/app/shared/services/db/seed.ts`.
