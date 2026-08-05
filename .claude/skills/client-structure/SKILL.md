---
name: client-structure
description: Use when scaffolding a new Next.js client project, bootstrapping from zero, adding a module/widget/feature/entity/api/model slice to an existing client codebase, adding a shared util/hook/store/service, registering a route or route handler, deciding where a new file should live, moving an existing slice to a different layer (re-homing it because a sibling imports it, or because it gained or lost consumers), or auditing an existing client against a Feature-Sliced Design (Layer/Slice/Segment) layout. Even if the user doesn't say "FSD" or "structure" explicitly — if they're placing new code in a Next.js client repo, use this skill. Skip for one-line edits, bug fixes, and refactors inside an existing slice.
---

# client-structure

Provide the canonical architectural pattern for **Next.js (App Router) + React** clients. The pattern follows **Feature-Sliced Design (FSD)**: code is organised into **Layers** (top-level concerns), each Layer contains **Slices** (one folder per business unit), and Slices may contain **Segments** (named subfolders by purpose).

Names in this document are placeholders. `<module>`, `<widget>`, `<feature>`, `<api>`, `<entity>`, `<segment>` stand in for the resource being built — the skill describes the pattern, not specific names.

## This skill is GENERIC — keep it that way

It states the pattern for ANY Next.js + React client, so every rule here must read the same in a
project it has never seen. **Editing it to fit one codebase is not allowed.** Concretely, an edit
to this skill (or to anything under `references/`, `spec/`, `examples/`) must NOT introduce:

- a real slice, file, symbol, route, env var or endpoint name from a specific project — write
  `<module>`, `<widget>`, `<entity>`, `<x>.store.ts`, `E<Entity>Key` instead;
- a domain-specific word standing in for the pattern (a chat, a paywall, a checkout, an
  organisation) — name the ROLE the pattern gives it (the module, the modal widget, the api slice);
- a measurement or verdict that is only true in one repo (a bundle size, a file's line count, a
  count of folders, "N call sites read this");
- a decision recorded because one team chose it, unless the reasoning holds for any project.

When a real run teaches something, generalise it before it lands here: state the SHAPE and the
mechanism, not the case. Project-specific facts, inventories and decisions belong in that
project's own memory or docs, never in this skill.

## When to use

Apply this skill to:
- Bootstrap a new Next.js client from zero (see `references/bootstrap.md`).
- Add a Slice to any Layer of an existing project (module, widget, feature, entity api or model, shared segment file, `pkg/` integration, route or route handler).
- Audit an existing project against the pattern (file layout, naming, layer dependency direction).

Skip this skill for one-line edits, bug fixes, and refactors *inside* an existing slice.

## Architecture

```
src/
├── app/
│   ├── (web)/                                      # LAYER — Next.js routing (route group)
│   │   ├── layout.tsx                              # root layout (RSC)
│   │   ├── page.tsx                                # root page (RSC)
│   │   ├── error.tsx                               # error boundary (optional)
│   │   ├── not-found.tsx                           # 404 page (optional)
│   │   ├── loading.tsx                             # loading UI (optional)
│   │   └── <route>/                                # nested route
│   │       ├── layout.tsx                          # optional
│   │       └── page.tsx
│   ├── (api)/                                      # LAYER — Next.js route handlers (route group)
│   │   └── api/
│   │       ├── <route>/
│   │       │   └── route.ts
│   │       └── <route>/[...path]/
│   │           └── route.ts                        # catch-all (e.g. BFF proxy)
│   ├── modules/                                    # LAYER — business domains, one per routing surface
│   │   └── <module>/                               # Slice — mounted by a page/layout/error
│   │       ├── <module>.module.tsx                 # module component (entry)
│   │       ├── <module>.service.ts                 # optional — module logic
│   │       ├── <module>.store.ts                   # optional — module-scoped store
│   │       ├── <module>.interface.ts               # optional — module-only types
│   │       ├── <module>.constant.ts                # optional — module-only constants
│   │       ├── elements/                           # optional — module-private sub-components
│   │       │   └── <element>/
│   │       │       ├── <element>.component.tsx
│   │       │       └── index.ts
│   │       └── index.ts                            # barrel — exports the module and nothing else
│   ├── widgets/                                    # LAYER — self-sufficient UI used by 2+ modules
│   │   └── <widget>/                               # Slice
│   │       ├── <widget>.component.tsx
│   │       ├── <widget>.service.ts                 # optional
│   │       ├── <widget>.store.ts                   # optional
│   │       ├── <widget>.interface.ts               # optional
│   │       ├── <widget>.constant.ts                # optional
│   │       ├── <widget>.css                        # optional — co-located styles
│   │       ├── elements/                           # optional
│   │       └── index.ts
│   ├── features/                                   # LAYER — single-purpose reusable capabilities
│   │   └── <feature>/                              # Slice
│   │       ├── <feature>.component.tsx
│   │       ├── <feature>.service.ts                # optional
│   │       ├── <feature>.interface.ts              # optional
│   │       ├── <feature>.constant.ts               # optional
│   │       └── index.ts
│   ├── entities/                                   # LAYER — business entities (no layer-level barrel)
│   │   ├── api/                                    # Segment — TanStack Query layer
│   │   │   └── <api>/
│   │   │       ├── <api>.api.ts                    # raw fetchers
│   │   │       ├── <api>.query.ts                  # queryOptions + useQuery wrappers (no 'use client')
│   │   │       ├── <api>.mutation.ts               # useMutation hooks ('use client')
│   │   │       └── index.ts
│   │   └── models/                                 # Segment — one file per entity (no barrel)
│   │       └── <entity>.model.ts
│   └── shared/                                     # LAYER — cross-layer reusable code
│       ├── components/                             # Segment — shared UI
│       │   └── <component>/
│       │       ├── <component>.component.tsx
│       │       └── index.ts
│       ├── hooks/                                  # Segment — grouping folder, no barrel
│       │   └── <hook>.hook.tsx
│       ├── stores/                                  # Segment — global state stores
│       │   └── <store>.store.ts
│       ├── services/                               # Segment
│       │   └── <name>.service.ts
│       ├── utils/                                  # Segment — pure utilities
│       │   └── <name>.util.ts
│       ├── constants/                              # Segment — static values
│       │   └── <name>.constant.ts
│       ├── interfaces/                             # Segment — global types
│       │   └── <name>.interface.ts
│       ├── validation/                             # Segment — schemas (flat files, plain *.ts)
│       │   └── validation.ts
│       ├── assets/                                 # Segment — icons, images
│       │   └── <category>/
│       │       └── <name>.<ext>
│       └── systems/                                # Segment — grouping folder, no barrel
│           └── <system>/                           # UNIT — one subject with internals
│               ├── <system>.interface.ts
│               ├── services/
│               │   └── <name>.service.ts
│               └── index.ts                        # the system's public face
├── config/                                         # application configuration
│   ├── env/                                        # Segment — @t3-oss/env-nextjs validated
│   │   ├── env.client.ts
│   │   ├── env.server.ts
│   │   └── index.ts
│   ├── fonts/                                      # Segment
│   │   ├── font.ts
│   │   └── index.ts
│   └── styles/                                     # Segment — global CSS
│       └── globals.css
├── pkg/                                            # external integrations / framework-level utilities
│   └── <integration>/                              # SLOT — a closed unit, entered through its barrel
│       ├── <integration>.<suffix>.ts               # isomorphic members
│       ├── client/                                 # optional — browser-runtime members
│       │   ├── <name>.<suffix>.ts
│       │   └── index.ts                            # the client runtime's barrel
│       ├── server/                                 # optional — server-runtime members
│       │   ├── <name>.<suffix>.ts
│       │   └── index.ts                            # the server runtime's barrel
│       └── index.ts                                # the slot's public face
└── middleware.ts                                   # Next.js edge middleware (one file at src root)
```

### Layer dependency rule

Imports may flow **only downward**:
```
(web) | (api) → modules → widgets → features → entities → shared
```
`config/` and `pkg/` are infra; any layer may import from them. Never import upward (an entity must not import a feature; a feature must not import a widget). Never import **sideways** either: a slice does not import a sibling slice in its own layer — not module→module, not widget→widget, not feature→feature.

### Two siblings must compose — invert through the layer above

The normal fix for a sibling import is to move the shared part DOWN a layer. Sometimes that is
not available: both slices genuinely belong to this layer, and the one being imported already
composes the layer below, so it has nowhere to descend to. Importing the sibling anyway is not
the answer, and neither is merging two slices that answer two different intents.

Invert the direction. The layer ABOVE may reference both, so it renders the dependency and
passes it IN; the consumer declares a slot in its props and knows only the slot's type. In the
common case the layer above is the routing tree, which is allowed to reach anything.

Two conditions make this hold:

- **Pass a RENDERED element, not a component type.** Where a framework splits server and client
  rendering, a function cannot cross that boundary: a prop typed as a component type-checks,
  lints and builds cleanly, then fails at RUNTIME on serialization. Type the slot as the
  framework's node type and let the layer above do the rendering.
- **The injected element must be self-serving** — it reads its own state from the layers below
  and takes no props from its host. The moment the host has to configure it, the type comes
  back across the boundary and so does the coupling.

Use this as the exception it is. A slot is inversion, not a licence: if a slice needs several of
them to function, it is not one slice.

### Folder discipline

**A barrel is the public face of ONE subject — never a directory of many.** Write an
`index.ts` when the folder holds a single unit expressed in several ROLES (`<x>.component.tsx`
+ `<x>.service.ts` + `<x>.interface.ts`; or `<api>.api.ts` + `<api>.query.ts` +
`<api>.mutation.ts`). Do NOT write one when the folder merely GROUPS independent units that
happen to share a role or a layer — a folder of unrelated hooks, of unrelated models, of every
slice in a layer. Consumers of a grouping folder import the unit they actually want, by path.

