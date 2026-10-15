import { defaultLocale, type Locale } from './config';
import { en, type Dictionary } from './en';
import { ca } from './ca';
import { es } from './es';

export const dictionaries: Record<Locale, Dictionary> = { en, ca, es };

export type { Dictionary };

/** UI dictionary for `locale`. Typed as total, and `ca`/`es` must match `en`'s shape. */
export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
