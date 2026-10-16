# vgr.cat

Static site for [vgr.cat](https://vgr.cat), built with **Astro** and served from
**Cloudflare Workers** as a static-assets project.

## Stack

| Layer      | Choice                                                               |
| ---------- | -------------------------------------------------------------------- |
| Framework  | [Astro](https://astro.build) — `output: 'static'`, fully prerendered |
| Language   | TypeScript, extending `astro/tsconfigs/strict`                       |
| Sitemap    | `@astrojs/sitemap`                                                   |
| Hosting    | Cloudflare Workers — static assets via `wrangler`                    |
| CI/CD      | GitHub Actions — validate on PR, deploy on merge to `main`           |
| Formatting | Prettier + `prettier-plugin-astro`                                   |

There is no adapter and no server-side rendering. Every page is prerendered at build
time and the `dist/` directory is uploaded to the edge verbatim.

One **Worker script** (`src/worker/index.ts`) sits in front of the assets to serve
`POST /api/contact`. Routing stays asset-first, so the prerendered pages keep winning;
`assets.run_worker_first: ["/api/*"]` is required for the form alone, because
`not_found_handling: '404-page'` otherwise intercepts navigation requests.

## Prerequisites

- **Node 24** — recorded in `.nvmrc`; CI reads the same file via `node-version-file`.
- npm — `package-lock.json` is committed and authoritative; CI uses `npm ci`.

```bash
nvm use    # or: fnm use
npm ci
```

## Scripts

| Script                 | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Dev server at http://localhost:4321               |
| `npm run start`        | Alias of `dev`                                    |
| `npm run build`        | `astro check && astro build` → `dist/`            |
| `npm run preview`      | Serve the built `dist/` locally                   |
| `npm run check`        | `astro check` — TypeScript + `.astro` diagnostics |
| `npm run format`       | Prettier, write                                   |
| `npm run format:check` | Prettier, check only (used by CI)                 |
| `npm run astro`        | Raw Astro CLI passthrough                         |

`astro build` transpiles with esbuild and performs no type checking, which is why
`check` is chained into `build`: a type error fails the build, and therefore CI.

## Local development

```bash
npm run dev        # http://localhost:4321
npm run build      # type-check, then build into dist/
npm run preview    # serve dist/ at http://localhost:4321
```

`npm run preview` is a plain static server and does **not** apply `public/_headers`,
so header behaviour can only be verified against a deployed Worker.

**`npm run dev` and `npm run preview` cannot exercise `/api/contact`.** Both serve the
static output only and never run the Worker, so the endpoint answers `404` (the prerendered
404 page) instead of the Worker's JSON. Local integration testing needs `wrangler dev`,
which also simulates the Email Service bindings:

```bash
npm run build
npx wrangler dev       # http://localhost:8787 — this one does run the Worker
```

The real Turnstile widget allows `localhost` and `127.0.0.1`, so the happy path is
exercisable locally with the `.dev.vars` secret; Cloudflare's _test_ keys cannot pass the
Worker's `action` and `hostname` checks.

## Deployment

The site is deployed to **Cloudflare Workers** as a _static-assets project_. Wrangler
uploads the prerendered `dist/` directory to the edge directly, alongside the small Worker
script that serves `/api/contact`. There is no Astro adapter — every page stays static.

`@astrojs/cloudflare` is intentionally not installed. It can be added later for SSR,
Actions, or sessions without changing platforms: the adapter removed Cloudflare Pages
support in v13, and Cloudflare recommends Workers for new projects, so Workers is the
canonical target for Astro going forward.

### Manual deploy

```bash
npx wrangler login     # once — OAuth; stores a credential for local CLI use
npm run build          # wrangler deploy does NOT run the build
npx wrangler deploy
```

### Custom domain

`wrangler.jsonc` declares the apex as a custom domain, which is the source of truth
every CI deploy reconciles:

```jsonc
"routes": [{ "pattern": "vgr.cat", "custom_domain": true }]
```

`custom_domain: true` makes Cloudflare create the proxied DNS record and manage the
TLS certificate. No wildcard route is declared: a `*.vgr.cat/*` catch-all would
silently answer on every present and future subdomain. If `www` is ever needed, add
it as a second explicit custom domain rather than widening the pattern.

`wrangler login` issues an **OAuth token** for local CLI use only. It is not an API
token and is not usable by CI — see the secrets table below.

### Static asset headers

`public/_headers` is copied verbatim into `dist/` and is applied by Cloudflare to
**static assets only** — it does not apply to responses generated by a Worker script.
Astro content-hashes every bundled filename under `/_astro/`, which is precisely what
makes `Cache-Control: public, max-age=31536000, immutable` safe to apply to them.

Verified in production: `Strict-Transport-Security`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are all served
on HTML responses.

Because `src/styles/global.css` sits below Astro's inline threshold it is inlined into
the HTML, so no `/_astro/*` asset is emitted and the `immutable` rule currently
matches nothing. It is dormant, not dead: Astro begins emitting a hashed
`/_astro/*.css` automatically once the stylesheet (or any bundled JS) grows past the
threshold. Inlining is intentional — for a ~1 KB stylesheet it avoids a
render-blocking request.

## Continuous integration & deployment

| Workflow | Trigger                              | Purpose                                                                                      |
| -------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `CI`     | Pull request, push to `main`, manual | `npm ci` → `format:check` → `check` → `build`; uploads the `dist` artifact (7-day retention) |
| `Deploy` | Push to `main`, manual               | `npm ci` → `build` → `wrangler deploy` to production                                         |

`Deploy` runs against the `production` environment with `cancel-in-progress: false`, so
an in-flight production deploy is never interrupted by a newer commit.

### Required repository secrets

These must be created under **Settings → Secrets and variables → Actions**. They are
**not** created by this repository, and must never be committed to the tree:

| Secret                  | Scope                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Scoped token with **Workers Scripts: Edit** plus **Account Settings: Read**. Add **Workers KV Storage: Edit** only if Astro sessions are ever enabled. |
| `CLOUDFLARE_ACCOUNT_ID` | Found in the Cloudflare dashboard sidebar.                                                                                                             |

Never commit `.dev.vars` or real values. For sensitive runtime values, use
`npx wrangler secret put <KEY>`.
