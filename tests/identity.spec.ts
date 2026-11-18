import { expect, test } from '@playwright/test';
import { ca } from '../src/i18n/ca';
import { en } from '../src/i18n/en';
import { es } from '../src/i18n/es';

/**
 * The identity and positioning copy that spans the head, the structured data and the chrome: the
 * page title, the JSON-LD `Person`, the hero and CTA-band anchors, the footer's source link and the
 * About page. Each of these reads from a different place in the dictionary, so a stale value in one
 * would otherwise survive a rewrite of the rest.
 *
 * The expected values come from the dictionaries, except the repository URL: it is the approved
 * destination from the copy deck, deliberately not read from `src/config.ts`, so a wrong constant
 * fails here instead of agreeing with itself. (`config.ts` also reads `import.meta.env`, which
 * plain Node, where this file runs, does not define.)
 */

const REPOSITORY_URL = 'https://github.com/vgr-dev/vgr.cat';

const LOCALES = [
  { locale: 'en', home: '/', about: '/about/', t: en },
  { locale: 'ca', home: '/ca/', about: '/ca/about/', t: ca },
  { locale: 'es', home: '/es/', about: '/es/about/', t: es },
] as const;

for (const { locale, home, about, t } of LOCALES) {
  test(`the ${locale} home page carries the new title and structured data`, async ({
    page,
  }) => {
    await page.goto(home);

    await expect(page).toHaveTitle(t.site.title);

    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const graph = (
      JSON.parse(raw ?? '{}') as { '@graph': Record<string, unknown>[] }
    )['@graph'];
    const person = graph.find((node) => node['@type'] === 'Person');
    const service = graph.find(
      (node) => node['@type'] === 'ProfessionalService',
    );

    expect(person?.name).toBe('Victor Gonzalez');
    expect(person?.jobTitle).toBe(t.site.jobTitle);
    expect(person?.address).toBe(t.site.location);
    expect(person?.knowsAbout).toEqual(t.about.competencies);
    // English and Spanish are the working languages; Catalan is welcome but not claimed.
    expect(service?.knowsLanguage).toEqual(['en', 'es']);
  });

  test(`the ${locale} hero and CTA band send the secondary action to the work section`, async ({
    page,
  }) => {
    await page.goto(home);

    await expect(
      page.locator(`a[href="#work"]:text-is("${t.hero.ctaSecondary}")`),
    ).toHaveCount(2);
    await expect(
      page.locator('dl dt').filter({ hasText: t.hero.metrics[0]?.value ?? '' }),
    ).toHaveCount(1);
    await expect(page.locator('#work')).toHaveCount(1);
  });

  test(`the ${locale} footer names the author and links to the source`, async ({
    page,
  }) => {
    await page.goto(home);

    const footer = page.locator('footer');
    await expect(footer).toContainText(
      `© ${new Date().getFullYear()} ${t.site.author}.`,
    );

    const source = footer.getByRole('link', { name: t.footer.sourceLabel });
    await expect(source).toHaveCount(1);
    await expect(source).toHaveAttribute('href', REPOSITORY_URL);
  });

  test(`the ${locale} About page lists three roles and ten competencies`, async ({
    page,
  }) => {
    await page.goto(about);

    await expect(page.locator('h1')).toHaveText(t.about.title);
    await expect(page.locator('main dl dt')).toHaveCount(3);
    await expect(page.locator('main ul li')).toHaveCount(10);
    await expect(page.locator('main')).toContainText(t.about.credentials);
  });
}
