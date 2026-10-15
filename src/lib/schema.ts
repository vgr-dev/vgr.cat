import type { Dictionary } from '../i18n';
import { localizedPath, type Locale } from '../i18n/config';

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

/** `Person` + `ProfessionalService` nodes for the home page. */
export function buildJsonLd({ locale, t, email, sameAs }: JsonLdInput) {
  const home = pageUrl(locale);

  const person = {
    '@type': 'Person',
    '@id': `${home}#person`,
    name: t.header.brand,
    jobTitle: t.hero.title,
    description: t.positioning.body,
    url: home,
    ...(email ? { email } : {}),
    ...(sameAs ? { sameAs } : {}),
  };

  const service = {
    '@type': 'ProfessionalService',
    '@id': `${home}#service`,
    name: t.header.brand,
    description: t.meta.description,
    url: home,
    areaServed: ['ES', 'EU'],
    founder: { '@id': person['@id'] },
    knowsLanguage: ['en', 'ca', 'es'],
  };

  return { '@context': 'https://schema.org', '@graph': [person, service] };
}
