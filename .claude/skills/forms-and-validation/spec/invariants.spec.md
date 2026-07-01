# Forms & validation invariants

Global rules that always hold for forms.

## Schemas

- **MUST** keep Zod schemas in `shared/validation/validation.ts` as flat `*.ts` (not `*.validation.ts`).
  - Check: `find src/app/shared/validation -name "*.validation.ts"` → empty; `ls src/app/shared/validation/validation.ts`.
- **MUST** derive form-value types with `z.infer`, not hand-written interfaces.
  - Check: `grep -n "z.infer<typeof" src/app/shared/validation/validation.ts`.

## Form wiring

- **MUST** use `useForm({ resolver: zodResolver(<schema>), defaultValues })` with defaults for every field.
  - Check: `grep -rn "zodResolver" src/app/features` ; each form has `defaultValues`.
- **MUST** render each field via `Controller` over `InputComponent`, passing `error={errors.<field>?.message}`.
  - Check: `grep -rn "Controller" src/app/features/login-form src/app/features/register-form`.

## Submit

- **MUST** drive submit with a TanStack mutation; loading from `mutation.isPending`, server error from `mutation.error`.
  - Check: `grep -rn "isPending\|\.error" src/app/features/login-form/login-form.component.tsx`.
- **MUST NOT** track loading/error with local `useState`.
  - Check: `grep -rn "useState" src/app/features/login-form src/app/features/register-form` → none for loading/error.
- **MUST** redirect on success via `@/pkg/locale` `useRouter` (`push` + `refresh`).