The distinction is not stylistic. A grouping barrel is a single module with one edge per
member, so importing any one symbol makes the whole group a dependency of the importer. Tree
shaking does not reliably undo this: bundlers group shared modules into chunks, so the cost
shows up as chunk weight rather than as unused exports. The visible symptom is consumers
deep-importing *past* the barrel to dodge it — read that as the barrel being wrong, not the
consumers.

Layer-level folders never carry a barrel; they are grouping folders by definition. Folder
names are **kebab-case**; the slice folder name matches the file prefix
(`<module>/<module>.module.tsx`).

### Tool-owned folders are outside the conventions

Some folders are not authored by the team: a code generator writes them from a schema or a
config, or a component-registry / scaffold CLI writes them from a remote registry and later
`diff`s and updates them in place. **The tool owns that folder.** Its layout, file names and
symbol names are the tool's contract with itself, and every convention on this page is
suspended inside it.

The test is mechanical, and it is not "does this look generated": **can the folder be
reproduced by running a command?** A generator's output directory, a registry CLI's target
directory, an SDK's emitted client all pass. A file someone wrote once by copying an example
does not — that is ordinary code with an unusual origin, and it follows the conventions like
everything else.

**Tool-owned means the tool WRITES the folder.** A folder a tool merely READS — a generator's
INPUT directory — is hand-written source and follows every convention on this page, however
tightly the generator depends on it. The two get confused because both are "part of the
codegen", and the mistake is expensive in one direction only: exempting an input directory
freezes it outside every metric forever. When the tool globs for a specific file name inside
those inputs, that name is the tool's contract with the tree — so it belongs in ONE constant in
the generator, not scattered through it, and renaming the files is then a one-line change rather
than a reason to leave them non-conforming.

Four consequences, in the order they get missed:

1. **Never hand-edit it.** Fix the input — the schema, the template, the CLI config — and
   re-run. A hand edit survives until the next regeneration and it dies invisibly: the file
   still parses, the build stays green, the behaviour reverts.
2. **Never count it, and never sweep it.** File naming, role suffixes, symbol prefixes, folder
   names, the file-size cap, comment style, declaration style — none of it applies inside, so
   none of it is debt. A metric that includes tool-owned files is not measuring the project; it
   is measuring the tool against rules the tool never agreed to. The exclusion list belongs to
   every checker AND to every repo-wide sweep: a symbol rename, a codemod, a `--fix` pass. A
   sweep that reaches in does not report a violation, it CREATES one — it silently edits files
   the tool owns, and each edit becomes a conflict on the next update, discovered only then.
3. **Its entry points are the tool's paths, not a barrel you add.** When the tool documents (or
   its config declares) the import path consumers use, that path IS the public surface, and
   imports following it are not barrel bypasses. Wrapping the output in a hand-written barrel to
   drive a bypass count to zero loses twice: the barrel groups independent units, which rule 5
   forbids anyway, and every consumer now diverges from the path the tool keeps writing.
4. **The direction that still holds is inward.** Tool-owned code must not reach into the
   application (a generator emitting an import of a module is misconfigured), and nothing
   outside may depend on a detail the next regeneration can move. The exemption covers naming
   and layout, never the dependency rules.

**Writing your own file into a tool-owned folder depends on HOW the tool writes:**

| The tool | A hand-written file in that folder |
|---|---|
| regenerates the WHOLE directory — wipes it and re-emits | Impossible. The next run destroys it silently. Your code lives outside, always. |
| writes NAMED files on demand — a registry / scaffold CLI, an `add` command | Allowed, and it adopts the **tool's** conventions: the same file naming, file shape, export style and props style the tool emits. |

The second row is not a concession, it is the same "one folder, one convention" rule applied
honestly. A folder's convention is set by whoever writes most into it, and inside a tool-owned
folder that is the tool. A hand-written neighbour following the *project's* rules instead reads
as a mistake to every future reader and buys nothing — the whole folder is already excluded
from the metrics, so no counter rewards the divergence. Match the neighbours.

What does not change either way: the folder stays out of every metric, is entered by the
tool's published paths, and never imports application code. And when a file the tool DOES own
has to be edited, that is a FORK — record it where the project records decisions, and expect
the tool's next diff to conflict there.

Declare the exclusion list **once**, in a shared constant every checker imports. Two lists
drift, and a folder exempt from one check but not another produces exactly the half-red report
the exemption existed to prevent.

## Hard rules

Fourteen rules that hold across every Next.js client built with this skill. Each rule has a one-line statement here; the reference docs own the detail.

The first four govern the **routing ↔ module ↔ widget** chain. They are the load-bearing ones: every other rule keeps a slice tidy, these four decide whether the slice may exist at all.

