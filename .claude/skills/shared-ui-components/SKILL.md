---
name: shared-ui-components
description: Build the shared UI layer for the project. Use when implementing the Button, Card, Input components in src/app/shared/components/, the Header widget, and the Providers (React Query) wrapper. These are the foundational building blocks used across all pages and features. Skip when these components already exist and you only need to use them.
---

# Shared UI Components

Base UI components in `src/app/shared/components/` + the Header widget + the QueryClientProvider wrapper. These must be created before features, modules, and widgets — everything imports from here.

## File Layout

```
src/app/
├── shared/
│   ├── components/
│   │   ├── button/
│   │   │   └── button.component.tsx
│   │   ├── card/
│   │   │   └── card.component.tsx
│   │   ├── input/
│   │   │   └── input.component.tsx
│   │   └── providers/
│   │       └── providers.component.tsx
│   ├── hooks/
│   │   └── use-session.hook.tsx
│   └── interfaces/
│       └── api-response.interface.ts
│
└── widgets/
    └── header/
        └── header.component.tsx
```

---

## `Button` (`shared/components/button/button.component.tsx`)

**Props** (extends `ButtonHTMLAttributes<HTMLButtonElement>`):
- `variant?: "primary" | "secondary" | "danger" | "ghost"` — default `"primary"`
- `size?: "sm" | "md" | "lg"` — default `"md"`
- `loading?: boolean` — default `false`

**Behavior:**
- When `loading` is true: show an SVG spinner (`animate-spin`, 16×16) before children + set `disabled={true}`
- When `disabled` is true (via prop): also set `disabled={true}`
- Apply base + variant + size Tailwind classes merged together
- Accept `className` prop to allow overrides

**Tailwind class sets:**

Base: `inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`

Variants:
- `primary`: blue-600 background, white text, blue-700 hover, blue-500 focus ring
- `secondary`: white background, gray-700 text, gray-300 border, gray-50 hover, gray-400 focus ring
- `danger`: red-600 background, white text, red-700 hover, red-500 focus ring
- `ghost`: gray-600 text, gray-100 hover background, gray-400 focus ring

Sizes:
- `sm`: text-sm, px-3 py-1.5, gap-1.5
- `md`: text-sm, px-4 py-2, gap-2
- `lg`: text-base, px-6 py-3, gap-2

Spinner SVG: circle (opacity-25) + path (opacity-75, fill currentColor) for the standard Tailwind spinner shape.

---

## `Card` (`shared/components/card/card.component.tsx`)

**Props** (extends `HTMLAttributes<HTMLDivElement>`):
- `hover?: boolean` — default `false`

**Behavior:**
- Base classes: `overflow-hidden rounded-xl border border-gray-200 bg-white`
- When `hover` is true: add `cursor-pointer transition-shadow hover:shadow-md`
- Accepts `className` for overrides

Simple container — no internal structure, just wraps `{children}`.

---

## `Input` (`shared/components/input/input.component.tsx`)

**Props** (extends `InputHTMLAttributes<HTMLInputElement>`):
- `label?: string`
- `error?: string`

**Critical:** Use `forwardRef<HTMLInputElement, InputProps>` — React Hook Form's `register()` needs a ref. Without `forwardRef`, validation won't work.

**Structure:**
```
<div className="flex flex-col gap-1">
  {label && <label htmlFor={id} ...>}
  <input ref={ref} id={id} className={...} {...props} />
  {error && <p className="text-sm text-red-600">{error}</p>}
</div>
```

Input border: `border-gray-300` normally, `border-red-500 focus:ring-red-500` when `error` is set.

Set `Input.displayName = "Input"` after the component definition (required for `forwardRef` components in React devtools).

---

## `Providers` (`shared/components/providers/providers.component.tsx`)

Client Component (`"use client"`):

**Props:** `{ children: React.ReactNode }`

**Key detail:** use `useState(() => getQueryClient())` to initialize the client — this prevents re-creating it on re-renders and correctly uses the browser singleton.

```typescript
const [queryClient] = useState(() => getQueryClient())
```

Include `<ReactQueryDevtools initialIsOpen={false} />` conditionally:
```typescript
{process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
```

Wrap children in `<QueryClientProvider client={queryClient}>`.

---

## `Header` (`widgets/header/header.component.tsx`)

Client Component (`"use client"`).

**Behavior:**
- `useSession()` to get current auth state: `const { data: session } = useSession()`
- `const isAuthenticated = !!session?.user`
- `useRouter()` for post-sign-out redirect

**Sign out handler:**
```typescript
async function handleSignOut() {
  await authClient.signOut()
  router.push("/login")
  router.refresh()   // clears server-side session cache
}
```

**Layout structure:**
- `<header>`: sticky top-0, z-50, white bg, bottom border
- Inner div: max-w-7xl, horizontal padding, flex h-16 items-center justify-between
- **Left:** Logo link to the app's home route — app name text in brand color
- **Center nav:** Main nav links (e.g., catalog, favorites) — show auth-only links conditionally when `isAuthenticated`
- **Right:**
  - When authenticated: user name span (hidden on mobile) + `<Button variant="secondary" size="sm">Sign out</Button>`
  - When not authenticated: Sign in link (`<Button variant="ghost" size="sm">`) + Register link (`<Button size="sm">`)

---

## Barrel Exports

Create `index.ts` barrels at the segment level (not the layer level):

```
shared/components/button/index.ts    → export { Button } from "./button.component"
shared/components/card/index.ts      → export { Card } from "./card.component"
shared/components/input/index.ts     → export { Input } from "./input.component"
shared/components/providers/index.ts → export { Providers } from "./providers.component"
shared/hooks/index.ts                → export { useSession } from "./use-session.hook"
```

This allows `import { Button } from "@/app/shared/components/button"` (no `.tsx` extension, no component filename).

---

## Hard Rules

- `Input` MUST use `forwardRef` — React Hook Form's `register()` spreads a `ref` onto inputs; without it validation silently fails
- `Providers` uses `useState(() => getQueryClient())` not `getQueryClient()` directly — prevents re-creating the client on every render
- `Header` calls `router.refresh()` after `signOut()` — this re-runs Server Components and clears the server-side session cache
- `Button`'s `loading` prop (not `isLoading`) — match this exact prop name everywhere to avoid type errors
- `Card`'s `hover` prop enables the hover shadow — always pass `hover` when using `Card` inside a clickable link

## Verification

- Button renders in all 4 variants with correct Tailwind colors
- Button shows spinner and is disabled when `loading={true}`
- Input shows red border and error message when `error` prop is set
- Input ref forwarding works with React Hook Form (no "ref not attached" warnings)
- Header shows "Sign out" + user name when logged in
- Header shows "Sign in" + "Register" when logged out
- Header's "Favorites" link only appears when authenticated
- Clicking Sign out → redirects to `/login`, session is cleared
