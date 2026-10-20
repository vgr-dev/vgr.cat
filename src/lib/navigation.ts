/**
 * The site navigation, owned in one place because the header and the footer must never disagree
 * about it, and because three pages used to rebuild the same array inline (UX-008).
 *
 * Two entries are still fragments: the home page is the index for capabilities and case studies, so
 * `/services/*` and `/work/*` have no index page of their own — only detail pages. `section` carries
 * the fragment id the scroll-spy watches, and is absent for the entry that is a real page.
 *
 * `prefixes` is what lets the header mark a detail page as its own entry: while the reader is on
 * `/work/topten-ecosystem/`, "Case Studies" is the current item even though its link points at the
 * home page's section.
 */
import { useTranslations } from '../i18n';
import { localizedPath, type Locale } from '../i18n/config';
import { aboutPath } from './paths';

export interface NavItem {
  /** Absolute href, already locale-prefixed. */
  href: string;
  label: string;
  /** Fragment id of the in-page target, when this entry points into the home page. */
  section?: string;
  /** Logical path prefixes that count as "this entry" for `aria-current`. */
  prefixes?: string[];
}

export function sectionNav(locale: Locale): NavItem[] {
  const t = useTranslations(locale);
  const home = localizedPath(locale, '/');
  return [
    {
      href: `${home}#services`,
      label: t.nav.services,
      section: 'services',
      prefixes: ['/services/'],
    },
    {
      href: `${home}#work`,
      label: t.nav.caseStudies,
      section: 'work',
      prefixes: ['/work/'],
    },
    {
      href: localizedPath(locale, aboutPath()),
      label: t.nav.about,
      prefixes: ['/about/'],
    },
    { href: `${home}#contact`, label: t.nav.contact, section: 'contact' },
  ];
}
