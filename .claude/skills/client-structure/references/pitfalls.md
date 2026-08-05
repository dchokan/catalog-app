# Pitfalls & verification

## Common mistakes

**Layer dependency direction.** A feature importing a widget, an entity importing a feature, or a module importing another module's `*.module.tsx` are all upward imports. Lift the shared symbol down: shared types into `entities/models/<entity>.model.ts` or `shared/interfaces/`, shared logic into a feature/widget, shared persistence shape into `entities/`.

**Module imports another module.** Modules don't import each other. If two modules need the same logic, lift it down into a widget/feature; if they need the same shape, lift it down into `shared/interfaces/` or `entities/models/`. A grep that finds `from '@/app/modules/'` inside `src/app/modules/` (except for `<module>/elements/*` self-imports) is the quick check.

**`'use client'` on every leaf.** The directive belongs at the **highest** component that requires the client runtime. Pushing it down into every leaf bloats the client bundle and surfaces hydration mismatches; pushing it onto a layout/page that doesn't need it forces every descendant client-side. The default is RSC; opt in to client only when the component itself uses hooks, browser APIs, event handlers, Zustand subscription, or TanStack mutations.

**`'use client'` on `<api>.api.ts` or `<api>.query.ts`.** Only `<api>.mutation.ts` declares `'use client'`. The api and query files must remain server-composable so a `page.tsx` can call `clientQuery.prefetchQuery(<api>QueryOptions(...))` during SSR. Adding `'use client'` to a query file forces every page that prefetches it into the client bundle.

**TanStack Query files outside `entities/api/`.** All `*.api.ts` / `*.query.ts` / `*.mutation.ts` files live under `src/app/entities/api/<api>/`. Putting a `useFooQuery` inside a module or widget couples that slice to the resource and prevents reuse from other slices.

**Free-floating domain types in modules.** Types describing API shapes belong in `entities/models/<entity>.model.ts`. Cross-cutting enums (route names, cookie keys, query-param keys, query-key enum) live in `shared/interfaces/`. Defining `IFoo` inside `modules/<module>/<module>.interface.ts` is correct *only* when the type is genuinely module-private.

**Direct `process.env` access.** Read env variables only through `envClient` / `envServer` exported from `config/env/`. Adding a var means updating the Zod schema in `env.client.ts` or `env.server.ts` *and* `.env.example`. The one structural exception is `src/middleware.ts`, which may read `process.env.NODE_ENV` for branching `secure: process.env.NODE_ENV === 'production'` cookie flags — any other env var goes through `envClient`/`envServer` even in middleware.

**`NEXT_PUBLIC_*` vars declared on the server-only schema (or vice versa).** Vars prefixed `NEXT_PUBLIC_` go in `envClient` (`client: { … }`); everything else (secrets, upstream URLs not safe to ship) goes in `envServer` (`server: { … }`). Swapping them either crashes the build (`envClient` rejecting a non-public name) or leaks a secret into the client bundle.

**A grouping barrel.** A folder gets an `index.ts` only when it is ONE subject in several roles. A folder that groups independent units — a layer, a folder of slices, a role folder of unrelated members — must not have one: the barrel becomes a single module with an edge per member, so any consumer of one symbol takes on all of them, and bundlers' chunk grouping means tree shaking does not reliably undo it. The tell is consumers deep-importing *past* the barrel to dodge its weight; that is the barrel being wrong, not the consumers. The opposite error is real too: where a barrel legitimately exists, reaching past it into the unit's internals is a boundary violation.

**`pkg/*` reaches into `app/*` (or another `pkg/*`).** A `pkg/*` slot must be liftable as one folder into another project; once it imports from `app/*` or a sibling `pkg/*`, that property is gone and the import graph also risks cycles. If a pkg needs a project-specific shape, accept it as a parameter at call time. If two pkg slots need the same helper, duplicate it as a private file inside each pkg.

**Mixed concerns in `shared/`.** A util that calls a service is no longer a util — move it to `shared/services/`. A util that touches React (hook, `useEffect`, JSX) is not a util — move it to `shared/hooks/` or `shared/components/`. A constant file that imports runtime code is not a constant — split it. `shared/utils/*.util.ts` files are pure: input → output, no side effects.

**File suffix omitted.** Every implementation file carries its role suffix (`.module.tsx`, `.component.tsx`, `.service.ts`, `.store.ts`, `.hook.ts(x)`, `.api.ts`, `.query.ts`, `.mutation.ts`, `.model.ts`, `.interface.ts`, `.constant.ts`, `.util.ts`). The single documented exception is **`shared/validation/validation.ts`** — flat `*.ts`, not `*.validation.ts`. Don't extend this exception to other segments.

**Anything declared in `page.tsx`.** Pages read params, optionally prefetch a query for hydration, and render a module. Authentication checks, data orchestration, side effects, analytics — all belong inside the module (or in `middleware.ts` for route gates).

The rule is not a line budget, it is a declaration ban: besides the route component, its `IProps` and Next.js's own route exports (`generateMetadata`, `generateStaticParams`, `generateViewport`, `metadata`, `viewport`, `dynamic`, `revalidate`, `dynamicParams`, `runtime`, …), a routing file declares **nothing** at module scope. A three-line `const TABS = [...]` is as much a violation as a fifty-line orchestration, because the problem is location, not size: a symbol parked in the routing tree cannot be imported by any slice, cannot be unit-tested without rendering a route, and is invisible to the next route that needs the same thing — so it gets re-implemented. Move it into the module the page renders: pure helper → `<module>.util.ts`, static value → `<module>.constant.ts`, React/IO/store-touching helper → `<module>.service.ts`, markup → `<module>/elements/`.

