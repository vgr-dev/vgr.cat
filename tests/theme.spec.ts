import { expect, test } from '@playwright/test';

/**
 * The theme toggle and the sticky header, as the plan's Phase 4 addition.
 *
 * The toggle is inside the collapsible panel, so on the mobile project it has to be opened first —
 * asserting that is part of the point: a control nobody can reach is not a control.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Start from the OS preference every time, so the assertion about "flipping" is meaningful.
  await page.evaluate(() => localStorage.removeItem('theme'));
  await page.reload();
});

test('the theme toggle flips the theme, reports it, and persists it', async ({
  page,
}) => {
  const toggle = page.locator('[data-theme-toggle]');
  if (!(await toggle.isVisible())) {
    await page.locator('#nav-toggle').click();
  }
  await expect(toggle).toBeVisible();

  const initial = await page.evaluate(
    () => document.documentElement.dataset.theme ?? '',
  );
  expect(['light', 'dark']).toContain(initial);

  await toggle.click();

  const after = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme ?? '',
    stored: localStorage.getItem('theme'),
    pressed: document
      .querySelector('[data-theme-toggle]')
      ?.getAttribute('aria-pressed'),
  }));

  expect(after.theme).not.toBe(initial);
  expect(after.stored, 'the choice is persisted').toBe(after.theme);
  expect(after.pressed, 'aria-pressed reports the theme').toBe(
    String(after.theme === 'dark'),
  );

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', after.theme);
});

test('the header stays at the top once the page scrolls', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 1200));

  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.round(
          document.querySelector('header')?.getBoundingClientRect().top ?? -1,
        ),
      ),
    )
    .toBe(0);
});
