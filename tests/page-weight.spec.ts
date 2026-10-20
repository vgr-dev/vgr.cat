import { expect, test } from '@playwright/test';

/**
 * Page-weight budgets for the home pages, measured on the built site at fixed viewports.
 *
 * The problem this guards: the home page used to render every case study's summary *and* its full
 * markdown body, so it reached 11,517 px and 2,959 words at 1280×900 (`/`), 12,424 px / 3,649 words
 * (`/ca/`) and 12,839 px / 3,714 words (`/es/`) — 24 mobile screens on a phone.
 *
 * Phase 1 (`.ai/plans/active/2026-10-20-ia-split-and-visual-identity.md`) stopped rendering the
 * case-study bodies. Phase 3 turned the page into a hub: service cards carry a summary instead of
 * the markdown body, case-study cards render a teaser, the CV became an About teaser linking to
 * `/about/`, and a CTA band was added. Measured after Phase 3, same viewport:
 *
 *   `/`     4,792 px / 744 words   `/ca/` 5,057 / 928   `/es/` 5,137 / 929
 *   390×844: `/` 7,703 px          `/es/` 8,155 px
 *   tallest home card: 331 px in all three locales
 *
 * The budgets are the Phase 3 targets, not the measurements: 5,500 px desktop and 1,700 words are
 * what "scannable in three seconds" was defined as, and every locale fits inside them with ~7%
 * headroom on the longest one. The card budget is what forces the teaser to stay a teaser — a
 * locale whose translation reflows past it has to shorten the copy, not grow the card.
 */
const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const HEIGHT_BUDGET = 5_500;
const MOBILE_HEIGHT_BUDGET = 12_000;
const WORD_BUDGET = 1_700;
const CARD_BUDGET = 340;

const HOME_PAGES = ['/', '/ca/', '/es/'];

for (const path of HOME_PAGES) {
  test(`home page weight stays within budget on ${path}`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(path);

    const measured = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      words: (document.body.innerText || '').trim().split(/\s+/).length,
      tallestCard: Math.max(
        0,
        ...[
          ...document.querySelectorAll('#services article, #work article'),
        ].map((card) => Math.round(card.getBoundingClientRect().height)),
      ),
      cards: document.querySelectorAll('#services article, #work article')
        .length,
    }));

    expect(measured.height, 'document height at 1280×900').toBeLessThanOrEqual(
      HEIGHT_BUDGET,
    );
    expect(measured.words, 'rendered words at 1280×900').toBeLessThanOrEqual(
      WORD_BUDGET,
    );
    expect(measured.cards, 'the hub must still list its cards').toBeGreaterThan(
      0,
    );
    expect(
      measured.tallestCard,
      `the tallest home card at 1280×900 (budget ${CARD_BUDGET} px)`,
    ).toBeLessThanOrEqual(CARD_BUDGET);
  });

  test(`home page stays within the mobile budget on ${path}`, async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(path);

    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    expect(height, 'document height at 390×844').toBeLessThanOrEqual(
      MOBILE_HEIGHT_BUDGET,
    );
  });
}