`layout.tsx`, `error.tsx`, `not-found.tsx` and `template.tsx` are held to the same standard.

**A module nobody routes to.** A module is a business domain *attached to the routing tree*. If no `page.tsx` / `layout.tsx` / `error.tsx` / `not-found.tsx` renders the slice, it is not a module — it is a widget, a feature, a `shared/components/` primitive or an entity concern that was filed one layer too high. The usual symptom is another module importing it, often lazily: `dynamic(() => import('@/app/modules/<other>/<other>.module'))`. That is both a module→module import and a mis-layered slice; splitting the chunk does not make it legal. Ask which routing file mounts the slice *before* creating it — if there is no answer, `modules/` is the wrong layer.

**A widget that only one module uses.** `widgets/` is for a smaller business entity or a self-contained complex behaviour used by **two or more modules**. Extracting a component into `widgets/` because it grew large, or because it "will probably be reused", inverts the rule: it moves module-private behaviour into shared surface that nothing shares, and every future reader has to check whether editing it breaks other screens. One consumer → it lives in that module's `elements/<element>/`, at any size. Promote on the day a second module needs it; demote when a widget falls back to a single caller. `features/` follows the same test with a narrower scope.

**A module barrel that exports more than its module.** `modules/<x>/index.ts` is one line: `export { default as <X>Module } from './<x>.module'`. A store, service, hook, type, constant or `elements/*` component in that barrel means something outside the slice is consuming module internals — and since modules never import modules, the only consumers that could exist are already violations. The fix is never to add the export: lift the symbol down (state → `shared/stores/`, logic → a feature/widget, type → `shared/interfaces/` or `entities/models/`, reused element → `features/`/`widgets/`/`shared/components/`) and let the barrel shrink back. Two `*.module.tsx` in one slice is the same problem in folder form — two routing surfaces sharing one slice — and splits into two slices.

**Auditing only what a slice imports.** Layer-direction greps answer "what does this slice depend on?". They never catch the opposite failure: this slice's `elements/` being rendered by three other modules. Both questions belong in every slice audit, and the reverse one is the one that gets skipped — `grep -rn "modules/<module>" src | grep -v "^src/app/modules/<module>/"` should return the mounting routing file and nothing else.

**File grown past 1000 lines.** 1000 lines is a hard cap for any implementation file, not a target. A file that big is holding more than one concern; split it along the pattern instead of scrolling: module-private UI into `elements/<element>/`, logic into `<slice>.service.ts`, static values into `<slice>.constant.ts`, types into `<slice>.interface.ts` — or promote the extra concern into its own slice. Apply the same split preventively when a file is approaching the cap, not only after it crosses it. If the file you need to edit is ALREADY over the cap (or your edit would push it over), split it first along the slice's existing boundaries, then make the change — piling onto an oversized file is a refactor being deferred.

**Constants or helper functions parked at the top of a component file.** A `*.component.tsx` / `*.module.tsx` holds one thing: the component (plus its `IProps`). Anything declared at module scope beside it is a second concern hiding in the file — a duration table, a formatter, a regex, a mapper. Static values go to `<name>.constant.ts`; a pure helper goes to `<name>.util.ts`; a helper that touches React, I/O or a store goes to `<name>.service.ts`. This is not cosmetic: the helper is invisible to every other slice that needs it, so the next developer re-implements it (that is how the same formatter ends up copied into two components that render the same field), and it cannot be unit-tested without rendering the component. Variables declared *inside* the component body are local state, not a violation.

**Implicit-return arrow on a declared function.** A function bound to a name always takes a block body with an explicit `return`, so the body has room to grow (guards, logging, a second statement) without reshaping the declaration, and every declared function reads the same way.

```ts
// ❌ concise body
const <fn>Href = (id: string) =>
  buildRoute(ERoute.<ROUTE>, { <param>: id })

// ✅ block body with explicit return
const <fn>Href = (id: string) => {
  return buildRoute(ERoute.<ROUTE>, { <param>: id })
}
```

This applies to any arrow function assigned to a `const`/`let` (or exported). Inline callbacks passed directly as arguments or JSX props — Zustand selectors, `map`/`filter` callbacks, `queryFn: (params) => …`, `onClick={() => …}` — may stay concise.

**Component prop pattern drift.** Components use `FC<Readonly<IProps>>` with `IProps` declared just above the component, and props are **destructured inside the body** (`const { x, y } = props`), not in the parameter list. The convention is repo-wide; deviating creates churn when other files mirror neighbours.

**Module folder name doesn't match file prefix.** A slice at `modules/<module-name>/` must contain `<module-name>.module.tsx`, not `<moduleName>.module.tsx` or a different prefix. The folder and the suffix files share one kebab-case prefix.

**Component element class lookup pulled into a util that depends on React.** When something needs React, it belongs in `shared/components/` or `shared/hooks/`, not `shared/utils/`. Test: can the file run under `vitest` with no DOM? If not, it's not a util.

**Notion KB drift from reality.** The project's Notion KB lists `shared/` segments as `ui/, hooks/, store/, interfaces/, assets/`. The repo actually uses `components/, hooks/, stores/, interfaces/, constants/, utils/, services/, validation/, assets/` (role folders are PLURAL). The skill anchors on **reality** (the segments in active use). If both the Notion KB and the code change in the future, update this skill in lockstep — do not let one drift away from the other again.
