---
name: database
description: Work with the database layer in this app — the Drizzle/Postgres client, the schema (auth tables + items/favorites), the drizzle-kit migration workflow (generate/push/migrate/studio), and the seed script. Use when defining or changing a table, wiring the db client, running or authoring migrations, adding seed data, or debugging the DATABASE_URL/connection. Covers src/app/shared/services/db. Skip for query/business logic inside features (that's the items/favorites/auth skills).
---

# database

Persistence is **Drizzle ORM over Postgres** (Supabase), all under `src/app/shared/services/db/` — not `pkg/`. One file defines the client (`index.ts`), one defines every table (`schema.ts`), one seeds dev data (`seed.ts`). Schema changes flow through drizzle-kit (`db:generate` → SQL in `drizzle/` → `db:push`/`db:migrate`). The same `schema.ts` serves both the app's query API and better-auth's adapter.

This skill documents the real DB layer in this repo — paths and symbols below are concrete.

## Layout

```
src/app/shared/services/db/
├── index.ts        # postgres client + drizzle(db); re-exports all tables (export * from './schema')
├── schema.ts       # all pgTable definitions + the `schema` auth-tables map
└── seed.ts         # standalone seed script (own client) — run via db:seed
drizzle/            # generated migration SQL + meta (drizzle-kit output)
├── 0000_*.sql
└── meta/
drizzle.config.ts   # drizzle-kit config (schema path, out, dialect, dbCredentials) — loads .env.local
```

Consumers import from the barrel: `import { db, items, favorites, schema } from '@/app/shared/services/db'`.

## Hard rules

1. **The DB layer lives in `app/shared/services/db/`, not `pkg/`.** `db` and every table are imported from `@/app/shared/services/db`.
2. **App code reads `DATABASE_URL` via `envServer`, never `process.env`.** The client is `postgres(envServer.DATABASE_URL, { prepare: false })` — `prepare: false` is required for the Supabase/pgbouncer transaction pooler. `drizzle.config.ts` and `seed.ts` run _outside_ the Next.js app, so they load `.env.local` via `dotenv` and read `process.env` directly — that's expected, not a violation of the env gate.
3. **Two distinct "schema" bindings — don't conflate them.**
   - `index.ts` does `import * as schema from './schema'` (the whole module namespace) and passes it to `drizzle(client, { schema })` so the query API knows every table.
   - `schema.ts` _also_ exports `const schema = { user, session, account, verification }` — the **auth-tables map** that `auth.server.ts` hands to `drizzleAdapter`. It deliberately excludes `items`/`favorites`.
4. **Migrations go through drizzle-kit.** `db:generate` writes SQL to `drizzle/`; `db:push` syncs the schema in dev; `db:migrate` applies migrations; `db:studio` inspects. Never hand-edit a generated file in `drizzle/`.
5. **Seed is standalone and items-only.** `db:seed` (`tsx .../seed.ts`) opens its **own** postgres client (not the app `db`), clears `items`, inserts the books, and ends the client. Auth tables aren't seeded — they fill via sign-up.
6. **Table naming follows the two conventions in use.** Auth tables use singular DB names (`user`, `session`, `account`, `verification`) per better-auth; domain tables use plural (`items`, `favorites`). Domain PKs are `uuid().defaultRandom()`; auth PKs are `text`. Uniqueness uses `uniqueIndex` (e.g. `unique_user_item_idx`).

## Key files

- **`schema.ts`** — `pgTable` definitions. Auth: `users`/`sessions`/`accounts`/`verifications` (DB names singular). Domain: `items` (uuid PK, title/description/imageUrl/createdAt) and `favorites` (uuid PK, `userId`→user, `itemId`→item, both `onDelete: 'cascade'`, `uniqueIndex('unique_user_item_idx').on(userId, itemId)`). Plus the `schema` auth-map export.
- **`index.ts`** — `const client = postgres(envServer.DATABASE_URL, { prepare: false })`; `export const db = drizzle(client, { schema })`; `export * from './schema'`.
- **`seed.ts`** — `dotenv` `.env.local`, dynamic `import('@/config/env')`, own client, `booksData` array, `seed()`: `delete(items)` → `insert(items).values(booksData).returning()` → log → `finally client.end()`; `process.exit(1)` on failure.
- **`drizzle.config.ts`** — `{ schema: './src/app/shared/services/db/schema.ts', out: './drizzle', dialect: 'postgresql', dbCredentials: { url: process.env.DATABASE_URL! } }`.

## Self-verification

After any change, confirm against `spec/`:

1. `spec/invariants.spec.md` — always-true rules (location, env access, the two schema bindings, naming, generated-file rule).
2. The matching block in `spec/per-action.spec.md` — `+table`, `+migration`, or `+seed`.

## Common mistakes

| Mistake                                         | Reality                                                                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Putting the db client/schema under `pkg/`       | It lives in `app/shared/services/db/`.                                                              |
| Passing `items`/`favorites` to `drizzleAdapter` | Pass the `schema` auth-map (`user/session/account/verification`); domain tables aren't auth tables. |
| Reading `process.env.DATABASE_URL` in app code  | Use `envServer.DATABASE_URL`. (Config/seed scripts outside the app are the exception.)              |
| Dropping `{ prepare: false }`                   | Required for the Supabase pooler; without it prepared statements break.                             |
| Hand-editing files in `drizzle/`                | Regenerate with `db:generate` instead.                                                              |
| Reusing the app `db` in `seed.ts`               | The seed opens its own client and `end()`s it — it's a standalone script.                           |
| Seeding auth tables                             | Only `items` is seeded; users come from sign-up.                                                    |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation                                                                                           | Open                                                                        |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Running or authoring a **migration** (the drizzle-kit scripts, the `drizzle/` folder, `.env.local`) | `references/migrations.md`                                                  |
| Working on the **seed** script / seed data                                                          | `references/seed.md`                                                        |
| Need a copy-ready **shape** for a schema/client/config/seed file                                    | `examples/`                                                                 |
| **Verifying** a change                                                                              | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/migrations.md`** — the drizzle-kit workflow and config.
- **`references/seed.md`** — the standalone seed pattern.
- **`examples/`** — concrete shapes of `schema.ts`, `index.ts`, `drizzle.config.ts`, `seed.ts`.
- **`spec/`** — `invariants.spec.md` + `per-action.spec.md`.
