import { expect, test } from '@playwright/test'

import { SEED, TEST_USER, TEST_USER_EMAIL_PREFIX } from './support/constants'

const formError = 'form p.text-destructive'

test('guest visiting favorites is redirected to sign-in', async ({ page }) => {
  await page.goto('/favorites')

  await expect(page).toHaveURL('/sign-in?from=%2Ffavorites')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
})

test('guest header offers sign-in and register but no favorites', async ({ page }) => {
  await page.goto('/items')

  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Favorites' })).toHaveCount(0)
})

test('guest clicking the favorite button is sent to sign-in', async ({ page }) => {
  await page.goto(`/items?search=${SEED.uniqueTitle}`)
  await page.getByRole('link', { name: SEED.uniqueTitle }).last().click()

  await page.getByRole('button', { name: 'Add to favorites' }).click()

  await expect(page).toHaveURL(/\/sign-in$/)
})

test('sign-in validates empty fields on the client', async ({ page }) => {
  await page.goto('/sign-in')

  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Password is required')).toBeVisible()
})

test('sign-in with wrong credentials shows a server error', async ({ page }) => {
  await page.goto('/sign-in')

  await page.getByLabel('Email address').fill(TEST_USER.email)
  await page.getByLabel('Password', { exact: true }).fill('WrongPassword1')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.locator(formError)).toBeVisible()
  await expect(page).toHaveURL(/\/sign-in$/)
})

test('register rejects mismatched passwords', async ({ page }) => {
  await page.goto('/sign-up')

  await page.getByLabel('Full name').fill('New User')
  await page.getByLabel('Email address').fill('new.user@example.com')
  await page.getByLabel('Password', { exact: true }).fill('Password1')
  await page.getByLabel('Confirm password').fill('Password2')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page.getByText('Passwords do not match')).toBeVisible()
  await expect(page).toHaveURL(/\/sign-up$/)
})

test('register a new account, then sign out', async ({ page }, testInfo) => {
  const email = `${TEST_USER_EMAIL_PREFIX}${testInfo.workerIndex}.${Date.now()}@example.com`

  await page.goto('/sign-up')
  await page.getByLabel('Full name').fill('New User')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('Password1')
  await page.getByLabel('Confirm password').fill('Password1')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/items$/)
  await expect(page.getByText('New User')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Favorites' })).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()

  await expect(page).toHaveURL(/\/sign-in$/)
  await expect(page.getByRole('link', { name: 'Favorites' })).toHaveCount(0)
})

test('sign in with the shared test account', async ({ page }) => {
  await page.goto('/sign-in')

  await page.getByLabel('Email address').fill(TEST_USER.email)
  await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL(/\/items$/)
  await expect(page.getByRole('link', { name: 'Favorites' })).toBeVisible()
})
