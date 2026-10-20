/**
 * Logical (locale-independent) paths for the detail templates.
 *
 * Nothing here knows about locales: callers pass the result through `localizedPath(locale, path)`,
 * so the `ca`/`es` prefixing stays in exactly one place (`src/i18n/config.ts`) and the route files,
 * the cards, the breadcrumbs and the sitemap cannot disagree about where a page lives.
 */
export function servicePath(translationKey: string): string {
  return `/services/${translationKey}/`;
}

export function caseStudyPath(translationKey: string): string {
  return `/work/${translationKey}/`;
}

export function aboutPath(): string {
  return '/about/';
}
