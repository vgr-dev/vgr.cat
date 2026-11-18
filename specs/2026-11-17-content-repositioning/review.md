# Review: content repositioning

- **Date:** 2026-11-17
- **Reviewer:** reviewer role (`spec-review`)
- **Spec:** `specs/2026-11-17-content-repositioning/spec.md` (`status: done`)
- **Closed:** 2026-11-18 after live confirmation
- **Scope reviewed:** `origin/main..HEAD` on `feat/content-repositioning`, 23 commits, plus the working tree
- **Verdict:** **PASS** (2026-11-18; originally PASS WITH CHANGES before the owner decisions below)

The implementation is complete, the gate passes, and the new home sections and locale-aware links behave as
specified. The owner resolved the document and approval actions on 2026-11-18, and the deployed result was
confirmed later that day. The visual suggestions below remain non-blocking.

## Code and standards findings

### Critical

None in the implementation.

### Mechanical fix applied

- **Stale Status line.** `plan.md` step 8 read `— uncommitted` while `c165dff` (`docs(specs): log step 8 and
close out the content-repositioning plan`) is in `git log` and the working tree was clean. Changed to
  `— c165dff` on 2026-11-17. This is the only file changed by this review, and it is left uncommitted. The
  `progress.md` step 8 `Commit: uncommitted` line is historical (written before the hash existed) and was left
  untouched; add a dated correction there if the record should carry the hash.

### Suggestions (not fixed; no logic changed)

1. **Related-work card is unreadable at desktop widths.** On `/services/<key>/` in all locales, the single
   related-work card is 476 px wide because the grid is `md:grid-cols-2`, but `CaseStudy.astro` applies
   `lg:grid-cols-3` to its `<dl>` based on viewport width. Measured at 1024 and 1280: three columns of **126 px**
   each, producing text that wraps to a few words per line (see the `/es/services/modernize/` screenshot taken
   during this review). The longer rewritten `problem`/`approach`/`outcome` copy exposes it. Likely fix: a
   single-column `<dl>` in the `full` card when it sits in a half-width related-work grid, or make that grid one
   column. This is a real visual defect surfaced by the new copy, not a spec violation.
2. **Service-page engagement link lacks a persistent affordance.** `ServiceDetail.astro` renders
   `services.engageLink` with `py-2 text-sm font-medium hover:text-accent` and no underline or accent colour
   until hover, unlike the process proof link (`text-accent-ink underline …`). It is clickable and localized
   correctly, but it reads as plain text next to the booking button. Give it the project's usual link styling.
3. **Worker `serviceType` lookup accepts inherited object keys.** `SERVICE_TYPES[serviceType]` is a plain-object
   lookup, so `serviceType=constructor` or `toString` yields a truthy inherited value and passes the
   `if (!serviceLabel)` check. This predates the change, but the map and its test are in this diff. Prefer
   `Object.hasOwn(SERVICE_TYPES, serviceType)` before reading the label. Low severity: the value lands in the
   notification text, not in a header, and Turnstile still gates the request.
4. **Test-only export from the Worker entry.** `SERVICE_TYPES` is exported from `src/worker/index.ts` solely for
   `tests/contact-options.spec.ts`. It works and keeps the test honest, but moving the map to a small shared
   module would avoid exposing an internal on the Worker entry. Optional.

## Owner actions required before `done` or any push

> Resolved 2026-11-18: see **Owner decisions** and **Post-deploy confirmation** below.

These are not builder defects. `progress.md` already lists most of them; they are repeated here because the
review cannot pass the corresponding acceptance criteria.

1. **Stale spec narrative.** `spec.md` still says "There are no implementation results yet", "The plan's sign-off
   remains blank" and, in Approval state, "No implementation step is complete and no plan sign-off is implied".
   That contradicts `plan.md`'s sign-off and steps 1–8 in git. Correct it with a dated note (do not rewrite the
   historical review text) so the public spec does not misstate the state.
2. **Budget acceptance criterion.** "Existing desktop/mobile/word budgets pass … Do not increase budgets to make
   the content fit" conflicts with the owner-approved raise of `HEIGHT_BUDGET` from 5,500 to 6,500 px. The raise
   and measurements are recorded, and all budgets now pass, but the criterion cannot be ticked as written. Amend
   or annotate it.
3. **Translations.** Catalan and Spanish copy (services, case studies, all new dictionary keys, and especially the
   VAT/discovery/minimum-term/notice wording) has not been reviewed by the owner. Listed in `progress.md` §D.
