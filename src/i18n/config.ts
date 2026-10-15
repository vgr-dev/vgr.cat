export const locales = ['en', 'ca', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Map a logical, locale-independent path to its URL in `locale`. */
export function localizedPath(locale: Locale, path = '/'): string {
  const logical = path.startsWith('/') ? path : `/${path}`;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  if (logical === '/') return prefix === '' ? '/' : `${prefix}/`;
  return `${prefix}${logical}`;
}

/** Strip a non-default locale prefix from a pathname, yielding the logical path. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first !== undefined && first !== defaultLocale && isLocale(first)) {
    const rest = segments.slice(1).join('/');
    return rest === '' ? '/' : `/${rest}`;
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}
