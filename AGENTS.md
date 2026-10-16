# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making changes.

---

## What this project is

`vgr.cat` is a **fully static site** built with **Astro 7** and deployed to **Cloudflare Workers as a
static-assets project** (no Worker script, no adapter, no SSR). Wrangler uploads `dist/` to the edge
verbatim. Live at `https://vgr.cat`, deployed automatically by GitHub Actions on merge to `main`.

Node **24** (pinned in `.nvmrc`), npm with a committed `package-lock.json`.

---

## Commands

### The verification gate — run this before claiming any change works

```bash
npm ci                                        # lockfile is authoritative; CI uses --ci
npm run format:check                          # Prettier (also covers .github/workflows/*.yml)
npm run lint                                  # ESLint 9 + eslint-plugin-astro (34 a11y rules)
npm run check                                 # wrangler types && astro check → expect "30 files, 0 errors, 0 warnings, 0 hints"
npm run build                                 # astro check && astro build → 7 pages
npx wrangler deploy --dry-run --outdir=.wrangler/dry-run   # expect exit 0, "Read 32 files", no warnings
```

`npm run check` alone is not enough — `astro build` transpiles with esbuild and performs **no** type
checking, which is exactly why `check` is chained into `build`. Never remove that chaining.

### Other commands

| Command                         | Notes                                                                      |
| ------------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                   | Dev server on `:4321`. Does **not** emit the CSP meta tag (see gotchas).   |
| `npm run preview`               | Serves the built `dist/` on `:4321`. Does **not** apply `public/_headers`. |
| `npx wrangler whoami`           | Authenticated 2026-10-15, **unauthenticated 2026-10-16** — probe it.       |
| `npx wrangler deployments list` | Read-only. Safe.                                                           |
| `gh pr checks <n>` / `git push` | See the hard rules below.                                                  |

Use `npx astro dev stop` / `npx astro preview stop` to shut servers down — they daemonise.

---

## Hard rules

1. **Never `git commit`, `git push`, `git reset`, or `git rebase` without explicit user authorization.**
   Make the edits, run the gate, then stop and _propose_ the commit message. This is a standing user
   instruction, not a suggestion.
2. **`main` is branch-protected.** Direct pushes are rejected. Every change — including docs-only —
   needs a branch and a pull request, with the `CI / validate` check passing.
3. **Never run destructive production commands.** In particular `npx wrangler rollback` republishes an
   older version to live `vgr.cat`. `wrangler secret put/delete` also deploy immediately. Ask first.
4. **Never commit secrets.** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are repository secrets;
   reference them only as `${{ secrets.* }}`. `.dev.vars` and `.env` must stay gitignored.
5. **Zero suppressions.** Never resolve a type/lint error with `@ts-ignore`, a baseline update, or a
   disabled rule. Fix the cause.
6. **Do not re-litigate settled architecture.** See the next section.

---

## Scoped instructions — read the matching file before editing those paths

Path-specific rules live in `.github/instructions/`. VS Code Copilot auto-loads them when a matching file
is in context; **other agents must read the matching file explicitly.**

| When you touch                      | Read                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `.github/workflows/**`              | `.github/instructions/workflows.instructions.md`         |
| `astro.config.mjs`                  | `.github/instructions/astro-config.instructions.md`      |
| `wrangler.jsonc`, `public/_headers` | `.github/instructions/cloudflare-config.instructions.md` |
| `src/**`                            | `.github/instructions/astro-src.instructions.md`         |
| `.ai/plans/**`                      | `.github/instructions/plans.instructions.md`             |

---

## Settled decisions — do not undo these

Each of these was decided deliberately and is documented in `.ai/plans/archive/`. If you think one is
wrong, raise it with the user rather than silently reverting it.

| Decision                                                                       | Rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Static output, no adapter.** `output: 'static'`, no `@astrojs/cloudflare`.   | `@astrojs/cloudflare` dropped Pages support and Workers is the recommended target. Keeping it out leaves the door open to add SSR later without changing platform.                                                                                                                                                                                                                                                                                                                          |
| **Workers static assets, not Pages.**                                          | The canonical path for new Astro projects.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **No per-PR preview workflow.**                                                | The originally-specified `env.preview` design created _one persistent_ Worker every PR overwrites — it never delivered per-PR previews. The modern `wrangler preview` alternative would not run on this repo's real PR traffic, because Dependabot-triggered workflows cannot read repository secrets. `ci.yml`'s 7-day `dist` artifact plus `npm run preview` is the review path. Full reasoning + a ready-to-implement spec: `.ai/plans/archive/2026-10-15-task-3.4-preview-decision.md`. |
| **CSP via `security.csp`, not `public/_headers`.**                             | Astro computes build-time hashes for its inline styles/scripts; a hand-written header CSP cannot track hashes that change every build.                                                                                                                                                                                                                                                                                                                                                      |
| **Tailwind 4 (CSS-first `@theme`), no client-side framework, no CMS/DB/auth.** | Tailwind adopted 2026-10-15 (plan Phase 2); tokens live in `src/styles/global.css` via `@theme`. Framework/CMS/DB/auth remain non-goals. Cheap to add later.                                                                                                                                                                                                                                                                                                                                |
| **No wildcard `*.vgr.cat/*` route.**                                           | A catch-all silently answers on every present _and future_ subdomain.                                                                                                                                                                                                                                                                                                                                                                                                                       |

---

## Gotchas that will otherwise waste your time

