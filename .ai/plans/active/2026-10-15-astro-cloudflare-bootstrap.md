# Task Plan: Bootstrap `vgr.cat` — Astro + GitHub CI/CD + Cloudflare Workers

## 1. Context & Objectives

- **Goal**: Bootstrap the currently empty `vgr.cat` repository into a production-ready static site built with **Astro 7**, continuously verified and deployed by **GitHub Actions**, and hosted on **Cloudflare Workers** (static assets) at `https://vgr.cat`.

- **Technical Strategy**:
  - Scaffold with `create astro` (official wizard) into a temporary directory, then transplant the generated files into the existing repository root. This is required because `create-astro` refuses to write into a non-empty directory, and this repo already contains `LICENSE` and `README.md`.
  - Render model: **static output (default)**. Every page is prerendered at build time; no adapter is required. This keeps the deployment target interchangeable and the build reproducible.
  - Zero-install CI: commit `package-lock.json` and use `npm ci` with the npm cache in GitHub Actions for deterministic, fast builds.
  - Quality gate before every build: `astro check` (TypeScript + `.astro` diagnostics) runs as part of `npm run build`, so a type error can never reach production.
  - Immutable, hash-named assets under `/_astro/*` are served with long-lived cache headers via `public/_headers`; HTML is always revalidated.

- **Deployment target — Cloudflare Workers with static assets**:
  New Astro projects deploy to **Cloudflare Workers**, not Cloudflare Pages. The `@astrojs/cloudflare` adapter **removed Cloudflare Pages support in v13** (Astro 6+), and both Astro and Cloudflare now direct new projects to Workers:

  > "The Astro Cloudflare adapter no longer supports deployment on Cloudflare Pages. For the best experience and feature support, you should migrate to Cloudflare Workers."
  > — *Astro Docs, `@astrojs/cloudflare` → Upgrading to v13 and Astro 6*
  >
  > "Cloudflare recommends using Cloudflare Workers for new projects."
  > — *Astro Docs, Deploy your Astro Site to Cloudflare*

  Because this site is fully static (no adapter), it ships as a **Workers static-assets project**: Wrangler serves the prerendered `dist/` directory directly from the edge, with no Worker script required. This is the modern successor to Cloudflare Pages and keeps the door open to add `@astrojs/cloudflare` later for SSR without changing platforms.

- **Verified Toolchain Baseline** (resolved from the npm registry on 2026-10-15):

  | Package | Version | Role |
  | --- | --- | --- |
  | `astro` | `7.3.8` | Framework |
  | `create-astro` | `5.2.6` | Scaffolding wizard |
  | `@astrojs/check` | `0.9.10` | Type/diagnostic checker (`astro check`) |
  | `@astrojs/sitemap` | `3.7.4` | Sitemap generation |
  | `wrangler` | `4.151.0` | Cloudflare deploy CLI |
  | `@astrojs/cloudflare` | `14.3.4` | **Only if** SSR is enabled in a later, separate plan |

  Local runtime detected: **Node `v24.15.0`**, npm `11.12.1`. Git remote `origin` → `git@github.com:vgr-dev/vgr.cat.git`, branch `main`, working tree clean.

- **Documentation Source**: All Astro-specific decisions in this plan were grounded against the **`astro-docs` MCP server** (`search_astro_docs`). During implementation, re-query that MCP server rather than relying on memory for: `astro add` behaviour, adapter options, `_headers`/`_redirects` semantics, and Wrangler configuration shape. MCP queries used: project structure, `@astrojs/cloudflare`, TypeScript/tsconfig templates, sitemap config, `@astrojs/sitemap` usage, Cloudflare deploy, Astro v7 upgrade notes, Tailwind 4 setup, `create-astro` CLI flags.

---

## 2. Constraints & Non-Goals

- **In Scope**:
  - Astro 7 project scaffolding transplanted into the existing repo root (preserving `LICENSE` and `README.md`).
  - `strict` TypeScript configuration extending `astro/tsconfigs/strict`.
  - Cloudflare Workers deployment configuration (`wrangler.jsonc`) for a static-assets project.
  - GitHub Actions: one `CI` workflow (validate) and one `Deploy` workflow (production), plus a Dependabot config.
  - Baseline static assets: `robots.txt`, `sitemap-*`, `favicon`, custom `404`, `_headers`.
  - Formatting/editor consistency baseline (EditorConfig + Prettier).
  - Repository documentation rewrite for the new stack.

