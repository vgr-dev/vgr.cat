---
description: 'Use when editing Astro components, layouts, or styles under src/. Covers the Astro-components-only rule and the Content Security Policy constraints that only surface in a production build.'
applyTo: 'src/**'
---

# Source (`src/`)

The whole site is 4 files: `layouts/BaseLayout.astro`, `pages/index.astro`, `pages/404.astro`, and
`styles/global.css`.

## Astro components only

No React/Vue/Svelte. Adding a client-side framework is an explicit bootstrap non-goal — raise it with the
user before introducing one.

## The CSP constrains what you can add

The site ships a strict `<meta>` CSP. Astro hashes the inline `<style>`/`<script>` blocks **it** emits, so
those are safe. What breaks:

- **External scripts or stylesheets** (a CDN, a font provider, analytics): the policy is
  `default-src 'self'`, so an unhashed external origin is blocked. It needs an explicit
  `scriptDirective.resources` / `styleDirective.resources` entry in `astro.config.mjs`. **Add the resource
  and its CSP entry in the same change** — never one without the other.
- **Inline `style=""` attributes** are not covered by Astro's hashes. They require
  `{ resource: "'unsafe-inline'", kind: "attribute" }`.

**This will not fail locally.** `npm run dev` emits no CSP meta tag, so a violation introduced here looks
fine in development and only appears after `npm run build`, or in production. Always build and
browser-check after changing rendering or adding any external resource.

## Conventions

- Formatting is owned by Prettier (`npm run format`): 2-space indent, single quotes.
- `BaseLayout.astro` owns `<head>` — title, description, canonical link, OG/Twitter meta and the global
  CSS import. Add page-level head concerns there, not per page.
