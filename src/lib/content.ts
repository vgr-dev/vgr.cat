/**
 * Ordered access to the content collections, keyed by locale.
 *
 * Both the reading orders used to live inline in `HomeSections.astro`. They are here now because
 * the home page, the detail routes and `getStaticPaths` all need the same order, and three copies
 * would drift.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config';

export type ServiceEntry = CollectionEntry<'services'>;
export type CaseStudyEntry = CollectionEntry<'caseStudies'>;
export type Pillar = ServiceEntry['data']['pillar'];

/** Mirrors the collection `pillar` enum, so this is also the home page's capability order. */
const pillarOrder: Pillar[] = [
  'regtech',
  'entity-resolution',
  'infrastructure',
  'iot',
];

/**
 * Explicit reading order. The collection loader returns entries alphabetically, which would put
 * `banco-estado-iot` first and desynchronise the list from `caseStudies.subtitle`, which enumerates
 * regulatory → platform → observability → IoT.
 *
 * UX-031: a reorder edits this array, never the filenames.
 */
const caseStudyOrder = [
  'eu-inspection-tooling',
  'topten-ecosystem',
  'topten-scout',
  'banco-estado-iot',
];

/** Unknown keys sort last, so a future entry cannot jump the queue by accident. */
const caseStudyRank = (key: string) => {
  const index = caseStudyOrder.indexOf(key);
  return index === -1 ? caseStudyOrder.length : index;
};

export async function getServices(locale: Locale): Promise<ServiceEntry[]> {
  const entries = await getCollection(
    'services',
    ({ data }) => data.locale === locale,
  );
  return entries.sort(
    (a, b) =>
      pillarOrder.indexOf(a.data.pillar) - pillarOrder.indexOf(b.data.pillar),
  );
}

export async function getCaseStudies(
  locale: Locale,
): Promise<CaseStudyEntry[]> {
  const entries = await getCollection(
    'caseStudies',
    ({ data }) => data.locale === locale,
  );
  return entries.sort(
    (a, b) =>
      caseStudyRank(a.data.translationKey) -
      caseStudyRank(b.data.translationKey),
  );
}

/** `undefined` rather than a throw: the static route owns the "cannot happen" error. */
export async function getService(
  locale: Locale,
  slug: string,
): Promise<ServiceEntry | undefined> {
  return (await getServices(locale)).find(
    (entry) => entry.data.translationKey === slug,
  );
}

export async function getCaseStudy(
  locale: Locale,
  slug: string,
): Promise<CaseStudyEntry | undefined> {
  return (await getCaseStudies(locale)).find(
    (entry) => entry.data.translationKey === slug,
  );
}

/**
 * The cross-link that keeps `/services/<pillar>/` from being a thin page: the case studies already
 * carry the same `pillar` enum, so the relationship is derived rather than authored twice.
 */
export async function getCaseStudiesByPillar(
  locale: Locale,
  pillar: Pillar,
): Promise<CaseStudyEntry[]> {
  return (await getCaseStudies(locale)).filter(
    (entry) => entry.data.pillar === pillar,
  );
}