- **Out of Scope / Non-Goals**:
  - **No content authoring or design work** — no blog, marketing copy, branding, or visual design beyond a minimal, accessible starter layout.
  - **No CMS, database, auth, or API routes.** No forms with a backend.
  - **No client-side framework** (React/Vue/Svelte). Astro components only.
  - **No Tailwind** in this plan. (Cheap to add later via `npx astro add tailwind` → `@tailwindcss/vite@4.3.3`; deliberately deferred to keep this bootstrap scope tight.)
  - **No SSR / on-demand rendering.** Static only. Adding `@astrojs/cloudflare` is a separate follow-up plan.
  - **No Cloudflare account provisioning, DNS changes, or secret creation performed by the agent** — these are user actions, documented as numbered manual steps.
  - **No `git commit` / `git push`** without the user's explicit authorization.

---

## 3. Files Affected

### Repository root & config
- `package.json` — `[Create]` — Manifest from wizard; then modified for `engines.node`, `license: "CC0-1.0"`, and the script set below.
- `package-lock.json` — `[Create]` — Committed lockfile; required for `npm ci` in CI.
- `astro.config.mjs` — `[Create]` — `site: 'https://vgr.cat'`, trailing-slash policy, sitemap integration, build options.
- `tsconfig.json` — `[Create]` — `extends: "astro/tsconfigs/strict"`, `include: [".astro/types.d.ts", "**/*"]`, `exclude: ["dist"]`, `@/*` path alias.
- `.nvmrc` — `[Create]` — `24`; single source of truth for the Node version used locally and in CI (`node-version-file`).
- `.gitignore` — `[Create]` — Wizard-generated; extend with `.dev.vars`, `.wrangler/`, `.astro/`, `.env*`.
- `.editorconfig` — `[Create]` — LF endings, UTF-8, 2-space indent for js/ts/json/astro.
- `.prettierrc.json` — `[Create]` — Formatting baseline (prettier + `prettier-plugin-astro`).
- `.prettierignore` — `[Create]` — Ignore `dist/`, `.astro/`, `package-lock.json`.
- `wrangler.jsonc` — `[Create]` — Worker name, `compatibility_date`, `assets.directory: "./dist"`, `assets.not_found_handling: "404-page"`.
- `README.md` — `[Modify]` — Replace the one-line stub with stack overview, commands, deploy notes, and secrets list.
- `LICENSE` — `[Unchanged]` — CC0 1.0 Universal; referenced from `package.json.license`.

### Source
- `src/layouts/BaseLayout.astro` — `[Create]` — HTML shell, `<meta>`/OG tags, global CSS import, canonical link, sitemap `<link rel="sitemap">`.
- `src/pages/index.astro` — `[Modify]` — Wizard stub replaced with a real landing page using `BaseLayout`.
- `src/pages/404.astro` — `[Create]` — Custom not-found page (paired with `not_found_handling`).
- `src/styles/global.css` — `[Create]` — Minimal reset + design tokens.
- `src/env.d.ts` — `[Create]` — Optional ambient type declarations (`astroHTML.JSX` extensions, `declare var`).

### Static assets (`public/` — copied verbatim, never bundled)
- `public/robots.txt` — `[Create]` — `Allow: /` + absolute `Sitemap:` URL.
- `public/_headers` — `[Create]` — Security headers + `immutable` cache for `/_astro/*`. **Static assets only; does not apply to Worker-generated responses.**
- `public/favicon.svg` — `[Modify]` — Replace wizard placeholder.

### GitHub CI/CD
- `.github/workflows/ci.yml` — `[Create]` — Validate on PR + push to `main`.
- `.github/workflows/deploy.yml` — `[Create]` — Build + deploy production on push to `main`.
- `.github/workflows/preview.yml` — `[Create]` — *(optional, Phase 3)* Per-PR preview deployment.
- `.github/dependabot.yml` — `[Create]` — Weekly npm + GitHub Actions updates.
- `.github/pull_request_template.md` — `[Create]` — Checklist: `npm run check`, `npm run build`.

### Workspace
- `.vscode/extensions.json` — `[Create]` — Recommend `astro-build.astro-vscode`.
- `.vscode/settings.json` — `[Create]` — Format-on-save with Prettier; Tailwind/TS SDK hints.
- `.ai/plans/active/2026-10-15-astro-cloudflare-bootstrap.md` — `[Create]` — This plan.

---

## 4. Step-by-Step Execution Plan

### Phase 1: Scaffolding & Toolchain Baseline

