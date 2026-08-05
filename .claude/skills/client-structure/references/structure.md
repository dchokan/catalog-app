# Structure: Layer / Slice / Segment decision guide

Three levels of granularity, top → bottom. Decide in order:

1. **Layer** — which top-level concern owns this code?
2. **Slice** — a new business unit inside that layer, or an existing one?
3. **Segment** — which named bucket inside the slice (or `shared/`)?

Each level below gives a **decision tree** (where does it go?) and **isolation rules** (what it may/may not import, when to lift up or down). Placeholders only — `<module>`, `<widget>`, `<feature>`, `<api>`, `<entity>`, `I<Name>`, `E<Name>`.

---

## Part A — Layer (which layer?)

Walk top → bottom; stop at the first match.

```
Is it a URL the browser hits?
├─ a page/layout/loading/error?──────────────────► (web)
└─ a server endpoint (route.ts, BFF proxy)?──────► (api)

Is it the entry behaviour of one business page/domain?
└─ WILL A ROUTING FILE MOUNT IT (page/layout/error/
   not-found)? composes widgets/features, reads
   stores, calls mutations, owns one screen's flow?► modules
   └─ no routing file mounts it? ─────────────────► NOT a module; keep walking

Is it self-sufficient composite UI used by 2+ MODULES?
└─ composes features/entities behind one component?► widgets
   └─ only one module uses it? ───────────────────► that module's elements/<element>/

Is it one narrow, reusable capability (no composition
of other features inside it), used by 2+ slices?─► features
   └─ only one slice uses it? ────────────────────► inside that slice

Is it data about one server resource?
├─ fetchers / queryOptions / mutations?──────────► entities/api/<api>
└─ pure type/interface of a domain shape?────────► entities/models

Is it cross-cutting code used by many slices?────► shared/<segment>

Is it app configuration (env, fonts, global css)?► config/<segment>

Is it an external-system client / framework glue
that must stay liftable as one folder?───────────► pkg/<name>

Is it edge routing/auth/locale gating?───────────► middleware.ts (src root)
```

### `features` vs `widgets` vs `modules` (the most common mix-up)

Two questions settle it, in this order — **who mounts it**, then **how many use it**:

