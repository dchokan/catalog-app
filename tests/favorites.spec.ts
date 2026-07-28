import { type APIRequestContext, expect, test } from '@playwright/test'

import { SEED } from './support/constants'
import { clearFavorites, waitForSession } from './support/favorites'

test.describe.configure({ mode: 'serial' })

async function firstItem(request: APIRequestContext): Promise<{ id: string; title: string }> {
  const response = await request.get('/api/items?sort=title')
  expect(response.ok()).toBeTruthy()

  const { data } = await response.json()
  return data[0]
}

test.beforeEach(async ({ request }) => {
  await clearFavorites(request)
})

test('favorites page is empty when nothing is saved', async ({ page }) => {
  await page.goto('/favorites')

  await expect(page.getByRole('heading', { name: 'My Favorites', level: 1 })).toBeVisible()
  await expect(page.getByText('No favorites yet')).toBeVisible()

  await page.getByRole('button', { name: 'Browse books' }).click()
  await expect(page).toHaveURL(/\/items$/)
})

test('adding a book from its detail page puts it in favorites', async ({ page, request }) => {
  const item = await firstItem(request)

  await page.goto(`/items/${item.id}`)
  await waitForSession(page)
  await page.getByRole('button', { name: 'Add to favorites' }).click()

  await expect(page.getByText('Added to favorites')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Remove from favorites' })).toBeVisible()

  await page.getByRole('link', { name: 'Favorites' }).click()

  await expect(page).toHaveURL(/\/favorites$/)
  await expect(page.locator('h3')).toHaveText(item.title)
})

test('removing a book from the favorites page empties the list', async ({ page, request }) => {
  const item = await firstItem(request)
  const added = await request.post('/api/favorites', { data: { itemId: item.id } })
  expect(added.ok()).toBeTruthy()

  await page.goto('/favorites')
  await expect(page.locator('h3')).toHaveText(item.title)

  await page.getByRole('button', { name: 'Remove' }).click()

  await expect(page.getByText('No favorites yet')).toBeVisible()
})

test('unfavoriting from the detail page clears the favorited state', async ({ page, request }) => {
  const item = await firstItem(request)
  const added = await request.post('/api/favorites', { data: { itemId: item.id } })
  expect(added.ok()).toBeTruthy()

  await page.goto(`/items/${item.id}`)
  await page.getByRole('button', { name: 'Remove from favorites' }).click()

  await expect(page.getByText('Removed from favorites')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add to favorites' })).toBeVisible()
})

test('catalog keeps working for a signed-in user', async ({ page }) => {
  await page.goto('/items')

  await expect(page.locator('h3')).toHaveCount(SEED.itemsOnFirstPage)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
})
