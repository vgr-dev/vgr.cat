import { expect, test } from '@playwright/test';

/**
 * Page-weight budgets for the home pages, measured on the built site at a fixed viewport.
 *
 * The problem this guards: the home page rendered every case study's summary *and* its full
 * markdown body, so it reached 11,517 px and 2,959 words at 1280×900 (`/`), 12,424 px / 3,649 words
 * (`/ca/`) and 12,839 px / 3,714 words (`/es/`) — 24 mobile screens on a phone. Phase 1 of
 * `.ai/plans/active/2026-10-20-ia-split-and-visual-identity.md` stopped rendering the bodies.
 *
 * Measured after that change, same viewport, `npm run build` + `node tests/support/serve.mjs`:
 *
 *   `/`     7,358 px / 1,728 words
 *   `/ca/`  8,001 px / 2,170 words
 *   `/es/`  8,272 px / 2,201 words
 *
 * The budgets below are each measurement plus ~10% headroom. Catalan and Spanish are budgeted
 * separately rather than sharing the English number, because the translations run ~27% longer and a
 * single budget would either be useless for `en` or immediately broken by a longer translation.
 * Phase 3 tightens all three again when the service bodies leave the home page.
 */
const DESKTOP = { width: 1280, height: 900 };

interface Budget {
  height: number;
  words: number;
}

const BUDGETS: Record<string, Budget> = {
  '/': { height: 8_100, words: 1_900 },
  '/ca/': { height: 8_800, words: 2_390 },
  '/es/': { height: 9_100, words: 2_420 },
};

for (const [path, budget] of Object.entries(BUDGETS)) {
  test(`home page weight stays within budget on ${path}`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(path);

    const measured = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      words: (document.body.innerText || '').trim().split(/\s+/).length,
    }));

    expect(
      measured.height,
      `document height at 1280×900 (budget ${budget.height} px)`,
    ).toBeLessThanOrEqual(budget.height);
    expect(
      measured.words,
      `rendered words at 1280×900 (budget ${budget.words})`,
    ).toBeLessThanOrEqual(budget.words);
  });
}
