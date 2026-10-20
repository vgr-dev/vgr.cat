---
description: 'Use when editing astro.config.mjs. Covers the Content Security Policy setup, why script-src and style-src hashes are never hand-written, sitemap requirements, and build options that must not be changed casually.'
applyTo: 'astro.config.mjs'
---

# `astro.config.mjs`

## `site` is mandatory

`@astrojs/sitemap` cannot emit absolute URLs without it, and it also feeds `BaseLayout`'s canonical URL.
It must stay `https://vgr.cat`.

## `output: 'static'` — do not add an adapter

No `@astrojs/cloudflare`. Every page is prerendered and `dist/` is uploaded to Workers as static assets.
Adding an adapter changes the deployment model — raise it with the user first.

## Content Security Policy

`security.csp` emits a build-time `<meta http-equiv="content-security-policy">` on every prerendered page,
carrying Astro-generated hashes for the inline styles/scripts Astro emits.

- **Never hand-write `script-src` or `style-src`.** Astro owns those hashes and they change on every
  build. Adding `'unsafe-inline'` to "fix" a blocked resource removes the protection entirely.
- The `directives` array carries only the **extra** directives — currently `default-src`, `img-src`,
  `object-src`, `base-uri`, `form-action`.
- Do **not** add `frame-ancestors`: browsers ignore it in `<meta>`-delivered CSP. Clickjacking is handled
  by `X-Frame-Options: DENY` in `public/_headers`.
- Do **not** move CSP into `public/_headers`. A hand-written header cannot track per-build hashes, which
  is the whole reason `security.csp` is used.
- Astro emits 5 orphan `script-src` hashes although the built pages contain no `<script>` elements. This
  is harmless, not a misconfiguration.

## Do not set `build.inlineStylesheets: 'never'`

`src/styles/global.css` crossed Astro's inline threshold on 2026-10-20: the built pages now link
`/_astro/PageShell.<hash>.css` (~40 KB) instead of inlining a `<style>` block, so `dist/_astro/` holds the
stylesheet as well as the font subsets, and `dist/index.html` contains no `<style>` at all. `style-src`
therefore carries `'self'` (plus an empty-string hash) rather than a content hash. Nothing needs to change
for that — `'self'` is already in the policy — but do not "fix" it with `inlineStylesheets: 'never'`, and
do not assume an inline block when you verify hashes.

## Verifying a CSP change

Never claim a CSP change works from the config alone. Confirm the emitted hashes match, then test in a
browser:

```bash
npm run build
grep -o 'content-security-policy[^>]*' dist/index.html
```

Load the built page with a `securitypolicyviolation` listener installed and assert **zero** violations.
Assert computed styles actually applied too — a present-but-blocked stylesheet still renders unstyled.

**`npm run dev` emits no CSP meta tag at all**, so a CSP regression will not surface during local
development. You must build to see it.
