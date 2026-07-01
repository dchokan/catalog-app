# Migration workflow (drizzle-kit)

Schema is the source of truth in `schema.ts`; drizzle-kit turns it into SQL and applies it. The scripts (in `package.json`) wrap the four drizzle-kit commands.

## The scripts

| Script | Command | Use |
|---|---|---|
| `db:generate` | `drizzle-kit generate` | Diff `schema.ts` against the last snapshot and write a new migration `.sql` + meta into `drizzle/`. |
| `db:push` | `drizzle-kit push` | Push the current schema straight to the DB without a migration file — fast iteration in dev. |
| `db:migrate` | `drizzle-kit migrate` | Apply the generated migrations in `drizzle/` to the DB (the deploy path). |
| `db:studio` | `drizzle-kit studio` | Open the Drizzle Studio GUI to browse/edit data. |

`db:seed` (`tsx .../seed.ts`) is not a drizzle-kit command — see the seed reference.

## Config (`drizzle.config.ts`)

```
{
  schema: './src/app/shared/services/db/schema.ts',  // where tables are defined
  out: './drizzle',                                  // where generated SQL/meta land
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
}
```

The config loads `.env.local` with `dotenv` and reads `process.env.DATABASE_URL` directly. This is correct: drizzle-kit runs as a standalone CLI outside the Next.js runtime, so the `@/config/env` gate (which is for app code) doesn't apply. The `.env.local` file must contain `DATABASE_URL`.

## The `drizzle/` folder

`drizzle/` holds generated artifacts: numbered `NNNN_name.sql` migrations plus `meta/` (`_journal.json` + per-migration snapshots). **Treat these as generated** — they're produced by `db:generate`, not hand-written. Editing them desyncs the meta journal and breaks future diffs. To change the schema, edit `schema.ts` and regenerate.

## Dev vs deploy

- **Dev iteration**: edit `schema.ts`, run `db:push` to sync immediately (no migration file).
- **Tracked change**: edit `schema.ts`, run `db:generate` to capture a migration, commit `drizzle/`, then `db:migrate` to apply.

## Choosing where DATABASE_URL is read

- **App code** (routes, services, `db/index.ts`) → `envServer.DATABASE_URL`.
- **Standalone scripts** (`drizzle.config.ts`, `seed.ts`) → `.env.local` via `dotenv` + `process.env`.
