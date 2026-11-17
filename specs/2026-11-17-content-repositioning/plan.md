# Plan: Content repositioning

Spec: `spec.md` · Copy source: `copy-en.md` (English is authoritative; `ca`/`es` are translations of it).
Draft corrected after review on 2026-11-17. No implementation approval or completed step is implied.

**Sign-off:** Approved by Victor Gonzalez on 2026-11-17

## Status

<!-- [ ] todo | [~] in progress | [x] done | [-] deferred | [!] blocked; then `uncommitted`, a
short commit hash, or the reason. The only part of this file that changes after sign-off. -->

- [x] 1. Retire the Topten Scout case study — 3cc8197
- [x] 2. Replace the service pillars and rewrite the four services — 841b39c
- [x] 3. Align the contact form's focus options with the new services — 5e7164f
- [x] 4. Rewrite the case studies and add "This website" — 8caace1 (audit gate run at critical by owner decision; see progress.md)
- [x] 5. Rewrite hero, meta, about, CTA band and footer — a9bd379
- [x] 6. Add the "How I work" home section — uncommitted
- [ ] 7. Add the "Ways to work together" home section with prices
- [ ] 8. Sync docs and close out

## Ground rules for every step

- **Read first:** `AGENTS.md`, `.github/instructions/astro-src.instructions.md` (every step touches
  `src/`), `.github/instructions/plans.instructions.md` (for `progress.md`), plus any file named in the step.
- **Preflight:** obtain human sign-off on the complete English copy, revised offer terms and publication
  register in `spec.md` before building. Do not invent missing facts, permissions, credentials or metrics.
  English is approved first; three-locale implementation below follows that approval, not the reverse.
- **Three locales per step.** `ca` and `es` are typed `: Dictionary` and the routes are generated per
  locale, so a key or content file added in `en` alone breaks `astro check` or leaves a locale without a
  route. Every step writes `en`, `ca` and `es` together; the translations follow `copy-en.md` and are
  flagged in `progress.md` for owner review before release. Translation review is not a claim of
  professional language proficiency; keep the approved language wording in the copy deck.
- **Standard gate** (repository commands plus the dependency audit actually required by CI):

  ```bash
  npm ci
  npm audit --audit-level=high
  npm run format:check
  npm run lint
  npm run check
  npm run check:placeholders
  npm run build
  ```

  Pass looks like: Prettier clean, ESLint 0 problems, `astro check` 0 errors / 0 warnings / 0 hints,
  placeholder guard clean, dependency audit below the high-severity failure threshold, and `astro build`
  reporting the step's expected page count. Do not call this a zero-vulnerability audit unless it is one.
  The document-revision check on 2026-11-17 initially failed `npm ci` with `ERESOLVE`. In separately
  authorised prerequisite work that day, the fork was updated to `^0.2.0`, the Astro plugin to `^3.2.1`
  so it actually loads the fork, and a scoped patched-matcher override added. Plain `npm ci` now passes
  and `npm audit --audit-level=high` reports `found 0 vulnerabilities`; exact evidence and remaining
  install-script warnings are appended in `progress.md`. This does not approve or complete any website
  implementation step. Repeat the gate at implementation time and stop release on any failure,
  without bypasses or dependency changes hidden in a copy step.
  The "62 files" count from `astro check`
  is expected to change once components are added (steps 6 and 7): record the new number rather than
  treating it as a failure.

- **E2E** (`npm run test:e2e`, which builds with the Turnstile test key first) is part of Verify wherever
  the step says so. CI runs on pull requests, pushes to `main` and manual dispatch, not a bare feature-
  branch push. E2E leaves a test-key build in `dist/`; rebuild normally and run
  `npm run check:production-env` before any final dry-run or release review. Deployment dry-run is an
  additional local check, not a current CI step.
- No step commits. The builder proposes a commit message at the end of each step (`/commit-msg`).
- **Status:** the builder marks its step `[~]` on start and `[x] … uncommitted` only when every Verify
  command passed (`[!] … <reason>` if blocked). Before starting a step it replaces `uncommitted` with
  the short hash of any earlier step I have committed, and stops to ask if an earlier step is still
  uncommitted (`docs/adr/0002-plan-status-checklist.md`). Each progress entry includes `Commit:`; append
  a later commit-reference note rather than rewriting earlier command output.
