# Task Plan: Index/Detail Information Architecture and Visual Identity

- **Plan date:** 2026-10-20 (`date +%Y-%m-%d` → `2026-10-20`)
- **Base:** `main` at `5cce688` (`git log --oneline -12`, working tree clean at plan time)
- **Plan type:** implementation specification. No source file was modified while writing it; nothing was
  built, deployed, or submitted to a production form.
- **Owner instruction:** "B + D, with A de-duplication as the first step" — i.e. index/detail page
  navigation, plus a visual identity pass, with the case-study de-duplication landing first because it is
  cheap and does not depend on either decision.
- **Predecessor:** `.ai/plans/active/2026-10-19-ui-ux-improvement.md` (UI/UX audit + spec). Its findings
  UX-007 (case-study duplication), UX-019 (single 16,779 px page), UX-027 (no imagery or quantified
  artefacts) and UX-031 (`caseStudyOrder` is authoritative) are the inputs for this plan. Read §4.0
  before touching anything, because this plan **amends** one of its recorded decisions.

---

## 1. Context & Objectives

### 1.1 Goal

Turn `vgr.cat` from one 11,517 px document into a hub-and-spoke site — a scannable home page that indexes
four services and four case studies, each backed by its own prerendered page — and give the visual layer a
hierarchy a visitor can read in three seconds (display type, banded sections, uniform cards, one bold CTA),
without weakening the security, i18n or accessibility guarantees the repository already holds.

### 1.2 Measured baseline (recorded 2026-10-20, production `https://vgr.cat`)

Measured in a 1280×900 viewport after `load`, via `page.evaluate` on `document.documentElement` and
`document.body.innerText`:

```text
documentElement.scrollHeight: 11,517 px  (~13 desktop viewports)
body.innerText words:          2,959
#services 1,835 px /  650 words
#work     5,836 px / 1,652 words
#about    1,450 px /  391 words
#contact  1,304 px /  127 words
390×844: scrollHeight 20,471 px (~24 mobile screens)
```

**Recorded caveat:** these numbers were measured against the **deployed** site, not a local `dist/`. They
establish the size of the problem, not a regression baseline. Phase 1 Task 1.0 re-baselines locally on the
same build the tests run against, and that local pair (before/after) is the evidence that counts.

### 1.3 Why this shape

Three independent causes were confirmed by reading the code and the rendered page; the plan addresses them
in dependency order, cheapest first:

1. **Duplication (A).** Every case study renders its `problem`/`approach`/`outcome` frontmatter as a
   three-column `<dl>` **and** renders a markdown body whose `####` headings restate the same three
   sections. `#work` is 5,836 px because of it, and roughly 40% of that text is repeated. No route change is
   needed to stop rendering the second copy — the bodies already exist and will simply move to a detail
   page in Phase 2.
2. **No scan layer (B).** Every block competes at the same volume. The content collections already carry
   everything a hub needs: `summary` (one line), `pillar` (shared enum across services and case studies),
   and `translationKey` (locale-stable slug). Index/detail separation is therefore a routing change, not a
   content-model change.
3. **No visual hierarchy (D).** One accent (`#0b5fff`), one typeface (Inter), uniform `--space-section`
   rhythm, no imagery, and a `--color-surface` card that barely separates from the page.

### 1.4 Technical strategy

- **Content stays the source of truth.** `src/content.config.ts` is **not** changed. `summary`,
  `translationKey` and `pillar` become the routing and teaser layer; the markdown bodies become the detail
  layer.
- **Two thin route files per template.** `build.format: 'directory'` with
  `prefixDefaultLocale: false` means the default locale is served from the root while `ca`/`es` are
  prefixed. The repo already accepts this duplication (`pages/index.astro` + `pages/[lang]/index.astro`
  both delegate to `HomeSections.astro`); this plan follows the same pattern and keeps each route file to
  `getStaticPaths` + a single component call.
- **SEO machinery is free.** `BaseLayout.astro` already computes canonical and hreflang from
  `stripLocale(Astro.url.pathname)`, so `/work/topten-ecosystem/` gets correct alternates with no new code.
  Only JSON-LD needs per-page types.
- **No new external origins.** Visual identity uses a self-hosted variable font (Vite-hashed, same-origin)
  and CSS/SVG only. The CSP in `astro.config.mjs` must stay untouched, and the built `<meta>` CSP is the
  verification artefact.
- **Motion is CSS-only.** Scroll-driven reveals use `animation-timeline: view()` behind `@supports` and
  `prefers-reduced-motion: no-preference`, so no new inline script is added and no CSP hash is involved.

---

## 2. Constraints & Non-Goals

### 2.1 In Scope

- Removing the case-study prose duplication from the home page (Phase 1).
- New prerendered routes: `/work/<slug>/`, `/services/<slug>/`, `/about/`, each in `en`/`ca`/`es`.
- Navigation, breadcrumbs and footer links converted from in-page fragments to real locale paths.
- Per-page JSON-LD (case study, service, about) and breadcrumb data.
- Home page restructured as a hub with a full-bleed CTA band.
- Visual identity: display typeface, extended palette with recorded contrast ratios, card system, section
  rhythm, CSS-only motion.
- Test suite updates (`tests/routes.ts`, `tests/structure.spec.ts`, `tests/network.spec.ts`) plus one new
  page-weight regression test.
- Documentation sync for counts asserted in `AGENTS.md` (page count, `astro check` file count, dry-run file
  count).

### 2.2 Out of Scope / Non-Goals

- **No content-model change.** `src/content.config.ts` is unchanged; no frontmatter field is added or
  removed; no `.md` content file is edited for content reasons in Phases 2–4.
- **No deletion of authored copy.** See §4.0 — this plan deliberately supersedes the "delete the prose"
  step recorded in the predecessor plan.
- **No raster photography or illustration.** The visual pass uses type, colour, spacing, borders and inline
  SVG only. Real imagery is UX-027's own project and carries the only serious performance risk; it is
  deferred with a documented reason rather than smuggled into a layout change.
- **No client-side framework, animation library, or icon package** (`AGENTS.md`, settled decision).
- **No new external origin** — no Google Fonts, no CDN, no third-party embed. `astro.config.mjs`
  `security.csp` should end this plan byte-identical.
