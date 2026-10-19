import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * The structural guarantees the plan treats as non-negotiable: one `h1` per page, no heading level
 * skipped, the four landmarks present, and a skip link that is both the first tab stop and a real
 * route into `main`.
 */

for (const route of ROUTES) {
  test(`structure of ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((heading) =>
        Number(heading.tagName.slice(1)),
      ),
    );
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    for (let index = 1; index < levels.length; index += 1) {
      const previous = levels[index - 1] ?? 0;
      const current = levels[index] ?? 0;
      expect(
        current - previous,
        `heading level jumps from h${previous} to h${current}`,
      ).toBeLessThanOrEqual(1);
    }

    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    expect(
      await page.locator('nav').count(),
      'every page carries at least one nav landmark',
    ).toBeGreaterThan(0);
  });

  test(`skip link of ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => ({
      href: document.activeElement?.getAttribute('href') ?? null,
      text: (document.activeElement?.textContent ?? '').trim(),
    }));
    expect(first.href, 'the first tab stop must be the skip link').toBe(
      '#main-content',
    );
    expect(first.text.length).toBeGreaterThan(0);

    await page.keyboard.press('Enter');
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.id ?? null))
      .toBe('main-content');
  });
}
