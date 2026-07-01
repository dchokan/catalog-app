import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// locale-aware replacements for next/link + next/navigation — import these app-wide
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
