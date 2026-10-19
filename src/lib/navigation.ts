/**
 * The in-page navigation, owned in one place because the header and the footer must never
 * disagree about it, and because three pages used to rebuild the same array inline (UX-008).
 *
 * The fragments are identical in every locale — they are section ids on the one page that has
 * them — so only the labels come from the dictionary.
 */
import { useTranslations } from '../i18n';
import type { Locale } from '../i18n/config';

export interface NavItem {
  /** In-page fragment such as `#work`; also the section id without the `#`. */
  href: string;
  label: string;
}

export function sectionNav(locale: Locale): NavItem[] {
  const t = useTranslations(locale);
  return [
    { href: '#services', label: t.nav.services },
    { href: '#work', label: t.nav.caseStudies },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];
}
