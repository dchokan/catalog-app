import { expect, test as setup } from '@playwright/test'

import { BASE_URL, STORAGE_STATE, TEST_USER } from './support/constants'

const headers = { origin: BASE_URL }

setup('authenticate the shared test user', async ({ request }) => {
  const credentials = { email: TEST_USER.email, password: TEST_USER.password }

  let signIn = await request.post('/api/auth/sign-in/email', {
    data: credentials,
    headers,
    failOnStatusCode: false,
  })

  if (!signIn.ok()) {
    const signUp = await request.post('/api/auth/sign-up/email', {
      data: { name: TEST_USER.name, ...credentials },
      headers,
      failOnStatusCode: false,
    })
    expect(signUp.ok(), `sign-up failed: ${await signUp.text()}`).toBeTruthy()

    signIn = await request.post('/api/auth/sign-in/email', {
      data: credentials,
      headers,
      failOnStatusCode: false,
    })
  }

  expect(signIn.ok(), `sign-in failed: ${await signIn.text()}`).toBeTruthy()

  const state = await request.storageState({ path: STORAGE_STATE })
  expect(state.cookies.some((cookie) => cookie.name.includes('better-auth.session_token'))).toBeTruthy()
})
