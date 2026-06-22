---
name: forms-and-validation
description: Build validated forms with React Hook Form + Zod in Next.js. Use when creating login, register, or any input form with client-side validation, error display, loading states, and server error handling. Covers the pattern for any validated form in the project.
---

# Forms and Validation

React Hook Form for form state management + Zod for schema validation + `@hookform/resolvers` to bridge them. All forms follow the same pattern: define a Zod schema → derive TypeScript type → create form with `useForm` + `zodResolver` → render controlled inputs.

## Dependencies

```
react-hook-form
zod
@hookform/resolvers
```

## Pattern: Schema → Form → Component

### Step 1 — Define Zod Schema

Define a `z.object()` schema above the component (module-level constant). Example fields for login:
- `email`: `z.string().min(1, "Required").email("Invalid email")`
- `password`: `z.string().min(8, "Must be at least 8 characters")`

Infer the TypeScript type: `type FormData = z.infer<typeof schema>`

### Step 2 — Initialize useForm

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
})
```

### Step 3 — Component Structure

The form component (e.g., `login-form.component.tsx`) should:
- Call `useForm` with the resolver
- Track a `serverError` state (string | null) for errors returned by the API
- Track an `isLoading` state (boolean)
- `handleSubmit` calls the auth action (e.g., `authClient.signIn.email(...)`)
- On success: call `router.push("/items")` (or wherever)
- On error from API: set `serverError` with the message string
- Render each field using the `<Input />` shared component
- Show `form.formState.errors.fieldName?.message` below each field
- Show `serverError` below all fields (non-field error)
- Disable/show loading on the submit `<Button />` while `loading` is true

## File Layout

```
src/app/features/
├── login-form/
│   └── login-form.component.tsx
└── register-form/
    └── register-form.component.tsx

src/app/shared/components/
├── input/
│   └── input.component.tsx    # Reusable input with label + error
└── button/
    └── button.component.tsx   # Reusable button with loading state
```

## `Input` Component Contract

Props: `label`, `error` (string | undefined), plus all standard HTML input props via spread.

Renders:
- `<label>` with the `label` prop
- `<input>` with `{...register("fieldName")}` spread onto it
- Conditional error message span below (only when `error` is truthy)
- Error state: red border on input + red error text

## `Button` Component Contract

Props: `variant` (`"primary" | "secondary" | "danger" | "ghost"`), `size` (`"sm" | "md" | "lg"`), `loading` (boolean), plus standard button props.

When `loading` is true:
- Shows a spinner or "Loading..." text
- Sets `disabled={true}` to prevent double-submit

## Login Form Schema

Fields: `email` (non-empty, valid email format), `password` (min 8 chars).

On submit: call `authClient.signIn.email({ email, password, callbackURL: "/items" })`.

## Register Form Schema

Fields: `name` (min 1), `email` (valid email), `password` (min 8).

On submit: call `authClient.signUp.email({ name, email, password, callbackURL: "/items" })`.

## Modules That Wrap Forms

`auth-login.module.tsx` and `auth-register.module.tsx` compose the form with surrounding layout:
- Title heading
- The form component
- OAuth buttons (Google)
- Link to the other auth page

## Hard Rules

- Zod schema is defined at module level, not inside the component — stable reference, no re-creation on render
- `defaultValues` must be set for all fields — prevents uncontrolled-to-controlled warnings
- Server errors (auth failures, network errors) go in `serverError` state, not `form.setError` — they aren't field-specific
- `isLoading` must disable the submit button — prevents double-submission during async auth calls
- `zodResolver` is the only resolver used — don't mix with manual validation logic

## Verification

- Submitting empty form shows validation errors under each field
- Submitting invalid email shows "Invalid email" error under email field
- Submitting password under 8 chars shows length error
- Submitting valid data calls the auth action
- Incorrect credentials from server shows a server error message below the form
- Submit button is disabled while request is in flight
