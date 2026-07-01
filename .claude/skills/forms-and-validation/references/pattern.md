# RHF + Zod + mutation, integrated

Three pieces compose into every form: a Zod schema (validation + types), React Hook Form (field state + submit), and a TanStack mutation (async submit + loading/error). Each owns one concern; wiring them correctly is the pattern.

## Schema → types (one source of truth)

The Zod schema is authored once and the TS type is *derived*, never hand-written:

```
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormValues = z.infer<typeof loginSchema>
```

`useForm<LoginFormValues>` and the mutation's `mutationFn(values: LoginFormValues)` both consume that one type, so a schema change propagates everywhere through the compiler. Cross-field rules live in the schema too — e.g. register's confirm:

```
.refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })
```

`path` attaches the error to the `confirmPassword` field so it renders under the right input.

## RHF + zodResolver + Controller

```
const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
})
```

- `zodResolver` runs the schema on submit (and per RHF's mode) and maps Zod issues into `errors`.
- Each field is a `Controller` (not `register`) because the shared `InputComponent` is a custom controlled component — `Controller` gives it `value`/`onChange`/`onBlur` via `field`, and `error={errors.email?.message}` renders the message.
- `defaultValues` are required so every input is controlled from first render.

## Mutation-driven submit

Submit hands off to a TanStack mutation rather than an inline `try/catch` + `useState`:

```
function onSubmit(data: LoginFormValues) {
  signIn.mutate(data, {
    onSuccess: () => { router.push('/items'); router.refresh() },
  })
}
```

This buys three things for free:
- **loading** — `signIn.isPending` drives `ButtonComponent loading=`.
- **server error** — `signIn.error` renders in an error block; the fetcher throws a message (e.g. better-auth's error), and the mutation captures it.
- **success side effects** — `onSuccess` navigates; `router.refresh()` re-runs server components (e.g. the header re-reads the session).

Client-side *validation* errors come from Zod/RHF; *server* errors (bad credentials, duplicate email) come from the mutation. Keeping them in their own channels is why there's no manual error state.

## Why this split

- Validation logic isn't duplicated between client types and runtime checks — the schema is both.
- The form component stays declarative: fields + a submit that delegates. No imperative async bookkeeping.
- Swapping or reusing the submit (same mutation in different forms) doesn't touch validation.
