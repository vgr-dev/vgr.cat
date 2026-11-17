# Plan: Content repositioning

Spec: `spec.md` · Copy source: `copy-en.md` (English is authoritative; `ca`/`es` are translations of it)

**Sign-off:** <!-- Human fills this in: "Approved by <name> on YYYY-MM-DD". Builders must not start while blank. -->

## Status

<!-- [ ] todo | [~] in progress | [x] done | [-] deferred | [!] blocked; then `uncommitted`, a
short commit hash, or the reason. The only part of this file that changes after sign-off. -->

- [ ] 1. Retire the Topten Scout case study
- [ ] 2. Replace the service pillars and rewrite the four services
- [ ] 3. Align the contact form's focus options with the new services
- [ ] 4. Rewrite the case studies and add "This website"
- [ ] 5. Rewrite hero, meta, about, CTA band and footer
- [ ] 6. Add the "How I work" home section
- [ ] 7. Add the "Ways to work together" home section with prices
- [ ] 8. Sync docs and close out

## Ground rules for every step

- **Read first:** `AGENTS.md`, `.github/instructions/astro-src.instructions.md` (every step touches
  `src/`), `.github/instructions/plans.instructions.md` (for `progress.md`), plus any file named in the step.
- **Three locales per step.** `ca` and `es` are typed `: Dictionary` and the routes are generated per
  locale, so a key or content file added in `en` alone breaks `astro check` or leaves a locale without a
  route. Every step writes `en`, `ca` and `es` together; the translations follow `copy-en.md` and are
  flagged in `progress.md` for my review (my Catalan is B1).
- **Standard gate** (from `AGENTS.md` Commands and `package.json`; CI runs the same plus e2e):

  ```bash
  npm run format:check && npm run lint && npm run check && npm run check:placeholders && npm run build
  ```

  Pass looks like: Prettier clean, ESLint 0 problems, `astro check` 0 errors / 0 warnings / 0 hints,
  placeholder guard clean, and `astro build` reporting 37 pages. The "62 files" count from `astro check`
  is expected to change once components are added (steps 6 and 7): record the new number rather than
  treating it as a failure.

- **E2E** (`npm run test:e2e`, which builds with the Turnstile test key first) is part of Verify wherever
  the step says so. CI runs it on every push.
- No step commits. The builder proposes a commit message at the end of each step (`/commit-msg`).
- **Branch:** all steps happen on `feat/content-repositioning` (created 2026-11-17 from `main` at
  `7c45ffc`). Nothing is pushed to `main` until step 8 is done, and only with my approval, via a PR.

## Decisions at planning time (2026-11-17)

- **Home-page length: option (b).** "How I work" steps are a title plus one line, and the About teaser
  band is removed from the home page. If a budget is still exceeded after that, stop and ask; (c), a
  separate `/pricing/` page, is the fallback, and only with my approval.
- **Branches from now on**, with standard names (`feat/…`, `fix/…`, `docs/…`, `chore/…`), never a
  `claude/` prefix. Recorded in `AGENTS.md` in step 8.
- **Public prices:** confirmed.
- **Redirects:** dropped. The site has not been promoted, so the retired URLs are allowed to 404.

## Steps

### 1. Retire the Topten Scout case study

- **Goal:** Topten Scout no longer exists on the site in any locale (D4); the case-study list reads
  coherently without it.
- **Files:** delete `src/content/caseStudies/topten-scout.{en,ca,es}.md`; `src/lib/content.ts` (remove
  from `caseStudyOrder`, fix the comment that enumerates the old order); `src/i18n/{en,ca,es}.ts`
  (`caseStudies.subtitle` no longer mentions market observability).
- **Verify:** standard gate. `astro build` now reports **34 pages** (three fewer `/work/` routes); that
  count is expected and temporary until step 4 adds a case study back. Also
  `grep -rni "scout" src/` returns nothing.
- **Out of scope:** pillar changes, other case-study copy, redirects (step 8).

### 2. Replace the service pillars and rewrite the four services

- **Goal:** the `pillar` enum is `build | modernize | platform | energy`, in that order. Each has a service
  page with the summary and body from `copy-en.md` (D3 wording for `energy`: no product search, retailer
  data, procurement, market monitoring or EPREL plus market-data integration). Existing case studies are
  re-tagged: `topten-ecosystem → platform`, `eu-inspection-tooling → energy`,
  `banco-estado-iot → energy`. Services section heading copy (eyebrow, title, subtitle) updated.
  `build` and `modernize` have no related case study yet; `services.noRelatedWork` covers that
  until step 4.