- **No change to `src/worker/index.ts`, Turnstile, rate limiting, or email delivery.** The contact form's
  markup and behaviour are reused as-is; only its surrounding page composition may move.
- **No change to `wrangler.jsonc` routes, `public/_headers`, or the deploy workflow.**
- **No CMS, database, or auth.**
- **No `@ts-ignore`, no disabled lint rule, no baseline update, no `--legacy-peer-deps`** — zero
  suppressions (`AGENTS.md` hard rule 5).
- **No `git commit`/`push`** without explicit owner authorisation; this plan ends with a proposed message.

---

## 3. Files Affected

### 3.1 Create

| Path | Role |
| --- | --- |
| `src/lib/content.ts` | Single source for ordered service/case-study collections per locale, and entry → URL mapping |
| `src/lib/paths.ts` | `servicePath()`, `caseStudyPath()`, `aboutPath()` → logical paths passed to `localizedPath()` |
| `src/components/pages/WorkDetail.astro` | Case-study page body (title, summary, prose, cross-links, CTA) |
| `src/components/pages/ServiceDetail.astro` | Service page body + pillar-derived "selected work" list |
| `src/components/pages/AboutPage.astro` | About page body, moved out of `HomeSections.astro` |
| `src/components/CtaBand.astro` | Full-bleed accent band with primary + secondary action |
| `src/components/Card.astro` | Shared card surface (tag, title, one-line, metric, link) |
| `src/components/Breadcrumbs.astro` | `<nav aria-label>` + ordered list, one level on detail pages |
| `src/components/HeroProofPanel.astro` | Hero side panel carrying the three metrics |
| `src/pages/work/[slug].astro` | Default-locale case-study route |
| `src/pages/[lang]/work/[slug].astro` | `ca`/`es` case-study route |
| `src/pages/services/[slug].astro` | Default-locale service route |
| `src/pages/[lang]/services/[slug].astro` | `ca`/`es` service route |
| `src/pages/about.astro` | Default-locale about route |
| `src/pages/[lang]/about.astro` | `ca`/`es` about route |
| `tests/page-weight.spec.ts` | Height/word budget for the home page and de-duplication regression |

### 3.2 Modify

| Path | Change |
| --- | --- |
| `src/components/CaseStudy.astro` | Drop the prose slot (Phase 1); add `href`/`ctaLabel` and card composition (Phase 2/4) |
| `src/components/ServiceCard.astro` | Drop the prose slot; become a `Card` with a link (Phase 3/4) |
| `src/components/HomeSections.astro` | Phase 1: stop rendering case-study bodies. Phase 3: restructure into hub sections |
| `src/components/Hero.astro` | Asymmetric layout + proof panel (Phase 4) |
| `src/components/SiteHeader.astro` | Fragment links → locale paths; `data-section-link` derived from a `section` field; `aria-current="page"` on route match |
| `src/components/SiteFooter.astro` | Consume the new nav shape; add Work/Services/About links |
| `src/lib/navigation.ts` | `NavItem` gains `section?`; hrefs become absolute locale paths |
| `src/lib/schema.ts` | Add `buildWorkJsonLd`, `buildServiceJsonLd`, `buildAboutJsonLd`, `buildBreadcrumbs` |
| `src/layouts/BaseLayout.astro` | Optional `jsonLd` prop; optional second font preload; no change to canonical/hreflang logic |
| `src/styles/global.css` | `--font-display`, band/inverse tokens, motion block, stale comment correction |
| `src/i18n/en.ts` | New keys (breadcrumbs, back links, card CTAs, CTA band) |
| `src/i18n/ca.ts` | Same keys, real Catalan copy |
| `src/i18n/es.ts` | Same keys, real Spanish copy |
| `tests/routes.ts` | `ROUTES` grows to every prerendered route; `grids` flag generalised |
| `tests/structure.spec.ts` | Heading assertions per new template; de-duplication assertion |
| `tests/network.spec.ts` | Font count 1 → 2 (Inter + display face) |
| `AGENTS.md` | Stale counts: "7 pages", "30 files", "Read 32 files" |
| `.github/instructions/astro-src.instructions.md` | "The whole site is 4 files" is already stale; correct it |

### 3.3 Delete

None. `src/styles/global.css` keeps every existing token; `src/content/**/*.md` keeps every word.

### 3.4 Explicitly untouched

`astro.config.mjs`, `wrangler.jsonc`, `public/**`, `src/worker/**`, `src/content.config.ts`,
`src/content/**/*.md`, `scripts/**`, `.github/workflows/**`.

---

## 4. Decisions and Constraints That Shape the Work

### 4.0 Correction to the predecessor plan's D-5

The predecessor plan records, at its §13:

> **D-5** — Dedupe case-study content by keeping the `<dl>` summary and removing the three prose
> sections. … *Decided 2026-10-19:* the owner chose **D-5b now, D-5 (delete the prose) later**.

and UX-007 stays open "until D-5 (A) is applied".

**This plan satisfies UX-007's criterion — "no case-study statement is present twice on the page" —
without deleting the prose**, because Phase 2 gives the prose its own route. Concretely:

- **Home card:** `title` + `summary` + the `dl` (challenge / architecture / impact) + a link. No body.
- **`/work/<slug>/`:** `title` + `summary` + the markdown body (whose `####` sections are the long form).
  No `dl`.

The two blocks never co-render, so nothing is duplicated on any page, and no authored copy is lost. This
supersedes D-5(A)'s premise that deletion is the only route to de-duplication. The predecessor plan's
recorded text is **not** rewritten — it is a record of what was decided on 2026-10-19 — and this section is
the dated correction. The owner authorised it by choosing "A de-duplication as the first step"; if the
intent was literal deletion, stop and confirm before Phase 2.

### 4.1 Route table (37 prerendered files, was 7)

| Logical path | Files | Template |
| --- | --- | --- |
| `/` | 3 | `HomeSections.astro` (hub) |
| `/work/<translationKey>/` | 12 | `pages/WorkDetail.astro` |
| `/services/<translationKey>/` | 12 | `pages/ServiceDetail.astro` |
| `/about/` | 3 | `pages/AboutPage.astro` |
| `/privacy/` | 3 | existing page, unchanged |
| `/contact/thanks/` | 3 | existing page, unchanged |
| 404 | 1 | existing single file, unchanged |

