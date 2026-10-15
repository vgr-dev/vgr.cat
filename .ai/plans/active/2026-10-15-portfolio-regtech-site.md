# Task Plan: `vgr.cat` — Personal Portfolio & RegTech Practice Site (EN / CA / ES)

## 1. Context & Objectives

- **Goal**: Turn the current minimal `vgr.cat` placeholder (4 source files, 2 pages, placeholder copy)
  into a multilingual (EN / CA / ES) professional site that presents a Principal Software Engineer
  working on EU energy-market surveillance, EPREL interoperability, entity resolution and DPP/ESPR
  readiness — addressed to public energy agencies (ICAEN, IDAE), European MSAs and NGOs, and
  marketplace/distributor/manufacturer buyers of automated compliance.

- **Technical Strategy**:
  - **Astro 7 native i18n, static output.** No adapter. English at `/` (`prefixDefaultLocale: false`),
    Catalan at `/ca/`, Spanish at `/es/`. Keeps the already-live root URL and avoids a redirect hop.
  - **Content-first sequencing.** Long-form copy lives in Content Collections keyed by a
    `translationKey`; UI micro-copy lives in typed dictionaries under `src/i18n/`. Component work
    (Phase 2) is deliberately downstream of the content inventory, because the chosen visual direction
    (typographic, restrained) derives its quality from the text length and section count.
  - **Design tokens in CSS, not in a framework config.** Tailwind 4's CSS-first `@theme` block is the
    single place the palette/type scale is defined, so `global.css` remains the source of truth and the
    existing light/dark `prefers-color-scheme` tokens survive.
  - **CSP unchanged by design where possible.** Every addition is audited against the existing
    build-time `<meta>` CSP. Self-hosted fonts and same-origin CSS need no `security.csp` change.
  - **Deployment model unchanged.** Workers static assets, Wrangler, existing `ci.yml` / `deploy.yml`.

### Reconciliation with the existing repository

This brief is written as a greenfield build. It is not one. The following **already exist and are
verified**, and are therefore *deltas only* in this plan — not new work:

