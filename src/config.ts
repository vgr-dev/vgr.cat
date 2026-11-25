/**
 * Turnstile sitekeys are public: they ship in the markup by design. The production
 * key is the default so a plain build works with no configuration;
 * `PUBLIC_TURNSTILE_SITE_KEY` overrides it — set that to Cloudflare's always-passes
 * *test* sitekey (`1x00000000000000000000AA`) for automated runs, since a test key
 * works on any domain including localhost.
 */
const PRODUCTION_SITE_KEY = '0x4AAAAAAGPHi96wZq5N-xcv';

export const turnstileSiteKey =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || PRODUCTION_SITE_KEY;

/** Stable surface label. Must match `TURNSTILE_ACTION` in `src/worker/index.ts`. */
export const turnstileAction = 'contact';

/**
 * Single source for every booking CTA. Kept here rather than inline in each component so the
 * campaign/link can change once without hunting through markup, and because the placeholder guard
 * (`scripts/check-placeholders.mjs`) treats an unresolved booking URL as a release blocker.
 */
export const bookingUrl = 'https://calendar.app.google/3dd7SXGnZqUZsWXm6';

/** Public contact address. Mirrors the Worker's `CONTACT_DESTINATION` variable. */
export const contactEmail = 'contact@vgr.cat';

/**
 * The public source repository. One constant for every link to it (the footer now, the process
 * section's proof line later), so the destination cannot drift between components and is never
 * duplicated in the translated dictionaries.
 */
export const repositoryUrl = 'https://github.com/vgr-dev/vgr.cat';
