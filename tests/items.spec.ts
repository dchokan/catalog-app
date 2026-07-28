import { expect, test } from '@playwright/test'

import { SEED } from './support/constants'

const cardTitles = 'h3'

test('root redirects to the catalog', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/items$/)
  await expect(page.getByRole('heading', { name: 'Browse Books', level: 1 })).toBeVisible()
})

test('catalog shows the first page of books', async ({ page }) => {
  await page.goto('/items')

  await expect(page.locator(cardTitles)).toHaveCount(SEED.itemsOnFirstPage)
  await expect(page.getByText(`Page 1 of ${SEED.totalPages}`)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled()
})

test('pagination moves to the next page', async ({ page }) => {
  await page.goto('/items')

  await page.getByRole('button', { name: 'Next' }).click()

  await expect(page).toHaveURL(/[?&]page=2/)
  await expect(page.getByText(`Page ${SEED.totalPages} of ${SEED.totalPages}`)).toBeVisible()
  await expect(page.locator(cardTitles)).toHaveCount(SEED.itemsOnLastPage)
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled()
})

test('search filters by title and can be cleared', async ({ page }) => {
  await page.goto('/items')

  await page.getByLabel('Search books').fill(SEED.uniqueTitle)
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page).toHaveURL(new RegExp(`[?&]search=${SEED.uniqueTitle}`))
  await expect(page.locator(cardTitles)).toHaveCount(1)
  await expect(page.locator(cardTitles)).toHaveText(SEED.uniqueTitle)

  await page.getByRole('button', { name: 'Clear' }).click()

  await expect(page).not.toHaveURL(/[?&]search=/)
  await expect(page.locator(cardTitles)).toHaveCount(SEED.itemsOnFirstPage)
})

test('search with no results shows the empty message', async ({ page }) => {
  await page.goto('/items')

  await page.getByLabel('Search books').fill('nosuchbook')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('No books match "nosuchbook".')).toBeVisible()
  await expect(page.locator(cardTitles)).toHaveCount(0)
})

test('sorting by title reorders the catalog', async ({ page }) => {
  await page.goto('/items')

  await page.getByLabel('Sort by').selectOption('title')

  await expect(page).toHaveURL(/[?&]sort=title/)
  await expect(page.locator(cardTitles).first()).toHaveText('1984')
})

test('opening a book shows its detail page', async ({ page }) => {
  await page.goto(`/items?search=${SEED.uniqueTitle}`)

  await page.getByRole('link', { name: SEED.uniqueTitle }).last().click()

  await expect(page).toHaveURL(/\/items\/[0-9a-f-]{36}$/)
  await expect(page.getByRole('heading', { name: SEED.uniqueTitle, level: 1 })).toBeVisible()
  await expect(page.getByText(/users? added this to favorites/)).toBeVisible()
})

test('unknown book id renders the not-found page', async ({ page }) => {
  await page.goto('/items/00000000-0000-0000-0000-000000000000')

  await expect(page.getByRole('heading', { name: 'Book not found' })).toBeVisible()
})

test('unknown route renders the not-found page', async ({ page }) => {
  await page.goto('/definitely-not-a-page')

  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('locale switcher moves the catalog to Ukrainian', async ({ page }) => {
  await page.goto('/items')

  await page.getByLabel('Language').selectOption('uk')

  await expect(page).toHaveURL(/\/uk\/items$/)
  await expect(page.getByRole('heading', { name: 'Каталог книг', level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Бібліотека' })).toBeVisible()
})
