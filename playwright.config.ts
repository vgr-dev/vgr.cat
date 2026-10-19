import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the **built** site, never `astro dev`: the production build is the only place the
 * CSP meta tag, the hashed assets and the inline-script hashes exist, and every defect this suite
 * guards surfaced there rather than in development (see the plan's Phase 6 and 7 notes).
 *
 * `astro preview` daemonises in Astro 7 — it prints a pid and exits — so the command starts it and
 * then holds a foreground process open for Playwright. `posttest:e2e` stops the daemon afterwards,
 * which also guarantees the next run starts against the freshly built `dist/`.
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
    command: 'npm run preview && node -e "setTimeout(() => {}, 1e9)"',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