- Slugs are `data.translationKey`, which is locale-stable by construction (`regtech`,
  `entity-resolution`, `infrastructure`, `iot`, `eu-inspection-tooling`, `topten-ecosystem`,
  `topten-scout`, `banco-estado-iot`).
- No `/work/` or `/services/` index page: the home hub **is** the index, and a four-item index page would
  duplicate it. Nav therefore points at home fragments for those two entries.
- Service pages are kept deliberately non-thin by composing them from data that already exists: the
  service's own markdown body, plus "Selected work in this pillar" derived from
  `caseStudies.filter((entry) => entry.data.pillar === service.data.pillar)`. No new copy is required to
  make the page worth visiting.

### 4.2 Navigation model

`NavItem` becomes `{ href: string; label: string; section?: string }`:

- `href` — absolute locale path: `localizedPath(lang, '/') + '#services'`, same for `#work`, `/about/`,
  `#contact`.
- `section` — the fragment id (`services`, `work`, `contact`), used only for scroll-spy and only where the
  target exists.

`SiteHeader.astro`'s existing scroll-spy already degrades correctly when `targets.length === 0`, so on
detail pages it becomes a no-op. It must additionally set `aria-current="page"` on the nav item whose
logical path equals the current page (`/about/`, `/services/*`, `/work/*`).

### 4.3 Accessibility invariants that must survive

Enforced by `tests/structure.spec.ts` today, per route: exactly one `h1`; no heading level skipped; exactly
one `header`, `footer`, `main#main-content`; at least one `nav`; the skip link is the first tab stop and
actually moves focus.

New consequences:

- Detail pages: `h1` is the entry title, body `####` sections may therefore be **promoted to `h2`** on the
  detail page only — either promote them in the markdown (a content edit, currently out of scope) or map
  them in `WorkDetail.astro`'s prose styles. **Decision: leave the markdown alone and accept `h1 → h4` is a
  skip.** That fails the existing assertion, so the chosen resolution is: `WorkDetail.astro` renders `h1`
  (title), then a visually-hidden `h2` is **not** acceptable either. The task is therefore: convert the
  three `####` headings to `##` in the 12 case-study markdown files. This is a heading-level edit only,
  requires no wording change, and is the smallest change that keeps the invariant true. It is the one
  exception to §2.2's "no content edit".
- A whole-card link must be one focusable anchor: title link with `after:absolute after:inset-0` inside a
  `relative` card, **not** a nested-link structure.
- The CTA band's accent background must carry `--color-fg-inverse` and be contrast-measured in Phase 4.

### 4.4 Build and CSP invariants

- Astro hashes inline `<style>`/`<script>` it emits; the display font is imported like the existing Inter
  file and resolved by Vite into `_astro/*`, so `font-src`/`style-src` gain no origin. `script-src` already
  lists `'self'`.
- Any new inline `<script>` in a component is hashed automatically; prefer no new scripts at all.
- `npm run dev` emits no CSP meta tag, so every CSP question in this plan is answered from the **built**
  output: `grep -o 'content-security-policy[^>]*' dist/index.html`.
- The bundle is static; new pages are prerendered. Nothing may introduce `export const prerender = false`.

### 4.5 Repository guards that can fail a phase

- `scripts/check-placeholders.mjs` fails on any `TODO(copy)` or `REPLACE_ME` under `src/`, including inside
  comments. Do not write those sentinels while scaffolding.
- `en.ts` defines `Dictionary`; `ca`/`es` must match its shape exactly in both directions. Never add a
  `const` assertion to `en`.
- `@astrojs/check@0.9.10` caps TypeScript at `^6.0.0`; do not chase a TS 7 bump.
- Prettier owns formatting: `npm run format`, never hand-format.

---

## 5. Step-by-Step Execution Plan

### Phase 1: De-duplicate the case-study cards (A)

**Goal:** stop rendering the same three statements twice on the home page, with no route change. This is
the cheap win and it is independently shippable.

#### Tasks

- [x] Task 1.0: Re-baseline locally on the build under test. `npm run build`, then
      `node tests/support/serve.mjs` (port 4321), then evaluate in a 1280×900 viewport and at 390×844:
      document height, `body.innerText` word count, and per-section height. Record all four numbers
      verbatim in this plan's Phase 1 evidence block.
- [x] Task 1.1: In `src/components/CaseStudy.astro`, remove the `<slot />` prose block (the
      `prose prose-sm` div) and the now-unused `prose-invert` classes. Keep `article`, the `h3` title, the
      `summary` paragraph and the three-column `<dl>`. The component no longer takes a slot.
- [x] Task 1.2: In `src/components/HomeSections.astro`, stop calling `render(entry)` for case studies and
      stop passing `Content` to `CaseStudy`. `serviceCards` keeps its `render()` call until Phase 3.
- [x] Task 1.3: In `tests/structure.spec.ts`, add a de-duplication assertion for the home routes: for each
      case study, the `summary` string appears **exactly once** in `document.body.innerText`, and every
      `####`-derived sentence from a body is absent from the home page.
- [x] Task 1.4: Create `tests/page-weight.spec.ts` with two budgets measured at an explicit
      `viewport: { width: 1280, height: 900 }`: home `scrollHeight` ≤ 7,500 px and home word count
      ≤ 2,300. Set them from Task 1.0's measured **after** value plus headroom; if the after value is far
      below, tighten the budget to `after + 10%`.

#### Acceptance Criteria

- [x] `#work` measured height drops by at least 60% versus Task 1.0's baseline, recorded with command and
      output.
- [x] No case-study statement appears twice on `/`, `/ca/`, `/es/` (Task 1.3 passes).
- [x] Heading outline on the home page contains exactly four `h3` under the `#work` `h2`, with no sibling
      prose headings.
- [x] `npm run check` → 0 errors, warnings and hints; record the actual file count (it changes later).
- [x] `npm run build` → exit 0.
- [x] `npx playwright test` → exit 0 on both projects.

#### Recorded evidence (executed 2026-10-20)

Measurement method: `npm run build`, then `node tests/support/serve.mjs`
("e2e static server listening on http://127.0.0.1:4321"), then in a Chromium page
`document.documentElement.scrollHeight` and `document.body.innerText.trim().split(/\s+/).length`
per viewport, and per-`main section` the same over each section's `boundingBox`/`innerText`.

**Task 1.0 baseline — before the change**

