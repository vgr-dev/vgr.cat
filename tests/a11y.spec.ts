import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * WCAG 2.0 A/AA plus 2.2 AA on every route, with `color-contrast` included (there are no gradient
 * or translucent backgrounds on this site, which is the case the rule is unreliable on).
 */
for (const route of ROUTES) {
  test(`axe on ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target.join(' ')),
      })),
    ).toEqual([]);
  });
}