- **Files:** `src/content.config.ts` (enum); `src/lib/content.ts` (`pillarOrder`); delete
  `src/content/services/{regtech,entity-resolution,infrastructure,iot}.{en,ca,es}.md`; create
  `src/content/services/{build,modernize,platform,energy}.{en,ca,es}.md`; pillar field in the three
  remaining case studies (all locales); `src/i18n/{en,ca,es}.ts` (`services.pillars` keys and tags,
  `services.eyebrow/title/subtitle`, and the pillar-key comment).
- **Verify:** standard gate, 34 pages. `grep -rn "entity-resolution\|regtech\|'iot'\|infrastructure" src/`
  returns only hits that are deliberately kept (expect none outside the Worker and form, which step 3
  handles; record any). Then `npm run test:e2e`: all pass. If the
  `structure`/`a11y` specs fail, fix the content, not the tests.
- **Out of scope:** contact form options (step 3), case-study bodies (step 4), the cross-link
  from `modernize` to the Topten case study (added in step 4, once the rewritten case study exists).

### 3. Align the contact form's focus options with the new services

- **Goal:** the form offers `build`, `modernize`, `platform`, `energy`, `other` with the labels in
  `copy-en.md`. The Worker accepts exactly those keys and labels the notification email accordingly.
  The contact section copy (eyebrow, title, subtitle, organisation placeholder, message label, "Based in")
  is updated.
- **Files:** read `.github/instructions/worker.instructions.md` first. `src/i18n/{en,ca,es}.ts`
  (`contact.*`, `serviceTypes` keys), `src/worker/index.ts` (`SERVICE_TYPES` only), `tests/form.spec.ts`
  (`FILLED.serviceType: 'iot'` → a new key).
- **Verify:** standard gate, then `npm run test:e2e` (form spec passes). Also run
  `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`: exit 0, no warnings. State in
  `progress.md` that the happy path cannot be verified with test keys (per the worker instructions), and
  that only the rejection paths and the select values were exercised.
- **Out of scope:** any other Worker logic, Turnstile, rate limits, `wrangler.jsonc`.

### 4. Rewrite the case studies and add "This website"

- **Goal:** case studies in the order: `topten-ecosystem`, `vgr-cat` (new, pillar `build`),
  `eu-inspection-tooling`, `banco-estado-iot`, with titles, problem / approach / outcome fields and bodies
  per `copy-en.md`, D8 and D9. Unsourced metrics are removed: "weeks to hours", "zero maintenance
  downtime", "sub-second", "negligible", "days rather than months", "days to minutes", "hours to seconds"
  and "legally defensible". Named clients (D1). Labels become `Problem` / `What I built` / `Result`.
  `caseStudies.eyebrow/title/subtitle` updated. The `modernize` service body gains the Topten Yii2 →
  Laravel example sentence.
- **Files:** `src/content/caseStudies/{topten-ecosystem,eu-inspection-tooling,banco-estado-iot}.{en,ca,es}.md`
  (rewrite; the `translationKey`s and filenames stay, so URLs stay); create
  `src/content/caseStudies/vgr-cat.{en,ca,es}.md`; `src/lib/content.ts` (`caseStudyOrder`);
  `src/content/services/modernize.{en,ca,es}.md`; `src/i18n/{en,ca,es}.ts` (`caseStudies.*`).
- **Verify:** standard gate, **37 pages** again. Then `npm run test:e2e` including `page-weight.spec.ts`
  (each home card ≤ 340 px). Then
  `grep -rniE "sub-second|zero maintenance|legally defensible|days to minutes|hours to seconds|weeks to hours" src/content`
  returns nothing. For the `vgr-cat` case study, every number must be checked against the repo (pages,
  locales, lint rules) and the check recorded.
- **Out of scope:** a bill-analytics case study (D5: a line in the `energy` service only).

### 5. Rewrite hero, meta, about, CTA band and footer

- **Goal:** `site.*` (title, description, author `Victor Gonzalez`, jobTitle per D2), `hero.*` (badge,
  title, highlight, subtitle, CTAs, metric labels), `about.*` (eyebrow, title, the five paragraphs,
  experience entries with named orgs, competencies, teaser, credentials), `ctaBand.*` and `footer.*` follow
  `copy-en.md`. The hard-coded `© {year} VGR.` in the footer uses `t.site.author`, so the name appears
  once in the source.
- **Files:** `src/i18n/{en,ca,es}.ts`; `src/components/SiteFooter.astro` (the copyright line only;
  pass the author through `PageShell.astro` if needed).
- **Decision taken here:** `copy-en.md` groups competencies into Build / Run / Lead / Domain. The
  dictionary keeps a **flat** `competencies` array (ordered by those groups) because `schema.ts` feeds
  it to JSON-LD `knowsAbout`. Grouped rendering would change `AboutPage.astro` and the schema, which
  this content plan does not need.
