---
description: 'Use when editing wrangler.jsonc or public/_headers. Covers Cloudflare Workers static-asset routing, custom-domain routes, caching and security headers, and the dry-run validation step.'
applyTo: ['wrangler.jsonc', 'public/_headers']
---

# Cloudflare configuration

## `wrangler.jsonc`

- `assets.directory` is `./dist`, and `assets.not_found_handling: '404-page'` is what makes
  `src/pages/404.astro` actually serve for unknown paths. Dropping it falls back to a Cloudflare default.
- `routes` binds the `vgr.cat` custom domain and is the **single source of truth**. Wrangler reconciles
  routes on every deploy, so a route added only in the dashboard disappears on the next deploy.
- **Never add a wildcard `*.vgr.cat/*` route.** A catch-all silently answers on every present _and
  future_ subdomain. This was deliberately removed once already; do not reintroduce it.
- `route` / `routes` must be given per environment. `vars` and bindings are non-inheritable.
- **Never run `npx wrangler rollback`** — it republishes an older version to live production. Ask first.

Validate any change without deploying:

```bash
npx wrangler deploy --dry-run --outdir=.wrangler/dry-run   # expect exit 0, "Read 8 files", no warnings
```

## `public/_headers`

- **Applies to static assets only** — never to Worker-generated responses.
- **Inert under `npm run preview`**, so header behaviour can only be verified against a real deployment.
- Do not put a CSP here. See `.github/instructions/astro-config.instructions.md` for why.

## Gotchas

- `dist/_astro/` is empty by design at this scale, so the `/_astro/*` `immutable` rule is **dormant, not
  dead**. It activates on its own once an asset exceeds Astro's inline threshold.
- `/_headers` itself correctly returns `404` in production — it is configuration, not a served asset.