- **Branch:** all steps happen on `feat/content-repositioning`. Local history contains prerequisite
  commits `7fe9292` (dependencies) and `ccc0d31` (plan-status workflow) beyond the currently tracked
  `origin/main` at `7c45ffc`; these are not automatically part of this content review's approval.
  Before an authorised PR, inspect the current remote comparison and review all included commits,
  public document history and outstanding changes. Nothing reaches `main` until step 8 is verified
  and the owner authorises the PR/publication. No push or history rewrite is authorised by this plan.

## Decisions at planning time (2026-11-17)

- **Home-page length: option (b), revised copy.** Process steps are a title plus one line; remove the
  About teaser but keep Victor's introduction in the hero. Final order: Hero, Services, Selected work,
  How I work, Ways to work together, CTA band, Contact. Client proof precedes the method. If budgets
  are exceeded, stop and ask; a separate `/pricing/` page is a fallback only with owner approval.
- **Evidence:** follow the publication register in `spec.md`. Omitted measurements are not replaced by
  estimates or unverified numbers carried over from old content. Keep implementation directions outside
  publishable copy and preserve historical `.ai/plans/` files unchanged.
- **Branches from now on**, with standard names (`feat/…`, `fix/…`, `docs/…`, `chore/…`), never a
  `claude/` prefix. Recorded in `AGENTS.md` in step 8.
- **Public prices:** confirmed.
- **Redirects:** dropped by the recorded owner decision; retired URLs may 404. This is an accepted
  possible link/SEO cost, not evidence that no incoming links exist. There is no redirect step later.

## Steps

### 1. Retire the Topten Scout case study

- **Goal:** Topten Scout no longer exists on the site in any locale (D4); the case-study list reads
  coherently without it.
- **Files:** delete `src/content/caseStudies/topten-scout.{en,ca,es}.md`; `src/lib/content.ts` (remove
  from `caseStudyOrder`, fix the comment that enumerates the old order); `src/i18n/{en,ca,es}.ts`
  (`caseStudies.subtitle` no longer mentions market observability).
- **Verify:** standard gate. `astro build` now reports **34 pages** (three fewer `/work/` routes); that
  count is expected and temporary until step 4 adds a case study back. Also
  `rg -ni scout src tests` returns no matches (exit 1 is expected for no matches; today the only hit
  outside the deleted files is
  `src/lib/content.ts`). Then `npm run test:e2e`: all pass (`tests/routes.ts` derives the routes from
  the content folders, so no test edit is needed).
- **Out of scope:** pillar changes, other case-study copy, redirects.

### 2. Replace the service pillars and rewrite the four services

- **Goal:** the `pillar` enum is `build | modernize | platform | energy`, in that order. Each has a service
  page with the explicit tag, title, summary and body from `copy-en.md` within D3's service boundary.
  Do not paste editorial headings or publication notes into service bodies. Existing case studies are
  re-tagged: `topten-ecosystem → platform`, `eu-inspection-tooling → energy`,
  `banco-estado-iot → energy`. Services section heading copy (eyebrow, title, subtitle) updated.
  `build` and `modernize` temporarily have no related case study; step 4 must resolve both before release.
  The `modernize` body may include its approved locale-aware Topten link now; step 4 supplies the
  rewritten study and related-work mapping. Step 7 owns the service-detail engagement link and its
  dictionary label, once the home `#engage` section exists.
- **Files:** `src/content.config.ts` (enum); `src/lib/content.ts` (`pillarOrder`); delete
  `src/content/services/{regtech,entity-resolution,infrastructure,iot}.{en,ca,es}.md`; create
  `src/content/services/{build,modernize,platform,energy}.{en,ca,es}.md`; pillar field in the three
  remaining case studies (all locales); `src/i18n/{en,ca,es}.ts` (`services.pillars` keys and tags,
  `services.eyebrow/title/subtitle`, `services.relatedWork`, `services.noRelatedWork`, and the pillar-key
  comment).
- **Verify:** standard gate, 34 pages. Inspect `rg -n 'entity-resolution|regtech|infrastructure|iot' src`:
  distinguish retired enum/slug/key references from legitimate prose, stable case-study slugs and
  contact options retained until step 3. Do not demand that the ordinary word `infrastructure` disappear.
  Record the output and classify any remaining old key. Then `npm run test:e2e`: all pass. If the
  `structure`/`a11y` specs fail, fix the content, not the tests.
- **Out of scope:** contact form options (step 3), case-study bodies and related-work mapping (step 4).

### 3. Align the contact form's focus options with the new services

