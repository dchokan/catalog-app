export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export const STORAGE_STATE = 'playwright/.auth/user.json'

export const TEST_USER_EMAIL_PREFIX = 'e2e.'

export const TEST_USER = {
  name: 'Playwright User',
  email: 'playwright@example.com',
  password: 'Playwright1',
}

export const SEED = {
  totalItems: 12,
  totalPages: 2,
  itemsOnFirstPage: 8,
  itemsOnLastPage: 4,
  uniqueTitle: 'Dune',
}