- **`@astrojs/check@0.9.10` caps TypeScript at `^6.0.0`.** A TypeScript 7 major bump fails `npm ci` with
  `ERESOLVE`. Do not "fix" it with `--legacy-peer-deps` — close the Dependabot PR instead.
- **ESLint is pinned to `^9`, not 10.** `eslint-plugin-jsx-a11y@6.10.2` — a peer of
  `eslint-plugin-astro`'s a11y configs — peers `eslint@^3 … ^9`, so an ESLint 10 major bump fails
  `npm ci` with `ERESOLVE`. Same rule as the TypeScript cap above: align the version, never
  `--legacy-peer-deps`. Astro's a11y rules appear under the `astro/jsx-a11y/*` namespace, several at
  error level.
- **The whole site is small.** `src/` holds the layout (`BaseLayout.astro`), `i18n/config.ts`, the
  component set under `components/`, the `src/worker` endpoint, the styles under `styles/`, and the pages
  (`index.astro`, `404.astro`, `[lang]/index.astro`, `contact/thanks.astro`, `[lang]/contact/thanks.astro`).
  The build emits 7 pages (`index.html`, `404.html`, `ca/`, `es/`, plus the three `contact/thanks`)
  alongside `robots.txt`, `favicon.*`, `og/og-default.png`, `sitemap-*.xml`, `_headers` and the hashed
  `_astro/*` bundle. `astro check` reports **30 files**, which is therefore expected; don't go hunting
  for a missing page.
- **The Worker needs `assets.run_worker_first` or browser form POSTs break.** `not_found_handling:
'404-page'` intercepts _navigation_ requests before the Worker runs, so a real browser POST to
  `/api/contact` returned **405** while the identical `curl` request succeeded — curl does not send
  `Sec-Fetch-Mode: navigate`. `run_worker_first: ["/api/*"]` is therefore mandatory, not an
  optimisation. The tell is a request that works from curl and fails from a browser.
- **Turnstile: the sitekey is committed, the secret never enters the repo.** Sitekeys are public — they
  ship in the markup — so `src/config.ts` holds the production sitekey as the default and
  `PUBLIC_TURNSTILE_SITE_KEY` overrides it (set that to the always-passes _test_ sitekey
  `1x00000000000000000000AA` for automated runs). The secret lives only in
  `wrangler secret put TURNSTILE_SECRET_KEY` (production) and `.dev.vars` (local test secret
  `1x0000000000000000000000000000000AA`). `deploy.yml` runs `npm run check:production-env`, which
  **refuses to deploy with a test sitekey**, since a test key silently disables bot protection.
- **Siteverify checks `action` and `hostname`, and Cloudflare's test keys cannot satisfy them.** The
  Worker requires `success === true` **plus** `action === 'contact'` **plus** a hostname in
  `TURNSTILE_HOSTNAMES` (production: `vgr.cat`; never add `localhost` to a production value). The test
  secret reports `hostname: "example.com"` and **omits `action` entirely**, so a test-key run clears the
  hostname gate and is stopped by the action gate. **Consequence: the contact happy path cannot be
  verified end-to-end with test keys** — only the rejection paths are locally exercisable. The Worker
  logs the reason as `siteverify rejected { action, hostname, codes }`, never the secret or the token.
- **`worker-configuration.d.ts` is generated, not committed.** It is gitignored and produced by
  `npm run types` (`wrangler types`), which `npm run check` chains. Secrets must be declared under
  `secrets.required` in `wrangler.jsonc` or `wrangler types` will not know about them.
- **Local Worker testing needs `wrangler dev`, not `astro dev`.** `npm run dev` and `npm run preview`
  serve static output only and never run the Worker, so `/api/contact` does not exist there.
  `wrangler dev` also simulates the Email Service bindings, which is how the contact flow is testable
  without a real sending domain.
- **Most other traps are path-specific** and now live with the files they concern: `dist/_astro/` being
  empty by design, `public/_headers` being inert under `preview`, `npm run dev` emitting no CSP meta tag,
  and the orphan `script-src` hashes. Read the matching scoped instruction file above before touching
  config, headers, or anything under `src/`.

---

## Conventions

- **Conventional Commits** in the history: `feat(scope):`, `fix(scope):`, `docs(scope):`, `chore(scope):`,
  `ci(scope):`. Write substantive commit bodies — the project's history explains _why_, not just _what_.
- **Action pinning, `permissions:` and `concurrency:` rules live in
  `.github/instructions/workflows.instructions.md`** — read it before editing anything under
  `.github/workflows/`.
- **Prettier + `prettier-plugin-astro`** own formatting. Two-space indent, single quotes, LF, final
  newline (see `.editorconfig` / `.prettierrc.json`). Run `npm run format` rather than hand-formatting.
- **Astro components only.** No React/Vue/Svelte.

---

## Plan workflow

Plans live in `.ai/plans/` — `active/` for the in-progress plan, `archive/` for completed ones. Check
`active/` before starting work.

Writing, verifying and archiving plans has its own rules — the evidence standard, the archive footer, and
why recorded command output must never be rewritten — in `.github/instructions/plans.instructions.md`.

---

## Verification culture in this repo

Evidence is recorded, not asserted. When you verify something, capture the **exact command and its
output** in the plan, and state explicitly what you did _not_ verify and why. Plans here contain
"Recorded deviations" and "Correction" notes — that is the expected standard. Do not write that
something is verified unless you ran it, and do not flip a checkbox for work that was only partially
completed (mark it deferred instead).