- **Goal:** the form offers `build`, `modernize`, `platform`, `energy`, `audit`, `other` with the labels in
  `copy-en.md`. The Worker accepts exactly those keys and labels the notification email accordingly.
  The audit is distinct from other enquiries. Update every contact key explicitly listed in the copy
  deck, including form labels, button labels, `directContact.locationValue` and booking text.
- **Files:** read `.github/instructions/worker.instructions.md` first. `src/i18n/{en,ca,es}.ts`
  (`contact.*`, including `contact.form.serviceTypes`), `src/worker/index.ts` (`SERVICE_TYPES` values and
  a named export for test access only), `tests/form.spec.ts` (replace the old selected value and cover
  all new options), new `tests/contact-options.spec.ts` (import the Worker's actual accepted map, not
  a duplicated test-only list, and compare it to all three dictionaries and rendered select options).
  Read the Worker instructions before implementing this test. Do not move or change validation logic
  merely to make the test pass.
- **Verify:** standard gate, then `npm run test:e2e` (form and parity specs pass). The
  parity test must fail if any one dictionary or the Worker's map has a missing/extra key; English email
  labels must match the approved English option labels. Verify rendered values on all three home pages.
  Rebuild without the test-key override, run `npm run check:production-env`, then
  `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`: exit 0, no warnings.
  State in `progress.md` that browser E2E stubs `/api/contact`: it verifies UI responses, not Worker
  rejection paths or delivery. Exercise an unknown service key against `npx wrangler dev` with an
  otherwise well-formed request and record the actual response if local integration is available;
  otherwise explicitly defer that integration check. Never send a real enquiry or change production
  secrets/bindings. A test-key happy path remains unverified; do not relax action/hostname checks.
- **Out of scope:** any other Worker logic, Turnstile, rate limits, `wrangler.jsonc`.

### 4. Rewrite the case studies and add "This website"

- **Goal:** case studies in the order: `topten-ecosystem`, `eu-inspection-tooling`, `banco-estado-iot`,
  `vgr-cat` (new, pillar `build`), with all required frontmatter fields and full Markdown bodies
  per `copy-en.md`, D8 and D9. Unsourced metrics are removed: "weeks to hours", "zero maintenance
  downtime", "sub-second", "negligible", "days rather than months", "days to minutes", "hours to seconds"
  and "legally defensible", plus immutable/defensible audit-log variants, unsourced traffic/uptime,
  automated failover, branch counts and unmeasured efficiency claims. Named attribution follows D1
  and owner publication review. Labels become `Problem` / `What I built` / `Result`.
  `caseStudies.eyebrow/title/subtitle` are updated. Keep Topten's canonical pillar `platform`; add an
  explicit related-work override in `getCaseStudiesByPillar` for `modernize` to include
  `topten-ecosystem`, deduplicated with enum-derived matches and filtered by the requested locale.
  No schema migration or duplicate case study is needed. Verify the actual Topten link in each
  `modernize` body: `/work/topten-ecosystem/`, `/ca/work/topten-ecosystem/`, `/es/work/topten-ecosystem/`.
- **Files:** `src/content/caseStudies/{topten-ecosystem,eu-inspection-tooling,banco-estado-iot}.{en,ca,es}.md`
  (rewrite; the `translationKey`s and filenames stay, so URLs stay); create
  `src/content/caseStudies/vgr-cat.{en,ca,es}.md`; `src/lib/content.ts` (`caseStudyOrder`);
  `src/content/services/modernize.{en,ca,es}.md`; `src/i18n/{en,ca,es}.ts` (`caseStudies.*`);
  `tests/structure.spec.ts` (related-work and locale-aware link assertions).
- **Verify:** standard gate, **37 pages** again. Then `npm run test:e2e` including `page-weight.spec.ts`
  (each home card ≤ 340 px). Then
  `rg -ni 'sub-second|zero maintenance|legally defensible|defensible audit|immutable audit|legal enforcement|days to minutes|hours to seconds|weeks to hours|negligible|days rather than months|slashed analyst' src/content`
  returns no matches in any locale (also manually inspect translated equivalents). Review all new copy
  against the evidence register, not just a phrase blacklist. The website case contains no hard-coded
  rule/page counts or claim of a dry-run on every push. Assert both `modernize` and `platform` detail
  pages link to the localised Topten case and do not display `noRelatedWork`; `build` links to `vgr-cat`.
- **Out of scope:** a bill-analytics case study (D5: a line in the `energy` service only).

### 5. Rewrite hero, meta, about, CTA band and footer

