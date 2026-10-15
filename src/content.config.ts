import { defineCollection } from 'astro:content';
// astro:schema is deprecated in Astro 7 and removed in Astro 8; astro/zod is the supported path.
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const pillar = z.enum(['regtech', 'entity-resolution', 'infrastructure']);
const locale = z.enum(['en', 'ca', 'es']);

/** Shared shape so a `ca`/`es` entry cannot silently drop a field. */
const localizedEntry = z.object({
  translationKey: z.string(),
  locale,
  title: z.string(),
  summary: z.string(),
  pillar,
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: localizedEntry,
});

const caseStudies = defineCollection({
  loader: glob({ base: './src/content/caseStudies', pattern: '**/*.md' }),
  schema: localizedEntry,
});

export const collections = { services, caseStudies };
