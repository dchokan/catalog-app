# Forms & validation checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +schema — adding/changing a Zod schema

- **MUST** add it to `shared/validation/validation.ts` and export `<name>Schema` + `type <Name>FormValues = z.infer<typeof <name>Schema>`.
- **MUST** give every rule a user-facing message (`.min/.email/.regex`).
- **MUST** express cross-field rules with `.refine(fn, { message, path })` so the error lands on the right field.

## +form — adding/changing a form component

- **MUST** be a `'use client'` feature slice with `useForm({ resolver: zodResolver(schema), defaultValues })`.
- **MUST** wrap each field in `Controller` over `InputComponent` with `error={errors.<field>?.message}`.
- **MUST** submit via `mutation.mutate(values, { onSuccess })`; show `mutation.error`; set `ButtonComponent loading={mutation.isPending}`.
- **MUST** redirect on success through `@/pkg/locale` (`push` + `refresh`), and re-export the component from the slice `index.ts`.