1. **A routing file mounts it** (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`) → **module**. No routing file mounts it → it is not a module, whatever its size or how domain-shaped it looks. Go to 2.
2. **How many modules use it?**
   - Exactly one → it stays **inside that module** (`elements/<element>/`). Complexity does not promote it.
   - Two or more, and it composes several features/entities into self-sufficient UI → **widget**.
   - Two or more, and it is one narrow capability with no composition inside → **feature**.

Counting consumers is a `grep`, not an opinion:

```bash
grep -rn "modules/<module>" src | grep -v "^src/app/modules/<module>/"   # who reaches into this module?
grep -rn "widgets/<widget>"  src | grep -v "^src/app/widgets/<widget>/"  # ≥2 distinct modules, or demote
```

Both directions matter. The forward direction (what a slice imports) is what the layer table
below governs; the reverse direction (who imports the slice) is what decides whether the slice
is in the right layer at all — and it is the one routinely skipped.

### Isolation rules per layer

Imports flow **only downward**: `(web)/(api) → modules → widgets → features → entities → shared`. `config/` and `pkg/` are infra — any layer may import them.

| Layer | May import | Must NOT import | When to lift |
|---|---|---|---|
| `(web)` / `(api)` | everything below + config/pkg | another page's internals | ANY module-scope declaration beside the route component and Next's route exports → into the module |
| `modules` | widgets, features, entities, shared, config, pkg | another **module** (incl. lazily); `(web)`/`(api)` | logic shared by 2 modules → down into feature/widget; shared type → `shared/interfaces` or `entities/models`; a module nobody routes to → out of the layer entirely |
| `widgets` | features, entities, shared, config, pkg | modules; another widget | over-composed widget → split features out; widget down to ONE consuming module → back into that module's `elements/` |
| `features` | entities, shared, config, pkg | widgets, modules; another feature | composition appearing inside → lift up to a widget |
| `entities/api` | entities/models, shared, config, pkg | features and above | — |
| `entities/models` | shared (types), config | any runtime code; features and above | — (types only) |
| `shared` | config, pkg | entities and above | a `shared` symbol that needs a domain shape takes it as a param |
| `config` | pkg | app/* | — |
| `pkg/<name>` | itself only | `app/*`; another `pkg/*` | shared helper between two pkg slots → duplicate privately in each |
| `middleware.ts` | config/env, relevant pkg slots | modules/widgets/features | new gate logic stays here, not duplicated in pages |

**Lift-down test:** a symbol needed by 3+ layers belongs in `shared/interfaces/` (cross-cutting) or `entities/models/` (domain shape). Logic reused by two siblings drops one layer down.

---

## Part B — Slice (new slice, or extend an existing one?)

A **slice** is one folder per business unit inside a layer: `modules/<module>/`, `widgets/<widget>/`, `features/<feature>/`, `entities/api/<api>/`. (`entities/models/` and `shared/` segments are flat — no per-unit slice folder.)

```
Does a slice for this unit already exist?
├─ yes, and the new code is the same unit's concern?──► add a file to it
├─ yes, but the code is a distinct capability?────────► new slice (and compose)
└─ no?────────────────────────────────────────────────► new slice

Is the new code only used inside one slice?
├─ a sub-component private to the slice?──────────────► <slice>/elements/<element>/
└─ logic/types private to the slice?──────────────────► <slice>/<slice>.{service,interface,constant,store}.ts

Is the slice growing past one screen's worth of UI?
└─ repeated sub-trees?────────────────────────────────► extract elements/, or lift reusable parts to features
```

### Isolation rules per slice

- **Barrel boundary** — consumers import a slice only through its `index.ts`. Never reach into `<slice>/elements/*` or a sibling slice's internal file from outside. This covers lazy imports: `dynamic(() => import('@/app/modules/<x>/<x>.module'))` is a deep import that happens later, not a permitted one.
- **A module barrel exports one symbol** — `export { default as <X>Module } from './<x>.module'`, nothing more. A store, service, hook, type or `elements/*` component in a module barrel is a lift-down signal, not an export; widening the barrel hides the problem instead of fixing it. Widget/feature barrels export their entry component plus the props type a consumer needs to type its call — still not their internals.
- **Name match** — the slice folder name (kebab-case) equals the file prefix: `modules/<module>/<module>.module.tsx`, not a different prefix or camelCase.
- **Private by default** — `elements/`, local `*.service.ts`, `*.store.ts`, `*.interface.ts`, `*.constant.ts` are the slice's private surface. If another slice needs them, that's the signal to lift down (logic → feature/widget; types → `shared/interfaces` or `entities/models`).
- **One entry** — a module slice has exactly one `*.module.tsx`; a widget/feature slice has one primary `*.component.tsx`. The barrel re-exports that entry as a named export. Two `*.module.tsx` in one folder means two routing surfaces sharing a slice: split them, and lift whatever they shared down a layer.
- **No sibling imports** — a slice never imports another slice in the **same** layer (no module → module, feature → feature, widget → widget).

---

## Part C — Segment (which bucket inside the slice / `shared`?)

A **segment** is a named subfolder grouping files by purpose. Segments appear inside `shared/`, `entities/`, `config/`, and (as `elements/` + suffix files) inside module/widget slices.

### `shared/` segment decision tree

```
Does it render or use React (JSX, hooks, effects)?
├─ a reusable UI component?─────────────► shared/components/<component>/
└─ a reusable hook?─────────────────────► shared/hooks/
Is it a Zustand store used across slices?► shared/stores/
Does it call other services / do I/O?───► shared/services/
Is it a pure fn (input → output)?───────► shared/utils/
Is it a static value / dictionary?──────► shared/constants/
Is it a TypeScript type / enum?─────────► shared/interfaces/
Is it a Zod schema?─────────────────────► shared/validation/  (plain *.ts, no suffix)
Is it an icon / image?──────────────────► shared/assets/<category>/
```

### `entities/` segment

```
Runtime code that talks to the server?──► entities/api/<api>/  (*.api / *.query / *.mutation)
Type/interface only, no runtime?────────► entities/models/<entity>.model.ts
```

### `modules/` & `widgets/` segment

```
A sub-component private to this slice?──► <slice>/elements/<element>/<element>.component.tsx
Slice-scoped logic / store / types / constants?
└─ root files: <slice>.service.ts | <slice>.store.ts | <slice>.interface.ts | <slice>.constant.ts
```

### Isolation rules per segment

- **`utils` are pure** — no React, no I/O, no service calls. Test: does it run under a unit test with no DOM and no network? If not, it's not a util.
- **A util that touches React** → `hooks/` or `components/`.
- **A util that calls a service** → `services/`.
- **A constant that imports runtime code** is not a constant → split the runtime part out.
- **`models` hold no runtime** — types/interfaces/enums only; one file per entity.
- **`api` segment splits by role** — `*.api.ts` (raw fetchers), `*.query.ts` (`queryOptions`, server-composable, no `'use client'`), `*.mutation.ts` (`useMutation`, the only file with `'use client'`).
- **Suffix == role** — every file carries its role suffix. The single exception is `shared/validation/validation.ts` (plain `*.ts`).
- **Every segment ships `index.ts`** — but the layer folder above it never does.
