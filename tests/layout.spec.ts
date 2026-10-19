import { expect, test } from '@playwright/test';
import { HOME_ROUTES, ROUTES } from './routes';

/**
 * The two layout rules Phase 5 established, as assertions rather than measurements in a plan:
 * 320 px never scrolls sideways, and no prose-bearing grid cell is narrower than 280 px.
 */

const PROSE_GRIDS = [
  '#services .grid > *',
  '#work article dl > div',
  '#contact dl > div',
  'main section dl > div',
];

for (const route of ROUTES) {
  test(`no horizontal scroll at 320px on ${route.path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(route.path);

    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(widths.scroll, 'the document must not scroll horizontally').toBe(
      widths.client,
    );
  });
}

test('320px holds with the challenge widget at its 300px minimum', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');

  // The widget cannot render below 300 px and the network is not part of this assertion, so the
  // worst case is simulated directly: this is the geometry that used to overflow the document.
  await page.evaluate(() => {
    const widget = document.querySelector<HTMLElement>('#contact-turnstile');
    if (widget) {
      widget.style.minWidth = '300px';
      widget.style.width = '300px';
    }
  });

  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    frame: document.querySelector('.turnstile-frame')?.scrollWidth ?? 0,
  }));
  expect(widths.scroll).toBe(widths.client);
  expect(
    widths.frame,
    'the widget itself is allowed to scroll inside its frame',
  ).toBeLessThanOrEqual(320);
});

for (const route of HOME_ROUTES) {
  test(`no prose column below 280px at 640px on ${route.path}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    await page.goto(route.path);

    const cells = await page.evaluate((selectors) => {
      const widths: { selector: string; width: number }[] = [];
      for (const selector of selectors) {
        for (const element of document.querySelectorAll(selector)) {
          widths.push({
            selector,
            width: element.getBoundingClientRect().width,
          });
        }
      }
      return widths;
    }, PROSE_GRIDS);

    expect(cells.length, 'the grids must actually be present').toBeGreaterThan(
      0,
    );
    for (const cell of cells) {
      expect(
        cell.width,
        `${cell.selector} measured ${cell.width}px at 640px`,
      ).toBeGreaterThanOrEqual(280);
    }
  });
}