```text
npm run build → "[build] 10 page(s) built in 987ms"

/        1280×900: height 11,517 px, 2,959 words
                   #services 1,835 / 650   #work 5,836 / 1,652
                   #about    1,450 / 391   #contact 1,304 / 127
                   #work headings: 4 × h3 + 12 × h4
/        390×844:  height 20,471 px, 2,948 words
```

The `/ca/` and `/es/` baselines were captured from the **deployed** build (`https://vgr.cat`, commit
`5cce688`) rather than from `dist/`, because by the time they were needed the working tree already carried
the edit — see recorded deviation 2.

```text
/ca/     1280×900: height 12,424 px, 3,649 words, #work 6,304 px
/es/     1280×900: height 12,839 px, 3,714 words, #work 6,525 px
```

**After the change — same method, same build pipeline**

```text
/        1280×900: height  7,358 px, 1,728 words
                   #services 1,835 / 650   #work 1,677 / 421
                   #about    1,450 / 391   #contact 1,304 / 127
                   card heights 344 / 344 / 344 / 421 px
                   #work headings: 4 (one per card, 0 × h4)
/        390×844:  height 13,840 px, 1,717 words, #work 3,356 px
/ca/     1280×900: height  8,001 px, 2,170 words, #work 1,881 px
/es/     1280×900: height  8,272 px, 2,201 words, #work 1,958 px
```

`#work` reduction: **`/` −71.3%**, **`/ca/` −70.2%**, **`/es/` −70.0%** (criterion was ≥ 60%).

Built-HTML cross-check, independent of the browser:

```text
$ grep -c "Market surveillance is essential to ensure" dist/index.html
0
$ grep -o "Purpose-built algorithmic software" dist/index.html | wc -l
1
```

**Verification commands and results**

```text
$ npm run format:check
All matched files use Prettier code style!

$ npm run lint
(exit 0, no findings)

$ npm run check
Result (46 files):
- 0 errors
- 0 warnings
- 0 hints

$ npm run build
[build] 10 page(s) built in 771ms

$ npx playwright test
122 passed (4.6s)

$ npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
✨ Read 39 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 8.71 KiB / gzip: 3.26 KiB
--dry-run: exiting now.
```

#### Recorded deviations

1. **Budgets are per locale, not one pair.** Task 1.4 assumed a single height/word budget. Measured, the
   translations run ~27% longer (`/` 7,358 px / 1,728 words, `/ca/` 8,001 / 2,170, `/es/` 8,272 / 2,201),
   so one budget would have been either useless for `en` or immediately tripped by `es`. `BUDGETS` is a
   `Record<string, { height; words }>` keyed by route, each value = measurement + ~10%, with the derivation
   and the before/after numbers written into the test's own doc comment.
2. **Two of the three baselines come from production.** The task asked for a local before/after pair for
   every locale. `/` was measured locally before the edit (11,517 px / 2,959 words) and matched the deployed
   commit exactly, so the deployed site was used for `/ca/` and `/es/` afterwards instead of reverting the
   working tree to re-measure. The `/` agreement is the reason to trust the other two; that reasoning is
   recorded here rather than left implicit.
3. **Task 1.3 asserts one body line per study, not every sentence.** Each case study's first body line of
   ≥ 80 characters is extracted from the `.md` on disk and asserted absent, plus every `summary` asserted
   present exactly once. Reading the needles from the source means editing a case study cannot silently
   invalidate the guard.
4. **Pre-existing documentation drift, not caused by this phase.** `AGENTS.md` says "7 pages", "30 files"
   (`astro check`) and "Read 32 files" (dry-run); the actual values before any Phase 1 edit were 10 pages,
   46 files and 39 files. Phase 1 added no `.astro` file, so the counts are unchanged by it. Phase 5 owns
   the doc sync; they are recorded here so the discrepancy is not mistaken for a regression later.
5. **`/ca/` and `/es/` are not yet covered by `tests/page-weight.spec.ts` at 390 px.** Phase 3 Task 3.4 owns
   the mobile budgets; Phase 1's task specified desktop only, and the mobile numbers above are evidence,
   not an assertion.

---

### Phase 2: Index/detail routes and per-page metadata (B, part 1)

**Goal:** every service and case study has its own prerendered, locale-aware, canonically-linked page, and
the markup that renders them is shared by one component per template.

#### Tasks

- [x] Task 2.1: Create `src/lib/paths.ts` with `servicePath(translationKey)`, `caseStudyPath(translationKey)`,
      `aboutPath()` returning **logical** paths (`/services/regtech/`), so callers always pass them through
      `localizedPath(locale, path)`.
- [x] Task 2.2: Create `src/lib/content.ts` exporting `getServices(locale)` and `getCaseStudies(locale)` with
      the `pillarOrder` and `caseStudyOrder` arrays **moved verbatim** from `HomeSections.astro`, plus
      `getService(locale, slug)` and `getCaseStudy(locale, slug)`. Preserve the UX-031 comment that warning
      future editors against reordering by filename.
- [x] Task 2.3: Convert the three `####` headings to `##` in the twelve case-study markdown files
      (`#### The Challenge` → `## The Challenge`, etc., in `en`/`ca`/`es`). Heading level only; no wording
      change. This is required by §4.3 and is the single sanctioned content edit.
- [x] Task 2.4: Create `src/components/pages/WorkDetail.astro`. Renders: breadcrumb slot, `h1` = entry
      `title`, one-line `summary`, `<Content />` inside `prose`, a "next case study" link, and the CTA band
      slot. No `<dl>` — the body is the narrative.
- [x] Task 2.5: Create `src/components/pages/ServiceDetail.astro`. Renders: `h1` = service `title`,
      `summary`, `<Content />` inside `prose`, then "Selected work in this pillar" — the case studies whose
      `pillar` matches, as `Card`s, or a single neutral line when the list is empty (never an empty
      heading).
- [x] Task 2.6: Create `src/components/pages/AboutPage.astro` and move the `#about` block from
      `HomeSections.astro` into it unchanged (paragraphs, experience `<dl>`, competencies `<ul>`,
      credentials), keeping `h2 → h3` order with exactly one `h1` for the page title.