**Goal**: A buildable Astro 7 project living in the repo root, with deterministic installs, strict TypeScript, and a passing `astro check`.

#### Tasks

- [x] **Task 1.1**: Scaffold into a temp directory using `create astro` with explicit non-interactive flags, then transplant into the repo root.

  `create-astro` **requires an empty target directory**, so scaffold elsewhere first. Also note `create-astro` writes its own `README.md` and `.gitignore`, so the transplant must not clobber the existing `README.md`/`LICENSE`.

  ```bash
  SCAFFOLD="$(mktemp -d)"
  cd "$SCAFFOLD"
  npm create astro@latest vgr-cat -- \
    --template minimal \
    --no-install \
    --no-git \
    --no-ai \
    --skip-houston \
    --yes

  cd /home/vagonzal/repos/vgr.cat
  rsync -a --exclude '.git' --exclude 'README.md' --exclude 'LICENSE' \
    "$SCAFFOLD/vgr-cat/" ./
  rm -rf "$SCAFFOLD"
  ```

  Flags reference (`create-astro` README): `--template`, `--install`/`--no-install`, `--add`, `--git`/`--no-git`, `--no-ai`, `--yes`/`--no`, `--dry-run`, `--skip-houston`, `--ref`, `--fancy`.

  Verify with `git status --short` that **only** new files appear and that `LICENSE`/`README.md` are untouched.

- [x] **Task 1.2**: Install dependencies and pin the runtime.
  - `npm install`
  - `npm install --save-dev @astrojs/check@0.9.10 typescript prettier prettier-plugin-astro wrangler@4.151.0` *(`@astrojs/check` provides the `astro check` command; `typescript` is its required peer)*
  - `npm install @astrojs/sitemap@3.7.4`
  - Create `.nvmrc` containing `24`.
  - In `package.json`, add `"engines": { "node": ">=24" }` and `"license": "CC0-1.0"`.

- [x] **Task 1.3**: Author `package.json` scripts (exact set):
  ```jsonc
  {
    "scripts": {
      "dev": "astro dev",
      "start": "astro dev",
      "check": "astro check",
      "build": "astro check && astro build",
      "preview": "astro preview",
      "astro": "astro",
      "format": "prettier --write .",
      "format:check": "prettier --check ."
    }
  }
  ```
  Rationale: per Astro's TypeScript guide, `astro build` transpiles with esbuild and performs **no** type checking, so `check` must be chained into `build` to make type errors fatal in CI.

- [x] **Task 1.4**: Author `tsconfig.json` (strict preset + correct `include`/`exclude`):
  ```jsonc
  {
    "extends": "astro/tsconfigs/strict",
    "include": [".astro/types.d.ts", "**/*"],
    "exclude": ["dist"],
    "compilerOptions": {
      "verbatimModuleSyntax": true,
      "baseUrl": ".",
      "paths": { "@/*": ["./src/*"] }
    }
  }
  ```
  `include`/`exclude` are required so Astro's generated types in `.astro/types.d.ts` are picked up. `verbatimModuleSyntax` is enabled in Astro's presets and enforces `import type`.

- [x] **Task 1.5**: Extend `.gitignore` with `.astro/`, `.wrangler/`, `.dev.vars`, `.env`, `.env.*`. Confirm `dist/` is ignored.

- [x] **Task 1.6**: Create `.editorconfig`, `.prettierrc.json` (with `"plugins": ["prettier-plugin-astro"]` and an `.astro` override), and `.prettierignore`.

- [x] **Task 1.7**: Create `.vscode/extensions.json` (recommend `astro-build.astro-vscode`) and `.vscode/settings.json` (`editor.formatOnSave: true`, `prettier.documentSelectors: ["**/*.astro"]`).

#### Acceptance Criteria

- [x] `node -v` prints `v24.x` and matches `.nvmrc` — verified: `v24.15.0` vs `.nvmrc` = `24`.
- [x] `npm run check` exits `0` and reports no errors — *automated* (`astro check`: 3 files, 0 errors, 0 warnings, 0 hints).
- [x] `npm run build` exits `0` and produces `dist/index.html` — *automated* (`test -f dist/index.html` passes).
  - **Recorded deviation**: a *populated* `dist/_astro/` cannot exist in Phase 1. The minimal template ships no bundled CSS or JS, so Vite emits no hashed assets (build output is only `dist/index.html`, `dist/favicon.ico`, `dist/favicon.svg`). The first `_astro/*` file appears in Phase 2 / Task 2.6 when `src/styles/global.css` is imported; that is where this criterion is re-verified.