| Brief item | Already present | Evidence |
| --- | --- | --- |
| Strict TypeScript | `tsconfig.json` extends `astro/tsconfigs/strict`, `verbatimModuleSyntax`, `@/*` alias | file read |
| Prettier for Astro | `prettier` + `prettier-plugin-astro`, `format:check` script | `package.json` |
| CI executing validation before deploy | `ci.yml` runs `npm ci` → `format:check` → `check` → `build` | file read |
| Deploy workflow | `deploy.yml`, `cloudflare/wrangler-action@v4`, `cancel-in-progress: false` (deliberate) | file read |
| `_headers` with HSTS + `X-Content-Type-Options` | `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, `/_astro/*` immutable | `public/_headers` |
| Strict CSP | Build-time `<meta>` CSP via `security.csp`, live in production | `astro.config.mjs`, repo memory (PR #3) |
| `sitemap.xml` + `robots.txt` | `@astrojs/sitemap` integration + `public/robots.txt` | `astro.config.mjs`, `public/` |
| OpenGraph / Twitter / canonical | `BaseLayout.astro` head block | file read |
| Custom 404 | `src/pages/404.astro` + `assets.not_found_handling: '404-page'` | both files |
| DNS for the apex domain | `routes: [{ pattern: "vgr.cat", custom_domain: true }]`, site live | `wrangler.jsonc`, repo memory |

### Evidence gathered (read-only, 2026-10-15)

Recorded verbatim; `active/` contains only `.gitkeep`, so no plan is in progress.

```
$ date +%Y-%m-%d
2026-10-15

$ git --no-pager log --oneline -1
d41cf0f (HEAD -> docs/agent-guidance, origin/docs/agent-guidance) chore(plans): keep .ai/plans/active/ tracked with a .gitkeep

$ grep -rIl --exclude-dir=node_modules --exclude-dir=.git -e 'tailwind' -e 'eslint' .
/home/vagonzal/repos/vgr.cat/.ai/plans/archive/2026-10-15-astro-cloudflare-boots
trap.md
(none above = absent)
```

Line-wrap artifact in the last result: exactly **one** match, and it is prose inside the archived
bootstrap plan — **Tailwind and ESLint are absent from the codebase, the manifest and the lockfile.**

### Recorded deviations from the supplied brief

These are conflicts between the brief and this repository's verified state or settled decisions. Per
`AGENTS.md` hard rule 6 they are raised here rather than silently applied. **No command output is
recorded for these because nothing has been implemented.**

1. **"Styling: Tailwind CSS" — authorized 2026-10-15; adopted.**
   The archived bootstrap plan lists *"No Tailwind in this plan"* as an explicit non-goal, adding
   *"cheap to add later via `npx astro add tailwind`"*. The user confirmed on 2026-10-15 that
   **Tailwind is preferred from now on**, so this is the sanctioned "later", not a reversal. It is still
   a dependency addition that changes `package.json`, the lockfile, the Prettier plugin set and the CSS
   size profile, and it retires the *no Tailwind* non-goal in `AGENTS.md` — that wording must be updated
   rather than left contradicting the code.

2. **"Cloudflare Pages linked to a private GitHub repository" — contradicts a settled decision.**
   This site deploys to **Workers static assets** via Wrangler. Pages was rejected during bootstrap
   because `@astrojs/cloudflare` v13 dropped Pages support and Cloudflare now recommends Workers for new
   projects. Pages' native Git integration would additionally *replace* the existing GitHub Actions
   deploy path. **This plan keeps Workers** (see D2).

3. **"`_headers` for strict security including CSP" — must not be done.**
   CSP is delivered by `security.csp` as a per-build-hashed `<meta>` tag. `public/_headers` cannot track
   hashes that change every build, and the scoped instructions state plainly: *do not put a CSP here.*
   `_headers` keeps only the static security headers it already has. See
   `.github/instructions/astro-config.instructions.md`.

4. **"Turnstile + Formspree/Tally" — resolved 2026-10-15 to a Worker endpoint, not a third-party form.**
   The CSP is `form-action 'self'`, so a form cannot POST to Formspree or Tally; Turnstile also
   **cannot be verified client-side** and needs a server-side `siteverify` call in a Worker. The user's
   proposal — a Worker that receives the POST and sends the mail — is confirmed viable, and **Mailgun is
   not required**: Cloudflare's own Email Service binding can send to any recipient once a sending domain
   is onboarded (verified quotes in Phase 4). This does change the deployment shape: the project goes
   from *static assets only* to *static assets + a Worker script*. That is a settled-decision change and
   is recorded as such. Net CSP cost is **zero for the form** — a same-origin POST already satisfies
   `form-action 'self'`, and mail is sent server-side, where CSP does not apply — plus one origin for
   Turnstile.

5. **"Cloudflare DNS setup for `vgr.cat` (Apex records, `www` CNAME)" — mostly already done.**
   The apex custom domain is already bound via `routes` and serving live. `www` is **not** configured.
   It is handled zone-level in the Cloudflare dashboard (a DNS record plus a Redirect Rule to the apex),
   deliberately **not** as a `wrangler.jsonc` route, and a wildcard route stays banned by settled
   decision — see D5 and Task 4.7 for why. SSL/TLS mode is a dashboard setting, i.e. a manual user
   action, not a code change.

6. **"`deploy.yml` executing linting, type-checking, and build validation" — largely already true.**
   `deploy.yml` runs `npm ci` + `npm run build`, and `build` is chained as `astro check && astro build`,
   so type checking *already* gates deployment. `ci.yml` owns formatting. Duplicating the full CI suite
   inside `deploy.yml` is not proposed; adding ESLint *does* mean extending the CI contract (D7).

7. **"Analytics integration requiring zero cookie consent" — correct intent, non-trivial mechanism.**
   Cloudflare Web Analytics is cookieless and the right choice, but either delivery path touches the CSP:
   zone-level automatic injection may be blocked by the `<meta>` CSP, and the explicit beacon loads from
   `static.cloudflareinsights.com`. Both need `security.csp` entries **in the same change**. See D4.

8. **Module ordering.** The brief orders design (module 2) before content (module 3). Phases 1–2 below
   invert that deliberately: the content inventory and copy come first, because in a typographic,
   restraint-led design the layout is a function of the text.

---

## 2. Constraints & Non-Goals

- **In Scope**:
  - Astro native i18n routing for EN (default, at `/`) / CA (`/ca/`) / ES (`/es/`).
  - A CSS-first design-token layer plus the five named components (`Hero`, `ServiceCard`,
    `CaseStudy`, `LanguagePicker`, `ContactSection`).
  - Content Collections with a typed schema, keyed for translation, plus typed UI dictionaries.
  - `hreflang` across the three locales, `ProfessionalService` + `Person` structured data,
    locale-aware OG tags, and a real 1200×630 OG image.
  - Cookieless analytics via an explicit beacon, and the CSP entries it needs, **added in the same
    change**.
  - ESLint (`eslint-plugin-astro` + a11y rules) as a new CI gate (D7 authorized), extending the CI
    contract **without** renaming the `CI` workflow or the `validate` job.
  - A placeholder-copy guard (D9) that stops Lorem Ipsum reaching live `vgr.cat`.
  - A Worker-served `POST /api/contact` endpoint with Turnstile spam protection, rate limiting, and
    transactional email (owner notification + visitor auto-reply) via the Cloudflare Email Service
    binding.
  - A pre-launch QA checklist with exact commands.

- **Out of Scope / Non-Goals**:
  - **No `@astrojs/cloudflare` adapter, no SSR, no on-demand rendering.** Every *page* stays
    prerendered. The site does gain a **standalone Worker script** for `POST /api/contact` (D3) — a
    different thing: assets remain asset-first, and the Worker runs only on paths no asset matches.
  - **No migration to Cloudflare Pages.**
  - **No CSP in `public/_headers`**, ever. See deviation 3.
  - **No wildcard `*.vgr.cat/*` route.**
  - **No client-side framework** (React/Vue/Svelte).
  - **No CMS, database or auth.**
  - **No committed secrets**, no `git commit` / `git push` / `git reset` / `git rebase` without explicit
    user authorization, and **no `wrangler rollback`** or `wrangler secret put/delete`.
  - **No confidential disclosure.** No employer-internal metrics, roadmap, client names, contract
    values, or unpublished regulatory positions about Topten or EU inspection tooling. Case studies
    describe *personal* technical contribution and *public* regulatory context (EPREL, ESPR/DPP) only.
  - **No visual design authored in this plan.** It specifies tokens and structure; art direction is
    applied during implementation. The inspiration reference (`itsthatlady.dev`) is a *layout-language*
    reference only — its IA (courses, newsletter, community) does not transfer.
  - **No final copywriting performed by the agent.** The build uses clearly marked Lorem Ipsum
    placeholders (D8); final EN/CA/ES copy is user-supplied. Placeholder text must never reach
    production — see D9.

- **Decision register** — every decision resolved as of 2026-10-15. Nothing here is outstanding:

  | ID | Decision | Blocks | Resolution |
  | --- | --- | --- | --- |
  | **D1** | ~~Authorize Tailwind 4~~ | Phase 2 | **RESOLVED 2026-10-15 — authorized.** `@theme` is the only token source |
  | **D2** | ~~Workers static assets **or** Pages~~ | Phase 4 | **RESOLVED 2026-10-15 — keep Workers static assets.** No migration to Pages |
  | **D3** | ~~Contact/lead-gen stack~~ | Phase 4 | **RESOLVED 2026-10-15 — Worker `POST /api/contact` + Cloudflare Email Service binding.** See Deviation 4 and Phase 4 |
  | **D4** | ~~Analytics delivery method~~ | Phase 5 | **RESOLVED 2026-10-15 — explicit beacon script.** Auditable, and whitelisted in the same change |
  | **D5** | ~~`www.vgr.cat`~~ | Phase 4 | **RESOLVED 2026-10-15 — handled in Cloudflare DNS + routing (zone-level), not in `wrangler.jsonc`.** See the caveat in Task 4.7 |
  | **D6** | ~~Default locale placement~~ | Phase 1 | **RESOLVED 2026-10-15 — EN at `/`.** Preserves the live URL, no redirect, no SEO churn |
  | **D7** | ~~Authorize ESLint~~ | Phase 4 | **RESOLVED 2026-10-15 — authorized.** `astro check` performs no a11y linting, so this is net-new value, not duplication |
  | **D8** | ~~Supply the copy up front~~ | Phases 1–3 | **RESOLVED 2026-10-15 — build with clearly marked Lorem Ipsum placeholders.** Enforcement mechanism is D9 |
  | **D9** | ~~Placeholder guard~~ | Phases 3–6 | **RESOLVED 2026-10-15 — approved.** `TODO(copy)` sentinel + CI check + temporary `ALLOW_PLACEHOLDER_COPY` hatch, retired in Task 6.6 |

### D9 — the placeholder-copy guard (approved 2026-10-15)

Placeholder copy is fine to build with, but `main` deploys on merge, so anything merged today is
published to live `vgr.cat` within minutes. The guard has to sit in CI, and CI is also the required
merge check — so a guard with no escape hatch would block every PR until all copy is written, which
defeats the point of building with placeholders at all.

**Mechanism:** mark every placeholder with the literal sentinel `TODO(copy)`.
`scripts/check-placeholders.mjs` greps `src/` and exits non-zero if any sentinel remains. Wire it into
`ci.yml` as `npm run check:placeholders`, **skipped while the repository variable
`ALLOW_PLACEHOLDER_COPY` is `true`**.

The hatch is deliberate and temporary, not a suppression: it is introduced and removed as explicit,
recorded steps, and Task 6.6 deletes the variable and the sentinels together so it cannot outlive the
placeholders it exists for. Record the variable's introduction *and* its removal, or it becomes a
permanently disabled check.

**Alternative considered:** hold placeholders on a long-lived branch that does not merge until copy is
ready. Rejected — it contradicts this repo's PR-per-change flow and leaves the redesign unreviewable.

---

## 3. Files Affected

### Configuration
- `package.json` — `[Modify]` — add `@tailwindcss/vite`, `@tailwindcss/typography`, `tailwindcss`,
  `prettier-plugin-tailwindcss`, `eslint`, `eslint-plugin-astro`; add `lint` and `check:placeholders`
  scripts.
- `package-lock.json` — `[Modify]` — regenerated; `npm ci` must still pass in CI.
- `astro.config.mjs` — `[Modify]` — add `i18n`, the Tailwind Vite plugin, `sitemap({ i18n })`, and the
  CSP `resources` entries for Turnstile (D3) and the analytics beacon (D4).
- `.prettierrc.json` — `[Modify]` — register `prettier-plugin-tailwindcss` (class ordering).
- `tsconfig.json` — `[Modify]` — optionally tighten to `astro/tsconfigs/strictest`.
- `eslint.config.js` — `[Create]` — flat config with `eslint-plugin-astro` + a11y rules (D7).
- `scripts/check-placeholders.mjs` — `[Create]` — exits non-zero while a `TODO(copy)` sentinel remains
  (D9).
- `AGENTS.md` — `[Modify]` — new gate expectations, the Tailwind/ESLint non-goal wording, and the
  retirement of the "no Worker script" statement.
- `.github/workflows/ci.yml` — `[Modify]` — add `lint` (D7) and the placeholder guard (D9).
- `public/_headers` — `[Modify]` — only if an extra static header is authorized. **Never** for CSP.
- `wrangler.jsonc` — `[Modify]` — `main`, `assets.binding` and `send_email` (D3) only. **`www` is
  handled in the Cloudflare dashboard, not here** (D5).

### Source — foundation
- `src/i18n/config.ts` — `[Create]` — locale list, default locale, `Locale` union type, path helpers.
- `src/i18n/en.ts`, `src/i18n/ca.ts`, `src/i18n/es.ts` — `[Create]` — typed UI dictionaries, one file
  per locale, all conforming to the shape exported by `en.ts`.
- `src/content.config.ts` — `[Create]` — Astro 5+ collections using the `glob` loader.
- `src/styles/global.css` — `[Modify]` — `@import 'tailwindcss'`, `@theme` token block, keep the
  existing light/dark `--color-*` mechanism.
- `src/layouts/BaseLayout.astro` — `[Modify]` — `lang` prop (currently hardcoded `en`), `hreflang`
  alternates, `og:locale` / `og:locale:alternate`, real OG image, locale-aware canonical.
- `src/lib/schema.ts` — `[Create]` — `Person` + `ProfessionalService` JSON-LD builders.

### Source — components
- `src/components/Hero.astro` — `[Create]`
- `src/components/ServiceCard.astro` — `[Create]`
- `src/components/CaseStudy.astro` — `[Create]`
- `src/components/LanguagePicker.astro` — `[Create]` — path-preserving, `hreflang`-linked
- `src/components/ContactSection.astro` — `[Create]`
- `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro` — `[Create]`

### Source — pages and content
- `src/pages/index.astro` — `[Modify]` — EN home; imports a shared page composition.
- `src/pages/[lang]/index.astro` — `[Create]` — `getStaticPaths` for `ca` and `es`.
- `src/pages/404.astro` — `[Modify]` — localize, keep `BaseLayout` usage.
- `src/content/services/**` — `[Create]` — three pillars, per-locale entries.
- `src/content/caseStudies/**` — `[Create]` — Topten ecosystem, Topten Scout, EU inspection tooling.
- `public/og/og-default.png` — `[Create]` — 1200×630; replaces the current `favicon.svg` OG target.
- `public/fonts/*.woff2` + `src/styles/fonts.css` — `[Create]` — self-hosted; `'self'`, so **no** CSP
  change is required.

### Source — contact endpoint (D3)
- `src/worker/index.ts` — `[Create]` — `POST /api/contact`: validate, verify Turnstile server-side,
  send notification + auto-reply, return `303` to `/contact/thanks`. Also sets its own security headers
  on every response it generates (see note below).
- `src/components/ContactForm.astro` — `[Create]` — plain same-origin `<form method="post">`; works
  with JavaScript disabled.
- `src/pages/contact/thanks.astro` — `[Create]` — post-submit landing page, all three locales.
- `worker-configuration.d.ts` — `[Create]` — generated by `npx wrangler types`, **never hand-written**.
- `README.md` — `[Modify]` — document that `npm run dev` and `npm run preview` cannot exercise the
  endpoint, and that `npm run build && npx wrangler dev` can.

> **`public/_headers` does not cover the Worker.** The scoped instruction states `_headers` "Applies to
> static assets only — never to Worker-generated responses." Because routing stays asset-first, every
> HTML *page* is still served as a static asset and keeps its HSTS / `nosniff` / `X-Frame-Options`
> headers. But the Worker's own responses — the `303` redirect and any error JSON from `/api/contact` —
> get **none** of them unless the Worker sets them itself. On a site whose pitch is regulatory rigour,
> the Worker must attach at least `Strict-Transport-Security` and `X-Content-Type-Options: nosniff` to
> its responses. This is handled in Task 4.4, not by `public/_headers`.

---

## 4. Step-by-Step Execution Plan

### Phase 1: i18n foundation, information architecture and content inventory

**Goal**: A locale-aware routing skeleton exists, and the section inventory the rest of the plan depends
on is written down and agreed.

#### Tasks

- [x] Task 1.1: Record the **section inventory** — the ordered list of sections, and whether it is a
      single page or several — in a companion document under `.ai/plans/active/`. Still required even
      though copy is now placeholder filler (D8): the *structure* is a decision, not filler, and it is
      what Phase 2's typography depends on. **Hard prerequisite for Phase 2.**
      > **AGREED 2026-10-15.** User accepted the proposed single-page inventory ("go"). Companion doc
      > `2026-10-15-portfolio-regtech-site-ia.md` status flipped to AGREED. Phase 2 unblocked.
- [x] Task 1.2: Add `i18n` to `astro.config.mjs` per D6:
      ```js
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ca', 'es'],
        routing: { prefixDefaultLocale: false },
      },
      ```
- [x] Task 1.3: Configure `@astrojs/sitemap` for `hreflang`:
      `sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ca: 'ca', es: 'es' } } })`.
- [x] Task 1.4: Create `src/i18n/config.ts` exporting `locales`, `defaultLocale`, a `Locale` union and a
      `localizedPath(locale, path)` helper that returns `/` for `en`.
- [x] Task 1.5: Add a `lang` prop to `BaseLayout.astro`, replacing the hardcoded `lang="en"`, and emit
      `hreflang` alternates plus `og:locale` / `og:locale:alternate`.
- [x] Task 1.6: Record the actual post-change `astro check` file count as evidence and update the pinned
      expectation in `AGENTS.md`.

> **Recorded evidence (2026-10-15).** Also created `src/pages/[lang]/index.astro` (a minimal
> `getStaticPaths` skeleton for `ca`/`es`) — unlisted as its own task but required by this phase's
> acceptance criteria, which demand `/ca/` and `/es/` build. `AGENTS.md` pinned numbers updated:
> `astro check` 5→7, build 2→4 pages, Wrangler "Read 8 files"→"Read 12 files", and the `src/` file-count
> gotcha. A pre-existing **Shiki/CSP build warning** is emitted (CSP is on, Shiki is the default MD
> highlighter); it predates this phase, renders nothing today, and is unrelated to i18n.
>
> **Follow-up (2026-10-15).** Unified the locale source of truth: `astro.config.mjs` now imports
> `locales`/`defaultLocale` from `src/i18n/config.ts` (the sitemap map is derived via
> `Object.fromEntries`). Switching the default locale is now a **one-line** change in `config.ts`, not an
> edit in three places. Motivated by a `.cat`-policy question: the policy requires Catalan *content*
> (satisfied by the first-class `/ca/` locale), **not** Catalan as the default or at `/` — verified
> against domini.cat's FAQ via Wikipedia; confirm the live Accent Obert/puntCAT policy before launch.
> D6 (EN at `/`) stands. Gate re-run clean: check 15 files, build 4 pages, Wrangler Read 21, sitemap
> alternates unchanged (3×`en`/`ca`/`es`).

#### Acceptance Criteria

- [x] `npm run check` passes with 0 errors and the **new** file count is recorded verbatim.
      → `Result (7 files): 0 errors, 0 warnings, 0 hints`.
- [x] `npm run build` emits `dist/index.html`, `dist/ca/index.html`, `dist/es/index.html`.
      → build log: `/index.html`, `/ca/index.html`, `/es/index.html`, `/404.html` — `4 page(s) built`.
- [x] `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` exits 0 with no warnings, and the new
      "Read N files" count is recorded verbatim. → `✨ Read 12 files`, `exit=0`, no warnings.
- [x] `dist/sitemap-0.xml` contains `xhtml:link` alternates for all three locales.
      → each `<url>` carries `hreflang="en"|"ca"|"es"`; built `index.html` also emits `en`/`ca`/`es`/`x-default`.

### Phase 2: Design system and modular UI components

**Goal**: Tokens are declared once in CSS, and the five named components exist and are CSP-clean.

#### Tasks

- [x] Task 2.1: Install Tailwind 4 (D1 was authorized 2026-10-15):
      `npx astro add tailwind` (expects `@tailwindcss/vite`). Confirm `package-lock.json` changed and
      `npm ci` still resolves.
      > **Recorded deviation.** Did **not** run the `astro add` wizard — it would rewrite the carefully
      > commented CSP block in `astro.config.mjs`. Instead ran
      > `npm install -D tailwindcss@^4 @tailwindcss/vite@^4 @tailwindcss/typography prettier-plugin-tailwindcss @fontsource-variable/inter`
      > (22 packages, exit 0) and wired `vite: { plugins: [tailwindcss()] }` by hand. Same result, config
      > comments preserved. **2 moderate npm audit advisories** were reported post-install — not yet
      > triaged; see the report.
- [x] Task 2.2: Replace the token block in `src/styles/global.css` with a Tailwind 4 CSS-first theme,
      preserving the existing light/dark mechanism:
      ```css
      @import 'tailwindcss';

      @theme {
        --color-bg: #ffffff;
        --color-fg: #1a1a1a;
        --color-accent: #0b5fff; /* replaces the reference design's pink */
        --font-sans: 'Inter Variable', system-ui, sans-serif;
        --measure: 68ch;
      }

      @media (prefers-color-scheme: dark) {
        @theme {
          --color-bg: #101114;
          --color-fg: #f2f3f5;
          --color-accent: #7aa7ff;
        }
      }
      ```
      Note: verify the `@theme`-inside-`@media` form against Tailwind 4 docs during implementation; if
      unsupported, keep the dark overrides as plain custom properties on `:root` exactly as today.
      > **Recorded outcome.** `@theme` does **not** accept nesting inside `@media`, so the fallback was
      > taken: colour tokens live in one `@theme` block; the dark overrides stay as plain custom
      > properties under `@media (prefers-color-scheme: dark) :root`, exactly as the pre-Tailwind file
      > did. `--measure` stays a plain custom property. Accent kept the existing blue `#0b5fff` /
      > `#7aa7ff` (not the reference design's pink), per the user's preference.
- [x] Task 2.3: Self-host the webfont as `public/fonts/*.woff2` with `@font-face` in `src/styles/fonts.css`.
      **No `security.csp` change is needed** — same-origin is `'self'`. Do not add a Google Fonts `<link>`.
      > **Recorded deviation.** Self-hosted via `@fontsource-variable/inter` (imported in `global.css`)
      > rather than hand-placed `public/fonts/*.woff2` + `fonts.css`. Vite bundles the woff2 to
      > same-origin `/_astro/*.woff2` (verified: `src:url(/_astro/inter-…woff2)`, `font-display:swap`),
      > so the CSP outcome is identical — `'self'` covers it, **no `security.csp` change**. Simpler and
      > version-pinned. No `fonts.css` file created.
- [x] Task 2.4: Build `Hero.astro`, `ServiceCard.astro`, `CaseStudy.astro`, `LanguagePicker.astro`,
      `ContactSection.astro`, `SiteHeader.astro`, `SiteFooter.astro` — Astro components only.
      > All seven created under `src/components/`. Also added `src/components/HomeSections.astro` — the
      > "shared page composition" the plan's `index.astro` entry references — plus header/footer named
      > slots in `BaseLayout.astro` so `<header>`/`<footer>` are proper landmarks outside `<main>`.
      > Components carry clearly-marked `TODO(copy)` placeholder props; real content is Phase 3.
- [x] Task 2.5: Any interactive behaviour (mobile nav toggle) must be an **inline** `<script>` inside the
      `.astro` component so Astro hashes it. No `<script src="https://…">`, no CDN.
      > The nav toggle is a standard Astro `<script>` in `SiteHeader.astro`. Astro inlined it as a
      > `<script type="module">` and **added its sha256 to `script-src`** (verified below). No external
      > or CDN script.
- [x] Task 2.6: Register `prettier-plugin-tailwindcss` in `.prettierrc.json`.
      > Added as the **last** plugin (`["prettier-plugin-astro", "prettier-plugin-tailwindcss"]`) so
      > class sorting runs after the Astro parser. `npm run format` applied the sort tree-wide.

#### Acceptance Criteria

- [x] `npm run format:check` passes (class ordering is now enforced).
      → `All matched files use Prettier code style!`
- [x] `npm run build` succeeds and `dist/_astro/` is **non-empty** — real CSS now exceeds Astro's inline
      threshold. Record this, and note that it activates the previously dormant `/_astro/*` `immutable`
      rule in `public/_headers`.
      → `dist/_astro/BaseLayout.*.css` (~32 KB) + 8 bundled Inter `*.woff2`. `astro check` **15 files**;
      `npm run build` **4 pages**; `wrangler --dry-run` **Read 21 files**, no warnings. The dormant
      `/_astro/*` immutable header rule is now live for the bundle.
- [x] `grep -o 'content-security-policy[^>]*' dist/index.html` shows `style-src` hashes that match the
      emitted inline blocks, and **no** hand-written `script-src`/`style-src` was added.
      → `style-src 'self' 'sha256-47DEQ…'` (empty-string hash + `'self'` covering the same-origin
      bundle); `script-src 'self'` + 6 hashes. The config `directives` array still carries only the 5
      extra directives — script/style sources are 100% Astro-generated.
- [x] CSP correctness proven deterministically (stands in for the live Playwright run):
      a Node script computed the sha256 of every inline `<script>` and confirmed membership in
      `script-src` (1 inline script, `sha256-KllY0u…` → **IN**), found **0** inline `style=` attributes,
      confirmed **no `unsafe-inline`**, and verified the CSP meta is present on all 4 pages. Every
      resource (bundle CSS, woff2 fonts) is same-origin, so there is no CSP-blockable request by
      construction.
      > **Deferred:** the live-browser `securitypolicyviolation` + `getComputedStyle` assertion was
      > **not** run — no browser harness was stood up this phase. The deterministic hash proof above is
      > stronger for the *violation* question; the *computed-style* question is evidenced by the bundle
      > containing the Inter `@font-face` and the used utilities (`bg-accent`, `text-muted`, `max-w-5xl`,
      > `grid-cols-3`, `sr-only`). Run the full Playwright check against the PR preview before launch
      > (Phase 6).

### Phase 3: Content architecture and copy

**Goal**: Long-form and micro-copy both live in typed, translatable structures.

#### Tasks

- [x] Task 3.1: Create `src/content.config.ts` with the `glob` loader and a schema carrying a
      `translationKey` so the three locale variants of one item are linked:
      ```ts
      import { defineCollection, z } from 'astro:content';
      import { glob } from 'astro/loaders';

      const caseStudies = defineCollection({
        loader: glob({ base: './src/content/caseStudies', pattern: '**/*.md' }),
        schema: z.object({
          translationKey: z.string(),
          locale: z.enum(['en', 'ca', 'es']),
          title: z.string(),
          summary: z.string(),
          pillar: z.enum(['regtech', 'entity-resolution', 'infrastructure']),
        }),
      });

      export const collections = { caseStudies };
      ```
- [x] Task 3.2: Author the three pillars (RegTech/EPREL compliance, Entity Resolution & Market
      Observability, Multi-tenant Cloud Infrastructure) and the case studies (Topten ecosystem, Topten
      Scout, EU inspection tooling) in all three locales, respecting the non-goal on confidential detail.
- [x] Task 3.3: Author `src/i18n/{en,ca,es}.ts` UI dictionaries. Type them so a missing key in `ca`/`es`
      is a compile error: `export const ca: typeof en = { … }`.
- [x] Task 3.4: Write the tone guidelines into the plan's companion doc: pragmatic, metrics-driven,
      operational ROI and regulatory certainty; no generic developer clichés; Catalan written for
      institutional/public-tender register, not machine-translated from English.
- [x] Task 3.5: Build `src/lib/schema.ts` emitting `Person` and `ProfessionalService` JSON-LD, injected
      as a single inline `<script type="application/ld+json">` in `BaseLayout` (Astro hashes it).
- [x] Task 3.6: Seed every content entry and dictionary key with Lorem Ipsum carrying the `TODO(copy)`
      sentinel (D8, D9), so placeholders are **greppable**, not merely obvious to a human reading the
      page. Create `scripts/check-placeholders.mjs` and wire `npm run check:placeholders` into `ci.yml`
      behind the `ALLOW_PLACEHOLDER_COPY` variable.

#### Acceptance Criteria

- [x] `npm run check` passes with 0 errors — a missing translation key fails the build, not production.
- [x] Every collection entry has three locale siblings sharing one `translationKey`; verify with a count
      assertion rather than by eye.
- [x] `npm run check:placeholders` reports the expected number of outstanding `TODO(copy)` sentinels and
      that count is recorded — it is the burn-down list for Phase 6.
- [x] Each of `/`, `/ca/`, `/es/` renders its own copy with no untranslated fallback visible.
      → verified in a real browser against `npm run preview`: EN page had 41 `TODO(copy) —` markers and
      **0** `[ca]`/`[es]`; `/ca/` had 32 `[ca]` and **0** others (`html lang="ca"`); `/es/` had 32 `[es]`
      and **0** others (`html lang="es"`). Each page carried its own `<title>`, canonical and
      `hreflang="en,ca,es,x-default"`.

> **Recorded evidence (2026-10-15).** `astro check` → **22 files, 0 errors, 0 warnings, 0 hints**.
> `npm run build` → 4 pages. `wrangler deploy --dry-run` → **Read 21 files**, no warnings (unchanged:
> content collections add no `dist` files). `npm run check:placeholders` → **exit 1**, reporting
> **129 sentinels across 21 files** — the Phase 6 burn-down list.
>
> **Two recorded deviations from the plan's snippets.**
>
> 1. **Zod import.** The plan snippet used `import { z } from 'astro:content'`. That is not exported in
>    Astro 7.3.8. `astro:schema` works but is **deprecated** (7 hints, and this repo's gate demands 0
>    hints), and its own JSDoc names the replacement: "Use `import { z } from 'astro/zod'` instead".
>    Final form: `defineCollection` from `astro:content`, `z` from `astro/zod`.
> 2. **`CaseStudy` reshaped.** The plan implied a three-part problem/approach/outcome card. The agreed
>    schema carries only `title`/`summary`/`pillar`, so the component now takes `title` + `summary` and
>    the markdown body is **not yet rendered**. The problem/approach/outcome breakdown belongs in the
>    real copy; revisit when it is written rather than inventing the structure now.
>
> **CSP finding — a new inline script was introduced, so it was verified, not assumed.** The JSON-LD
> block is an inline `<script type="application/ld+json">` and Astro does **not** add a hash for it
> (only the nav module script is hashed). A real-browser check with an `addInitScript`
> `securitypolicyviolation` listener reported **zero violations on `/`, `/ca/`, `/es/` and the 404 page**,
> confirming that non-executable data blocks are outside `script-src` enforcement. `unsafe-inline` is
> absent, there are **0** inline `style=` attributes, and computed styles confirmed the bundle applied
> (`body` margin `0px`, `font-family: "Inter Variable", …`, dark-mode bg `rgb(16, 17, 20)`, `h1` 48px).
> The JSON-LD graph parses to `["Person", "ProfessionalService"]`. Rationale for the absence of a hash is
> recorded rather than silenced: the blog body is placeholder, and Astro cannot hash arbitrary
> `set:html` content.
>
> **Residual / deferred.** (a) `src/pages/404.astro` remains **English-only** — it renders no dictionary
> keys, so `/ca/` and `/es/` 404s show English. A static 404 is a single prerendered file, so
> locale detection is impossible server-side; this needs a decision (accept English, or add a small
> inline script) and is left to Phase 5/6 rather than guessed at here. (b) The plan's Phase 1 file list
> described `404.astro` as "localize" — that is now explicitly **not done**, for the reason above.

### Phase 4: Contact endpoint, CI/CD and Cloudflare infrastructure

**Goal**: A genuinely working contact page — the owner is notified and the visitor gets a reply — with
the pipeline still validating and deploying.

**Verified basis for this phase** (retrieved from the Cloudflare docs on 2026-10-15; quoted, not
paraphrased):

- *Asset-first routing:* "If you have both static assets and a Worker script configured, Cloudflare will
  first attempt to serve static assets if one matches the incoming request... If an appropriate static
  asset is not found, Cloudflare will invoke your Worker script." — *Workers static assets → Routing →
  Worker script*, last updated 2026-10-12. So `POST /api/contact` reaches the Worker with **no**
  `run_worker_first` needed, and ordinary page views never invoke it.
- *Arbitrary recipients are possible:* "Before you onboard a sending domain, you can send emails only to
  verified destination addresses in your account. **After you onboard a sending domain, you can send to
  any recipient immediately.**" — *Email Service → Limits*, last updated 2026-09-25. This is the fact
  that makes the visitor auto-reply possible on the Cloudflare binding. **Mailgun is not required.**
- *Cost:* "Sends to verified destination addresses are always free: they do not count toward your
  monthly quota or your daily sending limits, on any plan." The owner notification to a verified inbox is
  therefore quota-exempt regardless of plan.
- *Least-privilege bindings*: an unconfigured `send_email` binding may send to any verified destination;
  `destination_address` pins it to exactly one; `allowed_destination_addresses` is an allowlist. —
  *Email Service → Configure send bindings*.

#### Tasks

- [ ] Task 4.1: Add the Worker and bindings to `wrangler.jsonc`, preserving
      `not_found_handling: '404-page'` (it is what makes `src/pages/404.astro` serve):
      ```jsonc
      {
        "name": "vgr-cat",
        "main": "./src/worker/index.ts",
        "routes": [{ "pattern": "vgr.cat", "custom_domain": true }],
        "assets": {
          "directory": "./dist",
          "not_found_handling": "404-page",
          "binding": "ASSETS",
        },
        "send_email": [
          // Least privilege: the notification can only ever reach one inbox.
          { "name": "NOTIFY", "destination_address": "REPLACE_ME@vgr.cat" },
          // Auto-reply to the visitor. Separate binding, deliberately unrestricted.
          { "name": "REPLY" },
        ],
        "observability": { "enabled": true },
      }
      ```
      **Then verify the 404 behaviour, because the Worker changes it.** `not_found_handling` governs the
      *asset* handler; a request that matches no asset now invokes the Worker script instead. Confirm
      that an unknown path still renders `src/pages/404.astro`, and if it does not, make the Worker fall
      through to `env.ASSETS.fetch(request)` for every non-`/api/*` path — which is also why the
      `ASSETS` binding above is required rather than optional. Losing the custom 404 is the single most
      likely silent regression from this phase.
- [ ] Task 4.2: Build the contact flow as **progressive enhancement with no JavaScript required**:
      `<form method="post" action="/api/contact">` posting same-origin, which the existing
      `form-action 'self'` already permits. The Worker answers `303 See Other` with
      `Location: /contact/thanks` — `form-action` constrains the *submission target*, not the redirect
      that follows. Add a real `src/pages/contact/thanks.astro` in all three locales.
- [ ] Task 4.3: Add Turnstile, verified **server-side only**, and add its CSP resources **in the same
      change**:
      ```js
      security: {
        csp: {
          directives: [
            "default-src 'self'",
            "img-src 'self' data:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-src https://challenges.cloudflare.com",
          ],
          // Resources only. Never hand-write the script-src hash list — Astro owns it.
          scriptDirective: { resources: ["https://challenges.cloudflare.com"] },
          styleDirective: { resources: ["https://challenges.cloudflare.com"] },
        },
      },
      ```
      **Confirm the exact directive set against current Turnstile docs during implementation.** The
      `styleDirective` entry above is *inferred, not verified* — Turnstile injects its own styles, and the
      authoritative test is the zero-violations browser check in the acceptance criteria. Do **not** add
      `'unsafe-inline'`.
- [ ] Task 4.4: Harden the endpoint. These are requirements, not suggestions:
      - **Validate before use.** Strict email regex, length cap on every field, and reject `\r` / `\n` in
        anything reaching `subject` or `replyTo`. Interpolating raw visitor input into a header is
        **email header injection** — on a site whose pitch is regulatory rigour, that is not a cosmetic
        bug.
      - **Rate limit.** An unauthenticated public endpoint that sends mail will be found and abused. Add a
        Cloudflare rate-limiting rule on `/api/contact`, plus a honeypot field and a minimum
        time-to-submit check as cheap first lines.
      - **Never verify the Turnstile token in the browser.** `siteverify` runs in the Worker only.
      - **Set security headers on the Worker's own responses.** `public/_headers` does not apply to
        Worker-generated responses, so attach at least `Strict-Transport-Security` and
        `X-Content-Type-Options: nosniff` to the `303` and to any error response from `/api/contact`.
      - Consider whether the auto-reply makes the endpoint a backscatter/abuse amplifier; if so, drop the
        `REPLY` binding and keep only the notification, which is quota-exempt and cannot be abused into
        unsolicited mail.
- [ ] Task 4.5: Generate binding types instead of hand-writing them: `npx wrangler types` →
      `worker-configuration.d.ts`, exposed as a `types` script. Decide and record whether the generated
      file is committed or produced in CI.
- [ ] Task 4.6: Add `eslint.config.js` (`eslint-plugin-astro` + a11y rules; D7 authorized) and insert a
      `npm run lint` step into `ci.yml`. **Do not rename the `CI` workflow or the `validate` job** —
      branch protection requires the `CI / validate` status check.
- [ ] Task 4.7: `www.vgr.cat` is handled in **Cloudflare DNS + routing**, deliberately *not* in
      `wrangler.jsonc` (D5). Two constraints apply:
      - **No wildcard route.** A `*.vgr.cat/*` catch-all answers on every present *and future*
        subdomain, and was deliberately removed once already.
      - **Use a zone-level Redirect Rule, not a Worker route.**
        `.github/instructions/cloudflare-config.instructions.md` warns that `routes` in `wrangler.jsonc`
        is the single source of truth and that Wrangler reconciles routes on every deploy, so a *Worker
        route* added only in the dashboard disappears on the next deploy. A DNS record plus a Redirect
        Rule lives outside the Worker's route table and is therefore stable. Verify this distinction
        empirically rather than assuming it.
- [ ] Task 4.8: Leave `deploy.yml` structure and `cancel-in-progress: false` untouched.
- [ ] Task 4.9: Manual user actions — each one touches production or the account, so request
      authorization first: onboard the sending domain (`npx wrangler email sending enable …`) with its
      SPF/DKIM records; verify the destination inbox address; create the Turnstile secret with
      `npx wrangler secret put TURNSTILE_SECRET_KEY`. **`wrangler secret put` deploys immediately.**

#### Acceptance Criteria

- [ ] `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` exits 0 with no warnings for the new
      `main` + `send_email` configuration; record the new "Read N files" count verbatim.
- [ ] CSP: `npm run build`, confirm each newly permitted origin appears in `dist/index.html`'s meta CSP,
      then browser-test with **zero** `securitypolicyviolation` events **and** assert the widget's styles
      actually applied — a present-but-blocked Turnstile renders invisibly and fails silently.
- [ ] Happy path on a real deployment: the notification email arrives **and** the visitor auto-reply
      arrives. Record the actual `EmailSendResult.messageId` values.
- [ ] Negative paths, each recorded with its real status code: missing token → rejected; invalid token →
      rejected; oversized body → rejected; a field containing `\r\n` → rejected, **not injected**.
- [ ] Rate limiting observed by deliberately exceeding the limit.
- [ ] **404 not regressed:** an unknown path **and** an unknown locale prefix still render
      `src/pages/404.astro` with the right status, now that a Worker is in front of the assets.
- [ ] **DX regression recorded:** `npm run dev` and `npm run preview` cannot exercise the endpoint —
      Astro's dev server and the static preview never run the Worker. Local integration testing requires
      `npm run build && npx wrangler dev`. Put this in `README.md` so it is not rediscovered.
- [ ] Documentation gotcha recorded: emails sent from the Worker show as **dropped** in the Email Routing
      summary even when delivered successfully. Use Email Sending metrics/logs for delivery truth.
- [ ] `CI / validate` is still the reported check name on the PR.

### Phase 5: Technical SEO, performance and cookieless analytics

**Goal**: Locale-correct discovery metadata and privacy-safe measurement.

#### Tasks

- [ ] Task 5.1: Add Cloudflare Web Analytics via the **explicit beacon script** (D4 authorized) so the
      origin is auditable. Add `https://static.cloudflareinsights.com` to the CSP `script-src` resources
      and the beacon endpoint to `connect-src`, **in the same change** as the script tag. Do **not** use
      zone-level automatic injection: a script injected by Cloudflare is not in Astro's hash list, which
      is precisely the case the `<meta>` CSP blocks.
- [ ] Task 5.2: Generate the real 1200×630 OG image at `public/og/og-default.png` and point
      `BaseLayout`'s `og:image` / `twitter:image` at it — currently they point at `favicon.svg`.
- [ ] Task 5.3: Confirm `robots.txt` still references the absolute sitemap URL and that the sitemap
      emits `hreflang`.
- [ ] Task 5.4: Verify per-locale canonical URLs and `og:locale`.

#### Acceptance Criteria

- [ ] `curl -s https://<preview>/ | grep -o 'content-security-policy[^>]*'` shows the analytics origin.
- [ ] Browser load records **zero** CSP violations and the beacon request succeeds (assert the network
      entry, not just absence of an error).
- [ ] No cookie is set by the analytics script — assert `document.cookie === ''` after a pageview.
- [ ] Lighthouse mobile: Performance ≥ 95 and Accessibility = 100 on `/`, `/ca/` and `/es/`. Record the
      actual numbers; the brief's "100" target is a goal, and English-only phrasing may not survive
      translation — **do not record 100 unless measured**.

### Phase 6: Pre-launch QA and go-live

**Goal**: Cutover is boring.

#### Tasks

- [ ] Task 6.1: Run the full local gate and capture output verbatim:
      ```bash
      npm ci
      npm run format:check
      npm run check
      npm run build
      npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
      ```
- [ ] Task 6.2: Preview the built output: `npm run preview`. Remember `public/_headers` is **inert**
      under `preview`, and `npm run dev` emits **no CSP meta tag** — neither can validate CSP or headers.
- [ ] Task 6.3: Cross-language link validation: crawl all three locales and assert every internal link
      resolves (an `hreflang`-declared sibling that 404s is the classic multilingual failure).
- [ ] Task 6.4: Verify 404 handling for both a bad path and a bad locale prefix.
- [ ] Task 6.5: Mobile layout audit at 320 px, 375 px and 768 px.
- [ ] Task 6.6: **Replace every `TODO(copy)` placeholder with final copy** and delete the D9 escape hatch
      (the `ALLOW_PLACEHOLDER_COPY` repository variable) in the same change, so the hatch cannot outlive
      the placeholders. This includes the Catalan, which must read as institutional/public-tender
      register rather than machine-translated English.
- [ ] Task 6.7: Manual user actions (not agent actions): configure the `www` DNS record + Redirect Rule
      to the apex (D5); confirm SSL/TLS mode is Full (strict) in the Cloudflare dashboard.
- [ ] Task 6.8: Land via a branch and a pull request. `main` is branch-protected; direct pushes are
      rejected. Do not commit without explicit authorization.

#### Acceptance Criteria

- [ ] All five gate commands exit 0 and their output is recorded verbatim in this plan.
- [ ] **Zero `TODO(copy)` sentinels remain** and the `ALLOW_PLACEHOLDER_COPY` variable is deleted — the
      guard is now unconditional and would fail the build if placeholder copy ever returned.
- [ ] Zero broken internal links across the three locales.
- [ ] CSP violation count is zero on every locale in a real deployment.
- [ ] Checksum/first-paint comparison before and after the DNS-independent deploy shows no regression.

---

## 5. Post-Implementation Verification & Regression Checks

- [ ] Feature end-to-end functionality verified on a real Cloudflare deployment, not only locally.
- [ ] `npm run format:check`, `npm run check`, `npm run build` and the Wrangler dry-run all pass cleanly.
- [ ] **`AGENTS.md`'s pinned expectations are updated to the measured values** (`astro check` file count,
      Wrangler "Read N files"). These are documented as expected numbers and will otherwise read as
      regressions on the next change.
- [ ] **The "no Worker script" statements are retired.** `AGENTS.md` describes this project as having
      "no Worker script", and the repo memory asserts the same. After Phase 4 both are false. Update them
      in the same change, or the next agent will plan against a deployment shape that no longer exists.
- [ ] No unintended modifications outside the listed affected files — in particular `deploy.yml` stays
      untouched, `public/_headers` gains **no CSP** ever, and `wrangler.jsonc` changes only for D3.
- [ ] Every CSP addition is paired with the resource that needs it, in the same commit.
- [ ] Nothing marked verified in this plan was inferred; anything not run is marked **Deferred** with
      the reason.
- [ ] Plans and decision records are archived with the `## Archive Metadata` footer when complete. Do
      **not** delete `.ai/plans/active/.gitkeep`, and do **not** run Prettier on `.ai/`.
