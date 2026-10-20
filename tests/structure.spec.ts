import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { HOME_ROUTES, ROUTES } from './routes';

/**
 * The structural guarantees the plan treats as non-negotiable: one `h1` per page, no heading level
 * skipped, the four landmarks present, and a skip link that is both the first tab stop and a real
 * route into `main`.
 *
 * The last group is the de-duplication guarantee from Phase 1 of
 * `.ai/plans/active/2026-10-20-ia-split-and-visual-identity.md`: a case study's summary is rendered
 * exactly once, and its markdown body — which restated the same three ideas as the card's `<dl>` —
 * is not rendered on the home page at all. The needles are read from the markdown on disk rather
 * than copied into this file, so editing a case study cannot silently invalidate the check.
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

const CASE_STUDY_DIR = join(process.cwd(), 'src/content/caseStudies');

interface CaseStudyCopy {
  /** Frontmatter `summary`, which the card renders. */
  summary: string;
  /** First long prose line of the body, which the card must not render. */
  bodyLine: string;
}

/** Read the assertion needles straight from the markdown that produced the page. */
function caseStudyCopy(locale: string): CaseStudyCopy[] {
  return readdirSync(CASE_STUDY_DIR)
    .filter((name) => name.endsWith(`.${locale}.md`))
    .map((name) => {
      const lines = readFileSync(join(CASE_STUDY_DIR, name), 'utf8').split(
        '\n',
      );
      const close = lines.indexOf('---', 1);
      if (close === -1) {
        throw new Error(`${name} has no frontmatter terminator`);
      }

      const summaryLine = lines
        .slice(1, close)
        .find((line) => line.startsWith('summary: '));
      if (summaryLine === undefined) {
        throw new Error(`${name} has no summary field`);
      }

      const bodyLine = lines
        .slice(close + 1)
        .find(
          (line) => line.trim().length >= 80 && !/^[#\-*>\d]/.test(line.trim()),
        );
      if (bodyLine === undefined) {
        throw new Error(`${name} has no long prose line to assert against`);
      }

      return {
        summary: summaryLine.slice('summary: '.length).replace(/^'|'$/g, ''),
        bodyLine: bodyLine.trim(),
      };
    });
}

/** Rendered text wraps, so compare on collapsed whitespace. */
function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function countOccurrences(haystack: string, needle: string): number {
  return normalize(haystack).split(normalize(needle)).length - 1;
}

for (const route of HOME_ROUTES) {
  const locale = route.path === '/' ? 'en' : route.path.split('/')[1];

  test(`case-study copy is not duplicated on ${route.path}`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const body = normalize(await page.evaluate(() => document.body.innerText));

    for (const { summary, bodyLine } of caseStudyCopy(locale)) {
      expect(
        countOccurrences(body, summary),
        `the summary "${summary.slice(0, 40)}…" must appear exactly once`,
      ).toBe(1);
      expect(
        body,
        `the markdown body of "${summary.slice(0, 40)}…" must not be on the home page`,
      ).not.toContain(normalize(bodyLine));
    }

    const outline = await page.evaluate(() => ({
      cards: document.querySelectorAll('#work article').length,
      headings: document.querySelectorAll(
        '#work article h1, #work article h2, #work article h3, #work article h4, #work article h5, #work article h6',
      ).length,
    }));

    expect(
      outline.cards,
      'the work section must still list its studies',
    ).toBeGreaterThan(0);
    expect(
      outline.headings,
      'each case-study card contributes exactly one heading',
    ).toBe(outline.cards);
  });
}

const COLLECTION_DIR: Record<'work' | 'services', string> = {
  work: CASE_STUDY_DIR,
  services: join(process.cwd(), 'src/content/services'),
};

/** `/work/<slug>/`, `/ca/services/<slug>/`, … → the three parts the assertions need. */
const DETAIL_PATTERN = /^\/(?:(ca|es)\/)?(work|services)\/([^/]+)\/$/;

const DETAIL_ROUTES = ROUTES.filter((route) => DETAIL_PATTERN.test(route.path));

function frontmatterTitle(dir: string, locale: string, slug: string): string {
  const file = join(dir, `${slug}.${locale}.md`);
  const line = readFileSync(file, 'utf8')
    .split('\n')
    .find((value) => value.startsWith('title: '));
  if (line === undefined) {
    throw new Error(`${file} has no title field`);
  }
  return line.slice('title: '.length).replace(/^'|'$/g, '');
}

/**
 * Detail pages own the trail and the title: the breadcrumb landmark must exist, and the `h1` must
 * be the collection entry's own title — a copy change in the markdown cannot leave the page
 * advertising a stale heading.
 */
for (const route of DETAIL_ROUTES) {
  const match = route.path.match(DETAIL_PATTERN);
  if (match === null) {
    throw new Error(`cannot parse detail route ${route.path}`);
  }
  const locale = match[1] ?? 'en';
  const kind = match[2] === 'work' ? 'work' : 'services';
  const slug = match[3] ?? '';

  test(`detail chrome of ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.locator('nav[data-breadcrumbs]')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(
      frontmatterTitle(COLLECTION_DIR[kind], locale, slug),
    );
  });
}