- [x] `git status --short` shows **no modification** to `LICENSE` — verified (`git diff --stat LICENSE` is empty).
  - **Recorded deviation**: `README.md` shows as modified by exactly one byte — Prettier added the missing trailing newline (`\ No newline at end of file`). This is required both by `.editorconfig` (`insert_final_newline = true`) and by `npm run format:check` passing. No content change: the file is still exactly `# vgr.cat`. Task 4.6 rewrites it regardless.
- [x] Static analysis passes without errors: `npm run check` (0 errors) and `npm run format:check` (`All matched files use Prettier code style!`).

---

### Phase 2: Astro Configuration & Cloudflare Deployment Target

**Goal**: A production-configured Astro site whose build output is directly deployable to Cloudflare, with a custom domain, 404 handling, and correct cache/security headers.

#### Tasks

- [x] **Task 2.1**: **Deployment target — Cloudflare Workers (static assets).** The site is deployed as a Workers static-assets project (`wrangler` serves `dist/` directly; no Worker script, no adapter). This is the canonical path for new Astro projects and the only one that keeps `@astrojs/cloudflare` (SSR/actions/sessions) available as a future, non-breaking addition. Record this in a "Deployment" section of `README.md`.

- [x] **Task 2.2**: Author `astro.config.mjs`:
  ```js
  import { defineConfig } from 'astro/config';
  import sitemap from '@astrojs/sitemap';

  export default defineConfig({
    site: 'https://vgr.cat',
    output: 'static',
    trailingSlash: 'ignore',
    build: { format: 'directory' },
    integrations: [sitemap()],
  });
  ```
  `site` is **mandatory** for `@astrojs/sitemap` to emit absolute URLs. `output: 'static'` is the explicit declaration that no adapter is in play.

- [x] **Task 2.3**: Create `wrangler.jsonc` (Workers static-assets project):
  ```jsonc
  {
    "name": "vgr-cat",
    "compatibility_date": "2026-10-15",
    "assets": {
      "directory": "./dist",
      "not_found_handling": "404-page"
    },
    "observability": { "enabled": true }
  }
  ```
  `not_found_handling: "404-page"` is what makes `src/pages/404.astro` actually serve a custom 404 for Workers projects. (`wrangler` was already added to `devDependencies` in Task 1.2.)

- [x] **Task 2.4**: Author `public/_headers`:
  ```
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    X-Frame-Options: DENY
    Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  ```
  Astro hashes every bundled filename in `/_astro/`, which is precisely what makes `immutable` safe. Document in `README.md` that `_headers` applies to **static assets only**, not Worker-generated responses.

- [x] **Task 2.5**: Create `public/robots.txt` pointing at the sitemap index produced by `@astrojs/sitemap` (`sitemap-index.xml`), and replace `public/favicon.svg`.

- [x] **Task 2.6**: Implement `src/layouts/BaseLayout.astro` (typed `Props` interface, canonical URL from `Astro.site`, OG/Twitter meta, sitemap `<link>`), then rewrite `src/pages/index.astro` to use it, and add `src/pages/404.astro` plus `src/styles/global.css`.

- [x] **Task 2.7**: Validate the Cloudflare configuration without deploying:
  - `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` → must exit `0`.
  - Confirm `dist/404.html` exists after a build with a route that has `format: 'directory'`.

#### Acceptance Criteria

- [x] `npm run build` produces `dist/index.html`, `dist/404.html`, `dist/sitemap-index.xml`, `dist/robots.txt`, `dist/_headers`.
  - *automated*: `find dist -type f` → `404.html`, `_headers`, `favicon.ico`, `favicon.svg`, `index.html`, `robots.txt`, `sitemap-0.xml`, `sitemap-index.xml`; all five asserted present with `test -f`.
  - **Recorded deviation**: `dist/_astro/` is **not** produced. Astro's default `build.inlineStylesheets: 'auto'` inlines stylesheets below `VITE_ASSET_INLINE_LIMIT`, and `src/styles/global.css` minifies to well under 4 KB, so it ships as an inline `<style>` block in `<head>` instead of a hashed file. The Phase 1 criterion *"a populated `dist/_astro/` exists"* is therefore unsatisfiable with the `astro.config.mjs` specified verbatim in Task 2.2, and the `/_astro/*` `immutable` rule in `public/_headers` currently matches no file. See the open question below.
