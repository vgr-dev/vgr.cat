#!/usr/bin/env node
// A Turnstile *test* sitekey in production silently disables bot protection, so the deploy
// workflow refuses to build with one. Two things are checked: the PUBLIC_TURNSTILE_SITE_KEY
// override and the committed PRODUCTION_SITE_KEY in src/config.ts. Values are Cloudflare's
// published test keys.
import { readFileSync } from 'node:fs';

const TEST_SITE_KEYS = new Set([
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '1x00000000000000000000BB',
  '2x00000000000000000000BB',
  '3x00000000000000000000FF',
]);

// Read the source instead of importing it: `src/config.ts` is TypeScript, and matching the
// literal keeps this script runnable with no loader flags.
const CONFIG_FILE = new URL('../src/config.ts', import.meta.url);
const COMMITTED_KEY_RE = /const\s+PRODUCTION_SITE_KEY\s*=\s*'([^']+)'/;

function committedSiteKey() {
  const match = readFileSync(CONFIG_FILE, 'utf8').match(COMMITTED_KEY_RE);
  return match ? match[1] : null;
}

const committed = committedSiteKey();
if (committed === null) {
  console.error(
    'check:production-env — refusing to deploy: PRODUCTION_SITE_KEY was not found in src/config.ts, so the committed sitekey cannot be verified.',
  );
  process.exit(1);
}
if (TEST_SITE_KEYS.has(committed)) {
  console.error(
    `check:production-env — refusing to deploy: the committed PRODUCTION_SITE_KEY is the Turnstile test sitekey ${committed}.`,
  );
  process.exit(1);
}

const siteKey = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

if (siteKey === '') {
  console.log(
    'check:production-env — no PUBLIC_TURNSTILE_SITE_KEY override; the committed sitekey is used and is not a test key.',
  );
  process.exit(0);
}

if (TEST_SITE_KEYS.has(siteKey)) {
  console.error(
    `check:production-env — refusing to deploy with the Turnstile test sitekey ${siteKey}.`,
  );
  console.error(
    'A test sitekey always passes, so shipping it would disable bot protection entirely.',
  );
  process.exit(1);
}

console.log(
  'check:production-env — both the committed and the override Turnstile sitekeys are non-test keys; proceeding.',
);
