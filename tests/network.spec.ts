import { expect, test } from '@playwright/test';

/**
 * The two network promises behind Phase 6: the third-party challenge is not fetched until it is
 * needed, and exactly one font file is fetched at all.
 *
 * Neither assertion depends on the challenge actually loading — the `<script>` element is counted,
 * not the response — so a CDN outage cannot fail these tests.
 */
test('a fresh page makes no third-party request and fetches one font', async ({
  page,
}) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));

  await page.goto('/');
  await page.waitForLoadState('load');

  expect(
    requested.filter((url) => url.includes('challenges.cloudflare.com')),
    'the challenge script must not load before it is needed',
  ).toEqual([]);

  expect(
    requested.filter((url) => url.endsWith('.woff2')),
    'only the latin subset is requested',
  ).toHaveLength(1);
});

test('the challenge loads once, when the form approaches the viewport', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.locator('script[src*="challenges.cloudflare.com"]'),
  ).toHaveCount(0);

  await page.evaluate(() =>
    document.getElementById('contact')?.scrollIntoView(),
  );

  const script = page.locator('script[src*="challenges.cloudflare.com"]');
  await expect(script).toHaveCount(1, { timeout: 20_000 });
  expect(await script.getAttribute('src')).toContain('render=explicit');

  // Repeated interaction must not add a second script or a second widget.
  for (let index = 0; index < 3; index += 1) {
    await page.locator('#contact-name').click();
    await page.keyboard.press('Tab');
  }
  await expect(script).toHaveCount(1);
  await expect(page.locator('[data-turnstile] > *')).toHaveCount(1);
});