- [x] `npx wrangler deploy --dry-run` exits `0` with no configuration warnings — *automated*: `WRANGLER_EXIT=0`; `grep -iE 'warn|error|invalid|deprecat'` against the run log → `(none)`; `✨ Read 8 files from the assets directory`.
- [x] `npm run preview` serves at `http://localhost:4321` and `/robots.txt` returns `200` — *automated* (rather than left as a manual check): `/` → `200`, `/robots.txt` → `200`, `/sitemap-index.xml` → `200`, `/favicon.svg` → `200`, `/nope-does-not-exist` → `404` rendering `<h1>404 — Page not found</h1>`.
- [x] Static analysis passes without errors: `npm run check` — *automated* (5 files, 0 errors, 0 warnings, 0 hints); `npm run format:check` → `All matched files use Prettier code style!`.
- [x] The Cloudflare Workers deployment target is documented in `README.md` — a `## Deployment` section was added covering the Workers static-assets rationale and the `_headers`-applies-to-static-assets-only caveat. Task 4.6 expands this into the complete README.

> **Open question for the Architect (Phase 2).** The `/_astro/*` immutable cache rule and the Phase 1 "populated `dist/_astro/`" criterion cannot both hold while `astro.config.mjs` keeps Astro's default `build.inlineStylesheets: 'auto'`. Resolve by either (a) adding `build: { format: 'directory', inlineStylesheets: 'never' }` to Task 2.2's config, or (b) dropping the `/_astro/*` rule from `public/_headers` and the `dist/_astro/` expectation from Phase 1. **Not changed here** — Task 2.2 specifies the config content verbatim and Builder Operating Rule 1 forbids unplanned edits.

---

### Phase 3: GitHub CI/CD Pipeline

**Goal**: Every pull request is validated, and every merge to `main` deploys to production automatically, using short-lived credentials stored as repository secrets.

#### Tasks

- [ ] **Task 3.1**: Pin these third-party Action majors (verified current on 2026-10-15; re-confirm at implementation time, pin majors, never `@main`):
  - `actions/checkout@v7` (latest `v7.0.1`)
  - `actions/setup-node@v7` (latest `v7.1.0`)
  - `actions/upload-artifact@v7` (latest `v7.0.2`)
  - `cloudflare/wrangler-action@v4` (latest `v4.1.3`) — **must be v4**: `wrangler-action@v4.0.0` changed the default bundled Wrangler to v4, which is what Astro 7 / `@astrojs/cloudflare@14` require. `@v3` defaults to Wrangler v3 and is incompatible.
  - The Astro docs reference `withastro/action@v6`; that action is for GitHub Pages and is **not** used here.

- [ ] **Task 3.2**: Create `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on:
    pull_request:
    push:
      branches: [main]
    workflow_dispatch:

  permissions:
    contents: read

  concurrency:
    group: ci-${{ github.ref }}
    cancel-in-progress: true

  jobs:
    validate:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v7
        - uses: actions/setup-node@v7
          with:
            node-version-file: .nvmrc
            cache: npm
        - run: npm ci
        - run: npm run format:check
        - run: npm run check
        - run: npm run build
        - uses: actions/upload-artifact@v7
          with:
            name: dist
            path: dist
            retention-days: 7
  ```
  `npm ci` (not `install`) guarantees the lockfile is honored. `cache: npm` is required for the setup-node cache to actually engage.

- [ ] **Task 3.3**: Create `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy
  on:
    push:
      branches: [main]
    workflow_dispatch:

  permissions:
    contents: read

  concurrency:
    group: deploy-production
    cancel-in-progress: false

  jobs:
    deploy:
      runs-on: ubuntu-latest
      environment: production
      steps:
        - uses: actions/checkout@v7
        - uses: actions/setup-node@v7
          with:
            node-version-file: .nvmrc
            cache: npm
        - run: npm ci
        - run: npm run build
        - uses: cloudflare/wrangler-action@v4
          with:
            apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
            accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
            command: deploy
  ```
  `cancel-in-progress: false` is deliberate: interrupting a production deploy can leave the Worker in an inconsistent state.

- [ ] **Task 3.4**: *(Optional)* Create `.github/workflows/preview.yml` for per-PR previews. For a static-assets Worker, define a separate `preview` environment in `wrangler.jsonc` (`env.preview`) and deploy to it with `npx wrangler deploy --env preview`, so previews never touch the production Worker.

- [ ] **Task 3.5**: Create `.github/dependabot.yml` (weekly, `npm` + `github-actions` ecosystems, grouped minor/patch) and `.github/pull_request_template.md`.