- [x] Task 2.7: Create the six route files (`work/[slug]`, `[lang]/work/[slug]`, `services/[slug]`,
      `[lang]/services/[slug]`, `about`, `[lang]/about`). Each route file is `getStaticPaths` + a single
      component call wrapped in `BaseLayout` + `PageShell`; no logic beyond `Astro.params` narrowing.
      `getStaticPaths` for `[lang]` variants iterates `locales.filter((l) => l !== defaultLocale)` exactly as
      `pages/[lang]/index.astro` does.
- [x] Task 2.8: Extend `src/lib/schema.ts` with `buildWorkJsonLd` (`CreativeWork` + `BreadcrumbList`),
      `buildServiceJsonLd` (`Service` with `areaServed: ['ES','EU']`, `provider` pointing at the home
      `Person` `@id`), and `buildAboutJsonLd` (`ProfilePage` + `Person`). Keep `buildJsonLd` unchanged for
      the home page and keep the `<` → `\u003c` escaping in `BaseLayout`.
- [x] Task 2.9: In `src/layouts/BaseLayout.astro`, add an optional `jsonLd?: object` prop defaulting to the
      existing home builder. Do not touch canonical/hreflang derivation.
- [x] Task 2.10: Rewrite `src/lib/navigation.ts` per §4.2. Update `SiteHeader.astro`
      (`data-section-link={item.section}`, skip when `undefined`) and `aria-current="page"` matching by
      logical path. Update `SiteFooter.astro` for the new `NavItem` shape.
- [x] Task 2.11: In `src/components/CaseStudy.astro` and `ServiceCard.astro`, add `href` and `ctaLabel`
      props and render the whole-card link per §4.3. Cards on the home page link to their detail page.
- [ ] Task 2.12: Add the new dictionary keys to `en.ts` (`breadcrumbs.home`, `caseStudy.backToWork`,
      `caseStudy.readCase`, `caseStudy.nextCase`, `services.readService`, `services.relatedWork`,
      `services.noRelatedWork`, `about.pageTitle`, `nav.about`), then mirror them in `ca.ts` and `es.ts`.
      **Catalan and Spanish must be real copy supplied or approved by the owner** — see §7, risk 1.
      **Status (2026-10-20): implemented, awaiting approval.** Every key exists in all three locales and
      the build is green; the `ca`/`es` values are agent-authored drafts pending owner review. See
      deviation 2 for the list to check. `about.pageTitle` and `nav.about` were not added — see
      deviation 3.
- [x] Task 2.13: Update `tests/routes.ts` to the full route table. Keep `grids` but rename its meaning to
      "has prose-bearing grids" and add the detail routes that contain grids (`/services/*` related-work
      grid). Update the file's doc comment, which currently says "three home pages".
- [x] Task 2.14: Extend `tests/structure.spec.ts` to also assert, on every `/work/*` and `/services/*` route,
      that a breadcrumb `nav` exists and that the page's `h1` equals the collection `title` for that slug.

#### Acceptance Criteria

- [x] `npm run build` emits **37** HTML entry points. Verify with
      `find dist -name '*.html' | wc -l` and record the number.
- [x] Canonical and hreflang on `/ca/work/topten-ecosystem/` point at `/ca/...` and list `en`, `ca`, `es`
      plus `x-default`. Verify by grepping the built file; record the three `<link>` lines.
- [x] `dist/sitemap-0.xml` contains the 36 indexable URLs and still excludes `/contact/thanks`. Record the
      URL count.
- [x] `npx playwright test tests/structure.spec.ts` passes for every route on both projects.
- [x] `npx playwright test tests/a11y.spec.ts` passes for every route on both projects, **or** a recorded
      decision to sample is taken and written into `tests/routes.ts` with the runtime evidence that
      motivated it.
- [x] `npm run check` → 0 errors/warnings/hints; record the new file count.

#### Recorded evidence (executed 2026-10-20)

```text
$ npm run build
[build] 37 page(s) built in 800ms

$ find dist -name '*.html' | wc -l
37

$ grep -o '<link rel="\(canonical\|alternate\)"[^>]*>' dist/ca/work/topten-ecosystem/index.html
<link rel="canonical" href="https://vgr.cat/ca/work/topten-ecosystem/">
<link rel="alternate" hreflang="en" href="https://vgr.cat/work/topten-ecosystem/">
<link rel="alternate" hreflang="ca" href="https://vgr.cat/ca/work/topten-ecosystem/">
<link rel="alternate" hreflang="es" href="https://vgr.cat/es/work/topten-ecosystem/">
<link rel="alternate" hreflang="x-default" href="https://vgr.cat/work/topten-ecosystem/">

$ grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | wc -l
33
$ grep -c "contact/thanks" dist/sitemap-0.xml
0

$ grep -o '"@type":"[A-Za-z]*"' dist/services/regtech/index.html | sort | uniq -c
      1 "@type":"BreadcrumbList"
      3 "@type":"ListItem"
      1 "@type":"Service"
$ grep -o '"@type":"[A-Za-z]*"' dist/work/topten-ecosystem/index.html | sort | uniq -c
      1 "@type":"BreadcrumbList"
      1 "@type":"CreativeWork"
      3 "@type":"ListItem"

$ npx playwright test tests/structure.spec.ts
202 passed (4.0s)
$ npx playwright test tests/a11y.spec.ts
74 passed (6.5s)
$ npx playwright test
386 passed (10.5s)

$ npm run check
Result (58 files):
- 0 errors
- 0 warnings
- 0 hints

$ npm run format:check
All matched files use Prettier code style!

$ npm run lint
(exit 0, no findings)

$ node scripts/check-placeholders.mjs
check:placeholders — 0 placeholders remain.

$ npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
✨ Read 99 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 8.71 KiB / gzip: 3.26 KiB
--dry-run: exiting now.
```

Markdown edit is level-only, proven by diffing the content directory:

```text
$ git diff -U0 src/content | grep -E '^[-+][^-+]'   # 36 pairs, all "#### X" → "## X"
$ git diff --stat src/content | tail -1
 12 files changed, 36 insertions(+), 36 deletions(-)
```

Rendered check (built site served by `tests/support/serve.mjs`): `/work/topten-ecosystem/` shows
Home / Case Studies / title, the pillar tag, `h1`, summary, and `##`-level prose; `/services/regtech/`
adds "Selected work in this pillar" with one linked card; the language picker on `/services/regtech/`
offers `/ca/services/regtech/` and `/es/services/regtech/`, i.e. `stripLocale` handles nested routes
unchanged.

