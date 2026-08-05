# Spec: per-action verification

After a specific action, run the matching block. Declarative `MUST` checks — read and confirm, no script.

## After `+module`

- **MUST** be mounted by a routing file (`page.tsx` / `layout.tsx` / `error.tsx` / `not-found.tsx`). Name it. No routing file → it is not a module; relocate the slice.
- **MUST** have exactly one `*.module.tsx` at the slice root.
- **MUST** re-export it from `<module>/index.ts` as the file's ONLY export line: `export { default as <Module>Module } from './<module>.module'`. Nothing else leaves the slice — no store, service, hook, type, constant or element.
- **MUST** carry `'use client'` on `<module>.module.tsx` only if the module needs it — not on the page that hosts it.
- **MUST NOT** import another module, lazily included (`dynamic(() => import('@/app/modules/…'))` counts).
- **MUST** pass the reverse-isolation check: `grep -rn "modules/<module>" src | grep -v "^src/app/modules/<module>/"` returns only the mounting routing file. Any other hit → lift that symbol out of the slice (element reused by 2+ modules → `features/`/`widgets/`/`shared/components/`; state → `shared/stores/`; type → `shared/interfaces/` or `entities/models/`).
- Optional files (`*.service.ts`, `*.store.ts`, `*.interface.ts`, `*.constant.ts`) share the slice's kebab prefix; private sub-components live under `elements/<element>/`. No `model/` folder.

## After `+widget` / `+feature`

- **MUST** be used by two or more distinct modules. One consumer → move it into that module's `elements/<element>/` instead, regardless of how complex it is. Anticipated reuse does not count.
- **MUST** have one primary `*.component.tsx` + `index.ts`.
- **MUST** compose only from layers below (entities, shared); a feature **MUST NOT** import a widget; neither imports a module or a same-layer sibling.
- **MUST** add `'use client'` only when the component itself uses client-only APIs.

## After `+entity` (api / model)

- **MUST** have three api files: `<api>.api.ts`, `<api>.query.ts`, `<api>.mutation.ts`.
- **MUST** carry `'use client'` on `<api>.mutation.ts` only; api/query files stay server-composable.
- **MUST** source the `queryKey` from that entity's own `E<Entity>Key` enum in `entities/models/<entity>.model.ts` — never a project-wide key enum.
- **MUST** throw `new Error(message)` in fetchers; mutations surface errors via the project's toast/notification service in `onError`.
- **MUST** export only what consumers need from the barrel (hooks, option factories) — not internal fetchers.
- Model: `entities/models/<entity>.model.ts` holds `I*`/`E*` only, re-exported from `entities/models/index.ts`.

## After `+shared` segment file

- **MUST** pick the correct segment (`components`/`hooks`/`stores`/`services`/`utils`/`constants`/`interfaces`/`validation`/`assets`).
- **MUST** use the matching suffix; `validation/` is the plain-`*.ts` exception.
- **MUST NOT** add a segment-level `index.ts`: a segment groups unrelated members, so consumers import the member by path. A single-subject folder inside it (a component folder with its own service/interface) does ship a barrel.
- **MUST** keep `utils` pure (no React, no service calls, no I/O).

## After `+pkg` integration

- **MUST** create `src/pkg/<name>/` with `index.ts` and at least one `<name>.<suffix>.ts`.
- **MUST** read config from `envClient` / `envServer`, never `process.env`.
- **MUST NOT** import from `app/*` or another `pkg/*`; duplicate a shared helper privately if needed.

## After `+route` ( `(web)` page / `(api)` handler )

- **(web) MUST** keep the page thin: read params, optionally `prefetchQuery` from `entities/api/<api>`, render a `<…>Module`.
- **(web) MUST NOT** declare anything else at module scope — no helper, constant, interface or inline sub-component, at any size. Allowed beside the route component: its `IProps` and Next's own route exports (`generateMetadata`, `generateStaticParams`, `generateViewport`, `metadata`, `viewport`, `dynamic`, `dynamicParams`, `revalidate`, `runtime`, …). Everything else moves into the module (`*.util.ts` / `*.constant.ts` / `*.service.ts` / `elements/`). Same for `layout.tsx`, `error.tsx`, `not-found.tsx`.
  Check: `grep -nE "^(const|let|function|async function|type|interface|enum|class) " <route-file>` shows only the route component and allowed Next exports.
- **(web) MUST** use `(public)` / `(private)` route groups to scope shared layout/middleware without changing the URL.
- **(api) MUST** export `GET`/`POST`/… , pull env from `config/env/`, validate input; factor a shared `handler` for multi-method passthroughs.
- **MUST** update `src/middleware.ts` for any new route gate (new private path, redirect rule) — keep all gating in that one file; `config.matcher` excludes static/image assets.

## After `bootstrap` (new project)

- **MUST** pass `yarn type-check` (or `tsc --noEmit`).
- **MUST** pass `yarn lint` / `yarn format` end-to-end.
- **MUST** boot via `bun dev` / `yarn dev`; the first route renders.
- **MUST** have `@/*` → `src/*` path alias, env validation wired, and a single `src/middleware.ts`.
