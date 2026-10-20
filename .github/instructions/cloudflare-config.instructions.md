---
description: 'Use when editing wrangler.jsonc or public/_headers. Covers Cloudflare Workers static-asset routing, custom-domain routes, caching and security headers, and the dry-run validation step.'
applyTo: 'wrangler.jsonc, public/_headers'
---

# Cloudflare configuration

## `wrangler.jsonc`

- `assets.directory` is `./dist`, and `assets.not_found_handling: '404-page'` is what makes
  `src/pages/404.astro` actually serve for unknown paths. Dropping it falls back to a Cloudflare default.
- `routes` binds the `vgr.cat` custom domain and is the **single source of truth for what Wrangler
  creates — it is not a reconciler.** A deploy **does not delete** routes that are absent from this file:
  a dashboard-only `*.vgr.cat/*` route, verified 2026-10-16, survived **five** deploys with no
  `route_delete` event in the account audit log and had to be removed in the dashboard. Config and account
  can therefore drift, so when a route's behaviour actually matters, read the account
  (`GET /zones/{zone}/workers/routes`) rather than trusting this file.
- **Never add a wildcard `*.vgr.cat/*` route.** A catch-all silently answers on every present _and
  future_ subdomain. This was deliberately removed once already; do not reintroduce it.
- `route` / `routes` must be given per environment. `vars` and bindings are non-inheritable.
- **Never run `npx wrangler rollback`** — it republishes an older version to live production. Ask first.

Validate any change without deploying:

```bash
npx wrangler deploy --dry-run --outdir=.wrangler/dry-run   # expect exit 0, "Read 32 files", no warnings
```

## `public/_headers`

- **Applies to static assets only** — never to Worker-generated responses.
- **Inert under `npm run preview`**, so header behaviour can only be verified against a real deployment.
- Do not put a CSP here. See `.github/instructions/astro-config.instructions.md` for why.

## Gotchas

- `dist/_astro/` now holds the stylesheet (`PageShell.<hash>.css`, ~40 KB) and every font subset, so the
  `/_astro/*` `immutable` rule is **live**, not dormant. It stopped being dormant on 2026-10-20, when
  `global.css` crossed Astro's inline threshold; the built pages link that file and carry no inline
  `<style>`.
- `/_headers` itself correctly returns `404` in production — it is configuration, not a served asset.