- **Verify:** standard gate, 37 pages, then `npm run test:e2e` (page-weight included). Inspect
  `dist/index.html` for `<title>Victor Gonzalez | Senior Full-Stack Engineer &amp; Fractional Tech Lead`
  and the JSON-LD `"name":"Victor Gonzalez"`; record both greps.
- **Out of scope:** the hero secondary CTA target (step 6); visual changes.

### 6. Add the "How I work" home section

- **Goal:** between Services and Selected work, a section `id="how-i-work"` with the eyebrow, title,
  subtitle, five steps and the proof line linking to `https://github.com/vgr-dev/vgr.cat`. The hero's
  secondary CTA ("See how I work") points to `#how-i-work`. Per decision (b), the steps are short, and
  this English text replaces the longer step bodies in `copy-en.md`:
  1. **Spec** — `We agree in writing what "done" means. You approve it.`
  2. **Plan** — `Small steps, visible to you before any code exists.`
  3. **Build** — `AI agents draft code and tests; each step passes an automated quality gate.`
  4. **Review** — `I read every change before it ships. Every commit is signed.`
  5. **Hand over** — `Specs, decisions and logs stay in your repository.`

  Also per (b): the About teaser band is removed from `HomeSections.astro`. `about.teaser` and
  `about.readMore` are deleted from all three dictionaries if nothing else reads them (grep first, and
  record the result).

- **Files:** new `src/components/ProcessSection.astro` (Astro only, Tailwind tokens already in
  `global.css`, an ordered list `<ol>` for the steps, no inline `style=""`); `HomeSections.astro`;
  `src/i18n/{en,ca,es}.ts` (new `process` key: `eyebrow`, `title`, `subtitle`, `steps[]` with `title` and
  `body`, `proof`, `proofLinkLabel`; remove the teaser keys).
- **Verify:** standard gate (record the new `astro check` file count). Then `npm run test:e2e`. **The
  page-weight budget is the risk:** 5,500 px desktop and 1,700 words per home page; the longest locale
  is at 5,137 px today. If any home page exceeds it even with (b) applied, **stop and ask**. Do not
  raise the budget or edit the test. Record the measured height and word count per locale. Then build and check the CSP: open `npm run preview`, confirm the section renders
  and the browser console shows no CSP violation, and record it.
- **Out of scope:** a separate `/how-i-work/` or `/pricing/` page (only with my approval if (b) does
  not fit).

### 7. Add the "Ways to work together" home section with prices

- **Goal:** after Selected work and before the CTA band, a section `id="engage"` with three offers
  (Audit €2,500 fixed; Project €640/day with the €1,280 spec credited; Fractional tech lead €2,400/month
  for 4 days, 3-month minimum), the VAT / no-hidden-extras note and the location/languages footnote (D7).
  Prices are formatted per locale: `€2,500` in `en`, `2.500 €` in `ca`/`es`.
- **Files:** new `src/components/EngageSection.astro`; `HomeSections.astro`; `src/i18n/{en,ca,es}.ts`
  (new `engage` key; prices as display strings in the dictionary, not computed).
- **Verify:** as step 6 (standard gate, e2e with page-weight, CSP check in preview). Same stop rule if a
  budget is exceeded. Confirm the three cards meet the 280 px layout rule (`layout.spec.ts`).
- **Out of scope:** JSON-LD `Offer` markup with prices (a possible follow-up, not in the spec).

### 8. Sync docs and close out

- **Goal:** `AGENTS.md` matches reality: the `astro check` file count and dry-run asset count, the
  `Dictionary` gotcha's pillar example (`'entity-resolution'` → a current key), and the description of
  the home page if it lists sections. Hard rule 2 gains the branch convention: work happens on a
  branch with a standard prefix (`feat/`, `fix/`, `docs/`, `chore/`), never `claude/`, and reaches
  `main` through a PR. `progress.md` lists, per locale, every translation awaiting my
  review. Spec `status: done` only after I confirm the live site.
- **Files:** `AGENTS.md`, `specs/2026-11-17-content-repositioning/{spec,progress}.md`.
- **Verify:** the full AGENTS.md gate, including
  `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`, with the counts written into `AGENTS.md`
  exactly as printed.
- **Out of scope:** the CV and LinkedIn changes (outside this repo; the spec lists them for me).

## Risks / open questions

- **Page-weight budget (steps 6 and 7).** Resolved as option (b) (see Decisions). Residual risk: even
  trimmed, the two sections may not fit 5,500 px. The stop rule applies.
- **Translation quality.** `ca`/`es` are machine-assisted from `copy-en.md`; I must review them before
  deploy. Pricing and legal-adjacent lines (VAT, notice period) need the most care.
- **Deploy is automatic** on `main`. Handled by working on `feat/content-repositioning` until step 8.
  Pushing the branch itself is safe: CI runs, Deploy does not (it only follows CI on `main`).