- **Goal:** `site.*` (title, description, author `Victor Gonzalez`, jobTitle per D2, canonical location), `hero.*` (badge,
  title, highlight, subtitle, CTAs, metric labels), `about.*` (eyebrow, title, the five paragraphs,
  experience entries with approved attribution, flat competencies, headings, credentials), `nav.*`,
  `ctaBand.*` and `footer.*` follow
  `copy-en.md`. The hard-coded `© {year} VGR.` in the footer uses `t.site.author`, so the name appears
  consistently without replacing historical role titles with the headline title. Hero proof values
  are qualitative, using the existing `metrics` value/label shape; do not restore unverified numbers.
  Link the hero secondary CTA to `#work` using its approved See selected work label.
- **Files:** `src/i18n/{en,ca,es}.ts`; `src/components/SiteFooter.astro` and
  `src/components/PageShell.astro` (pass author and explicit GitHub URL/link label through props and
  render an actual anchor rather than injecting HTML into a translated string);
  `src/lib/schema.ts` (check that language/location claims agree with the approved copy),
  `src/config.ts` (shared repository URL).
- **Dictionary:** keep a flat `about.competencies` array because `schema.ts` feeds it to `knowsAbout`.
  New link labels and URLs must be explicit, not an instruction hidden in prose. Keep a single GitHub
  URL constant in `src/config.ts` for process and footer links. Existing error/privacy/utility strings
  follow the copy deck's retain-existing rule; do not invent a credential, fluency level or date.
- **Verify:** standard gate, 37 pages, then `npm run test:e2e` (page-weight included). Inspect
  `dist/index.html` for `<title>Victor Gonzalez | Senior Full-Stack Engineer &amp; Fractional Tech Lead`
  and the JSON-LD `"name":"Victor Gonzalez"`; record exact inspection commands/output. Also inspect
  JSON-LD address, headline title and language claims and click the footer GitHub link. Do not assert
  that signed history proves every historical change was human-reviewed.
- **Out of scope:** visual redesign, new portrait/testimonial assets and external account updates.

### 6. Add the "How I work" home section

- **Goal:** after Selected work, a section `id="how-i-work"` with the eyebrow, title,
  subtitle, five steps and the proof line linking to `https://github.com/vgr-dev/vgr.cat`. The hero's
  secondary CTA remains See selected work, pointing to `#work`. Use the five short steps and the
  approved code-sharing boundary in `copy-en.md` verbatim; this plan contains no competing replacement
  copy. Explain AI drafts and personal accountability without speed or perfect-review guarantees.

  Also per (b): the About teaser band is removed from `HomeSections.astro`. `about.teaser` and
  `about.readMore` are deleted from all three dictionaries if nothing else reads them (grep first, and
  record the result).

- **Files:** new `src/components/ProcessSection.astro` (Astro only, Tailwind tokens already in
  `global.css`, an ordered list `<ol>` for the steps, no inline `style=""`); `HomeSections.astro`;
  `src/i18n/{en,ca,es}.ts` (new `process` key: `eyebrow`, `title`, `subtitle`, `steps[]` with `title` and
  `body`, `dataBoundary`, `proof`, `proofLinkLabel`; remove the teaser keys), `src/config.ts`
  (reuse the repository URL), `tests/page-weight.spec.ts` (log existing measurements without changing
  budgets), `tests/structure.spec.ts` (order, anchors and proof link).
- **Verify:** standard gate (record the new `astro check` file count). Then `npm run test:e2e`. **The
  page-weight budget is the risk:** 5,500 px desktop, 12,000 px mobile and 1,700 words per home page.
  Historical measurements in `tests/page-weight.spec.ts` are `/` 4,792 px / 744 words, `/ca/` 5,057 / 928,
  `/es/` 5,137 / 929 at 1280×900; Spanish had only 363 px desktop headroom. These are not current
  measurements. Before adding sections, emit/log the already computed measurements in the page-weight
  tests and run `npm run test:e2e` to record fresh per-locale height/words and mobile height. Repeat
  after the edit. A passing assertion alone does not print this baseline. If any home page exceeds a
  budget even with (b), **stop and ask**; do not raise thresholds or remove assertions. Test edits may
  add logging and coverage only. Then check
  the CSP: `npm run build`, `npm run preview`, confirm the section renders and the browser console shows
  no CSP violation, and record it (`npm run dev` emits no CSP meta tag, so it cannot be used for this).
- **Out of scope:** a separate `/how-i-work/` or `/pricing/` page (only with my approval if (b) does
  not fit).

### 7. Add the "Ways to work together" home section with prices

