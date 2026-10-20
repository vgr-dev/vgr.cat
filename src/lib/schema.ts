import type { Dictionary } from '../i18n';
import { localizedPath, type Locale } from '../i18n/config';
import type { CaseStudyEntry, ServiceEntry } from './content';
import { aboutPath, caseStudyPath, servicePath } from './paths';

const SITE = 'https://vgr.cat';

export interface JsonLdInput {
  locale: Locale;
  t: Dictionary;
  /** Contact address and external profiles are wired in a later phase. */
  email?: string;
  sameAs?: string[];
}

function pageUrl(locale: Locale, path = '/'): string {
  return new URL(localizedPath(locale, path), SITE).href;
}

/**
 * The `Person` node's `@id`. Detail pages point `creator`/`provider` at the same id the home page
 * publishes, so the graph describes one person rather than one per page.
 */
function personId(locale: Locale): string {
  return `${pageUrl(locale)}#person`;
}

/** `Person` + `ProfessionalService` nodes for the home page. */
export function buildJsonLd({ locale, t, email, sameAs }: JsonLdInput) {
  const home = pageUrl(locale);

  const person = {
    '@type': 'Person',
    '@id': personId(locale),
    name: t.site.author,
    jobTitle: t.site.jobTitle,
    description: t.site.description,
    address: t.site.location,
    url: home,
    // Read from the About section so the structured data cannot drift from the visible copy (Q-7 keeps
    // `areaServed` at ES/EU; client geography is not published).
    knowsAbout: t.about.competencies,
    ...(email ? { email } : {}),
    ...(sameAs ? { sameAs } : {}),
  };

  const service = {
    '@type': 'ProfessionalService',
    '@id': `${home}#service`,
    name: t.header.brand,
    description: t.site.description,
    url: home,
    areaServed: ['ES', 'EU'],
    founder: { '@id': person['@id'] },
    knowsLanguage: ['en', 'ca', 'es'],
  };

  return { '@context': 'https://schema.org', '@graph': [person, service] };
}

export interface EntryJsonLdInput {
  locale: Locale;
  t: Dictionary;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

function buildBreadcrumbs(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Home → section → entry: the same trail `Breadcrumbs.astro` renders above the title. */
function caseStudyTrail(
  locale: Locale,
  t: Dictionary,
  entry: CaseStudyEntry,
): BreadcrumbItem[] {
  const home = pageUrl(locale);
  return [
    { name: t.breadcrumbs.home, url: home },
    { name: t.nav.caseStudies, url: `${home}#work` },
    {
      name: entry.data.title,
      url: pageUrl(locale, caseStudyPath(entry.data.translationKey)),
    },
  ];
}

/** `CreativeWork` + `BreadcrumbList` for `/work/<translationKey>/`. */
export function buildWorkJsonLd({
  locale,
  t,
  entry,
}: EntryJsonLdInput & { entry: CaseStudyEntry }): Record<string, unknown> {
  const url = pageUrl(locale, caseStudyPath(entry.data.translationKey));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: entry.data.title,
        description: entry.data.summary,
        url,
        inLanguage: locale,
        keywords: t.services.pillars[entry.data.pillar].tag,
        creator: { '@id': personId(locale) },
      },
      buildBreadcrumbs(caseStudyTrail(locale, t, entry)),
    ],
  };
}

/** `Service` + `BreadcrumbList` for `/services/<translationKey>/`. */
export function buildServiceJsonLd({
  locale,
  t,
  entry,
}: EntryJsonLdInput & { entry: ServiceEntry }): Record<string, unknown> {
  const url = pageUrl(locale, servicePath(entry.data.translationKey));
  const home = pageUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: entry.data.title,
        description: entry.data.summary,
        url,
        inLanguage: locale,
        serviceType: t.services.pillars[entry.data.pillar].tag,
        areaServed: ['ES', 'EU'],
        provider: { '@id': personId(locale) },
      },
      buildBreadcrumbs([
        { name: t.breadcrumbs.home, url: home },
        { name: t.nav.services, url: `${home}#services` },
        { name: entry.data.title, url },
      ]),
    ],
  };
}

/** `ProfilePage` + the same `Person` node the home page publishes. */
export function buildAboutJsonLd({
  locale,
  t,
}: EntryJsonLdInput): Record<string, unknown> {
  const url = pageUrl(locale, aboutPath());
  const home = pageUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        url,
        inLanguage: locale,
        mainEntity: { '@id': personId(locale) },
      },
      {
        '@type': 'Person',
        '@id': personId(locale),
        name: t.site.author,
        jobTitle: t.site.jobTitle,
        description: t.site.description,
        address: t.site.location,
        url: home,
        knowsAbout: t.about.competencies,
      },
      buildBreadcrumbs([
        { name: t.breadcrumbs.home, url: home },
        { name: t.about.title, url },
      ]),
    ],
  };
}