4. **Attribution and permissions.** Owner confirmation is still required for Topten, Bush Energie, Banco Estado and
   Fundación Chile, the historical roles/dates, D8 and D9. `spec.md`'s evidence register still marks these pending.
5. **Publication decisions.** CV/LinkedIn alignment, AI-tool boundaries, and the branch-history exposure of the
   internal client rate (commits `ccc0d31` and `e9fd4ac`) need an explicit owner decision before push. The final
   tree is clean of the removed material; the history is not rewritten, per the recorded policy.
6. **Live confirmation.** Mark `done` only after the owner confirms the deployed result, not a local build.

## Scope check

- The eight plan steps match the diff: pillars and four services, contact keys, four rewritten case studies plus
  `vgr-cat`, hero/meta/about/CTA/footer, How I work, Ways to work together, docs and close-out.
- No visual redesign, no new framework/CMS/tracking, no redirects, no invoice/contract changes, no secrets.
- `git diff origin/main..HEAD` also contains prerequisite work outside this spec: dependency/lint/CI updates,
  `docs/adr/0002`, the status checklist in `specs/_template/plan.md`, the audit threshold change and the
  `package.json` overrides/`allowScripts`. They are recorded in `AGENTS.md`/the ADR as separate owner decisions,
  not content-plan scope. A review of this PR should read them separately, or the owner should split the branch.
- No `TODO`, `FIXME`, `@ts-ignore`, `eslint-disable`, `debugger` or debug logging in `src/` or `tests/`; the only
  `console.log` calls are the deliberate test/script output.
- No excluded product-data service, unreleased partner URL, internal rate, or unsupported quantitative claim in
  the final tree; English copy matches `copy-en.md` for the sections checked (site, nav, hero, services, process,
  engage, about, contact, footer, all service bodies and all case studies).
- `engages` cards are `<article>`s deliberately outside the teaser-height selector; the price and four terms
  render with no inline styles.

## Commands run (2026-11-17)

| Command                                                    | Result                                                                                                                              |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                                   | exit 0, 424 packages, 16 high advisories (picomatch, expected)                                                                      |
| `npm audit --audit-level=critical`                         | exit 0                                                                                                                              |
| `npm run format:check`                                     | exit 0, all files Prettier-clean                                                                                                    |
| `npm run lint`                                             | exit 0                                                                                                                              |
| `npm run check`                                            | exit 0, `Result (66 files): 0 errors, 0 warnings, 0 hints`                                                                          |
| `npm run check:placeholders`                               | exit 0, `0 placeholders remain.`                                                                                                    |
| `npm run build`                                            | exit 0, `37 page(s) built`                                                                                                          |
| `npm run test:e2e`                                         | exit 0, `560 passed (2.5m)`                                                                                                         |
| `npx playwright test tests/page-weight.spec.ts`            | exit 0; heights 5,832 / 6,232 / 6,242 px desktop, 8,959 / 9,416 / 9,713 px mobile; 1,100 / 1,318 / 1,333 words; tallest card 320 px |
| `npm run build && npm run check:production-env`            | exit 0, committed sitekey in use, no test-key override                                                                              |
| `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` | exit 0, `Read 102 files`, 8.67 KiB / 3.22 KiB gzip, no warnings                                                                     |

Playwright was also run manually against the production `dist/` at 1280×900 and 390×844 for `/`, `/ca/` and
`/es/`: CSP meta present, no CSP violations, no console errors or warnings, no horizontal overflow, three offer
cards and four terms, zero inline styles in `#engage`, and the section order `services → work → how-i-work →
engage → contact`. Dark mode renders the offer cards with the same layout. At 640 px the cards measure 592 px
each. A screenshot of `/es/services/modernize/` at 1280 px shows the 126 px related-work columns described above.

## Next action

Superseded by **Post-deploy confirmation** below: the owner resolved the open items, PR #15 merged, CI and
Deploy passed, and the live result was confirmed on 2026-11-18.

## Recommended manual smoke test

Serve the production build and check the new UI by hand:

```bash
npm run preview
```

1. Open `http://127.0.0.1:4321/es/`, scroll to **Tres formas de empezar**. Confirm the three cards read
   `2.500 € precio fijo`, `640 € por día` and `2.400 € al mes`, the four terms are visible, and the layout holds
   at 390 px (no horizontal scroll).
