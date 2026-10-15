#!/usr/bin/env node
// A Turnstile *test* sitekey in production silently disables bot protection, so the
// deploy workflow refuses to build with one. Values are Cloudflare's published test keys.
const TEST_SITE_KEYS = new Set([
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '1x00000000000000000000BB',
  '2x00000000000000000000BB',
  '3x00000000000000000000FF',
]);

const siteKey = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

if (siteKey === '') {
  console.log(
    'check:production-env — PUBLIC_TURNSTILE_SITE_KEY is unset; the committed production sitekey is used.',
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
  'check:production-env — Turnstile site key is not a test key; proceeding.',
);