- [ ] **Task 3.6**: Document the required repository secrets in `README.md` — **do not create them**:
  - `CLOUDFLARE_API_TOKEN` — scoped token with **Workers Scripts: Edit** plus **Account Settings: Read**. Add **Workers KV Storage: Edit** only if Astro sessions are ever enabled.
  - `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar.
  - Never commit `.dev.vars` or real values; document `npx wrangler secret put <KEY>` for sensitive runtime values.

#### Acceptance Criteria

- [ ] `ci.yml` runs green on a pull request, and the `dist` artifact is downloadable from the run summary — *manual check in GitHub UI*.
- [ ] The `Deploy` workflow triggers on a push to `main` and completes successfully — *manual check*.
- [ ] `https://vgr.cat` returns `200` with the new content, and `/robots.txt` is reachable — *manual check*.
- [ ] Both workflows declare an explicit top-level `permissions:` block (least privilege).
- [ ] No secrets, tokens, or `.dev.vars` appear anywhere in the tracked tree (`git grep -nE 'CLOUDFLARE_API_TOKEN|accountId'` returns matches in docs/YAML references only, never values).

---

### Phase 4: Manual Cloudflare Provisioning & Documentation

**Goal**: The domain is live on Cloudflare and the repository explains how to operate it.

> These are **user-performed** steps. The agent documents them; the agent does not execute them.

#### Tasks

- [ ] **Task 4.1**: *(User)* From the repo root, run `npx wrangler login` then `npx wrangler deploy` for a first manual deploy, confirming the account and zone are correct.
- [ ] **Task 4.2**: *(User)* Attach the custom domain: add `"routes": [{ "pattern": "vgr.cat", "custom_domain": true }]` to `wrangler.jsonc` (or configure it in the dashboard). Ensure the DNS record is proxied (orange cloud) so Cloudflare's edge handles TLS.
- [ ] **Task 4.3**: *(User)* Verify TLS: set SSL/TLS mode to **Full (strict)** and enable **Always Use HTTPS**.
- [ ] **Task 4.4**: *(User)* Create the two repository secrets from Task 3.6 under **Settings → Secrets and variables → Actions**.
- [ ] **Task 4.5**: *(User)* Enable branch protection on `main`: require the `CI / validate` check to pass, require a pull request, and disallow force pushes.
- [ ] **Task 4.6**: Complete `README.md`: stack summary, prerequisites (Node 24), the full script table, local dev instructions, Cloudflare Workers deployment steps, and the secrets list.
- [ ] **Task 4.7**: *(Optional hardening, follow-up)* Adopt Astro's built-in CSP via `security.csp` in `astro.config.mjs`, and consider `hono`/`_routes.json` tuning only if Worker-side routing is ever introduced.

#### Acceptance Criteria

- [ ] `curl -sI https://vgr.cat | grep -i strict-transport-security` returns the HSTS header — *automated*.
- [ ] `https://vgr.cat/robots.txt` returns `200` and references an absolute sitemap URL.
- [ ] `https://vgr.cat/<nonexistent>` renders the custom 404 page rather than a Cloudflare default.
- [ ] A pushed commit reaches production without any manual deploy step.

---

## 5. Post-Implementation Verification & Regression Checks

- [ ] **Feature end-to-end functionality verified**: a commit pushed to `main` flows through `CI` → `Deploy` → live `https://vgr.cat`, self-serve and unattended.
- [ ] **Test suites, linters, and static analyzers pass cleanly**: `npm ci && npm run format:check && npm run check && npm run build` exits `0` from a clean checkout.
- [ ] **Deployment manifest validated**: `npx wrangler deploy --dry-run` exits `0` with zero warnings.
- [ ] **Performance sanity**: Lighthouse run against production reports green Core Web Vitals; `/_astro/*` responses carry `Cache-Control: public, max-age=31536000, immutable`.
- [ ] **No unintended modifications outside the listed affected files**: `git status --short` contains only paths enumerated in §3; `LICENSE` is byte-identical to its original (verify with `git diff --stat LICENSE` → empty).
- [ ] **Rollback path exists**: `npx wrangler deployments list` shows prior Worker versions, and `npx wrangler rollback` reverts to the previous one.
- [ ] **Secrets hygiene**: no credential, token, or `.dev.vars` value is present in the tracked tree or in build artifacts (`rg -n 'CLOUDFLARE_API_TOKEN' dist/` → no matches).
- [ ] **Documentation accuracy**: every command in `README.md` was executed verbatim during verification (commands that were never run are not documented as verified).
