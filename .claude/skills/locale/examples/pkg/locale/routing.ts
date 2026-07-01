import { defineRouting } from 'next-intl/routing'

// single source of truth for which locales exist
export const routing = defineRouting({
  locales: ['en'],
  localePrefix: 'as-needed', // default locale is not prefixed → no middleware needed
  localeDetection: false,
  defaultLocale: 'en',
})
