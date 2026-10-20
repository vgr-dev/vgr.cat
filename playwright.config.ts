import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the **built** site, never `astro dev`: the production build is the only place the
 * CSP meta tag, the hashed assets and the inline-script hashes exist, and every defect this suite
 * guards surfaced there rather than in development (see the plan's Phase 6 and 7 notes).
 *
 * `astro preview` daemonises in Astro 7 — it prints a pid and exits — and it binds to `localhost`, so
 * it cannot be Playwright's webServer: on a CI runner the readiness probe against `127.0.0.1` timed
 * out after 120 s and blocked the deploy. `tests/support/serve.mjs` is a foreground `node:http`
 * server bound explicitly to `127.0.0.1` that serves the built `dist/`, so the local and CI paths are
 * now the same one.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: {
    command: 'node tests/support/serve.mjs',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
    // A local static server binds in milliseconds; a longer wait only delays the diagnosis.
    timeout: 30_000,
  },
});