2. Open `http://127.0.0.1:4321/es/services/modernize/` and click **Ver las formas de trabajar juntos**; it must
   land on `/es/#engage` with the section heading clear of the sticky header. Repeat once in `/ca/`.
3. On the same service page, inspect **Trabajos relacionados**: confirm whether the three-column problem /
   approach / result text is acceptable at 1280 px (this review measured 126 px per column and recommends a fix).
4. Toggle dark mode on `/` and confirm the offer cards, prices and terms keep readable contrast.
5. Do not submit the contact form in this smoke test: a real submission needs production keys, and the local
   suite stubs `/api/contact`.

## Post-deploy confirmation (2026-11-18)

The branch merged as PR #15 (`ff47c42`), CI run 44277840630 passed, and Deploy run 44278314434 succeeded.

Live checks against `https://vgr.cat` using curl and HTML parsing:

- `/`, `/ca/`, `/es/`, `/es/services/modernize/` and `/ca/services/modernize/` return HTTP 200; canonical URLs
  and `lang` attributes are correct.
- Home pages contain three offer cards and four terms, in the planned order
  (`services → work → how-i-work → engage → contact`), with the approved prices in each locale
  (`€2,500 / €640 / €2,400` and `2.500 € / 640 € / 2.400 €`).
- Contact options are `build, modernize, platform, energy, audit, other` in all three locales; structured data
  reports `knowsLanguage` as `["en","es"]`; each home page has two public GitHub repository links.
- Service pages link to `/es/#engage` and `/ca/#engage`; `/work/topten-ecosystem/`,
  `/es/work/topten-ecosystem/`, `/ca/work/vgr-cat/` and `/es/services/energy/` return HTTP 200.
- The retired `/services/entity-resolution/`, `/services/infrastructure/` and `/services/iot/` return HTTP 404,
  and the sitemap contains no retired service routes.
- The CSP meta tag is present with the Turnstile and Cloudflare Web Analytics origins. The Worker answers
  `GET /api/contact` with HTTP 405, and the response headers include HSTS, COOP, CORP, `X-Content-Type-Options`,
  `X-Frame-Options` and Referrer-Policy.

Playwright could not navigate to the public host from this environment (external navigation timed out), so the
live checks above used the served HTML rather than a browser. The local production build had already passed the
browser, CSP, console, overflow and dark-mode checks recorded earlier. The owner confirmed the live result.
Verdict remains **PASS**; the spec is `done`.

## Owner confirmation (2026-11-18)

The owner stated, after reviewing the result: “From my side, content wise is perfectly fine.”

- Recorded as owner approval of the final tree's content, including the Catalan and Spanish wording. This
  supersedes the translation-review sentence in **Next action** above and clears owner action 3.
- Not recorded as confirmation of third-party attribution/permission (action 4), the CV/LinkedIn follow-up, the
  branch-history decision (action 5), the budget-criterion amendment (action 2), correction of the stale spec
  narrative (action 1), or the live deployment (action 6). If the approval was intended to cover only the English
  copy, this note needs correcting.
- Verdict at that time: **PASS WITH CHANGES**. The owner decisions below supersede this; the spec remains
  `active` only for live confirmation.

## Owner deferral (2026-11-18)

The owner deferred the CV/LinkedIn alignment: “CV/Linkedin will come later we can close that for now.”

- Recorded as a deliberate deferral, not completion. It no longer blocks this spec's close-out, which concerns
  the site in this repository. The external profiles may keep the old headline, location and bill-volume wording
  until that follow-up happens.
- At that time the remaining blockers were third-party attribution/permission, the branch-history decision, the
  stale `spec.md` narrative, the budget-criterion amendment and live deployment confirmation. The owner decisions
  below resolve all but the live confirmation.

## Owner decisions and spec update (2026-11-18)

The owner resolved the remaining close-out decisions:

1. Third-party attribution is permitted.
2. The branch-history exposure is accepted; no history rewrite.
3. The sign-off is confirmed.

The owner also asked for the spec edits, which are now applied:

- `spec.md` narrative corrected: implementation status, plan sign-off and the accepted history exposure.
- The budget criterion now records the owner-approved 6,500 px desktop height; the mobile, word and card
  budgets are unchanged.
- Acceptance criteria 1–10 are ticked with dated evidence. Criterion 11 stays open only for live confirmation.

With those changes the review verdict is **PASS**. The deployed result was confirmed on 2026-11-18 (see
**Post-deploy confirmation** below), so the spec is `done`. This section supersedes the owner-actions list and
**Next action** above.
