---
name: database-and-drizzle
description: Set up Drizzle ORM with PostgreSQL for a Next.js project. Use when configuring the database connection, defining schema tables, setting up drizzle.config.ts, and writing npm scripts for migrations. Covers the pkg/db layer: schema, client, and migration workflow.
---

# Database and Drizzle

Drizzle ORM with `postgres` (node-postgres) driver connected to a PostgreSQL database (Supabase recommended). Schema lives in `src/pkg/db/schema.ts`. The Drizzle client is a singleton in `src/pkg/db/index.ts`.

## File Layout

```
src/pkg/db/
├── index.ts      # Drizzle client singleton
├── schema.ts     # All table definitions
└── seed.ts       # Sample data insertion script

drizzle/
└── 0000_<name>.sql   # Generated migration (do not edit)

drizzle.config.ts     # Root-level Drizzle Kit config
```

## Dependencies

```
drizzle-orm postgres        # runtime
drizzle-kit                 # devDependency — CLI for migrations
```

## `drizzle.config.ts` (root)

Configure with:
- `schema`: path to `./src/pkg/db/schema.ts`
- `out`: path to `./drizzle`
- `dialect`: `"postgresql"`
- `dbCredentials.url`: read from `process.env.DATABASE_URL`
- `verbose: true`, `strict: true`

Use `defineConfig` from `drizzle-kit`.

## `src/pkg/db/index.ts`

- Import `drizzle` from `drizzle-orm/postgres-js`
- Import `postgres` from `postgres`
- Read `DATABASE_URL` from server env config (`@/config/env`)
- Create a `postgres(url)` connection
- Export `db = drizzle(connection)`
- This is a module-level singleton — no factory function needed

## `src/pkg/db/schema.ts`

### Better Auth Tables (required by better-auth drizzle adapter)

**`user`**
- `id`: text, primaryKey
- `name`: text, notNull
- `email`: text, notNull, unique
- `emailVerified`: boolean, notNull
- `image`: text (nullable)
- `createdAt`: timestamp, notNull
- `updatedAt`: timestamp, notNull

**`session`**
- `id`: text, primaryKey
- `expiresAt`: timestamp, notNull
- `token`: text, notNull, unique
- `createdAt`: timestamp, notNull
- `updatedAt`: timestamp, notNull
- `ipAddress`: text (nullable)
- `userAgent`: text (nullable)
- `userId`: text, notNull — references `user.id`, onDelete cascade

**`account`**
- `id`: text, primaryKey
- `accountId`: text, notNull
- `providerId`: text, notNull
- `userId`: text, notNull — references `user.id`, onDelete cascade
- `accessToken`, `refreshToken`, `idToken`: text (nullable)
- `accessTokenExpiresAt`, `refreshTokenExpiresAt`: timestamp (nullable)
- `scope`: text (nullable)
- `password`: text (nullable)
- `createdAt`: timestamp, notNull
- `updatedAt`: timestamp, notNull

**`verification`**
- `id`: text, primaryKey
- `identifier`: text, notNull
- `value`: text, notNull
- `expiresAt`: timestamp, notNull
- `createdAt`, `updatedAt`: timestamp (nullable)

### Application Tables

**`items`**
- `id`: uuid, primaryKey, defaultRandom()
- `title`: text, notNull
- `description`: text, notNull
- `imageUrl`: text, notNull
- `createdAt`: timestamp, notNull, defaultNow()

**`favorites`**
- `id`: uuid, primaryKey, defaultRandom()
- `userId`: text, notNull — references `user.id`, onDelete cascade
- `itemId`: uuid, notNull — references `items.id`, onDelete cascade
- `createdAt`: timestamp, notNull, defaultNow()
- **Unique constraint** on `(userId, itemId)` — one favorite per user per item

Use `pgTable` from `drizzle-orm/pg-core` for all table definitions.

## npm Scripts

Add to `package.json`:
```json
"db:push":     "drizzle-kit push"
"db:generate": "drizzle-kit generate"
"db:migrate":  "drizzle-kit migrate"
"db:studio":   "drizzle-kit studio"
"db:seed":     "npx tsx src/pkg/db/seed.ts"
```

## Database URL Format

For Supabase use port `6543` (connection pooling):
```
DATABASE_URL=postgresql://postgres.<project>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

## Hard Rules

- Never read `process.env.DATABASE_URL` directly — always go through `src/config/env/env.server.ts`
- The `drizzle/` folder is generated — commit it, never edit SQL files by hand
- Better Auth tables must match the exact column names above — better-auth adapter requires them
- Unique constraint on `(userId, itemId)` in favorites is critical — prevents duplicate favorites at DB level
- Use `cascade` delete on FK relations so user deletion cleans up sessions, accounts, favorites

## Verification

- `npm run db:push` completes without errors
- `npm run db:studio` opens Drizzle Studio at `https://local.drizzle.studio`
- All tables defined in `schema.ts` are visible (better-auth tables: user, session, account, verification; plus any app tables)
- `npm run db:seed` inserts seed rows without unique constraint errors