1. **A routing file declares nothing of its own** — `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx` contain the default-exported route component plus Next.js's own route exports (`generateMetadata`, `generateStaticParams`, `generateViewport`, `metadata`, `viewport`, `dynamic`, `revalidate`, `dynamicParams`, `runtime`, …) and **nothing else**. No helper function, no constant, no interface, no inline sub-component, no data-shaping. The route component reads `params`/`searchParams`, may `prefetchQuery`, and renders one module. Everything else moves into that module. Detail under "Layer responsibilities".
2. **A module exists only if a routing file mounts it** — a module is an isolated business domain attached to the routing tree through a `page.tsx`, `layout.tsx`, `error.tsx` or `not-found.tsx`. A slice under `modules/` that no routing file mounts **is not a module**: it is a widget, a feature, a shared component or an entity, and it moves there. A module reached only from ANOTHER module is this violation and the module→module violation at once. Detail under "Layer responsibilities".
3. **A module barrel exports its module component and nothing else** — `index.ts` is exactly `export { default as <X>Module } from './<x>.module'` (one line, one symbol). No store, service, hook, type, constant or element leaves a module. One slice holds exactly one module component; a second one is a second slice — unless the two are **variations of one domain** (authed vs guest, locked vs unlocked), which stay ONE module that selects the variant, see "One domain, two variations" below. A deep import into a module's internals from outside — including `dynamic(() => import('@/app/modules/<x>/<x>.module'))` — is the same violation spelled differently. Detail under "The module barrel exports one symbol".
4. **A widget needs a second module** — `widgets/` holds a smaller business entity or a self-contained complex behaviour used by **two or more modules**. Used by exactly one module, it stays inside that module as `elements/<element>/`, however complex it is. Promotion is driven by a real second consumer, never by anticipation; a widget that loses its second consumer moves back down into the surviving module. Detail under "Layer responsibilities".
5. **A barrel is one subject's public face** — a folder whose files are ROLES of a single unit ships an `index.ts`; a folder that GROUPS independent units (a role folder of unrelated members, a layer) does not, and its consumers import the member by path. If a barrel exists, nobody may bypass it. Detail under "Folder discipline".
6. **Layer dependency direction, and no sibling imports** — imports flow only downward (`(web)/(api) → modules → widgets → features → entities → shared`), and a slice never imports another slice in the **same** layer: no module→module, no widget→widget, no feature→feature. `config/` and `pkg/` are infra and may be imported from any layer. What two siblings both need moves DOWN a layer; when it genuinely cannot, invert the direction instead — see "Two siblings must compose".
7. **`pkg/*` self-containment, and a barrel only where there is a surface to name** — a `pkg/*` slot never imports from `app/*` or from another `pkg/*`; each folder must be liftable into another project as one folder. If two pkg slots need the same helper, duplicate it as a private file inside each pkg. A slot carries AT MOST ONE barrel, and only when there is a surface decision to record — its files are roles of one subject, or some members must stay out of reach. A flat bag of independent, equally reachable members is a GROUP: no barrel, members imported by path. Where a barrel exists it NAMES its surface and outsiders enter there. When members must not share a GRAPH — different runtimes, a vendor SDK, credentials, a heavy data set — the barrel OMITS them (with a comment saying why) and groups them into a folder named for that boundary, which carries no barrel of its own; an omitted member is then reached by its path, which is not a bypass because the barrel declared it out of surface. Detail under "A pkg slot is a CLOSED unit".
8. **RSC by default, `'use client'` at the highest necessary boundary** — pages and layouts stay Server Components unless they call client-only APIs. When a tree needs the client runtime (hooks, browser APIs, event handlers, Zustand subscription, TanStack mutations), add `'use client'` at the **outermost** component that requires it; do not sprinkle it on every leaf.
9. **Env access through `config/env/` only** — never read `process.env` directly outside `config/env/env.client.ts` and `config/env/env.server.ts` (the `middleware.ts` boundary edge cases are noted in `references/pitfalls.md`).
10. **File size cap — 1000 lines** — no implementation file exceeds 1000 lines. When a file approaches the cap, split along the pattern: extract `elements/` sub-components, a `*.service.ts`, a `*.constant.ts`, or a new slice. A file already over the cap is split FIRST, then edited. One carve-out only, for a file the architecture genuinely cannot divide — see "The cap's one carve-out".
11. **Declared arrow functions use a block body with explicit `return`** — a function bound to a name (`const <fn> = (…) =>`) never uses a one-line implicit return. Inline callbacks passed directly as arguments or JSX props (selectors, `map`, event handlers) may stay concise. Before/after in `references/pitfalls.md`.
12. **The second file of a role earns that role a folder** — one `*.service.ts` (or `*.interface.ts`, `*.store.ts`, …) stays at the slice root; two or more move into a PLURAL folder named for the role (`services/`, `hooks/`, `utils/`, `interfaces/`, `stores/`). That folder is a GROUPING folder, so by rule 5 it ships **no** barrel: consumers import the member they need by path. A role with one file never gets a folder. `model/` is not a role — flatten it. Detail under "Segments inside a module slice".
13. **A tool-owned folder is exempt and untouched** — a folder a command can regenerate (a generator's output directory, a registry CLI's target directory) is owned by that tool: never hand-edited, excluded from every structural metric, and entered through the paths the tool publishes rather than a barrel you add over it. The dependency rules still apply to it; the naming and layout rules stop at its edge. A hand-written file may join it only when the tool writes NAMED files rather than regenerating the whole directory — and it then follows the TOOL's conventions, not the project's. Exemption follows the WRITE: a folder a tool only READS (a generator's input directory) is ordinary hand-written source and conforms in full. Detail under "Tool-owned folders are outside the conventions".
14. **Persistent state is a `*.store.ts` on the project's state library** — never a `.storage.ts` of hand-rolled `localStorage` helpers. Keyed-by-id records live in the store as a map, not as N `<prefix>:<id>` keys; replacing an existing per-key scheme folds the old keys in once and deletes them. Detail under "Segments inside a module slice".

## Layer responsibilities

**`src/app/(web)/`** — Next.js App Router pages. Files (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`) follow Next.js conventions. Route groups (`(public)`, `(private)`) and dynamic segments (`[locale]`, `[id]`) live here. Pages stay thin: a page reads `params`/`searchParams`, may `prefetchQuery` against `entities/api/<api>` for SSR hydration, and renders a `<…>Module` from `modules/`.

**A routing file declares nothing of its own.** Not "little logic" — *nothing*. The complete allowed contents of a `page.tsx`:

- the default-exported route component;
- Next.js's own route exports: `generateMetadata`, `generateStaticParams`, `generateViewport`, `metadata`, `viewport`, `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`, `runtime`, `preferredRegion`, `maxDuration`;
- `IProps` for the route component's `params`/`searchParams`;
- imports.

Anything else at module scope is a violation, whatever its size: a `const` map, a `formatX` helper, a `parseSearchParams`, a locally declared sub-component, a `type` describing something other than the route props. It moves into the module the page renders — a pure helper to `<module>.util.ts`, a static value to `<module>.constant.ts`, anything touching React/IO/a store to `<module>.service.ts`, markup to `<module>/elements/`. The cost of leaving it is not aesthetic: a symbol in the routing tree is invisible to every slice, untestable without rendering a route, and the next route that needs it re-implements it.

The same holds for `layout.tsx`, `error.tsx`, `not-found.tsx` and `template.tsx`. The one thing a route component's *body* may do beyond rendering the module is read the router's inputs, `await` a prefetch, and wrap the module in `<HydrationBoundary>` / `<Suspense>`.

**A `layout.tsx` is as thin as a `page.tsx`, and every layout belongs to the layout module.** It reads what the router gives it and renders a variation from `modules/layout/`; markup, provider composition and data orchestration never live in the routing tree. All layouts are collected in that one module and selected **by variation**, because layouts routinely share the same pieces — header, sidebar, footer, shell. Two layouts differing only in whether the visitor is authenticated are two variations of one module, not two hand-written trees under `(web)/`.

Consequence: a component whose job is to NEST providers into an application shell is composition, and belongs to the layout module — not to `shared/`, whose job is cross-cutting building blocks.

**`src/app/(api)/api/`** — Next.js route handlers (`route.ts` / `route.tsx`). Treat as a sibling routing layer to `(web)/`: same dependency rule (may import from anything below), separate folder so server routes do not mix with page routes. Common shapes: BFF proxies forwarding to an upstream API, secret-gated revalidation endpoints, dynamic asset generators (`route.tsx` returning `ImageResponse`). Catch-all dynamic routes use `[...path]/route.ts`.

**A route handler is a routing file too, so rule 1 applies — with one adjustment.** It declares
its handler function(s) and whatever wraps them, and nothing else: no schema, no mapper, no
fetcher, no type describing the upstream payload, no constant holding a third-party URL. The
handler function itself is expected — a verb export cannot be wrapped in place, so
`const GET = withX(_GET)` over a local `_GET` is the sanctioned shape, and the same holds for the
multi-verb passthrough.

Everything else belongs to a slice BELOW. A page's answer is "move it into the module"; a handler
renders nothing, so it has no module — its logic belongs to whatever slice owns the domain the
endpoint serves, usually the `pkg/` slot for that external system or the entity behind the
resource. **If there is nowhere for it to go, the handler has found a MISSING slice, not an
exception**: the endpoint is the first consumer of something that should exist on its own.

The tell is length. A handler that reads a request, calls one thing and shapes a response is a
few dozen lines; one that has grown types, constants and helpers is a service that happens to sit
in the routing tree, where no other caller can reach it and no test can exercise it without
invoking a route.

**`src/app/modules/<module>/`** — a **module** is a self-contained business-logic domain (the slice as a whole). The slice owns the page's primary client-side behaviour end-to-end: top-level component (`<module>.module.tsx`), domain logic, module-scoped store/constants/interfaces, and any module-private sub-components under `elements/`. `<module>.module.tsx` is the **entry component** of that domain — typically a `'use client'` component that composes widgets/features, reads from stores, calls TanStack mutations from `entities/api/<api>/`. Modules don't import each other — shared logic lifts down into a feature/widget, shared types into `shared/interfaces/`.

**A module is defined by its attachment to routing.** The routing tree is the only thing allowed to mount one: a `page.tsx`, a `layout.tsx`, an `error.tsx`, a `not-found.tsx`. That attachment is what makes the slice a *business domain* rather than a big component — it is the screen's behaviour, and a screen is a route.

So the test for "may this be a module?" is mechanical: **does a routing file render it?**

- Yes → module.
- No, but two or more modules use it → it was never a module. It is a **widget** (composite UI), a **feature** (one narrow capability), a `shared/components/` primitive, or an `entities/` concern. Move it.
- No, and one module uses it → it belongs *inside* that module, as `elements/<element>/`.

A slice under `modules/` that only other modules import is the worst case: it breaks module isolation *and* claims a layer it does not belong to. `dynamic(() => import('@/app/modules/<other>/<other>.module'))` is that violation — lazy loading changes when the code is fetched, not who is allowed to reach it.

Isolation runs both directions, and the reverse direction is the one that gets missed. Before declaring a module done, ask **who else imports this slice's files** — not just what the slice imports. An `elements/` component that another module renders must be lifted (to `features/`, `widgets/` or `shared/components/`) *now*; leaving it exported is how one module quietly becomes four modules' dependency.

**`src/app/widgets/<widget>/`** — a smaller business entity, or a self-contained complex behaviour, **used by two or more modules**. Composes features/entities behind one component. May be RSC or `'use client'` depending on what it does; default RSC when possible. No routing; no page-level concerns.

**Reuse is the entry ticket, and complexity is not a substitute for it.** A 600-line composite that exactly one module renders stays in that module's `elements/` — it is not "widget-grade" for being big. Conversely, a modest component that three modules render is a widget however small. Two consequences:

- **Promote on the second consumer, not before.** "This will surely be reused" is not a second consumer. Build it in the module; move it out the day a second module needs it (the move is cheap — one folder, one barrel, an import rewrite).
- **Demote when the second consumer disappears.** A widget that ends up with one caller has stopped being shared surface and goes back into that module's `elements/`.

The same reuse test governs `features/`: one narrow capability, reused. A capability used by exactly one slice stays in it.

**`src/app/features/<feature>/`** — single-purpose reusable capability (a countdown timer, a pagination control, a sign-in button). Small surface. If composition of multiple features starts to appear inside a feature, lift the composition up into a widget.

**`src/app/entities/api/<api>/`** — TanStack Query layer for one resource. Three files:
- `<api>.api.ts` — raw async fetchers calling the project's REST client (a `pkg/<rest-api>` integration wrapping `ky` / `axios` / `fetch`). Returns the typed response.
- `<api>.query.ts` — `queryOptions(...)` factories with stable `queryKey`s sourced from that entity's own `E<Entity>Key` enum, plus the thin `use<X>Query` / `use<X>InfiniteQuery` wrapper hooks over them (one place owns the key, the `select` and the `enabled` guard, so no call site re-derives them). No `'use client'` — a `useQuery` wrapper does not need the directive, the consuming component carries it, and the file stays composable into `prefetchQuery` on the server.
- `<api>.mutation.ts` — `'use client'` `useMutation` hooks. Owns optimistic updates and toast/error surface.
The barrel re-exports the hooks/options consumers need; not every internal helper is exported.

**`src/app/entities/models/`** — flat `<entity>.model.ts` files, **one file per entity**, holding everything that describes that entity: its request/response types, and the two enums that address it — `E<Entity>Api` (its endpoint paths) and `E<Entity>Key` (its TanStack query keys). Nothing else runtime: no fetchers, no React, no side effects at module load. Consumed by both the api slice (`<api>.api.ts`) and any layer that needs to type a domain shape.

**Endpoints and query keys stay WITH their entity — do not centralise them.** A single project-wide key enum turns into a file every slice has to edit, makes two unrelated resources conflict in review, and leaves a dangling member behind whenever an entity is deleted. One enum per entity keeps an entity's whole surface — shapes, URLs, cache keys — readable and deletable in one place, and `E<Entity>Key` is still a single owner for that entity's keys, which is what stops call sites re-deriving them.

**`src/app/shared/`** — cross-cutting code organised by **Segment**. Each segment is flat at the top (no sub-slices). Segments in use:
- `components/<component>/` — shared UI components (one folder per component, `<component>.component.tsx` + `index.ts`).
- `hooks/` — `<name>.hook.ts` / `<name>.hook.tsx`.
- `stores/` — global Zustand stores (`<name>.store.ts`).
- `services/` — shared services not tied to one slice (`<name>.service.ts`).
- `utils/` — pure utilities (`<name>.util.ts`), no React, no I/O.
- `constants/` — static values (`<name>.constant.ts`).
- `interfaces/` — global TypeScript types/enums (`<name>.interface.ts`).
- `validation/` — Zod schemas as flat files (`validation.ts`). **Exception to suffix rule** — files are plain `*.ts`, not `*.validation.ts`. See `references/pitfalls.md`.
- `assets/` — icons/images organised by category.
- `systems/<system>/` — cross-cutting SUBSYSTEMS that no role segment fits (see below).

#### `shared/systems/` — when a thing is not one role, but a small architecture

**`systems/` is the FALLBACK home for this layer.** Every other segment above is named for a
ROLE, so a file belongs there only when it IS that role. When a piece of shared code fits none of
them — it is not a component, a hook, a store, a service, a util, a constant, an interface, a
provider or an asset — do not force it into the nearest one and do not leave it loose at the top
of the layer. It goes to `systems/<system>/`. A folder appearing directly under the layer root,
beside the role segments, is the smell this rule exists to prevent.

Every other segment is a ROLE folder: its members are independent files that happen to
share a suffix. Some shared code is not shaped like that. It is ONE subject with INTERNAL
STRUCTURE — its own elements, its own services, sometimes its own client/server split — and
splitting it across `hooks/` + `services/` + `interfaces/` would scatter one thing into three
places and destroy the boundary that makes it comprehensible. Typical shapes: a wire/protocol
layer, a rendering registry others plug views into, a flag/experiment subsystem, a runtime whose
client and server halves must not be merged.

Put each one at `shared/systems/<system>/`. **A system is a UNIT**: it publishes an `index.ts`,
it is CLOSED, and outsiders enter through that barrel (heavy internals behind async accessors, per
"A slice is a CLOSED unit"). **`systems/` itself is a grouping folder** and never carries a barrel.

Choosing between the three homes it could plausibly go to:

| The thing is | Home |
|---|---|
| one file of a known role, reused across slices | that role segment (`hooks/`, `utils/`, `stores/`, …) |
| several independent members sharing only a suffix | that role segment — a folder of them, **no barrel** |
| one subject with internals, specific to this application | `shared/systems/<system>/` |
| one subject with internals, framework-agnostic and liftable into another project as-is | `pkg/<name>/` |

The last row is the line that actually decides it: if the folder would work unchanged in a
different product, it is a `pkg/`, not a system. A system knows about this application.

**When a folder is ambiguous, its CALL SITES settle it — measure, do not eyeball.** A plural
folder name and a shared file suffix look like a role segment even when the thing is one subject,
so read how consumers actually import it:

| Traffic pattern | What it means |
|---|---|
| most call sites take SEVERAL members in one import | one surface → a system, keep the barrel |
| most call sites take ONE member, and by path, bypassing the barrel | a bag → a role segment, delete the barrel |

The second row is the same "consumers dodge the barrel" tell from "Folder discipline", read
quantitatively. Counting takes one command and beats an opinion: a folder whose members are used
together is a unit however plural its name is, and a folder nobody imports as a whole is a
grouping however tidy its suffix.

**Do not name this folder `core/` or `lib/`.** `core` reads as "the essential centre", so a
newcomer looking for the application's heart finds a transport layer and a flag client instead —
and because anything can be argued to be core, everything eventually drifts in. `lib` collides
with whatever the project already calls its liftable-integration folder; two vague words next to
each other cannot be told apart.

**`src/config/`** — application configuration.
- `env/env.client.ts` and `env/env.server.ts` — `@t3-oss/env-nextjs` `createEnv(...)` with Zod over `process.env`. Export `envClient` / `envServer`. Every public env var must be in the `client.*` schema; every server-only var in `server.*`.
- `fonts/font.ts` — `next/font` declarations exported as named consts (`fontPrimary`, …).
- `styles/globals.css` — global CSS, imported once from the root layout.

**`src/pkg/`** — external-system clients and framework-level utilities. Each subfolder is self-contained and stays liftable as one folder. **Liftability comes from having no outward dependencies, NOT from an `index.ts`** — a slot gets a barrel only when it has a surface decision to record, and a slot that is a flat bag of independent members gets none. Reading "a slot is a unit, so it has a barrel" is the single most common way a leftover barrel survives every audit. A project may keep `pkg/` flat (`pkg/<name>/`) or group related integrations under a parent (`pkg/<group>/<name>/` — e.g. `pkg/lib/`, `pkg/integrations/`, `pkg/theme/`). Typical slots a Next.js client tends to need: auth client/middleware, REST API client (ky/axios/fetch wrapper), i18n routing config (if i18n is in scope), shadcn/Tailwind theme primitives, analytics adapter, payment SDK adapter. Read configuration from `envClient` / `envServer` — never `process.env` directly.

#### A `pkg` slot is a CLOSED unit — and it may split along a real BOUNDARY

A slot is entered through `pkg/<slot>/index.ts`. Reaching past it at a member file is the
same violation as deep-importing a slice, and it is what erodes the slot's liftability:
the moment consumers depend on internal paths, moving a file inside the slot becomes a
breaking change to the whole application.

**Unless the slot is TOOL-OWNED.** A slot whose contents a CLI writes and updates publishes
its entry points through that CLI's config, and those paths are the boundary — deep imports
following them are correct, and a hand-written barrel over them is the violation (rule 13).

**A barrel records a SURFACE DECISION. A folder being a unit is not one.** Exactly two things
earn an `index.ts`, here and everywhere else:

1. the folder's files are **ROLES of one subject** (rule 5) — the barrel is that subject's face;
2. the folder holds members a consumer **must not reach by default** — the barrel names the safe
   surface and omits the rest, saying why.

A folder whose members are independent AND all equally reachable records no decision at all. It
is a GROUP: its members are imported by path and it takes no barrel — the same answer a role
segment already gets. That a folder is the unit you LIFT does not change this; what makes a slot
liftable is having no outward dependencies (rule 7), not having an `index.ts`. A barrel over a
flat bag of independent members buys nothing and costs one module edge per member.

**Measure before deciding, because this is exactly where intent and reality diverge:**

| Count | What it means |
|---|---|
| the barrel has NO importers | it is not a public face, it is a leftover — usually publishing whatever its first author happened to need |
| consumers overwhelmingly import MEMBERS by path | the folder has already told you it is a group; delete the barrel rather than herd the callers |
| consumers import the barrel and take several symbols at once | a real surface — keep it, and keep it NAMED |

> **This never reaches a SLICE.** A slice under `modules/`, `widgets/` or `features/`, a
> `shared/components/<component>/`, a `shared/systems/<system>/` and an `entities/api/<api>/` are
> each **one subject by definition** — the folder is named for the thing it is, and its files are
> that thing's roles. They fall under case 1, so their barrel is always earned and a slice stays
> CLOSED: outsiders enter it and nowhere else. Never read "measure the importers" as a licence to
> open a slice; a slice with few importers is a slice with few consumers, not a group. The rule
> bites only where a folder is NOT a slice — a `pkg` slot that turned out to be a flat bag, or a
> grouping folder that grew an `index.ts` it never earned.

The barrel cannot publish everything, because a slot's members do not always belong to the
same GRAPH. A barrel re-exports every symbol it names as one module edge, so naming the
heaviest member there makes every consumer of the lightest one carry it — and where that
member's dependency cannot resolve, the build breaks in that environment rather than at the
import.

**ONE barrel per slot, and it NAMES its public surface.** There is no second barrel anywhere
inside a slot — not on a role folder, not on a folder that isolates a graph. The surface is a
list of named re-exports (`export *` is not a public face: it hides what the slot publishes,
widens that surface silently whenever a member gains an export, and turns a collision between
two members into a compile error instead of a decision).

**A boundary is expressed by OMISSION, not by another barrel.** Leave the heavy member out of
the list. It is then reached by its own path — and that is the one legal member path, precisely
because the barrel declared it out of scope:

```
pkg/<slot>/
  index.ts                      # names the shared surface; says what it omits and why
  <name>.<suffix>.ts            # named -> consumers import `pkg/<slot>`
  <boundary>/
    <name>.<suffix>.ts          # NOT named -> consumers import `pkg/<slot>/<boundary>/<name>.<suffix>`
```

This is what keeps the two rules from contradicting each other. "Enter through the barrel"
governs the slot's PUBLISHED surface; a member the barrel deliberately does not publish is not
part of that surface, so reaching it by path is not a bypass. A sub-barrel would only re-create
the problem one level down — it groups independent members (rule 5) and hands every consumer of
one of them all the others.

**Group the omitted members by what must not travel with what**, and name the folder for that:
a runtime, a platform, a vendor SDK, a credentialed surface, a heavy data set. `client/` and
`server/` are the common case, not the rule — do not force a real boundary into those two words,
and do not invent one for members that share a graph happily.

**Say in a comment at the top of `index.ts` what is omitted and why**, naming each folder and the
mechanism. Otherwise the next person "fixes" the missing re-export and
reintroduces the break — this omission looks like an oversight and is not one.

#### Deciding a slot's internal shape — three measurements, in order

Folder names lie. A folder named after a vendor, a runtime or a layer records what someone
INTENDED, not what the code does, so shaping a slot by reading its tree reproduces the previous
author's guess. Three measurements settle it, and the order matters — each one can invalidate the
answer the next would give.

**1. Edges between the candidates — settles SLOT vs GROUP.**
Count imports in BOTH directions between every pair of candidate folders. A pair with edges both
ways is ONE slot, not two: a group holds independent slots (rule 7), so splitting a cycle across
two of them re-creates the very violation the split was meant to fix. Fold the pair and the cycle
becomes intra-slot, which is legal — a slot is one unit and may be internally entangled.

> Resolve the specifier before counting, and match the BARREL form as well as the path form. A
> pattern that requires a trailing separator silently misses `from '<folder>'` and reports a
> cycle as clean.

**2. What each folder actually pulls at module load — settles BOUNDARY vs role folder.**
Read the non-relative imports of every file in the folder. A folder earns a boundary barrel only
when its graph is one a consumer must be able to avoid: an SDK, credentials, a native module, a
large data set. A folder named for a heavyweight thing that in fact imports only small helpers is
NOT a boundary — it is a role folder, and it collapses into one.

> Distrust the comments while doing this. A barrel that claims to isolate a vendor SDK, sitting in
> a folder that imports no SDK, is a claim nobody re-measured after the code moved.

**3. Runtime exclusivity of each MEMBER — settles WHERE the boundary runs.**
Mark every member that carries the framework's client directive, touches browser globals, or reads
server-only credentials. The boundary follows those marks, not the folder tree. Members scattered
across three vendor folders that all touch browser globals are ONE boundary, and the vendor
folders were never the axis — they were a taxonomy of suppliers, which is not a graph constraint.

**A one-file boundary needs no folder.** "Count the files" still holds. A single omitted member
simply sits at the slot root, unnamed by the barrel, and is reached by its own path. Build the
folder only once several members share the constraint — and look for them before concluding there
is one, because they are usually there, filed under some other taxonomy.

**Implementation inside an `index.ts` is a barrel doing two jobs.** Move the implementation into a
role file; the barrel then either re-exports it or disappears with the folder.

Two traps:

- **Type-only re-exports are erased; value re-exports are not.** A folder that publishes
  only types is safe to re-export from the slot barrel however exotic its dependency,
  because the import disappears at build. One runtime VALUE in that folder changes the
  answer. Check what the folder exports, not what it is named.
- **A boundary folder is not a role folder** — it groups by *what must not travel with what*,
  not by what a file is. Neither carries a barrel; the difference is only that the slot barrel
  names a role folder's members and omits a boundary folder's. Do not invent a boundary folder
  for members that share a graph anyway.

**`src/middleware.ts`** — Next.js edge middleware lives at the **root of `src/`**, not under `app/`. One file. Composes locale routing, auth gates, session cookies, request-header rewrites. May read from `config/env/` and the relevant `pkg/<auth>/` (and other `pkg/` slots), but should not pull from modules/widgets/features.

> Detailed decision trees and isolation rules at the Layer/Slice/Segment levels (which layer, new slice vs extend, which segment, what each may import) live in `references/structure.md`.

## File naming (suffix = role)

| Suffix | Role | Layer |
|---|---|---|
| `*.module.tsx` | Module entry component | `modules/` |
| `*.component.tsx` | React component | widgets, features, shared/components, modules/elements |
| `*.service.ts` | Logic helpers (no React) | modules, widgets, features, shared/services, pkg |
| `*.store.ts` | Zustand store | modules, widgets, shared/stores |
| `*.hook.ts` / `*.hook.tsx` | Custom hook | shared/hooks |
| `*.api.ts` | Raw fetcher | `entities/api/<api>/` |
| `*.query.ts` | TanStack `queryOptions` + `useQuery` wrapper hooks | `entities/api/<api>/` |
| `*.mutation.ts` | TanStack `useMutation` hook | `entities/api/<api>/` |
| `*.model.ts` | Domain types + that entity's `E<Entity>Api` / `E<Entity>Key` enums | `entities/models/` |
| `*.interface.ts` | TypeScript types/enums | modules, widgets, features, shared/interfaces |
| `*.constant.ts` | Static values | modules, widgets, features, shared/constants |
| `*.util.ts` | Pure utility | shared/utils, pkg/util |
| `*.pkg.ts` | Public surface of a `pkg/` slot | `pkg/<name>/` |
| `page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` | Next.js conventions | `app/(web)/` |
| `route.ts` / `route.tsx` | Next.js route handler | `app/(api)/api/` |
| `middleware.ts` | Next.js edge middleware | `src/` root |

**`shared/validation/validation.ts`** is the documented exception: flat `*.ts`, not `*.validation.ts`.

### A slice is a CLOSED unit — and how to publish a heavy internal

Every slice in `modules/`, `widgets/` and `features/` is one closed unit. Its `elements/`,
its role folders and its root role files are INTERNAL. Code outside the slice folder enters
through `index.ts` and nowhere else — `<layer>/<slice>/elements/<x>` from outside is a
violation even when the target is exactly the file you want, and even when the import is
lazy.

If an internal is genuinely meant to be usable from outside, **re-export it from the
barrel**. Widening the barrel is the legal move; letting the consumer path around it is not.
(For a module the answer is different — a module publishes only its module component, so an
internal that outsiders need is a signal to lift it down a layer, see below.)

**The heavy-internal problem.** A static re-export makes the internal an EDGE of the barrel
module: import any one symbol and the whole re-exported set joins your graph. Tree shaking
does not reliably undo this, because bundlers group shared modules into chunks. In a slice
with a large UI surface this is measurable in tens of kilobytes, and the symptom is
consumers deep-importing *past* the barrel to dodge it.

Publish the heavy internal through an **async accessor exported by the barrel**:

```ts
// <slice>/index.ts — light members statically, heavy ones behind an accessor
export { use<X>Store } from './<x>.store'
export type { I<X> } from './<x>.interface'

export const load<Heavy> = () => import('./elements/<heavy>/<heavy>.component').then((m) => m.<Heavy>Component)
```

```ts
// consumer — still names ONLY the barrel, and still gets a lazy chunk
const <Heavy>Component = dynamic(() => load<Heavy>(), { ssr: false })
```

The boundary holds (the consumer never names an internal path) and the chunk stays split.

**Which members go which way.** "Heavy" is the wrong test on its own — a heavy member every
consumer renders on first paint gains nothing from an accessor, and a light one that only one
page renders still costs every other page if it is static. Decide by the CONSUMER:

| Publish STATICALLY when | Publish behind an ACCESSOR when |
|---|---|
| it is a hook — a hook cannot be lazy | only some consumers render it |
| a synchronous surface renders it (a route's loading state, an error boundary's fallback) | the consumer already wraps it in a lazy boundary today |
| every consumer paints it immediately (the shell chrome) | it is a modal, a panel or a page view that is closed or unvisited on first paint |

**The decisive question is who imports the barrel.** If a LAYOUT — anything mounted above many
pages — imports one symbol from a slice, every page under that layout inherits everything the
barrel names statically. When that is the case, keep static exports down to what the layout
itself needs and publish the rest as accessors, however small they look.

**A server component may use the framework's lazy helper, but not its `ssr: false` option** — the
component has to render on the server. Client consumers can disable SSR; server ones pass the
accessor through the plain lazy form. The accessor itself is identical for both.

Two traps here:

- **A framework `dynamic()` helper placed inside the barrel does not preserve laziness.**
  Some bundler/framework combinations compile it into a static import in the host chunk, so
  the internal becomes an edge again. A bare `() => import('…')` is what stays dynamic.
  Verify on the BUILT output, not by reading the source.
- **Measure the number your users pay.** A server/worker bundle total counts every emitted
  chunk whether or not it is reachable; that is a deploy-budget figure. For user cost, take
  the rendered HTML of a real page, collect its preloaded/scripted assets, and sum them
  compressed.

**Before reaching for an accessor, check whether the consumer needs the SURFACE at all.** What
usually couples a light trigger to a heavy surface is state: a button imports a modal only to
flip its `isOpen`. Put that state one layer below both — in the shared state segment, not inside
the surface's own slice — and the trigger's edge disappears instead of merely becoming lazy. The
surface subscribes to the same state and mounts itself. An accessor defers a dependency; this
removes it, so prefer it whenever the consumer's only interest is state.

If a slice cannot be closed behind one barrel without dragging its whole graph into every
consumer, that is not a barrel problem — the slice is in the wrong layer. It is a library,
not a feature: split it, push the shared data layer down, and keep the UI unit that is
actually reused.

### The module barrel exports one symbol

A module slice's `index.ts` is one line:

```ts
export { default as <X>Module } from './<x>.module'
```

That is the whole file. A module is **closed** business logic — its store, service, hooks,
utils, interfaces, constants and `elements/` are internal, and the only consumer a module
may have is a routing file, which needs exactly one thing: the component to render.

Anything else in that barrel is a design error announcing itself:

| The barrel exports | What it actually means |
|---|---|
| a store / service / hook | another slice reads this module's state → lift it to `shared/stores`, `shared/services` or a feature |
| a type / interface | a cross-slice shape → `shared/interfaces/` (cross-cutting) or `entities/models/` (domain) |
| an `elements/*` component | that element is reused → lift it to `features/`, `widgets/` or `shared/components/` |
| a second `*.module.tsx` | two DOMAINS share one folder → two slices, one per routing surface. Two VARIATIONS of one domain → one module that selects them (next section) |

Fixing the export by widening the barrel is backwards; the export is the *symptom*. Lift the
symbol down a layer and the barrel returns to one line by itself.

Two spellings of the same violation to watch for, because neither shows up in a barrel diff:

- a **deep import** from outside — `@/app/modules/<x>/<x>.store`, `…/elements/<e>/<e>.component`;
- a **lazy** deep import — `dynamic(() => import('@/app/modules/<x>/<x>.module'))`, `import('@/app/modules/<x>').then(m => m.XModule)`.

Both reach a module from somewhere that is not the routing tree. Whether the bundler splits
the chunk is irrelevant to the layering.

#### One domain, two variations — still ONE module

Signed-in vs anonymous, locked vs unlocked, embedded vs standalone: these are **variations of one
domain**, not two domains. They stay in ONE slice with one `<module>.module.tsx`, and the variant is
chosen inside it. Two slices would be wrong twice over — the domain gets duplicated, and every piece
the variations SHARE starts to look like a two-module dependency, so the "lift it out of the module"
rule fires on code that belongs to this module alone.

The shape that holds, and that keeps each variation's code out of the other's bundle:

- `<module>.module.tsx` is an **async server component**: it reads whatever decides the variant
  (session, entitlement, embed flag) and renders exactly ONE
  `elements/<variant>/<variant>.component.tsx`;
- each variation is its own **client** component, so only the rendered one is referenced by the
  server payload the browser receives;
- anything both variations use lives in `elements/` beside them — which is the whole reason they
  belong in one slice.

Do NOT make the module a client component that branches on a prop: it then statically imports every
variation and ships all of their graphs to every visitor. After building, confirm the separation by
grepping one variation's emitted chunk for a symbol only another variation can produce — it must not
be there, and the same grep must find that symbol in the chunk that does own it.

The test for "variation or second domain?": a variation answers the SAME user intent for a different
audience or entitlement. A different intent is a different domain, and it gets its own slice.

### Segments inside a module slice

A module slice groups its own files into segments once they multiply — the same folders
the layer above uses, scoped to the slice:

```
modules/<module>/
  <module>.module.tsx        <module>.store.ts   <module>.interface.ts
  elements/<element>/        # module-private sub-components
  hooks/                     # module-private hooks
  utils/                     # module-private pure helpers
  tests/                     # suites for the files at the slice ROOT
```

Each of `elements/<element>/`, `hooks/` and `utils/` ships an `index.ts` — they are
segment folders that directly contain implementation files. `tests/` does not (nothing
imports a test). Files stay at the slice root until a group is large enough to read as a
group; a lone hook does not earn a `hooks/` folder, five do.

#### The second file of a role earns that role a folder

The threshold is exact, not a judgement call: **one file of a role stays at the slice
root; the moment there are two or more, they move into a folder named after the role.**
The folder is **plural** — `services/`, `interfaces/`, `stores/`, `constants/`, `hooks/`,
`utils/` — matching the segment names the `shared/` layer already uses.

**None of these folders ships a barrel.** They group members that are independent of one
another — two services in one slice solve two different problems — so an `index.ts` there
would be a grouping barrel (rule 5): every consumer of one member would take on all of them.
Consumers import the member by path, inside and outside the slice alike.

This also removes the cycle hazard a group barrel introduces. A store that imports one service
while another service imports the store back stays two one-way edges; routed through a shared
barrel it would become one cycle.

```
modules/<module>/                        modules/<module>/
  <module>.module.tsx                      <module>.module.tsx
  <module>.service.ts        →  2nd →      services/
  <module>.interface.ts                      <module>.service.ts
                                             <module>-<concern>.service.ts
                                             index.ts
                                           <module>.interface.ts   # still ONE — stays
```

This is what keeps a large slice readable: a root listing should show the slice's shape
(module, store, and the role folders), not thirty peers. Do NOT invent a folder for a role
that has one file — `service/` holding a single `x.service.ts` is noise.

A file whose role already has a folder goes straight into it; never leave a sibling at the
root "for now".

**Never double the name.** When the container those files already sit in IS the role — a `pkg`
slot called after the role, a segment already named for it — the role folder EXISTS and its
members stay at its root. `<role>/<role>/` is never the answer: the rule creates the role folder
one level down, it does not create a second one with the same name. If that container holds
members of a DIFFERENT role too, those are the ones that move out (or the container was misnamed).

**A role folder that would swallow its whole parent groups nothing.** The rule exists to separate
one role from the others around it. When every file in a folder shares the same role, there is
nothing to separate them FROM: the parent already is that group, and adding the folder produces a
directory whose only child is another directory. Leave the files where they are. The threshold is
"two or more of a role **beside members of other roles**", not "two or more" in the absolute — the
same reasoning as name doubling, one step further out.

#### The cap's one carve-out — an INDIVISIBLE file

"This file is hard to split" is not the carve-out; almost every oversized file is hard to split,
which is why it got oversized. The carve-out is narrower: a file may exceed the cap when it is
**one indivisible thing** — a single data table, a single exhaustive union, a single literal that
the domain defines as one — so that any cut would be arbitrary.

The test is mechanical, and it is about the PIECES, not the whole:

> Would each piece have a name of its own, and at least one consumer that wants only that piece?

- **Yes → split it.** The architecture can divide this file, so the cap applies with no argument.
  A second role hiding inside it, an extractable sub-component, a group that already has a name in
  the domain — all of these are ordinary splits, and size is what makes them overdue.
- **No → carve-out.** Every piece would be a fragment nobody imports alone, and every consumer
  would immediately re-import all of them; splitting would add files and subtract meaning.

Two consequences. A file with a THOUSAND entries of one shape is a candidate; a file with a
thousand lines of several shapes is not — it is several files. And a carve-out is recorded where
the project fences known debt, with the reason it is indivisible, so it is re-examined rather
than inherited: the day the domain gives one part of it a name, the carve-out has expired.

#### A name a dependency imposes wins

A library sometimes owns a name the project would otherwise pick: it resolves a module by its
PATH, or it augments a module with a type of its own spelling, or a build alias points at a fixed
file. Where that is true, the dependency's name wins over the naming rules on this page — the
role suffix, the symbol prefix, the folder convention all yield.

This is not an exemption a file earns for being awkward. The test is destructive: **renaming it
must actually break resolution or type augmentation.** If the rename merely looks unfamiliar, or
"matches the library's docs", the rule applies as normal and the file gets renamed.

Where the constraint holds, note it in a comment at the top of the file, naming the dependency and
what breaks. Otherwise the next reader — or the next repo-wide sweep — "fixes" it.

#### Suffix or folder — count the files

The same question comes up for every axis a slice can be cut along: a runtime, a platform, a
vendor, a variant. One answer covers all of them:

| The variant is | Express it as |
|---|---|
| ONE file | a **suffix** on that file — `<name>.<variant>.<role>.ts` |
| SEVERAL files — an entry plus the sub-services, interfaces and constants it composes | a **folder** named for the variant, publishing them through one barrel |

A folder holding a single file is noise, and a suffix repeated across five files is a folder
waiting to be written. Nothing about the axis changes the answer — count the files.

#### A named segment folder is where that role's files live — including one that arrived early

`transport/`, `service/`, `hooks/` and the rest are the address for their role. If a file
belongs to a segment that already exists, it lives inside it, whatever the git history says
— e.g. a `<x>-transport.ts` façade belongs in `transport/` beside the connection, stream and
reducer files it fronts, not at the slice root next to the store.
The test for "does it belong": would a reader looking for this file open that folder first?

#### Placing a subsystem that has no UI: feature, not `pkg/`

A cohesive subsystem sitting inside a module (a wire layer, a sync engine) is often a SLICE in
its own right rather than a folder of that module. Two tests decide where, in this order:

1. **Does it render anything?** No `.tsx`, no component → it is **not a widget**. Widgets are UI.
2. **Does it import `app/*`?** A `pkg/*` slot may not (hard rule 7). If it reaches for
   `shared/utils`, a shared service, a shared constant — `pkg/` is closed to it, and the answer
   is **`features/<name>/`**.

Only a subsystem that depends on nothing above `config/` + other externals can be a `pkg/`
slot. Do not "fix" that by inverting six shared imports just to reach `pkg/`; a feature that
uses `shared/` is correct FSD, not a compromise.

Moving it out is blocked by any **upward** import it holds (`app/module/*`). Those invert first —
and when the subsystem already injects its dependencies (an options object of getters, a writer
interface), the inversion is just adding another getter, not a redesign. Check for that pattern
before designing anything.

#### `model/` is not a segment — flatten it

An `x.types.ts` / `x.constants.ts` pair tucked under `model/` is the old pattern. Files
named by their ROLE do not need a folder that repeats the role, so `model/` flattens into
the slice root with the suffixes corrected:

| was | becomes |
|---|---|
| `model/x.types.ts` | `x.interface.ts` |
| `model/x.constants.ts` | `x.constant.ts` |
| `model/x.store.ts` | `x.store.ts` (moves, name already right) |

Once flattened, the "second file earns a folder" rule above applies normally.

#### Persistent state is a store, not a hand-rolled storage module

Anything that holds state across renders or reloads is a **`*.store.ts` built on the
project's state library** (with its persistence middleware for the durable part) — not a file
of `localStorage.getItem` / `setItem` helpers with a `.storage.ts` suffix. A store gets
devtools, a single storage key, typed actions and a testable surface; hand-rolled helpers
get none of that and drift into per-call `JSON.parse`.

Keyed-by-id records belong in the store as a map (`<record>ById: Record<string, I<Record>>`),
not as N separate `<prefix>:<id>` keys. When replacing an existing per-key scheme, fold the
old keys in once on rehydration and delete them — never ship a change that silently drops
user data.

Reserve `*.storage.ts` for a thin wrapper over a browser storage API that holds NO state of
its own (a one-shot handoff slot read once and cleared, say).

### Tests live in ONE `tests/` folder per slice

A slice has exactly one `tests/` folder, at its root — never a second one nested inside a
segment. Every suite for that slice lives there, named `<subject-file>.test.ts`, and
reaches its subject by path:

```
modules/<module>/
  <module>.store.ts
  hooks/use-<hook>.hook.ts
  transport/<x>-reducer.service.ts
  elements/<element>/<element>.service.ts
  tests/
    <module>.store.<case>.test.ts       # imports '../<module>.store'
    <x>-reducer.test.ts                 # imports '../transport/<x>-reducer.service'
    <element>.service.test.ts           # imports '../elements/<element>/…'
```

Add a middle segment when one subject needs several focused suites
(`<subject>.<case-a>.test.ts`, `<subject>.<case-b>.test.ts`).

**Two rules, two different reasons:**

1. **Inside the slice** — a slice is barrel-only to CONSUMERS, but most files worth unit
   testing are slice-internal and deliberately absent from `index.ts`. A test outside the
   slice could reach them only by breaking that barrel rule, or by forcing internals to be
   re-exported publicly for no product reason. A test in the slice's own `tests/` folder
   importing `../transport/x` is not a violation — it is the slice testing itself. A
   root-level `tests/` mirror would also duplicate the whole layer hierarchy and drift the
   moment a slice is renamed.
2. **ONE folder, not one per segment** — every suite for a slice is findable in a single
   place. Scattering `tests/` through `transport/`, `elements/<x>/` and the root means
   answering "what covers this module?" requires walking the tree.

`tests/` takes **no `index.ts`** — the barrel rule covers folders of implementation files,
and nothing ever imports a test.

Keep the runner's glob matching this; `src/**/*.{test,spec}.{ts,tsx}` already does.
Cross-layer, end-to-end or fixture-heavy suites belonging to NO single slice are the one
case for a root-level folder; nothing that belongs to a slice goes there.

## Symbol naming

- **TypeScript interfaces**: prefix `I<Name>` (`IProps`, `I<Api>Body`, `I<Api>Res`).
- **Enums**: prefix `E<Name>` (`E<Domain>Step`, `E<Domain>Route`, `E<Entity>Key`).
- **Plain constants** in `*.constant.ts`: `UPPER_SNAKE_CASE` for static values and dictionaries; helper functions in the same file stay `camelCase`.
- **React components**: PascalCase identifier, suffix `Component` / `Module` matching the file (`<Module>Module`, `<Widget>Component`, `<Feature>Component`). Props pattern is `FC<Readonly<IProps>>`, destructure inside the body.
- **Zustand stores**: `use<Name>Store` exported from `<name>.store.ts`.
- **TanStack hooks**: `use<Name>Mutation` for mutations exported from `<api>.mutation.ts`; `<name>QueryOptions` for query option factories exported from `<api>.query.ts`.
- **Module/component default export**: file ends with `export default <Name>Module` (or `Component`); the barrel re-exports as a named export — `export { default as <Name>Module } from './<name>.module'`.
- **Query keys**: source from the entity's own `E<Entity>Key` enum in `entities/models/<entity>.model.ts` — one owner per entity, never one enum for the whole project.

## Mode A — Bootstrap a new Next.js client

Follow `references/bootstrap.md` step-by-step. It covers `create-next-app`, `package.json` scripts, `tsconfig.json` (`@/*` path alias to `src/*`), `eslint.config.mjs`, Prettier (single quotes, no semis, 120 cols, trailing commas), Tailwind v4 setup, `next-intl` `[locale]` routing, `@t3-oss/env-nextjs` env validation, the first `(web)` route, the first module, the first `entities/api/` slice, and `middleware.ts`.

## Mode B — Add a Slice to an existing project

Pick the Layer the new code belongs to (top-down: `(web)`/`(api)` → modules → widgets → features → entities → shared). Pull complexity *down* the stack: when a module's logic is reused by another module, lift the shared part into a feature or widget; when types appear in 3+ layers, lift them into `shared/interfaces/`.

### B1. New module
0. **Name the routing file that will mount it** — the `page.tsx` / `layout.tsx` / `error.tsx` / `not-found.tsx`. If you cannot, stop: this is not a module (hard rule 2). Pick a widget, feature, shared component or entity instead.
1. Create `src/app/modules/<module>/{<module>.module.tsx, index.ts}`. Add optional `<module>.service.ts`, `<module>.store.ts`, `<module>.interface.ts`, `<module>.constant.ts` as needed.
2. Place module-private sub-components under `src/app/modules/<module>/elements/<element>/<element>.component.tsx` with their own `index.ts`.
3. Re-export `<Module>Module` from the slice barrel — that single line is the whole barrel: `export { default as <Module>Module } from './<module>.module'`.
4. Mount from the routing file named in step 0 (typically inside `<HydrationBoundary>` if SSR-prefetching from `entities/api/<api>/`).
5. `'use client'` only on the `<module>.module.tsx` file itself when client-side state/effects are needed; keep the page that hosts it as RSC.
6. **Reverse-check isolation**: `grep -rn "modules/<module>" src | grep -v "^src/app/modules/<module>/"` — the only hits allowed are the routing file's. Anything else (another module, a widget, a lazy `import()`) means a symbol must be lifted out of the slice.

### B2. New widget / feature
0. **Name the two modules that will use it.** One module → it belongs in that module's `elements/` (hard rule 4), not here. A feature likewise needs a real second consumer.
1. Create `src/app/widgets/<widget>/` or `src/app/features/<feature>/` with `<name>.component.tsx`, optional `*.service.ts` / `*.interface.ts` / `*.constant.ts`, and `index.ts`.
2. Compose from layers below (entities, shared). Do not call modules. Do not import another widget from a feature.
3. Add `'use client'` only when the component itself uses client-only APIs.

### B3. New entity (api and/or model)
1. Model: `src/app/entities/models/<entity>.model.ts` exporting `I*` interfaces and `E*` enums. No barrel — `models/` groups independent entities, so consumers import `<entity>.model` by path.
2. Api slice: `src/app/entities/api/<api>/` with `<api>.api.ts`, `<api>.query.ts`, `<api>.mutation.ts`, `index.ts`. Add the `queryKey` member to that entity's `E<Entity>Key` enum in `entities/models/<entity>.model.ts`, beside its `E<Entity>Api` endpoints.
3. The mutation file declares `'use client'` at the top; the api and query files do not (they must remain composable on the server for `prefetchQuery`).

### B4. New shared segment file
1. Pick the segment: `components/`, `hooks/`, `stores/`, `services/`, `utils/`, `constants/`, `interfaces/`, `validation/`, or `assets/`.
2. Use the matching suffix (`*.component.tsx`, `*.hook.ts(x)`, `*.store.ts`, `*.service.ts`, `*.util.ts`, `*.constant.ts`, `*.interface.ts`). `validation/` is the exception — files are plain `*.ts`.
3. Re-export from the segment's `index.ts`. For `components/`, the inner folder also ships its own barrel.

### B5. New `pkg/` integration
1. New folder `src/pkg/<name>/` with at least one `<name>.<suffix>.ts` file, plus an `index.ts` ONLY if there is a surface to name (`.service.ts`, `.provider.tsx`, `.pkg.ts`, etc.). For larger integrations split into `service`, `provider`, `constants` files.
2. Read configuration from `envClient` / `envServer`. Do not touch `process.env` directly.
3. **Pkg self-containment**: never import from `app/*` or from another `pkg/*`. If two pkg slots need the same helper, duplicate it as a private file inside each pkg.
4. **Sort members by graph.** Anything that only resolves in one runtime, or drags an SDK, credentials or a heavy data set, goes in a folder named for that boundary; members every consumer can afford stay at the slot root. The boundary folder carries NO barrel — the slot has exactly one.
5. **Write the slot barrel as a list of NAMED re-exports, and omit the boundary folders.** Never `export *`. Comment at the top of `index.ts` saying which folders are omitted and why, or the omission reads as an oversight and gets "fixed". An omitted member is reached by its own path; that is not a bypass, because the barrel declared it out of surface.

### B6. New `(web)` route or `(api)` route handler
1. **`(web)` route**: add `src/app/(web)/[locale]/<…group>/<route>/page.tsx` (and optional `layout.tsx`/`loading.tsx`/`error.tsx`). Keep the page thin: read params, optionally `prefetchQuery` from `entities/api/<api>`, render a `<…>Module`. Use `(public)` / `(private)` route groups to scope shared layout/middleware behaviour without affecting URL.
2. **`(api)` route handler**: add `src/app/(api)/api/<route>/route.ts` exporting `GET` / `POST` / etc. Pull env from `config/env/`. Validate input. For multi-method passthroughs, factor a `handler` function and assign it to each verb.
3. If middleware behaviour changes (new private path, new redirect rule), update `src/middleware.ts` accordingly — keep all gating in that one file.

## Comments

Short label-style `//` comments sit above named symbols and expand on the identifier in 1–5 words. Pages use `// page`, layouts use `// layout`, route handlers use `// VERB /path` shorthand, mutations use `// <action>` (e.g. `// create payment session hook`). Full convention, examples, and anti-patterns live in `references/comments.md`.

## Examples

Canonical file shapes for every layer live in `examples/`. The tree mirrors the canonical `src/` layout, so `cp -r examples/* <project>/src/` (with placeholder substitution) yields a working skeleton for a new project. Use the relevant subtree for incremental refactors of an existing project.

**Placeholder conventions:**
- **Identifiers** inside files use angle-bracket notation: `<module>`, `<widget>`, `<feature>`, `<api>`, `<entity>`, `<Module>`, `<Component>`, `I<Name>`, `E<Name>`, `use<Name>Store`. Replace every `<…>` before saving in a real project.
- **File and folder names** with placeholders use double-underscore notation: `__module__/`, `__widget__.component.tsx`, `__api__.query.ts`. Rename to the real slice name when copying.
- Files are **shape references, not runnable code** — angle-bracket identifiers are invalid TypeScript. The contract is structural: imports, layer dependencies, function signatures, return shapes, comment style.

**Multiplicity:**
The example tree shows **one** of each placeholder file. Real projects will have many: many `<module>/` folders under `app/modules/`, many `<widget>/` and `<feature>/` slices, many `<api>/` slices under `app/entities/api/`, many `<entity>.model.ts` files. Treat each example as the *template for one*, then duplicate per concrete name.

## Self-verification

Two of these rules are invisible to a type-checker, a linter and a bundler, so they regress
silently. `scripts/` ships zero-dependency checkers for both; copy the folder into a project and
run them from a test or from CI:

```
node scripts/check-layer-imports.mjs --root src/app --allow <lower>\><higher>=<n>
node scripts/check-barrels.mjs --root src --ignore <tool-owned-path>,<tool-owned-path>
```

`--ignore` takes the project's tool-owned list (rule 13) — the same list, from the same shared
constant, for every checker and every metric. A figure quoted before that exclusion is applied
is not a debt figure.

Each also exports a function (`checkLayerImports`, `checkBarrels`) with a `.d.mts` beside it, so a
TypeScript test can consume it directly and pin a known debt to a CEILING that may only shrink.
Both resolve alias and relative specifiers to absolute paths before comparing — a grep for one
spelling misses the other — and both count side-effect imports.

The barrel checker's bypass report aggregates by BOUNDARY on purpose: a high count against one
folder is the diagnosis (it is a grouping barrel, delete it), a low count is the opposite (route
those few imports through the barrel).

After adding or changing a slice, self-verify against `spec/`:
1. **`spec/invariants.spec.md`** — global structural invariants (barrels, import direction, `pkg` self-containment, server/client boundary, env, naming, code style, layer purity).
2. **`spec/per-action.spec.md`** — the block matching what you did (`+module`, `+widget/feature`, `+entity`, `+shared`, `+pkg`, `+route`, `bootstrap`).

Each spec item is a `MUST` / `MUST NOT` with a **Check** hint (grep pattern or visual cue). Confirm each before declaring work done.

## Common Mistakes

| Mistake | Reality |
|---|---|
| A helper, constant, interface or inline component declared in `page.tsx` / `layout.tsx` | Routing files hold the route component + Next's own route exports only. Everything else moves into the module. |
| A slice under `modules/` that no routing file mounts | Not a module. Two+ consumers → widget/feature/shared; one consumer → that module's `elements/`. |
| Reaching a module from another module (incl. `dynamic(() => import('@/app/modules/…'))`) | Modules attach to routing, not to each other. Lazy loading does not change the layering. |
| A module barrel exporting a store / service / type / element | The barrel is one line: the module component. Any other export is a lift-down signal. |
| Two `*.module.tsx` files in one slice | Decide WHICH case it is first. Two domains → two slices, one per routing surface. Two variations of ONE domain (signed-in/anonymous, locked/unlocked) → one `*.module.tsx` that selects the variant, variations under `elements/`. |
| A slice folder whose name does not match its file prefix (`<group>/<child>/<a>-<b>.module.tsx`) | The slice folder name IS the file prefix. Flatten it to `<a>-<b>/<a>-<b>.module.tsx`; a grouping folder that holds a single slice earns nothing. |
| Extracting a complex one-module component into `widgets/` | A widget needs two consuming modules. Complexity alone keeps it in `elements/`. |
| Adding `index.ts` on a grouping folder (a layer, a role segment, `systems/`) | Forbidden — a barrel is one subject's public face. Consumers import the member by path. |
| Importing upward (feature → widget, entity → feature, module → module) | Imports flow only downward: `(web)/(api) → modules → widgets → features → entities → shared`. |
| A slice importing a sibling in its own layer (module→module, widget→widget, feature→feature) | Siblings don't import each other. Lift the shared part DOWN a layer; if it cannot descend, the layer above passes it in as a rendered slot. |
| Only checking what a slice imports | Check the reverse too: who imports this slice's `elements/`? A reused element must be lifted out. |
| `pkg/<name>` importing from `app/*` or another `pkg/<name>` | `pkg/*` must stay self-contained and liftable. Duplicate helpers if needed. |
| Importing a `pkg` member the barrel NAMES, by its own path | The barrel published it — enter `pkg/<name>`. A member path is legal only for what the barrel deliberately omits. |
| One `pkg` barrel re-exporting a browser-only SDK and a server-only client alike | A barrel is one module edge per member, so every consumer inherits both graphs and the build breaks in the runtime that cannot resolve one. Split into `client/` + `server/`, each with its own barrel. |
| Adding the "missing" re-export of a runtime folder to the slot barrel | If the barrel omits `client/` or `server/`, that is deliberate — read the comment above it before widening. |
| Renaming a file or a symbol inside a generated / CLI-managed folder to match the project's conventions | The tool owns those names and rewrites them on the next regeneration or `diff`. The conventions stop at that folder's edge. |
| Counting tool-owned files in a structure audit ("N files break the naming rule") | Exclude them first, in every checker at once. Measuring generated output against hand-written rules manufactures debt nobody can pay. |
| Adding a barrel over a registry CLI's output so its imports stop reading as bypasses | The tool's published path IS the public surface. The barrel would group independent units (rule 5), and the next regeneration writes straight past it. |
| A hand-written file added to a WHOLE-directory generator's output | The next regeneration deletes it, silently. That folder takes tool output only. |
| A hand-written file added to a registry CLI's folder in the PROJECT's style (role suffixes, project props shape) | Fine to put it there — but match the neighbours. Inside a tool-owned folder the tool's conventions are the folder's conventions. |
| Reading `process.env` directly outside `config/env/` | Add the var to the Zod schema in `env.client.ts` / `env.server.ts`, import `envClient` / `envServer`. |
| `'use client'` on every leaf component | Add it at the **highest** boundary that needs the client runtime. Pages/layouts stay RSC by default. |
| `'use client'` on `<api>.api.ts` or `<api>.query.ts` | Only `<api>.mutation.ts` declares `'use client'`. Api/query files must stay server-composable for `prefetchQuery`. |
| TanStack Query files living in modules/widgets/features | All `*.api.ts` / `*.query.ts` / `*.mutation.ts` files live under `entities/api/<api>/`. |
| Free-floating types in modules that other layers need | Lift into `entities/models/<entity>.model.ts` (domain shape) or `shared/interfaces/<name>.interface.ts` (cross-cutting). |
| Suffix-less files outside the documented exception | Every file uses its suffix (`.component.tsx`, `.service.ts`, etc.). Only `shared/validation/validation.ts` is plain `*.ts`. |
| Folder naming with camelCase or `_` | All folders are `kebab-case`; slice folder name matches file prefix. |
| Mixing concerns in `shared/` | A util that calls a service is not a util — move it to `shared/services/`. A constant file that imports runtime code is not a constant — split it. |
| Letting a file grow past 1000 lines | Hard cap. Split along the pattern: `elements/` sub-components, `*.service.ts`, `*.constant.ts`, or a new slice. |
| Claiming the cap's carve-out because a file is hard to split | Hard is not indivisible. Apply the piece test: if a piece would have a name and a consumer of its own, split. |
| A role folder holding EVERY file of its parent | It separates nothing — the parent is already that group, and you get a directory whose only child is a directory. Two-or-more counts only BESIDE other roles. |
| A role folder nested inside a container already named for that role (`<role>/<role>/`) | The role folder already exists — members stay at its root. The rule never doubles a name. |
| A folder created for a single-file variant, or a suffix repeated across five files of one variant | Count the files: one file → a suffix, several files → a folder with a barrel. |
| Forcing a real split into the words `client`/`server` | Those are the common case, not the rule. Name the folder for the boundary that actually exists. |
| Deleting a slice's barrel because "its files look independent" | A slice is ONE subject by definition — the folder is named for the thing it is. The surface-decision test applies to `pkg` slots and grouping folders, never to a slice, which stays CLOSED. |
| A second barrel anywhere inside a slot | A slot has exactly ONE. A boundary is expressed by leaving the member out of that barrel's list, not by wrapping it in another one. |
| `export *` in a barrel | Not a public face: it hides the surface, widens it silently as members gain exports, and turns a name collision into a compile error instead of a decision. Name every symbol. |
| Renaming a file or symbol whose name a dependency resolves by path or declares by augmentation | The dependency's name wins. Test destructively: if the rename does not break resolution, the rule applies and it gets renamed. |
| One-line implicit-return arrow on a declared function (`const <fn> = () => value`) | Declared functions use a block body: `const <fn> = () => { return value }`. Concise bodies are for inline callbacks only. |

Full explanations of the *why* behind each rule live in `references/pitfalls.md`.

## Resources

This SKILL is the router: it decides which resource to open for the situation. The three resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Deciding **where new code goes** (which layer / new slice vs extend / which segment / what it may import / when to lift up or down) | `references/structure.md` |
| Need a **file or slice template** to copy and rename | `examples/` |
| **Verifying** after a change — what file type belongs where, what each layer must/must not do | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |
| Understanding **why** a rule exists / diagnosing a smell | `references/pitfalls.md` |
| **Bootstrapping** a new project from zero | `references/bootstrap.md` |
| **Comment style** for any file | `references/comments.md` |

- **`references/structure.md`** — Layer/Slice/Segment decision trees + isolation rules.
- **`references/bootstrap.md`** — Mode A new-project scaffold (`create-next-app`, `tsconfig`, ESLint, Prettier, Tailwind v4, `next-intl`, env validation, first route/module/api slice, `middleware.ts`).
- **`references/comments.md`** — comment-style convention.
- **`references/pitfalls.md`** — common mistakes with explanations.
- **`spec/`** — declarative self-verification: `invariants.spec.md` (global invariants) + `per-action.spec.md` (checks per action).
- **`examples/`** — canonical file shapes per layer with `<…>` / `__…__` placeholders.