Final re-run from the formatted tree (appended, not substituted — the block above is the record of the
run that produced it): `npm run build` → "37 page(s) built in 878ms", `npx playwright test` →
"386 passed (10.9s)", `npx wrangler deploy --dry-run` → "Read 99 files", 8.71 KiB.

#### Recorded deviations and corrections to this phase

1. **Sitemap count corrected: 33, not 36.** The criterion's arithmetic was wrong: 37 HTML files − 1
   `404.html` − 3 `contact/thanks/` = 33. The filter still excludes the confirmation pages (0 matches),
   which is what the criterion was protecting.
2. **Task 2.12 is implemented but not ticked.** The Catalan and Spanish strings were authored by the
   agent, in the vocabulary the dictionaries already use (`Casos pràctics` / `Casos prácticos`,
   `Inici` / `Inicio`), because `Dictionary` parity and the `TODO(copy)` guard make an untranslated key
   impossible to ship. The plan requires owner approval for exactly this copy, so the task stays open:
   **review `breadcrumbs.*`, `services.readService` / `relatedWork` / `noRelatedWork` and
   `caseStudies.readCase` / `backToWork` / `nextCase` in `ca.ts` and `es.ts` before merging.**
3. **`about.pageTitle` was not added.** The About page's `h1` reuses the existing `about.title`, which is
   already a complete headline; a second key would have produced two headings saying the same thing in
   three locales. Likewise `nav.about` already existed, so it was not duplicated.
4. **Related work reuses `CaseStudy.astro`, not a new `Card.astro`.** `Card` is Phase 4's shared
   primitive; creating it now would mean building the same abstraction twice. The service page renders
   the existing card component, which already has the link and CTA added in Task 2.11.
5. **The stretched-link overlay makes card text unselectable.** §4.3 asks for one focus stop per card,
   which the `after:absolute after:inset-0` pattern delivers. The cost is that prose inside a card cannot
   be selected with the mouse. This is permanent for case-study cards (they hold no prose since Phase 1)
   and **temporary for service cards**, whose markdown body Phase 3 removes.
6. **`tests/routes.ts` derives detail slugs from the content directory** instead of hardcoding the 24
   detail paths. Stronger than the task asked: a new case study automatically joins the suite rather than
   silently going untested. `HOME_ROUTES` had to stop filtering on `grids` (the About and service detail
   pages are grid routes but are not home pages), so it now matches the three home paths explicitly.
7. **No axe sampling was needed.** 386 tests in 10.5 s (from 122 in 4.6 s) is well under the ~6 minute
   threshold §7 risk 4 set, so `a11y.spec.ts` keeps running on every route in both projects.
8. **`ServiceDetail` renders the booking CTA and no "back to services" link.** The breadcrumb supplies the
   way back; adding a fifth string per locale for a link the trail already provides was not worth it.

---

### Phase 3: Home hub and CTA band (B, part 2)

**Goal:** the home page becomes an index a visitor can scan in three seconds, and the target budgets from
§1.1 are met.

#### Tasks

- [x] Task 3.1: Restructure `src/components/HomeSections.astro` into the hub: Hero (with proof panel,
      Phase 4), Services (four cards, no bodies), Work (four teaser cards: `summary` + the `outcome` line
      only), About teaser (two sentences + link to `/about/`), CTA band, Contact.
- [x] Task 3.2: In `src/components/ServiceCard.astro`, stop rendering the markdown body; the card carries
      tag, title, `summary` and a link. Remove the now-unused `render()` calls from `HomeSections.astro`
      entirely, so no `astro:content` `render` runs for the hub.
- [x] Task 3.3: Create `src/components/CtaBand.astro`: full-bleed accent surface, one `h2`, one sentence, a
      primary button to `bookingUrl` and a secondary link to the work section. Text from new dictionary
      keys; contrast approved in Phase 4.
- [x] Task 3.4: Tighten `tests/page-weight.spec.ts` budgets to the Phase 3 measurements: home `scrollHeight`
      ≤ 5,500 px at 1280×900 and ≤ 12,000 px at 390×844; home word count ≤ 1,700.
- [x] Task 3.5: Ensure the contact form's anchor and Turnstile lazy-load still resolve from the new
      section order (`tests/network.spec.ts` second test scrolls `#contact`); adjust only if the id moved.

#### Acceptance Criteria

- [x] Home document height at 1280×900 ≤ 5,500 px (from 11,517), recorded with command and output.
- [x] Home document height at 390×844 ≤ 12,000 px (from 20,471), recorded.
- [x] Home word count ≤ 1,700 (from 2,959), recorded.
- [x] Every home card is ≤ 340 px tall at 1280×900, asserted in `tests/page-weight.spec.ts`.
- [x] No home page contains a case-study body paragraph or a service body paragraph (Task 1.3 assertion
      still passes).
- [x] `npx playwright test` → exit 0; `tests/network.spec.ts` still observes zero third-party requests on
      first paint.

#### Recorded evidence (executed 2026-10-20)

Measured on the **built** output (`npm run build` → `node tests/support/serve.mjs`, 1280×900 unless
stated), after the restructure:

```text
/     4,792 px / 744 words   tallest card 331 px
/ca/  5,057 px / 928 words   tallest card 331 px
/es/  5,137 px / 929 words   tallest card 331 px
390×844: /es/ 8,155 px   (before Phase 1 the same page was 20,471 px at 390×844)
```

Section heights on `/`: hero 688, `#services` 784, `#work` 1,044, About teaser 293, CTA band 377,
`#contact` 1,304. The whole home page is now shorter than the contact section plus the old `#work`.

Verification commands:

```text
$ npm run build
[build] 37 page(s) built in 817ms

$ npx playwright test
392 passed (10.5s)

$ npm run check
Result (59 files):
- 0 errors
- 0 warnings
- 0 hints

$ npm run format:check
All matched files use Prettier code style!

$ npm run lint
(exit 0, no findings)

$ node scripts/check-placeholders.mjs
check:placeholders — 0 placeholders remain.

$ npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
✨ Read 99 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 8.71 KiB / gzip: 3.26 KiB
```

`tests/network.spec.ts` still passes both assertions unchanged: no `challenges.cloudflare.com` request on
first paint, one font file, and the challenge loads once when `#contact` approaches the viewport — the
`#contact` id did not move, so Task 3.5 needed no code.

