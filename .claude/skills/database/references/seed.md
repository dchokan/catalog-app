# Seed script

`db:seed` (`tsx src/app/shared/services/db/seed.ts`) populates the `items` table with sample books for development. It is a **standalone** Node script, not part of the app runtime.

## Why it opens its own client

The script can't import the app's `db` and run as a normal module: it executes outside Next.js via `tsx`, so it must bootstrap its own connection and env. It:

1. `config({ path: '.env.local' })` — loads env (it's outside the `@/config/env` gate, like `drizzle.config.ts`).
2. `const { envServer } = await import('@/config/env')` — dynamic import so the dotenv load happens *first*.
3. `const client = postgres(envServer.DATABASE_URL, { prepare: false })` + `const db = drizzle(client)` — its own connection.

This keeps the seed independent of the app's module graph and connection lifecycle.

## What it does

```
async function seed() {
  await db.delete(items)                                   // clear existing items (idempotent reseed)
  const inserted = await db.insert(items).values(booksData).returning()
  // log counts
}
seed()
  .catch((e) => { console.error(e); process.exit(1) })     // non-zero exit on failure
// (client.end() in the finally inside seed())
```

- **Idempotent**: it deletes all `items` first, so re-running yields the same dataset, not duplicates. `favorites` rows referencing those items are removed too (FK `onDelete: 'cascade'`).
- **Items only**: auth tables (`user`/`session`/…) are never seeded — accounts come from sign-up.
- **Clean shutdown**: `client.end()` in `finally`; `process.exit(1)` on error so CI/scripts see the failure.
- **Data**: `booksData` is an inline array of `{ title, description, imageUrl }`. Image hosts must be allow-listed in `next.config.ts` `images.remotePatterns` for `next/image` to render them.

## Adding seed data

Append objects to `booksData` (`title`, `description`, `imageUrl`). If a new image host is used, add it to `next.config.ts`. Re-run `db:seed`; the delete-then-insert keeps the table to exactly the array.