- **Goal:** after How I work and before the CTA band, a section `id="engage"` with three offers
  (Audit €2,500 fixed; Project €640/day with the €1,280 spec credited; Fractional tech lead €2,400/month
  for 4 days, 3-month minimum), concise cards and the scoped terms from `copy-en.md` (D7). Distinguish
  working days from elapsed scheduling, discovery ownership/one-time credit, retainer availability,
  minimum commitment, VAT and pre-agreed costs. Do not imply 24/7 support or blanket at-cost expenses.
  Prices are formatted per locale: `€2,500` in `en`, `2.500 €` in `ca`/`es`.
- **Files:** new `src/components/EngageSection.astro`; `HomeSections.astro`; `src/i18n/{en,ca,es}.ts`
  (new `engage` key as defined in the copy deck; prices as display strings, not computed; add
  `services.engageLink: 'See ways to work together'` and its translations);
  `src/components/pages/ServiceDetail.astro` (localised `${home}#engage` anchor rendered with
  `t.services.engageLink`, never a hard-coded English label);
  `tests/layout.spec.ts` (explicit `#engage .grid > *` selector and assertion that all three cards exist);
  `tests/structure.spec.ts` (prices, terms and detail-page engagement links).
- **Verify:** as step 6 (standard gate, e2e with page-weight, CSP check in preview). Same stop rule if a
  budget is exceeded. Confirm all three engagement cards are actually selected and meet the 280 px
  layout rule at 640 px; the existing selectors do not cover arbitrary new cards. Preserve the existing
  340 px service/work card budget; do not silently extend that teaser-height rule to price/terms cards.
  Verify desktop/mobile readability in every locale and service-detail links to the matching `#engage`.
- **Out of scope:** JSON-LD `Offer` markup with prices (a possible follow-up, not in the spec).

### 8. Sync docs and close out

- **Goal:** `AGENTS.md` matches reality: the `astro check` file count and dry-run asset count, the
  `Dictionary` gotcha's pillar example (`'entity-resolution'` → a current key), and the description of
  the home page if it lists sections. Hard rule 2 gains the branch convention: work happens on a
  branch with a standard prefix (`feat/`, `fix/`, `docs/`, `chore/`), never `claude/`, and reaches
  `main` through a PR. `progress.md` lists, per locale, every translation awaiting my
  review; publication requires that review to be complete, not merely listed. Record owner confirmation
  of attribution/technical facts and CV/LinkedIn follow-up separately from builder checks. Refresh
  README command/CI descriptions if they repeat superseded claims. Remove no historical evidence.
  Mark step 8 `[x] … uncommitted` after its local verification, then update its reference only after
  the owner commits; do not require the step's own future hash to finish local work. Earlier steps
  must already have owner-approved commits or explicit deferrals under the existing stop rule.
  Spec `status: done` only after owner-confirmed publication and live review; that confirmation is an
  append-only progress entry, not an invented automated test result.
- **Files:** `AGENTS.md`, `specs/2026-11-17-content-repositioning/{spec,progress}.md`, and the Status
  lines in `plan.md`, and `README.md` if its command/CI descriptions are stale.
- **Verify:** the full AGENTS.md gate, including
  `npm audit --audit-level=high`, `npm run test:e2e`, a subsequent production `npm run build`,
  `npm run check:production-env`, and `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`, with
  actual counts written into `AGENTS.md`. Inspect all commits/changed documents included in the
  eventual PR for internal rates, unreleased partner information and unsupported assertions before
  requesting publication approval. Do not rewrite Git history or declare old copies removed.
- **Out of scope:** CV/LinkedIn edits, outreach execution, fixing dependency advisories, commits, pushes
  and deployment without separate owner authorisation.

## Risks / open questions

- **Page-weight budget (steps 6 and 7).** Option (b) is a mitigation, not proof of fit. The two compact
  sections and offer terms may still exceed desktop/mobile budgets, particularly in translation. The
  stop rule applies; do not mark this risk resolved until measured.
- **Translation quality.** `ca`/`es` are machine-assisted from `copy-en.md`; I must review them before
  deploy. Pricing and legal-adjacent lines (VAT, notice period) need the most care.
- **Deploy is automatic** after successful CI on `main`. Work on the feature branch until authorised
  integration; a bare branch push runs neither CI nor Deploy. An authorised PR runs CI. A public branch
  push still publishes its Git objects, so deployment safety is not confidentiality safety.
- **Release prerequisites:** owner sign-off, client attribution/technical-fact review, translations and
  the dependency audit remain explicit gates. Missing external evidence is not fixed by a passing build.