The Task 1.3 de-duplication assertions still pass, now for a stronger reason: `HomeSections.astro` no
longer imports `render` from `astro:content` at all, so no collection body can reach the hub without
someone deliberately re-adding the import.

#### Recorded deviations and traps

1. **A running `astro dev` silently replaces the build under the suite.** `playwright.config.ts` sets
   `reuseExistingServer: !process.env.CI`, so with `astro dev` on :4321 the suite ran against the dev
   server instead of `dist/`. Astro's dev toolbar injects its own UI and the page then contains **7**
   `<header>` elements, so `structure.spec.ts` failed with "locator resolved to 7 elements" on a growing
   set of routes — including `/es/privacy/`, which this phase never touched. Against `dist/` the same
   suite is green (392 passed). The dev server was stopped to run the gate and restarted afterwards
   (`npm run dev`, pid recorded by Astro). **Anyone running the suite locally must stop `astro dev`
   first**, or `reuseExistingServer` will quietly test the wrong thing.
2. **Teaser cards needed clamping to meet the 340 px budget.** Before clamping, the case-study teasers
   measured 383 px (`en`) and 434 px (`ca`/`es`) because the translations reflow to more lines. `line-clamp-2`
   on the teaser's title, summary and outcome brings every card in every locale to **331 px**, which is
   also what the "same size cards" goal wanted.
3. **`about.teaser` and `about.readMore` are new keys, not slices of existing copy.** Slicing
   `about.paragraphs[0]` by sentence would have been locale-fragile; the two keys are authored per locale
   and belong to the same owner review as Task 2.12.
4. **`Button` gained an `inverse` variant.** The band needs a page-coloured fill with accent text; adding
   the variant to the existing primitive keeps one button implementation (UX-022) instead of a fourth
   copy of the markup. Phase 4 extends the palette behind that variant, not the call sites.
5. **CTA band contrast reuses a pairing that already passes.** `bg-accent` + `text-bg` is exactly what
   `Button`'s primary variant has been using on every page, and axe passes on all 37 routes; computed
   ratio is 5.13:1 in light and 7.9:1 in dark. The explicit recorded measurement table is still Phase 4's
   Task 4.3.
6. **Budgets collapsed back to one shared set.** Phase 1 used per-locale budgets because translations were
   ~27% longer than English. After the hub restructure every locale fits the same target (`/es/` is the
   longest at 5,137 of 5,500 px and 929 of 1,700 words), so `tests/page-weight.spec.ts` now asserts
   `5,500 px` / `1,700 words` / `340 px` per card plus a new `12,000 px` mobile test on all three homes.
7. **The Hero proof panel is not in this phase.** Task 3.1 names it as "Phase 4" in its own text, and
   Task 4.5/4.6 own it, so the Hero is structurally unchanged here.

---

### Phase 4: Visual identity (D)

**Goal:** the site stops reading as documentation. Type, colour, card and rhythm carry the hierarchy; motion
is garnish and additive only.

#### Tasks

- [ ] Task 4.1: Add a self-hosted variable display face via `@fontsource-variable/*` imported in
      `src/styles/global.css` (candidate list for owner sign-off: **Sora**, **Space Grotesk**,
      **Instrument Sans**, **Bricolage Grotesque**), expose `--font-display` in `@theme static`, and apply it
      to `h1`/`h2`/metric values only. Inter keeps body copy. No external origin.
- [ ] Task 4.2: Add the display face's latin preload to `BaseLayout.astro` next to the Inter preload
      (`crossorigin`, same pattern). Update `tests/network.spec.ts` to expect **two** `.woff2` requests and
      document why the count changed.
- [ ] Task 4.3: Extend the palette in `src/styles/global.css`: `--color-band` (a tinted section surface),
      `--color-accent-ink` (accent-on-band text), `--color-fg-inverse` (text on accent). Define light and
      dark values. **Record measured contrast for every new pair** with a WCAG calculation run in the
      terminal, for example:
      `node -e "const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const r=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return ((x+.05)/(y+.05)).toFixed(2)};console.log(r('#0b5fff','#ffffff'))"`
      Thresholds: ≥ 4.5:1 for body text, ≥ 3:1 for ≥ 24 px text and for control boundaries.
- [ ] Task 4.4: Create `src/components/Card.astro` and move both card components onto it: equal-height
      grid, pillar tag pill, title, one-line, optional metric, hover/focus elevation using
      `--duration-fast`/`--ease-standard`. Keep the single-anchor whole-card link from §4.3.
- [ ] Task 4.5: Rebuild `src/components/Hero.astro` as a two-column layout at `lg` (text + proof panel) and
      create `src/components/HeroProofPanel.astro` for the three metrics; stacked below `lg`, metrics
      remaining `dt`/`dd` semantics.
- [ ] Task 4.6: Section rhythm: alternate `bg-bg` and `bg-band` full-bleed sections, retune `--space-section`
      for the denser hub, and keep `Container`'s measured breakpoint policy intact (no prose cell under
      280 px).
- [ ] Task 4.7: Motion in `src/styles/global.css` only: a `@supports (animation-timeline: view())` block
      inside `@media (prefers-reduced-motion: no-preference)` for section reveals, plus card hover
      transitions. Correct the stale comment that reads "Nothing in the site animates today". Content must
      be visible when the `@supports` block does not apply.
- [ ] Task 4.8: Verify the built CSP is unchanged and that nothing is blocked:
      `grep -o 'content-security-policy[^>]*' dist/index.html` and compare to the pre-phase output; then load
      the built site and confirm the form, the beacon allowance and both fonts in console with no CSP
      violations.
- [ ] Task 4.9: Re-run the 320 px and 280 px suites (`tests/layout.spec.ts`) and add the new detail routes to
      its 320 px list via `ROUTES`.

#### Acceptance Criteria

- [ ] Display face is served from the same origin; `grep -c 'fontsource\|fonts.gstatic\|googleapis' dist/index.html`
      finds no external font origin in the HTML.
- [ ] Contrast table for every new token pair is recorded in this plan, each value ≥ its threshold.
- [ ] `tests/network.spec.ts` passes with the updated expectation (2 woff2, 0 third-party requests on first
      paint).
