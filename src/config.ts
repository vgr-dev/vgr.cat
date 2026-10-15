/**
 * Turnstile sitekeys are public: they ship in the markup by design. The production
 * key is the default so a plain build works with no configuration;
 * `PUBLIC_TURNSTILE_SITE_KEY` overrides it — set that to Cloudflare's always-passes
 * *test* sitekey (`1x00000000000000000000AA`) for automated runs, since a test key
 * works on any domain including localhost.
 */
const PRODUCTION_SITE_KEY = '0x4AAAAAAFX7NYXtXTGajTgb';

export const turnstileSiteKey =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || PRODUCTION_SITE_KEY;

/** Stable surface label. Must match `TURNSTILE_ACTION` in `src/worker/index.ts`. */
export const turnstileAction = 'contact';
