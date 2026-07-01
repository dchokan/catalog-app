---
name: forms-and-validation
description: Build validated forms in this app — React Hook Form + Zod (zodResolver) + Controller over the shared Input, with a TanStack mutation driving submit, server-error display, and loading state. Use when creating or changing the login/register forms, the search form, or any input form, and when adding/altering Zod schemas in shared/validation. Skip for non-form UI and for the auth/session mechanics (that's the auth skill).
---

# forms-and-validation

Forms use **React Hook Form** with **Zod** validation via `zodResolver`. Each field is a `Controller` wrapping the shared `InputComponent` (which renders its own label + error). Submit drives a **TanStack mutation**, so loading state, server-error surfacing, and the `onSuccess` redirect come from the mutation rather than hand-rolled async state. Schemas (and their inferred types) live in one place: `shared/validation/validation.ts`.

This skill documents the real form pattern in this repo — paths and symbols below are concrete.

## Layout

```
src/app/shared/validation/
├── validation.ts       # Zod schemas + inferred types (loginSchema, registerSchema, *FormValues) — flat *.ts
└── index.ts
src/app/features/<form>/      # one feature slice per form
├── <form>.component.tsx  # 'use client' — useForm + zodResolver + Controller + mutation
└── index.ts
src/app/shared/components/input/   # the shared Input the Controllers wrap (label + error props)
```

The submit **mutation** lives in the relevant `entities/api/<api>` slice (e.g. `useSignInMutation`); this skill covers the form, not the mutation's internals.

## Hard rules

1. **Schemas live in `shared/validation/validation.ts` as flat `*.ts`** — the documented suffix exception (not `*.validation.ts`). Export `<name>Schema` and its inferred type together: `export type <Name>FormValues = z.infer<typeof <name>Schema>`. The schema is the single source of truth for both validation and types.
2. **Forms are `'use client'` feature slices.** `useForm<<Name>FormValues>({ resolver: zodResolver(<name>Schema), defaultValues })` — always set `defaultValues` for every field (controlled inputs).
3. **One `Controller` per field, wrapping `InputComponent`.** Pass `error={errors.<field>?.message}` so validation errors render under the field.
4. **Submit drives a TanStack mutation.** `onSubmit(data)` calls `mutation.mutate(data, { onSuccess })`. The submit/server error surfaces from `mutation.error`; the submit button uses `loading={mutation.isPending}`. Don't manage loading/error with local `useState`.
5. **Validation messages are user-facing.** Chain `.min/.email/.regex` with messages; cross-field rules use `.refine(fn, { message, path })` (e.g. password confirmation).
6. **On success, navigate via `@/pkg/locale` `useRouter`** (`router.push(...)` + `router.refresh()` to re-sync server components like the header).

## Key files

- **`validation.ts`** — `loginSchema` (email + password), `registerSchema` (name, email, password with `.regex` upper/number, `confirmPassword`, `.refine` match on `path: ['confirmPassword']`), and `LoginFormValues` / `RegisterFormValues` via `z.infer`.
- **`<form>.component.tsx`** — `const { control, handleSubmit, formState: { errors } } = useForm(...)`; a `Controller` per field; `<form onSubmit={handleSubmit(onSubmit)}>`; mutation error block; submit `ButtonComponent`.
- **`InputComponent`** — `forwardRef` input with `label` + `error` props (so RHF can register it and errors render inline). Owned by the shared-ui-components skill.

## Self-verification

After any change, confirm against `spec/`:
1. `spec/invariants.spec.md` — always-true rules (schema location, resolver wiring, Controller usage, mutation-driven submit).
2. The matching block in `spec/per-action.spec.md` — `+schema` or `+form`.

## Common mistakes

| Mistake | Reality |
|---|---|
| Naming the schema file `*.validation.ts` | The folder is the documented exception — files are plain `*.ts`. |
| Re-declaring a TS type for the form values | Infer it: `type X = z.infer<typeof xSchema>`. One source of truth. |
| Local `useState` for loading/error | Use `mutation.isPending` / `mutation.error`. |
| Registering raw `<input>` instead of `Controller` + `InputComponent` | Forms use `Controller` over the shared input so errors/labels are consistent. |
| Cross-field check in component code | Use `.refine(..., { path })` in the schema. |
| `useRouter` from `next/navigation` for the success redirect | Use `@/pkg/locale`; `push` + `refresh`. |
| Omitting `defaultValues` | Set them for every field — these are controlled inputs. |

## Resources

This SKILL.md is the router; it decides which resource to open. The resource sets are independent — they do **not** reference one another.

| Situation | Open |
|---|---|
| Understanding **how RHF + Zod + the mutation fit together** and **why** | `references/pattern.md` |
| Need a copy-ready **shape** for a schema or a form component | `examples/` |
| **Verifying** a change | `spec/invariants.spec.md` + the matching block in `spec/per-action.spec.md` |

- **`references/pattern.md`** — the integration of resolver + Controller + mutation, and the reasoning.
- **`examples/`** — concrete shapes of `validation.ts` and a form component.
- **`spec/`** — `invariants.spec.md` + `per-action.spec.md`.