- [ ] No CSP violation in the browser console on `/`, `/ca/work/topten-ecosystem/`, `/services/regtech/`
      against the **built** output.
- [ ] `tests/layout.spec.ts` passes: no horizontal scroll at 320 px on any route; no prose cell under 280 px
      at 640 px on every route flagged in `tests/routes.ts`.
- [ ] With `prefers-reduced-motion: reduce` emulated, no element is opacity 0 and no animation runs.

---

### Phase 5: Documentation sync and full gate

**Goal:** the repository's own documentation stops describing a seven-page site, and the whole gate passes
from a clean tree.

#### Tasks

- [ ] Task 5.1: Update `AGENTS.md`: page count ("7 pages" → the measured number), `astro check` file count
      ("30 files"), dry-run file count ("Read 32 files"), and the `src/` inventory paragraph, which lists
      the pages that no longer exist in that shape.
- [ ] Task 5.2: Correct `.github/instructions/astro-src.instructions.md`, whose opening line ("The whole site
      is 4 files") has been false for several commits. State the current structure and keep the CSP section
      unchanged.
- [ ] Task 5.3: Decide and record the status of the predecessor plan: this plan applies its UX-007 (D-5),
      UX-019 and UX-027-adjacent work. Do **not** rewrite its recorded text; either archive it with an
      `## Archive Metadata` footer noting this plan as its successor, or leave it in `active/` with a dated
      note. Owner decides; record the choice here.
- [ ] Task 5.4: Run the full gate from a clean tree and paste the **exact** output of each command into this
      plan: `npm ci`, `npm run format:check`, `npm run lint`, `npm run check`, `npm run build`,
      `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`, `npx playwright test`.
- [ ] Task 5.5: Propose the commit message (`feat(ui): split the site into index and detail pages` plus a
      body explaining the de-duplication decision) and **stop**. Do not commit or push.

#### Acceptance Criteria

- [ ] All seven gate commands exit 0.
- [ ] No `TODO(copy)` or `REPLACE_ME` anywhere under `src/` (`node scripts/check-placeholders.mjs`).
- [ ] `npm audit` reports 0 vulnerabilities, as before the change.
- [ ] The plan's "Deviations" section records anything skipped or measured differently, with the reason.

---

## 6. Post-Implementation Verification & Regression Checks

- [ ] End-to-end: from `/`, reach a case study in two clicks, read it, reach the contact form, submit with
      test keys and reach `/contact/thanks/` — remembering that **the happy path cannot be verified with
      test keys** (Siteverify requires `action === 'contact'`, which Cloudflare's test secret omits). Record
      that limitation rather than claiming success.
- [ ] Locale round-trip: from `/services/regtech/`, switch to `ca` and land on `/ca/services/regtech/`, not
      on the `ca` home page (the current language picker keeps position via `stripLocale`; verify it still
      does for nested routes).
- [ ] Keyboard: skip link still the first tab stop on every template; card links produce exactly one focus
      stop each; the CTA band's buttons are reachable and visible on focus.
- [ ] 320 px, 640 px and 1280 px checked on one route per template in both themes, with the measured
      numbers recorded.
- [ ] `astro check`, `eslint`, `prettier --check`, the Playwright suite and the wrangler dry-run all pass
      cleanly (no suppressions added anywhere).
- [ ] `git status --porcelain` contains no file outside §3, and no `.dev.vars`, `.env`, `dist/` or
      `node_modules` entry.
- [ ] `git diff --stat` reviewed for accidental changes to `astro.config.mjs`, `wrangler.jsonc`,
      `public/**`, `src/worker/**` and `src/content.config.ts` — all must be empty.

---

## 7. Risks, Open Questions, and Reversibility

1. **`ca`/`es` copy for new UI strings (blocking Phase 2).** `Dictionary` parity forces every new key into
   all three locales, and the `TODO(copy)` guard forbids leaving a sentinel. The owner (or a translator)
   must supply the Catalan and Spanish strings. **This is the only task in the plan that cannot be
   completed by an agent alone.**
2. **Display typeface is a taste decision (blocking Phase 4.1).** Four candidates are listed; the fallback
   is to ship Phase 4 without a second face and keep Inter, which is a legitimate outcome rather than a
   failure. Record whichever is chosen.
3. **Service detail pages could read thin** at ~160 words each. Mitigated by the pillar cross-link block.
   If the owner finds them thin after Phase 2, the reversible move is to drop the four `/services/*` routes
   and keep cards — 13 fewer files, no other change. Record the decision either way.
4. **Test-suite growth.** 37 routes × 2 Playwright projects multiplies the axe and structural runs. Phase 2
   requires recording the wall time; if the suite exceeds roughly 6 minutes, sample `a11y.spec.ts` by
   template × locale instead of exhaustively, and write the reason into `tests/routes.ts`.
5. **Heading-level edit touches content.** Task 2.3 edits twelve markdown files. It is a level change only,
   but it is still authored content: diff it file by file and confirm no word changed.
6. **Height budgets can be brittle** if a font fails to load. The budgets in `tests/page-weight.spec.ts`
   carry deliberate headroom, and the test runs against the built site with the font preloaded.
7. **The predecessor plan's checkboxes are all unticked** even though most of its work has landed, so it
   cannot be trusted as a status source. Treat the running code as the truth, and resolve its status
   explicitly in Task 5.3.

---

## 8. Deferred / Explicitly Not Verified

- **Deployment.** This plan does not deploy. `npx wrangler deploy` is prohibited here; the dry-run is the
  ceiling.
- **Real email delivery.** Not verified, and not verifiable with test keys (see §6).
- **Real-device testing.** 320 px and 390 px are emulated viewports, not hardware. Stated as a limitation,
  not a pass.
- **Raster imagery, OG image regeneration, and analytics confirmation.** Out of scope; the OG card is
  unchanged and the Web Analytics path is untouched.
- **Search-console-level SEO effect** of the split cannot be measured in this repository.

---

## 9. Proposed Commit Shape

Four commits, one per phase, each independently green:

1. `perf(ui): stop rendering case-study bodies alongside their summary`
2. `feat(routing): give every service and case study its own page`
3. `feat(ui): rebuild the home page as a scannable hub with a CTA band`
4. `feat(ui): add display typography, banded sections and card motion`

The owner authorises each commit; the agent proposes messages and stops.
