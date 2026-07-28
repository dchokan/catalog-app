import { defineConfig, devices } from '@playwright/test'

import { BASE_URL as baseURL, STORAGE_STATE } from './tests/support/constants'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalTeardown: './tests/global.teardown.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    {
      name: 'guest',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /(items|auth)\.spec\.ts/,
      dependencies: ['setup'],
    },

    {
      name: 'authenticated',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      testMatch: /favorites\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'yarn build && yarn start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
