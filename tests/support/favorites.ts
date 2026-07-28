import { type APIRequestContext, expect, type Page } from '@playwright/test'

interface IFavoriteResponse {
  itemId: string
}

export async function clearFavorites(request: APIRequestContext): Promise<void> {
  const response = await request.get('/api/favorites')
  expect(response.ok()).toBeTruthy()

  const favorites: IFavoriteResponse[] = await response.json()

  for (const favorite of favorites) {
    const deleted = await request.delete(`/api/favorites/${favorite.itemId}`)
    expect(deleted.ok()).toBeTruthy()
  }
}

export async function waitForSession(page: Page): Promise<void> {
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
}
