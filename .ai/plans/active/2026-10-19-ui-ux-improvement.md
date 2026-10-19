# UI/UX Improvement Specification

- **Plan date:** 2026-10-19 (`date +%Y-%m-%d` → `2026-10-19`)
- **Audited commit:** `3cc7b3b` (`git rev-parse --short HEAD`), working tree clean
- **Plan type:** read-only UI/UX audit **plus** implementation specification. No application change was
  made. Nothing was built, deployed, or submitted to a production form.
- **Companion plan:** `.ai/plans/archive/2026-10-19-security-audit.md` (moved from `active/` on 2026-10-19) is
  independent of this one. Neither blocks the other; they touch `ContactForm.astro` from different angles (that
  plan is read-only, this one changes behaviour) and must not be merged blindly.

## Re-evaluation — 2026-10-19 (after the content rework)

The content rework (`2026-10-19-content-rework.md`, Phases 1–5) landed after this audit was written, from the
same base commit. Every finding below was **re-measured on the post-rework build** (`npm run build` →
`npm run preview`, 7 pages). **Where this section disagrees with the body, this section wins.** The original
measurements are left verbatim as the record of the audited state.

### What the rework touched, and why it matters here

| Rework phase | UI surface affected |
| --- | --- |
| 1 — Tier A copy | `hero.*`, `services.*`, `caseStudies.*`, `about.*`, `contact.subtitle`, `footer.tagline`, `site.title/description/jobTitle` |
| 2 — IoT pillar | `#services` grid `sm:grid-cols-3` → `md:grid-cols-2`; a 4th card; a 5th `<option>` in the contact select |
| 3 — bank case study | a 4th article in `#work`; explicit `caseStudyOrder` sort replaces alphabetical order |
| 4 — experience list | new `h3` + `<dl>` in `#about` |
| 5 — structured data | JSON-LD `Person.knowsAbout` only — no visual change |

### Resolved by the rework

| ID | Status | Re-measured evidence |
| --- | --- | --- |
| **UX-012 (services part only)** | **RESOLVED** | `#services .grid` is `md:grid-cols-2`. 375 → 1 col (prose 262 px); 640 → 1 col (prose 527 px); 768 → **2 cols, prose 291 px**; 1024 → 2 cols (419 px); 1440 → 2 cols (426 px). No orphan, no horizontal overflow. The 176 px / 227 px columns in the original finding no longer exist. |

### Still open — re-measured, values unchanged

| ID | Re-measurement |
| --- | --- |
| UX-001 skip link | anchors matching `/skip/i` → **0** |
| UX-002 control boundary | light: border **1.24:1** vs page, **1.17:1** vs its own fill; dark: **1.23:1** vs fill |
| UX-003 320 px reflow | `scrollWidth 324` vs `clientWidth 305`; grid column **300 px** inside a **257 px** form; widget 300 px at x=24 |
| UX-004 mobile panel | open panel `display:block`, **x=145, w=191, h=190** in a 360 px header |
| UX-008 dead-end pages | `404.html` and `contact/thanks` → **0** `<header>`, **0** `<nav>`, **0** `<footer>`; 404 still ships **3** `h1` |
| UX-013 contact `<dl>` | still **3 columns × 309 px with 2 children** |
| UX-017 error copy | `en` still names no address; `ca` still does |
| UX-018 Turnstile eager | `api.js` + challenge iframe both requested on first load |
| UX-020 thanks pages | **3** `contact/thanks` URLs still in `sitemap-0.xml`; **no** `robots` meta |
| UX-023 dead keys | 0 consumers for `successMessage`, `namePlaceholder`, `emailPlaceholder`, `messagePlaceholder`, `ctaLearnMore` |
| UX-025 font loading | `rel="preload"` → **0**; one woff2 fetched (48,256 B decoded) |

### Numbers that are now stale in the body

| Where | Was | Is |
| --- | --- | --- |
| UX-019, §8, J1 | page **16,779 px**; `#work` **8,205 px**; `#contact` top **15,085 px** at 375 px | page **19,291 px**; `#work` **9,027 px**; `#contact` top **17,623 px**; `#about` top 15,155 px. The experience list alone added ~571 px |
| §3 content collections | 18 markdown files | **24** (4 services + 4 case studies × 3 locales). `astro check` still reports **30 files** |
| UX-007 | 12 `h3` in `#work` | **13** (4 card titles + 9 sibling prose) |

### New findings introduced by the rework

**UX-029 [Medium] The four case studies are now inconsistent in shape.**

- **Type:** Content problem / Visual inconsistency
- **Evidence:** `eu-inspection-tooling`, `topten-ecosystem` and `topten-scout` each carry three `###` headings
  duplicating their `<dl>`; the new `banco-estado-iot.*.md` has **one paragraph and no headings**. Measured
  article heights at 375 px: **2,424 / 2,591 / 2,637 / 1,068 px**.
- **Why it matters:** a reader scanning `#work` sees three long articles and one less than half their size with
  no explanation; a screen-reader user finds nine `h3`s for three articles and none for the fourth.
- **Desired:** one shape for all four — which is exactly UX-007's decision (content plan D-5), now with a
  visible cost.
- **Status:** Confirmed. It **strengthens** the case for landing UX-007; it does not change the recommended fix.
- **Resolution note (2026-10-19):** resolved. On the owner's instruction the IoT article gained the same three
  sections as the others (`#### The Challenge / The Architecture / Measurable Impact`, and the CA/ES
  equivalents), written only from facts already in its summary. Measured after the build: every locale
  renders 4 × `H3` titles and 12 × `H4` sections with no level skip, so all four articles share one shape.
  The prose sections were authored here, so they are worth a read before they ship.

**UX-030 [Low] The focus select grew to six options, and its longest label sets the control's minimum width.**

- **Type:** Responsive defect (latent — currently masked by UX-003)
- **Evidence:** `select.options.length === 6`; longest label `RegTech / EPREL Integration / ESPR Readiness`;
  `select.scrollWidth 298` inside a 300 px column. That column is 300 px only because the Turnstile widget
  forces it there.
- **Why it matters:** once UX-003 is fixed (column → 257 px) the **selected option text will clip**, because a
  native `<select>` cannot wrap its closed-state label.
- **Desired:** after the reflow fix, shorten the option labels or move the long descriptions into an
  `aria-describedby` hint so the closed control stays readable at 320 px.
- **Status:** confirmed by measurement; the clipping is **predicted, not observed** — it cannot appear until
  UX-003 lands.

**UX-031 [Opportunity] `caseStudyOrder` is now an explicit ordering the UI must respect.**

The rework replaced alphabetical collection order with a `caseStudyOrder` array keyed on `translationKey`
(unknown keys sort last). A future reorder must edit that array, not the filenames. Recorded so a later phase
does not "fix" the order by renaming files. **Status:** informational.

**Not a new defect:** the `#about` experience `<dl>` is single-column at 672 px with 3 entries, and `#about`
reads `H2 → H3 → H3` with no level skip. It is unaffected by UX-013.

### Companion-plan paths

`2026-10-19-security-audit.md` has moved from `active/` to `archive/`. Paths elsewhere in this plan that still
say `active/` are left as recorded; read them as `archive/`.

---

## 1. Executive Summary

**Overall assessment.** The site is architecturally sound and unusually well-documented: a single
prerendered Astro page per locale, Tailwind 4 `@theme` tokens, a build-time CSP, a real focus-visible
style, semantic landmarks, one `h1` per page, correct `lang` plumbing across three locales, and text
contrast that passes comfortably (measured `6.00`–`7.41` for muted text, `5.13` for accent). The
weaknesses are not in the foundations — they are concentrated in **three places**: the form
(contrast, validation, focus, error messaging, 320 px reflow), the **page chrome around the single long
home page** (no skip link, no footer navigation, dead-end 404/thanks pages, a broken mobile menu panel),
and **document structure inside the case studies** (flattened and duplicated headings).

**Primary user problems, in order of severity.**

1. A keyboard or screen-reader user cannot skip the header, and the contact form's controls are visually
   indistinguishable from the page (measured border contrast **1.24:1**, needs 3:1).
2. At **320 CSS px the page scrolls horizontally** — the Turnstile widget's fixed 300 px width forces a
   300 px grid column into 257 px of space. Reflected text and form fields are clipped.
3. Submitting the form **destroys keyboard focus** (`document.activeElement` becomes `<body>`), exposes no
   busy state, and reports every one of seven distinct server outcomes with a single sentence.
4. Errors are browser-native only: no `aria-invalid`, no `aria-describedby`, no error summary, no
   persistent per-field message. A Catalan visitor receives English browser chrome text.
5. The opened mobile menu renders as a **191 px column beside the brand** rather than a panel below it.

**Accessibility outlook.** No WCAG 2.2 AA conformance claim is made here. Three Level-AA/A barriers are
confirmed by measurement (2.4.1 bypass blocks, 1.4.11 non-text contrast, 1.4.10 reflow) and a fourth
(3.3.1/3.3.3 error identification) is only partially met through native validation. The remaining
structure — landmarks, `lang`, one `h1`, label association via wrapping `<label>`, `aria-live` status
region, `aria-expanded` on the toggle, per-locale `hreflang`, `aria-hidden` honeypot — is correct and
should be preserved, not rebuilt.

**Contact-form verdict.** The **server** is the strongest part of the system (rate limiting, honeypot,
elapsed-time gate, Turnstile action + hostname validation, CRLF rejection, field allowlist, `no-store`).
The **client** is the weakest: it delegates all validation to browser bubbles, collapses every failure
into one string, uses `disabled` for its pending state, and cannot be completed without JavaScript.
The form needs a defined state model and a status-driven message map — not a rewrite.

**Proposed improvement strategy.** Six increments, each independently reviewable: (1) design-token and
primitive foundation, (2) contact-form state model and accessibility, (3) navigation, footer and page
chrome, (4) document structure and microcopy, (5) responsive corrections, (6) performance-adjacent UX.
No new frontend framework, component library, CSS framework, or state-management library is proposed.
One new **dev** dependency family (Playwright + axe) is proposed for regression coverage, with a
no-new-dependency alternative documented in §13.

**Important constraints.**

- Astro components only; `output: 'static'`; no adapter. Nothing in this plan needs SSR.
- The CSP is emitted by Astro's `security.csp` and hashes inline styles/scripts per build. **No inline
  `style=` attribute may be introduced** (none exists today; verified by `grep -rn 'style=' src/` → no
  matches). Any new inline script is hashed automatically.
- Path-scoped rules apply: `src/**` changes must follow
  `.github/instructions/astro-src.instructions.md`; plan edits follow
  `.github/instructions/plans.instructions.md`; workflow edits follow
  `.github/instructions/workflows.instructions.md`.
- **Recorded command output must never be rewritten.** The Worker's `{"error": "..."}` JSON bodies appear
  verbatim in `.ai/plans/archive/2026-10-15-portfolio-regtech-site.md` (lines 1188, 1214, 1934) and
  `.ai/plans/archive/2026-10-19-security-audit-remediation.md` (lines 383, 402). Phase 2 therefore
  derives user-facing messages from the **HTTP status code** and changes **no** existing JSON body. If a
  worker change ever does alter a body, add a dated correction note; do not edit the archived output.

**Audit limitations.** Everything below was measured against the local build in `dist/` served by
`npm run preview`, not against production. `dist/index.html` has mtime `13:09` while
`src/layouts/BaseLayout.astro` has mtime `13:11`, so the served HTML is **very likely one edit stale** for
that one file; `git status` is clean, so the tree equals `3cc7b3b` and no conclusion in this document
depends on the difference (every BaseLayout-related claim is also readable in the source). No analytics,
no session recordings, no user research and no production RUM data were available. No screen reader was
run. See §16.

---

## 2. Product and Audience Interpretation

**Documented facts** (from `README.md`, `AGENTS.md`, `src/i18n/en.ts`, `wrangler.jsonc`):

- A one-person technical consultancy site: `vgr.cat` presents a Principal Software Engineer working on
  European energy-regulation software (RegTech/GovTech, EPREL, ESPR, market surveillance, entity
  resolution, multi-tenant cloud).
- Three locales (en default, ca, es) with full dictionary parity enforced by `astro check`.
- Offers: architectural advisory, technical auditing, speaking engagements, engineering contracts
  (`contact.subtitle`).
- Two conversion paths: a **contact form** (`POST /api/contact`, with auto-reply) and an **external
  booking link** (`bookingUrl` → Google Calendar).
- Content is a single long home page per locale: Hero → Services → Case Studies → About → Contact.

**Architectural inferences (not documented — treat as hypotheses):**

- The audience is B2B: EU institutions, national energy agencies, NGOs, manufacturers preparing for
  Digital Product Passports, and retailers facing market-surveillance scrutiny. Inferred from
  `about.paragraphs`, `caseStudies` copy, and `contact.subtitle` naming "Catalonia, Spain, and the
  European Union".
- The reader is evaluating **credibility** in under a minute, not learning a product. There is no
  pricing, no product features, no sign-up. Inferred from the absence of any pricing/product routes.
- Language selection matters: a Catalan-first visitor is plausible given the location copy. Inferred from
  ca being a shipped locale with hand-written (not machine) translations.

**Primary user goals** (inferred):

1. Decide whether this person can solve *my* compliance/data problem.
2. Find evidence (a case study with jurisdictions, scale and outcome).
3. Establish a next step with low commitment (email, form, or a 30-minute call).

**Explicitly not inferred:** no analytics exist, so no claim is made about traffic sources, device mix,
drop-off, or conversion rate. Any statement about "most users" in this document is absent by design.

---

## 3. Current UI Architecture

### Rendering model

| Item | Value | Evidence |
| --- | --- | --- |
| Framework | Astro `7.4.0` | `dist/index.html` `<meta name="generator" content="Astro v7.4.0">` |
| Output | `output: 'static'`, `trailingSlash: 'ignore'`, `build.format: 'directory'` | `astro.config.mjs` |
| Client JS | Two small inline modules: header toggle, form submit. Plus third-party `api.js`. | `SiteHeader.astro`, `ContactForm.astro` |
| Islands | **None.** No framework integration is installed. | `package.json` — only `astro` + `@astrojs/sitemap` in `dependencies` |
| Styling | Tailwind 4 via `@tailwindcss/vite`, CSS-first `@theme`, one global stylesheet, **zero component `<style>` blocks** | `src/styles/global.css`; `grep` for `<style` returns nothing |
| Typography plugin | `@tailwindcss/typography` (`prose`, `prose-sm`, `dark:prose-invert`) | `global.css`, `ServiceCard.astro`, `CaseStudy.astro` |
| Fonts | `@fontsource-variable/inter` — 7 `@font-face` subsets, all `font-display: swap`, **no preload** | built CSS; 0 `rel="preload"` in `dist/index.html` |

### Routes (7 prerendered files)

| URL | File | Header/Footer? |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | yes |
| `/ca/`, `/es/` | `src/pages/[lang]/index.astro` | yes |
| `/404.html` | `src/pages/404.astro` | **no** |
| `/contact/thanks/` | `src/pages/contact/thanks.astro` | **no** |
| `/ca/contact/thanks/`, `/es/contact/thanks/` | `src/pages/[lang]/contact/thanks.astro` | **no** |
| `POST /api/contact` | `src/worker/index.ts` | n/a |

### Design tokens (`src/styles/global.css`)

```
@theme
  --color-bg      #ffffff   (dark #101114)
  --color-fg      #1a1a1a   (dark #f2f3f5)
  --color-muted   #5b6470   (dark #9aa3b0)
  --color-accent  #0b5fff   (dark #7aa7ff)
  --color-border  #e4e7ec   (dark #262a31)
  --color-surface #f7f8fa   (dark #16181d)
  --font-sans     'Inter Variable', system-ui, …
:root
  color-scheme: light dark
  --measure: 68ch           ← declared, never referenced anywhere
```

Dark mode is a `@media (prefers-color-scheme: dark)` override of the same custom properties inside a
plain `:root` block (because `@theme` cannot contain media queries — documented in-file). There is **no**
manual theme switch and **no** `.dark` class. Tailwind's `dark:` variant resolves to
`prefers-color-scheme`, which is why the two `dark:prose-invert` usages do work.

**One concern:** `--color-border` serves two incompatible purposes — decorative hairlines (header/footer
rules, card outlines) *and* the boundary of every form control. Those have different contrast
requirements. This is the root cause of UX-002.

### Breakpoints and layout

Measured inventory of responsive prefixes across `src/`:

```
$ grep -rohE '\b(sm|md|lg|xl|2xl):' src/ | sort | uniq -c
     19 sm:
```

**There is exactly one breakpoint in the whole system (640 px).** No `md:`, `lg:`, `xl:`.

Container classes are copy-pasted, not shared:

```
$ grep -rohE 'max-w-[a-z0-9]+' src/ | sort | uniq -c
     10 max-w-2xl      ← 672 px, prose blocks
      1 max-w-3xl
      9 max-w-5xl      ← 1024 px, page container
      2 max-w-none
```

### Architecture map

```
                        astro.config.mjs (site, i18n, CSP, sitemap)
                                     │
                 src/i18n/config.ts ◄┘   locales / localizedPath / stripLocale
                          │
                  src/layouts/BaseLayout.astro
                  ├─ <head> title, description, canonical + hreflang,
                  │        OG/Twitter, JSON-LD (lib/schema.ts), CSP meta
                  ├─ slot "header" ─────────────►  SiteHeader.astro
                  │                                  ├─ brand <a href="#top">
                  │                                  ├─ button#nav-toggle (+ inline JS)
                  │                                  ├─ nav[Primary navigation] ─► 4 × <a href="#…">
                  │                                  ├─ LanguagePicker.astro ────► nav[Select language] 3 × <a>
                  │                                  └─ a → bookingUrl (external)
                  ├─ <main id="top">
                  │     └─ slot
                  └─ slot "footer" ─────────────►  SiteFooter.astro (tagline + © only)

  Pages filling header/footer:  index.astro, [lang]/index.astro
     └─ HomeSections.astro (single page, 5 sections, all data fetched at build)
          ├─ Hero.astro            #hero implicit   h1 + 2 CTA + <dl> 3 metrics
          ├─ <section id=services>                    h2 → ServiceCard.astro ×3   (h3 + prose)
          ├─ <section id=work>                        h2 → CaseStudy.astro   ×3   (h3 + <dl> + prose)
          ├─ <section id=about>                       h2 → h3 + <ul> competencies
          └─ <ContactSection.astro id=contact>         h2 + slot + <dl> 2 items
                └─ ContactForm.astro  (5 fields + honeypot + Turnstile + status p + inline JS)

  Pages with NO header/footer:  404.astro (3 hidden-per-locale sections + inline JS locale switch)
                                contact/thanks.astro, [lang]/contact/thanks.astro

  Content:  src/content/services/*.{en,ca,es}.md       (no headings)
            src/content/caseStudies/*.{en,ca,es}.md    (three ### headings each)
            schema: src/content.config.ts
  Worker:   src/worker/index.ts  → POST /api/contact → 303 to THANKS_PATH[lang]
```

### Interaction behaviour present today

| Behaviour | Where | Notes |
| --- | --- | --- |
| Mobile nav toggle | inline script in `SiteHeader.astro` | `classList.toggle('hidden')`, no Escape, no outside-click, no focus move |
| Form submit | inline script in `ContactForm.astro` | `checkValidity()` gate → `fetch` → `location.assign(response.url)` on success |
| Turnstile reset | same script | explicitly resets on failure because tokens are single-use |
| 404 locale switch | inline script in `404.astro` | rewrites `<html lang>`, `<title>`, description, unhides one section |
| Scroll-to-section | native fragment navigation | no scroll-spy, no `aria-current` |

### Existing tests

**None.** `package.json` has no test runner. CI (`.github/workflows/ci.yml`) runs, in order:
`npm ci` → `npm audit --audit-level=high` → `format:check` → `check` → `lint` → `check:placeholders` →
`build` → upload `dist`. `astro check` reports 30 files; `eslint` lints 19 files with 34
`astro/jsx-a11y/*` rules at error level. There is **no** browser test, no axe run, no visual regression,
and no assertion about rendered semantics. This is the single largest structural gap for a UI plan: the
three confirmed AA barriers below would all pass the current gate.

---

## 4. Primary User Journeys

### J1 — Arriving on the homepage

- **Goal:** decide within seconds whether this person is relevant.
- **Entry:** `/`, `/ca/`, `/es/`.
- **Current flow:** hero badge → `h1` (two-line, second line accent) → subtitle → two CTAs → three metrics.
- **Friction:** the primary CTA ("Book Technical Consultation") leaves the site *before* the visitor has
  read any evidence; the secondary CTA ("Explore Case Studies") is the better first step for a cold
  reader but is styled as the weaker action. This is a **product/design decision**, not a defect.
- **Accessibility:** no skip link; `h1` is 36 px at 320 px and wraps without overflow (verified at 375 px).
- **Desired:** unchanged layout; documented CTA intent; no imposed redesign.

### J2 — Understanding the site's purpose

- **Goal:** map "what they do" to "my problem".
- **Entry:** hero + Services section.
- **Current flow:** eyebrow → `h2` → subtitle → three `ServiceCard`s, each `tag + h3 + summary + prose`.
- **Friction:** at 640 px each card is **176 px wide with 24 px padding → 128 px of text ≈ 17 characters
  per line** (measured). At 768 px it is 219 px ≈ 22 characters. Reading three prose cards at 17 ch is a
  real comprehension cost.
- **Accessibility:** card headings are `h3` under `h2`; correct here.
- **Desired:** cards reflow at a column width that keeps prose legible (§8).

### J3 — Navigating to important content

- **Goal:** jump to Services / Case Studies / About / Contact.
- **Entry:** header nav (4 fragment links) or mobile menu.
- **Current flow:** anchors scroll to `#services`, `#work`, `#about`, `#contact`.
- **Friction:**
  - No indication of which section you are in (`aria-current` is `null` on all four — measured).
  - The header is **not sticky**, so after scrolling into the page (16,779 px tall at 375 px) there is no
    navigation and no back-to-top; the only route back is the browser.
  - Switching language deep in the page returns you to the top, because `LanguagePicker` rebuilds the href
    from `stripLocale(pathname)` and the fragment is not part of the build-time URL.
- **Accessibility:** 4 nav links + 3 language links + 1 CTA precede `<main>` with no bypass mechanism.
- **Desired:** current-section indication, a persistent-or-reachable navigation affordance, and
  hash-preserving language switches.

### J4 — Finding contact information

- **Goal:** get an email address or book a call without filling a form.
- **Entry:** nav "Contact", the calendar CTA in header/hero, or scrolling.
- **Current flow:** `#contact` → form → "or schedule directly" → big accent calendar button → `<dl>` with
  *Direct Email* and *Headquarters*.
- **Friction:** the email address sits **below** the entire form and below a primary-styled button; the
  `<dl>` declares `sm:grid-cols-3` but contains only 2 items, leaving a dead 176 px column at 640 px.
  The footer offers no contact affordance at all.
- **Accessibility:** the `mailto:` link is 17 px tall (measured) — below the 24 px target size, relying on
  the spacing exception.
- **Desired:** contact details discoverable from the footer and from the top of the contact section.

### J5 — Completing the contact form

- **Goal:** send a message and be certain it arrived.
- **Entry:** `#contact` form.
- **Current steps:** 5 required fields → Turnstile → submit → `fetch` → 303 → localized thanks page.
- **Friction (measured):** see §7. Headline items: focus is lost (`activeElement === BODY`), no busy
  announcement, one generic error for seven outcomes, no field-level errors.
- **Trust:** no privacy statement, no statement of what happens to the data, Turnstile only explained as
  "Protected by Cloudflare Turnstile." placed below the submit button.
- **Desired:** defined state model (§7), persistent errors, focus preservation, distinct messaging.

### J6 — Recovering from validation errors

- **Goal:** fix the mistake without losing work.
- **Current flow:** empty submit → browser focuses the first invalid field (`name`) and shows a transient
  native bubble; five fields are invalid but only one is reported; no `aria-invalid`, no summary.
- **Friction:** all-or-nothing visibility; the message disappears on blur; the wording comes from the
  **browser locale**, not the page locale, so a Catalan page can surface an English or Spanish bubble.
- **Desired:** a single error summary at the top of the form, linked to each field, plus persistent inline
  messages, with `aria-invalid` and `aria-describedby` wired.

### J7 — Confirming successful submission

- **Goal:** know it worked and know what happens next.
- **Current flow:** navigate to `/contact/thanks/` (localized) with `<h1>Thank you — message received</h1>`
  and one back link.
- **Friction:** **no header, no footer, no navigation** — a dead end. The page is also indexable
  (canonical present, no `robots: noindex`, and it is listed in `sitemap-0.xml`).
- **Desired:** same chrome as the rest of the site, plus `noindex`.

### J8 — Navigating on mobile

- **Goal:** reach any section from a 375 px screen.
- **Current flow:** hamburger → panel.
- **Friction (measured):** the opened panel is **191 px wide at x = 145**, i.e. it appears *beside* the
  brand inside the same flex row rather than below it. `gap-4` and `flex-col` are inert because the panel
  resolves to `display: block` once `hidden` is removed.
- **Desired:** full-width panel below the brand row, with correct `flex` display, Escape to close, and
  `aria-expanded` kept in sync.

### J9 — Navigating using only a keyboard

- **Goal:** reach the form and submit it without a pointer.
- **Current flow:** Tab through brand → toggle (mobile) → 4 nav links → 3 language links → CTA → hero
  primary → hero secondary → … (every link in the page) before `<main>`.
- **Friction:** no skip link (0 found); after a failed submit focus is on `<body>`, so the user must
  re-traverse the whole document; the Turnstile iframe adds a focus stop outside the page's control.
- **Desired:** skip link first in tab order; focus restored to a meaningful element after every outcome.

---

## 5. Findings

Priority legend — **Impact:** Critical / High / Medium / Low / Opportunity. **Reach:** Global /
Multiple pages / Single journey / Single component / Edge case. **Confidence:** High (measured) /
Medium (evidence + unverified condition) / Low (needs research).

### [UX-001] No bypass mechanism; keyboard users traverse the whole header on every page

- **Type:** Accessibility barrier
- **Impact:** Critical
- **Reach:** Global
- **Confidence:** High
- **Affected users:** keyboard-only, switch-control, and screen-reader users
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** `document.querySelectorAll('a').filter(a => /skip/i.test(a.textContent))` → `0` matches.
  DOM order in `BaseLayout.astro` places `<slot name="header" />` before `<main id="top">`; the header
  contributes 8–9 focusable stops. WCAG 2.2 SC 2.4.1 (Level A).
- **Affected files or components:** `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`
- **Current behavior:** first Tab lands on the brand link; `<main>` is reachable only by tabbing past the
  nav, language picker, and booking CTA.
- **Desired behavior:** a "Skip to main content" link is the first focusable element in `<body>`, visually
  hidden until focused, positioned over the header when focused, and moves focus to `<main>`.
- **Architectural implications:** `<main>` needs `tabindex="-1"` so the fragment target is focusable; the
  brand link currently uses `href="#top"` targeting that same `<main>`, so both must be reconciled (see
  UX-015). The skip link belongs to the shared layout, not to each page.
- **Dependencies:** none
- **Status:** Confirmed

### [UX-002] Form controls have no perceivable boundary — 1.24:1 border contrast in both themes

- **Type:** Accessibility barrier
- **Impact:** Critical
- **Reach:** Single component (but it is the primary conversion surface)
- **Confidence:** High
- **Affected users:** low-vision users, users on dim screens or in sunlight, anyone in dark mode
- **Affected routes:** `/`, `/ca/`, `/es/` (the `#contact` section)
- **Evidence:** computed-style contrast, measured in the browser:
  - light: `input` border `rgb(228,231,236)` vs page `rgb(255,255,255)` → **1.24:1**; input background
    `rgb(247,248,250)` vs page → **1.06:1**; border vs its own input background → **1.17:1**
  - dark: border `rgb(38,42,49)` vs surface `rgb(22,24,29)` → **1.23:1**
  - WCAG 2.2 SC 1.4.11 requires ≥3:1 for the visual boundary of a UI component.
  - The same `--color-border` token also draws decorative rules, which have no such requirement.
- **Affected files or components:** `src/styles/global.css`, `src/components/ContactForm.astro` (`inputClass`)
- **Current behavior:** field boundaries are effectively invisible; only the caret and typed text reveal
  where a field starts, and the `<textarea>`/`<select>` are unrecognisable as controls.
- **Desired behavior:** a dedicated control-boundary token meets ≥3:1 against **both** the control fill and
  the page background in both themes, while decorative rules keep the current subtle value.
- **Architectural implications:** splits one overloaded token into two semantic tokens; every control must
  consume the control token. Focus indication must remain distinguishable **from** the new boundary (a
  3 px accent ring or a heavier outline offset), since border and focus currently use similar weights.
- **Dependencies:** none
- **Status:** Confirmed

### [UX-003] Horizontal overflow at 320 CSS px caused by the Turnstile widget's fixed width

- **Type:** Responsive defect / Accessibility barrier
- **Impact:** Critical
- **Reach:** Single journey (contact)
- **Confidence:** High
- **Affected users:** 320 px viewports, 400 % zoom users, small-window users
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** measured with viewport width 320:
  ```
  document.documentElement.scrollWidth = 324   (viewport 320, clientWidth 305 after scrollbar)
  form.getBoundingClientRect().width   = 257
  getComputedStyle(form).gridTemplateColumns = "300px"
  .cf-turnstile width = 300, left = 24
  ```
  At 375 px and above: `scrollWidth === clientWidth`, no overflow. WCAG 2.2 SC 1.4.10 (Reflow).
- **Affected files or components:** `src/components/ContactForm.astro`
- **Current behavior:** the widget's 300 px intrinsic width becomes the grid's min-content width, so the
  single-column grid is 300 px wide inside a 257 px container; the page scrolls sideways and every field
  is clipped by 19 px.
- **Desired behavior:** no horizontal scrolling at 320 px; the widget scales to the available width.
- **Architectural implications:** two independent remedies, both required: give the grid explicit
  `minmax(0, 1fr)` columns (or `min-w-0` on every grid child) **and** request Turnstile's flexible
  widget sizing. The second is a markup attribute change whose exact option must be confirmed against
  Cloudflare's current Turnstile documentation at implementation time — if a flexible mode is
  unavailable, the fallback is a wrapper with `overflow-x: auto` **plus** a documented exception, which
  is a worse outcome and should be raised before implementation.
- **Dependencies:** none (but touches the same file as Phase 2 — implement together)
- **Status:** Confirmed
- **Resolution note (2026-10-19, Phase 2):** partially fixed. The grid track is now 257 px instead of
  300 px (`grid-cols-1` + `min-w-0`), the widget requests `data-size="flexible"`, and the document no longer
  scrolls horizontally at 320 px. Cloudflare documents `flexible` as 100% width **with a 300 px minimum**,
  which is still wider than the 257 px content box, so the widget itself scrolls inside a
  `.turnstile-frame` region at the narrowest viewports. See Phase 2's deviation 2 for the options.

### [UX-004] Opened mobile navigation renders as a narrow column inside the header row

- **Type:** Responsive defect / Confirmed defect
- **Impact:** High
- **Reach:** Global on mobile
- **Confidence:** High
- **Affected users:** all touch users below 640 px
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** at 375 px after clicking `#nav-toggle`:
  ```
  #site-nav  display: block   x: 145   width: 191   height: 190
  flexDirection: column       (inert: the element is not a flex container)
  links measured 17 px tall, stacked vertically inside that 191 px column
  ```
  Markup: `class="hidden w-full flex-col gap-4 sm:flex sm:w-auto sm:flex-row sm:items-center"` — no base
  `flex`, so removing `hidden` yields `display: block`; the parent
  `mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4` has no `flex-wrap`, so the
  `w-full` panel shrinks into the same row as the brand and the toggle.
- **Affected files or components:** `src/components/SiteHeader.astro`
- **Current behavior:** menu content appears jammed beside the brand, over a 190 px tall column, with the
  page behind it still interactive.
- **Desired behavior:** activating the toggle reveals a full-width panel below the brand row; the panel
  contains the 4 section links, the language picker and the booking CTA in a single readable column.
- **Architectural implications:** the panel needs an explicit display mode for both states (not the
  presence/absence of a utility class), a wrapping header container, and a state hook the script can read.
  Adding Escape-to-close and outside-click close requires the script to also return focus to the toggle.
  This is the only interactive component besides the form; keep it framework-free.
- **Dependencies:** interacts with UX-015 (current-section indication) — both edit `SiteHeader.astro`.
- **Status:** Confirmed
- **Resolution note (2026-10-19, Phase 3):** fixed. The panel is attribute-driven (`data-open`), the
  header row wraps and the panel is `w-full`; measured 312/312 px wide and 76 px top vs a 51 px brand-row
  bottom at 375 px, with 44 px rows. Escape closes it and returns focus to the toggle.

### [UX-005] The pending state destroys focus, exposes no busy state, and has no in-flight guard

- **Type:** Accessibility barrier / Interaction defect
- **Impact:** High
- **Reach:** Single journey (contact)
- **Confidence:** High
- **Affected users:** keyboard users, screen-reader users, anyone on a slow connection
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** with the POST delayed 2.5 s by a request interceptor, measured 400 ms after clicking submit:
  ```
  { text: "Submitting...", disabled: true, ariaBusy: null, active: "BODY:" }
  ```
  After completion: `{ active: "BODY" }`. Source: the handler sets `submitButton.disabled = true`, which
  removes the focused element from the document's focus order; the `finally` block re-enables it but does
  not restore focus. There is no module-level "already submitting" flag, so `form.requestSubmit()`
  re-enters the handler and starts a second `fetch`.
- **Affected files or components:** `src/components/ContactForm.astro`
- **Current behavior:** the keyboard user is silently dropped to the document body mid-submission; screen
  readers announce neither the pending state nor (on success) any status; a programmatic second submit can
  double-post.
- **Desired behavior:** the submit control exposes a busy state programmatically, keeps focus (or moves it
  deliberately), cannot start a second concurrent submission, and is disabled only via a mechanism that
  does not remove it from the accessibility tree.
- **Architectural implications:** replaces `disabled` with `aria-disabled` + `aria-busy` plus a
  handler-level guard, which in turn requires the submit handler to ignore activation while pending
  (a native `disabled` button cannot be clicked at all, so the replacement must be a real guard).
  The status region already exists (`role="status" aria-live="polite"`) and should be reused.
- **Dependencies:** shares `ContactForm.astro` with UX-003, UX-006, UX-009; implement in one phase.
- **Status:** Confirmed

### [UX-006] Seven distinct server outcomes collapse into one sentence — and client/server validation disagree

- **Type:** Content problem / Interaction defect
- **Impact:** High
- **Reach:** Single journey (contact)
- **Confidence:** High
- **Affected users:** anyone who hits rate limiting, a Turnstile failure, or an email the server rejects
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:**
  - `src/worker/index.ts` returns distinct outcomes: `405`, `429` (rate limited), `415`, `413`, `400`
    (malformed/unexpected field/honeypot/elapsed/invalid field/invalid email), `403` (challenge
    missing/failed), `500` (challenge not configured), `502` (delivery failed).
  - The client prints `contactForm.dataset.errorMessage` for every non-`ok` response:
    ```
  statusText: "Something went wrong while sending your message. Please reach out directly via email."
  ```
  - The English string names no address; `ca`/`es` do
    (`'No s’ha pogut enviar el missatge. Podeu escriure directament a contact@vgr.cat.'`).
  - Client/server mismatch: the input allows `maxlength="2000"`, the worker caps email at `254`
    (`EMAIL_MAX_LENGTH`) and rejects punycode TLDs (`EMAIL_DOMAIN = /…[A-Za-z]{2,63}$/`), so a
    browser-valid address can be refused with the generic message and no field indication.
  - `MIN_ELAPSED_MS = 3000` rejects very fast (autofill-then-submit) submissions with the same generic text.
- **Affected files or components:** `src/components/ContactForm.astro`, `src/i18n/{en,ca,es}.ts`
- **Current behavior:** the user cannot tell "wait a minute and retry" from "your email is wrong" from
  "our mail provider is down"; retry advice is identical in all cases.
- **Desired behavior:** each outcome maps to a specific, localised message with an explicit next action;
  rate limiting states when to retry; delivery failure offers the direct email **as a link**; validation
  failures identify the field. Implemented by branching on `response.status` (see §13 D-3) so **no**
  recorded Worker response body changes.
- **Architectural implications:** requires a message map keyed by outcome, not a single `data-` attribute;
  requires the i18n `contact.form` shape to grow new keys in all three dictionaries (parity is enforced by
  `astro check`). Field-level error copy must mirror the server's rules so the two cannot drift silently.
- **Dependencies:** UX-009 (field errors) and UX-005 (state model) — one implementation unit.
- **Status:** Confirmed

### [UX-007] Case-study document outline is flattened and its content is duplicated

- **Type:** Accessibility barrier (structure) / Content problem
- **Impact:** High
- **Reach:** Multiple components (three case studies × three locales)
- **Confidence:** High
- **Affected users:** screen-reader and keyboard users navigating by heading; every reader (duplication)
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** extracted outline of the rendered page:
  ```
  H2 Featured Technical Deployments
  H3 Automated Market Surveillance Tooling for EU Verification
  H3 The Problem
  H3 The Technical Approach
  H3 The Impact
  H3 Architecting the Pan-European Topten Infrastructure
  H3 The Problem
  …
  ```
  `CaseStudy.astro` emits the card title as `h3` and then renders markdown whose first three headings are
  `###` (`grep -rnE '^#{1,6} ' src/content/` → every case study uses `###` for all three). So the
  sub-sections are *siblings* of their own case-study title, not children of it.
  Additionally the `<dl>` already prints `problem` / `approach` / `outcome` as `<dt>/<dd>`, and the
  markdown then repeats "The Problem" / "The Technical Approach" / "The Impact" as prose — the same three
  ideas twice per case study, six times on the page. `#work` occupies 8,205 px at 375 px.
- **Affected files or components:** `src/components/CaseStudy.astro`,
  `src/content/caseStudies/*.{en,ca,es}.md` (9 files), `src/i18n/{en,ca,es}.ts` (`caseStudies.labels`)
- **Current behavior:** heading navigation jumps between sibling `h3`s with no nesting signal; readers scan
  duplicated blocks; the labels differ between the `<dl>` ("The Challenge") and the prose ("The Problem").
- **Desired behavior:** one heading level per role — section `h2` → case-study title `h3` → body parts
  `h4` — **or** remove the duplicated parts entirely and keep the prose as the canonical narrative.
- **Architectural implications:** this is a content-model decision, not only a markup change. Removing the
  `<dl>` deletes the `problem/approach/outcome` frontmatter fields from `content.config.ts` (a schema
  change that forces all 9 markdown files to be edited in the same commit). Keeping both requires
  demoting the markdown headings to `####`, which means editing all 9 files anyway. **Recommendation:**
  keep the `<dl>` as the scannable summary, drop the three prose headings and let the remaining prose
  carry the detail (see §13 D-5) — but this needs owner sign-off because it deletes authored copy.
- **Dependencies:** must land before UX-012 (grid change) to avoid two edits to the same component.
- **Status:** Confirmed (structure); the copy-removal decision is **Requires product input**

> **Re-evaluated 2026-10-19:** still open, but the rework changed its shape — `#work` now carries **13** `h3`
> (4 titles + 9 sibling prose), and the 4th article (`banco-estado-iot`) has **no** body headings, so the four
> articles no longer match each other. See **UX-029** in the Re-evaluation section. The recommended fix is
> unchanged; the cost of deferring it is now visible on the page.
>
> **Partially resolved 2026-10-19 (D-5b):** the outline defect is gone — each of the three long articles is
> now `H3` title + three `H4` sections, measured with no level skip, and the prose headings use the same
> three terms as the `<dl>`. The **duplication remains by decision**: the owner chose to keep both blocks now
> and delete the prose later, so UX-007 stays open until D-5 (A) is applied.

### [UX-008] The 404 and thanks pages are chrome-less dead ends; the 404 ships three `h1` elements

- **Type:** Information architecture / Confirmed defect
- **Impact:** High
- **Reach:** Multiple pages (three files)
- **Confidence:** High
- **Affected users:** anyone mistyping a URL, any visitor who submits the form
- **Affected routes:** `/404.html`, `/contact/thanks/`, `/ca/contact/thanks/`, `/es/contact/thanks/`
- **Evidence:** landmarks extracted per page:
  ```
  /404.html              landmarks: ["MAIN"]      headings: 3 × H1 (two carry hidden)
  /contact/thanks/       landmarks: ["MAIN"]      links: 1 ("Back to the home page")
  /ca/contact/thanks/    landmarks: ["MAIN"]      links: 1
  ```
  No `<header>`, `<nav>`, or `<footer>` on any of them, because the pages never fill `BaseLayout`'s
  `header`/`footer` slots. The 404 renders one section per locale, all in the DOM with `hidden` on the
  inactive ones; only one is visible, but three `h1`s exist in the document and any tool or AT that
  ignores `hidden` sees three.
  The thanks pages also carry `rel="canonical"` and **no** `robots` meta, and both appear in
  `dist/sitemap-0.xml`.
- **Affected files or components:** `src/pages/404.astro`, `src/pages/contact/thanks.astro`,
  `src/pages/[lang]/contact/thanks.astro`, `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`,
  `src/components/SiteFooter.astro`
- **Current behavior:** a mistyped URL offers exactly one recovery link; a post-submission visitor loses
  all navigation; search engines can index the confirmation page.
- **Desired behavior:** every page shares the same header/footer chrome; the 404's inactive locales are
  not `h1`s in the accessibility tree; the thanks pages are `noindex` and excluded from the sitemap.
- **Architectural implications:** requires a *page shell* concept so 404/thanks can be rendered with chrome
  without copying the nav array four times — the nav array is currently constructed inline in two page
  files. If the nav becomes a component that derives its own labels from `lang`, those two pages get
  chrome with two lines each. The sitemap filter needs a decision (see §13 D-7) because `@astrojs/sitemap`
  is configured at the integration level, not per page.
- **Dependencies:** UX-001 (the shell is where the skip link lives) and UX-016 (footer navigation).
- **Status:** Confirmed
- **Resolution note (2026-10-19, Phase 3):** fixed. 404 and thanks render `PageShell` (skip link, header,
  main, footer) and the 404 now has **one** `h1` — the three per-locale `<section>`s were replaced by one
  content block plus a JSON island the script reads to localize it.

### [UX-009] No persistent, programmatically associated validation feedback

- **Type:** Accessibility barrier / Interaction defect
- **Impact:** High
- **Reach:** Single component
- **Confidence:** High
- **Affected users:** screen-reader users, users of voice control, anyone who misses a transient bubble
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** per-field audit of the rendered form:
  ```
  name          required=true  id=null  aria-invalid=null  aria-describedby=null  wrappedInLabel=true
  email         required=true  id=null  aria-invalid=null  aria-describedby=null  wrappedInLabel=true
  organization  required=true  id=null  aria-invalid=null  aria-describedby=null  wrappedInLabel=true
  serviceType   required=true  id=null  aria-invalid=null  aria-describedby=null  wrappedInLabel=true
  message       required=true  id=null  aria-invalid=null  aria-describedby=null  wrappedInLabel=true
  ```
  Empty submit → `document.activeElement` is `name`, `form :invalid` lists all five, and the only feedback
  is the browser's own tooltip. The form has no `novalidate`, no error-summary element, and no live region
  for field errors (the single `role="status"` paragraph is used only for transport failures).
- **Affected files or components:** `src/components/ContactForm.astro`, `src/i18n/{en,ca,es}.ts`
- **Current behavior:** one error at a time; vanishes on blur; wording follows browser locale, not page
  locale; nothing is announced to a screen reader.
- **Desired behavior:** on submit, all invalid fields get a persistent message; a summary at the top of the
  form lists them as links; focus moves to the summary; each field exposes `aria-invalid="true"` and
  `aria-describedby` pointing at its message; fixing a field clears its message.
- **Architectural implications:** wrapping labels are valid and must be preserved (they already produce
  correct accessible names: `textbox "Your Name"`). Adding `id`/`aria-describedby` requires stable ids —
  generate them from the field name, not from a counter, so the markup stays deterministic across builds.
  Introducing `novalidate` is required to stop the native bubble competing with the summary; `required`
  must stay for semantics. Because `novalidate` removes the browser's client-side gate, the JS validator
  must cover the same rules the server enforces (this is the drift risk named in UX-006).
- **Dependencies:** UX-005, UX-006 — one phase.
- **Status:** Confirmed

### [UX-010] Without JavaScript the form can never succeed, and any failure renders raw JSON

- **Type:** Confirmed defect / Maintainability concern
- **Impact:** High
- **Reach:** Edge case (no-JS or JS-blocked users) with a severe failure mode
- **Confidence:** High
- **Affected users:** users behind restrictive proxies, corporate policy, or with JS blocked/erroring
- **Affected routes:** `/`, `/ca/`, `/es/` → `POST /api/contact`
- **Evidence:**
  - The form is a real `method="post" action="/api/contact"` form, so without the inline handler the
    browser posts natively — and the Worker answers `application/json` for every outcome. Verified live
    with a read-only request (**no form was submitted**):
    ```
    $ curl -s -i https://vgr.cat/api/contact | head -12
    HTTP/2 405
    content-type: application/json
    {"error":"Method not allowed"}
    ```
  - Even with the handler absent, the submission could not succeed: `elapsed` is populated only by JS, and
    the Worker rejects `elapsed < 3000` (`Number('') === 0`) with `400 Rejected`.
  - Turnstile cannot mint a token without JS either, so siteverify would reject the request regardless.
- **Affected files or components:** `src/components/ContactForm.astro`, `src/worker/index.ts`
- **Current behavior:** a no-JS visitor sees a working-looking form, submits it, and receives a raw JSON
  document with no branding, no navigation and no explanation.
- **Desired behavior:** without JS the form is not presented as usable; a static fallback offers the
  direct email and the booking link; the failure mode stops being a JSON document.
- **Architectural implications:** the cleanest CSP-safe technique is a class on `<html>` set by an
  Astro-hashed inline script (`html.js`) with `global.css` rules that show the fallback and hide the
  `requires-js` form when the class is absent. **Do not** use an inline `style` attribute or a `<style>`
  block inside `<noscript>` — the former is blocked by `style-src` (no `'unsafe-inline'`), and Astro's
  hashing does not cover markup inside `<noscript>`. A worker-side `Accept: text/html` branch is optional
  hardening, explicitly *not* required for correctness, and must leave `*/*` responses byte-identical.
  **Do not** loosen the `elapsed` gate: hiding the form removes the need.
- **Dependencies:** UX-005/UX-009 share the file.
- **Status:** Confirmed

### [UX-011] No privacy, data-handling or consent information on a form collecting personal data

- **Type:** Content problem / Product decision
- **Impact:** High (trust, and arguably legal exposure in the EU)
- **Reach:** Global
- **Confidence:** High that the content is absent; **Low** that any specific legal remedy is required
- **Affected users:** every prospective client — the audience is explicitly EU public bodies and agencies
- **Affected routes:** `/`, `/ca/`, `/es/`, `/contact/thanks/`
- **Evidence:** no privacy/legal/consent text exists anywhere in `src/` or `public/`
  (`grep -rinE 'privacy|privacitat|privacidad|gdpr|rgpd|cookie|consent|terms|legal' src/ public/` returns
  only unrelated words inside case-study prose and a code comment). There is no `/privacy` route. The only
  adjacent text is `contact.form.turnstile` = "Protected by Cloudflare Turnstile."
- **Affected files or components:** `src/components/ContactForm.astro`, `src/components/ContactSection.astro`,
  `src/components/SiteFooter.astro`, `src/i18n/{en,ca,es}.ts`, plus a new page if a policy is authored
- **Current behavior:** the visitor is asked for name, work email, organisation and a project description
  with no statement of purpose, retention, recipients (Cloudflare Email Service), or how to request
  deletion.
- **Desired behavior:** a short purpose/retention notice adjacent to the submit control, plus a linked
  privacy policy covering the form, email delivery, and analytics.
- **Architectural implications:** the notice is content, not UI machinery; the policy is a new static page
  that must share the page shell (UX-008) and appear in the footer (UX-016). **The content must be
  authored or approved by the site owner** — an implementer must not invent legal text.
- **Dependencies:** UX-008 (shell), UX-016 (footer). Blocks nothing technically.
- **Status:** Absence confirmed. **Requires product/legal input before implementation.**
- **Resolution note (2026-10-19):** the owner asked for the notice and a policy page to be authored by the
  implementer. `/privacy`, `/ca/privacy` and `/es/privacy` render with the shell, the footer carries a legal
  link, and the form shows a purpose/retention sentence above the submit control. The copy describes the
  real data flow and makes no legal claims, but it has **not** had a legal review.

### [UX-012] Three-column prose grids start at 640 px, yielding 176 px columns

- **Type:** Responsive defect
- **Impact:** Medium
- **Reach:** Multiple pages (single home page, four components)
- **Confidence:** High
- **Affected users:** tablet and small-laptop readers; everyone reading the long case studies
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** measured grid geometry:
  ```
  viewport 640:  service card width 176, padding 24 → prose ≈ 128 px ≈ 17 characters
                 case-study <dl> gridTemplateColumns "176.328px 176.328px 176.328px"
  viewport 768:  service card width 219, prose ≈ 22 characters
                 case-study <dl> columns 219 px each
  ```
  Three `sm:grid-cols-3` usages in `HomeSections.astro` (services) plus `CaseStudy.astro` and
  `ContactSection.astro`. At 1440 px the container is capped by `max-w-5xl` (1024 px), so nothing improves
  past 1088 px.
- **Affected files or components:** `src/components/Hero.astro`, `ServiceCard.astro`, `CaseStudy.astro`,
  `ContactSection.astro`, `HomeSections.astro`
- **Current behavior:** prose is squeezed into columns narrower than a phone screen at the exact widths
  where multi-column layout is supposed to help.
- **Desired behavior:** no prose-bearing column narrower than ~280 px; metrics/tags (short values) may go
  to three columns earlier than paragraphs.
- **Architectural implications:** introduces the design-system rule "prose columns ≥ 280 px" and requires
  at least one additional breakpoint, which the system currently does not use. It is a class-level change
  in five files, not a token change.
- **Dependencies:** UX-007 edits `CaseStudy.astro`; sequence after it.
- **Status:** Confirmed

> **Re-evaluated 2026-10-19 — the services half of this finding is RESOLVED.** The content rework changed
> `#services` to `md:grid-cols-2`, measured 2 columns at 768/1024/1440 with prose 291/419/426 px and single
> column at 375/640. **What remains open from UX-012:** the hero metrics `<dl>`, the `CaseStudy` `<dl>` and the
> `#contact dl` are all still `sm:grid-cols-3` (309 px columns measured at 1440 px). Do not re-apply the
> services change — it is already in the tree.

### [UX-013] The contact `<dl>` declares three columns but has two items

- **Type:** Visual inconsistency
- **Impact:** Medium
- **Reach:** Single component
- **Confidence:** High
- **Affected users:** all readers at ≥640 px
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** `#contact dl` → `gridTemplateColumns: "176px 176px 176px"` with
  `querySelectorAll('#contact dl > div').length === 2`. The third column is empty at every width ≥640 px.
- **Affected files or components:** `src/components/ContactSection.astro`
- **Current behavior:** the email and location blocks occupy the left two thirds; the right third is empty,
  which reads as a missing third item rather than a deliberate layout.
- **Desired behavior:** two columns, or a third real item (e.g. a response-time expectation).
- **Architectural implications:** trivial; if a third item is added it must exist in all three locales.
- **Dependencies:** UX-016 (footer may absorb contact details) — decide together.
- **Status:** Confirmed

### [UX-014] Every call to action is styled as the same primary button

- **Type:** Visual inconsistency
- **Impact:** Medium
- **Reach:** Single journey (conversion)
- **Confidence:** Medium (structure measured; the perceptual effect is a judgement)
- **Affected users:** any visitor deciding what to do next
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** the identical accent class string
  `rounded-md bg-accent px-6 py-3 font-medium text-bg hover:opacity-90` is repeated in `SiteHeader.astro`,
  `Hero.astro`, `ContactSection.astro` and `ContactForm.astro`. On one page that yields **five** primary
  buttons, three of which point at the same external booking URL (header, hero, contact section), and the
  form's submit button is styled identically to the booking button placed directly beneath it. The only
  secondary variant (`border border-border`) appears once, in the hero.
- **Affected files or components:** `SiteHeader.astro`, `Hero.astro`, `ContactSection.astro`,
  `ContactForm.astro`, `global.css`
- **Current behavior:** no button communicates "this is the one thing to do here"; in the contact section
  two identical-looking primary actions sit metres apart in the same visual column.
- **Desired behavior:** one primary action per region; secondary/tertiary variants for the rest; the submit
  button is primary within the form, and the booking alternative is visually secondary.
- **Architectural implications:** needs a `Button`-level primitive (variant × size) or a documented class
  contract. Keep the existing visual language (`rounded-md`, accent fill, `px-6 py-3`); this is a
  hierarchy change, **not** a restyle.
- **Dependencies:** Phase 1 (primitive) before this change.
- **Status:** Confirmed (structure); effect on conversion is a **hypothesis** needing analytics.

### [UX-015] No current-section indication; language switching loses the reader's position

- **Type:** Accessibility barrier (1.4.1 is not implicated, 2.4.8-adjacent) / Interaction defect
- **Impact:** Medium
- **Reach:** Multiple components
- **Confidence:** High
- **Affected users:** screen-reader users, users switching language mid-read
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** all four primary nav links carry `aria-current: null`; the language picker sets
  `aria-current="true"` (valid, but `"page"` is the accurate token for a page-level switch, and these are
  locale alternates rather than the current document). `LanguagePicker.astro` builds its href from
  `stripLocale(Astro.url.pathname)`, which never contains the fragment, so switching language from
  `/#work` lands on `/ca/` at scroll position 0 — a 16,779 px page at 375 px.
  The brand link points at `#top`, an in-page scroll target, not at the localised home.
- **Affected files or components:** `src/components/SiteHeader.astro`, `src/components/LanguagePicker.astro`,
  `src/layouts/BaseLayout.astro`
- **Current behavior:** a reader who switches language loses their place; nothing indicates which section
  is being viewed.
- **Desired behavior:** the in-page nav reflects the visible section both visually (weight/colour) and
  programmatically (`aria-current="location"` or `"true"` on the matching link); language links preserve
  the current fragment; the brand navigates to the localised home.
- **Architectural implications:** scroll-spy needs an `IntersectionObserver` in a small inline module —
  this is the third piece of client JS on the page and should be written to do nothing when
  `IntersectionObserver` is unavailable. Preserving the fragment needs a click-time handler that appends
  `location.hash` to each language href (build-time HTML cannot know it). Changing the brand href to the
  localised home leaves `<main id="top">` referenced only by the skip link, which is fine.
- **Dependencies:** `SiteHeader.astro` is also edited by UX-004 — same phase.
- **Status:** Confirmed
- **Resolution note (2026-10-19, Phase 3):** fixed. Scroll-spy sets `aria-current="location"` plus a weight
  and colour change; language links append the fragment at click time (verified `/#work` → `/ca/#work`
  landing at `#work`); the brand now points at the localized home. The picker's `aria-current="true"`
  (UX-026) was **not** touched — it belongs to no phase yet.

### [UX-016] The footer provides no navigation, contact, or language affordance

- **Type:** Information architecture
- **Impact:** Medium
- **Reach:** Global
- **Confidence:** High
- **Affected users:** every visitor at the end of a 16,779 px page
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** `SiteFooter.astro` renders exactly two `<p>` elements (tagline, copyright) inside a
  two-column flex row. It has no `<nav>`, no email, no booking link, no language links, no link to a legal
  page.
- **Affected files or components:** `src/components/SiteFooter.astro`
- **Current behavior:** the end of the page offers no next step; the only way back is scrolling up.
- **Desired behavior:** a footer with grouped links: sections, contact (mailto + booking), language, and
  legal (when it exists).
- **Architectural implications:** the footer must receive the same nav data the header uses, which argues
  for lifting navigation data out of the page files (§6). Adding six links also adds tab stops — acceptable
  only once the skip link (UX-001) exists, and the footer nav should carry its own `aria-label`.
- **Dependencies:** UX-001 (skip link first), UX-008 (shell).
- **Status:** Confirmed
- **Resolution note (2026-10-19, Phase 3):** fixed. Three `<nav>` groups (sections, contact, language) plus
  a legal slot that renders only when a policy page exists; the section links come from
  `src/lib/navigation.ts`, the same source the header reads.

### [UX-017] Failure-recovery copy is inconsistent between locales

- **Type:** Content problem
- **Impact:** Medium
- **Reach:** Multiple pages (all three locales)
- **Confidence:** High
- **Affected users:** English-locale visitors specifically
- **Affected routes:** `/` (the other two locales already behave correctly)
- **Evidence:**
  - `en.ts` → `errorMessage: 'Something went wrong while sending your message. Please reach out directly via email.'`
  - `ca.ts` → `errorMessage: 'No s’ha pogut enviar el missatge. Podeu escriure directament a contact@vgr.cat.'`
  - `es.ts` → same shape, address included.
  The English string tells the user to email someone without saying whom; the address is ~1,000 px further
  down the section.
- **Affected files or components:** `src/i18n/en.ts` (and the new outcome-keyed messages in all three)
- **Current behavior:** an English visitor is told to "reach out directly via email" with no address in view.
- **Desired behavior:** all locales name the address, and the message renders it as a `mailto:` link.
- **Architectural implications:** none beyond i18n parity; `astro check` will fail if only one dictionary
  changes, which is the desired guard.
- **Dependencies:** UX-006 (same keys).
- **Status:** Confirmed

### [UX-018] Third-party Turnstile script and iframe load on first paint, 15,000 px above the form

- **Type:** Performance-related UX
- **Impact:** Medium
- **Reach:** Global
- **Confidence:** High that it loads eagerly; **Low** about the real cost on the target audience
- **Affected users:** mobile and low-end device users; users who never reach the form
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** resource timings on a fresh load of `/`:
  ```
  /_astro/BaseLayout.6KT4yb6d.css                                  link    29,696 B decoded
  https://challenges.cloudflare.com/turnstile/v0/api.js            script  (blocked locally)
  /_astro/inter-latin-wght-normal.Dx4kXJAl.woff2                   css     48,256 B decoded
  https://challenges.cloudflare.com/cdn-cgi/…/iframe                 iframe  89 ms
  ```
  The widget also makes further requests that failed with `ERR_ABORTED`/`TurnstileError 110200` locally
  because `127.0.0.1` is not on the production sitekey's allowlist. `ContactForm` is the last section of
  the page (`#contact` top = 15,085 px at 375 px).
- **Affected files or components:** `src/components/ContactForm.astro`
- **Current behavior:** every visitor, including those who never scroll to the form, downloads and executes
  a third-party challenge script and spawns its iframe.
- **Desired behavior:** the Turnstile script loads when the form is about to be used (first focus/pointer
  interaction with the form, or when it enters the viewport by a wide margin), and the widget is
  initialised explicitly at that point.
- **Architectural implications:** switching from `api.js`'s automatic `.cf-turnstile` scanning to explicit
  rendering (`turnstile.render`) changes the reset path (`turnstile.reset(widgetId)`), which the current
  code relies on. Keep the existing single-use-token reset behaviour; it is correct and load-bearing.
  Third-party script + iframe is also a privacy consideration (UX-011).
- **Dependencies:** none; but the widget element must respect the 320 px fix (UX-003).
- **Status:** Confirmed that it is eager. Performance impact **requires production monitoring** to
  quantify and must not be stated as measured.

### [UX-019] A single 16,779 px page with no persistent navigation

- **Type:** Information architecture / Hypothesis
- **Impact:** Medium
- **Reach:** Global
- **Confidence:** Medium (length measured; effect on behaviour unmeasured)
- **Affected users:** mobile readers
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** section offsets measured on the rendered page:
  ```
  375 px:  height 16,779  services 1,376  work 5,532  about 13,737  contact 15,085
  1440 px: height  8,098  services   833  work 2,302  about  6,033  contact  6,721
  ```
  `#work` alone occupies 8,205 px at 375 px (over half the page), largely because of UX-007's duplication.
  The header is not sticky and there is no back-to-top control.
- **Affected files or components:** `SiteHeader.astro`, `HomeSections.astro`, `CaseStudy.astro`,
  `ServiceCard.astro`
- **Current behavior:** navigation exists only at the top of the page. Anchors in the header do provide
  jumps, so this is friction, not a blocker.
- **Desired behavior:** the page length drops materially after UX-007; a persistent (or
  appear-on-scroll-up) header/back-to-top control exists at least below `sm`.
- **Architectural implications:** a sticky header interacts with fragment scrolling — anchor targets need
  `scroll-margin-top` equal to the header height, or headings land under the header. No sticky element
  exists today, so this is genuinely new behaviour, not an adjustment.
- **Dependencies:** UX-007 first (length), UX-004 (header structure).
- **Status:** Length **confirmed**; the claim that length reduces contact completions is a **hypothesis**
  requiring analytics. Do not present it as a defect.

> **Re-evaluated 2026-10-19:** the page grew. At 375 px it is now **19,291 px** (was 16,779), `#work` is
> **9,027 px** (was 8,205) and `#contact` starts at **17,623 px** (was 15,085). Every figure quoted in §8 and J1
> from the original audit is stale and superseded by these.

### [UX-020] Confirmation pages are indexable and present in the sitemap

- **Type:** Content problem (SEO hygiene)
- **Impact:** Low
- **Reach:** Multiple pages
- **Confidence:** High
- **Affected users:** search-engine users, and anyone judging the site's polish from search results
- **Affected routes:** `/contact/thanks/`, `/ca/contact/thanks/`, `/es/contact/thanks/`
- **Evidence:** `dist/sitemap-0.xml` contains `<loc>https://vgr.cat/ca/contact/thanks/</loc>`,
  `<loc>https://vgr.cat/contact/thanks/</loc>`, `<loc>https://vgr.cat/es/contact/thanks/</loc>`. The thanks
  pages emit `rel="canonical"` and no `<meta name="robots">` (extracted: `robots: "absent"`).
- **Affected files or components:** `src/pages/contact/thanks.astro`, `src/pages/[lang]/contact/thanks.astro`,
  `astro.config.mjs` (sitemap filter)
- **Current behavior:** "Message sent" pages are crawlable and listed.
- **Desired behavior:** `noindex` on the pages and exclusion from the sitemap.
- **Architectural implications:** `BaseLayout` already supports `noindex`; use it. Filtering the sitemap
  happens in `astro.config.mjs`, which is governed by
  `.github/instructions/astro-config.instructions.md` — read that file before editing, and do not touch
  the CSP block while adding a `filter`.
- **Dependencies:** none.
- **Status:** Confirmed

### [UX-021] Body text runs to ~83 characters while an unused 68ch measure token exists

- **Type:** Visual/typography concern
- **Impact:** Low
- **Reach:** Global
- **Confidence:** High (width measured); the readability effect is established typographic guidance, not a
  measured user outcome
- **Affected users:** readers of the long About/Services prose
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** `#about p.text-muted` → `getBoundingClientRect().width === 672` at `16px` font-size; 672 px
  ÷ ~8.1 px average advance ≈ 83 characters. `--measure: 68ch` is declared in `:root` and referenced
  **nowhere** (`grep -rn -- '--measure' src/` returns only the declaration).
- **Affected files or components:** `src/styles/global.css`, `HomeSections.astro`, `ContactSection.astro`
- **Current behavior:** prose blocks use `max-w-2xl` (672 px) at every width; the intended measure token is
  dead.
- **Desired behavior:** prose constrained by the existing token (68ch) or an equivalent, consistently.
- **Architectural implications:** either consume `--measure` or delete it. Consuming it makes line length a
  token rather than a per-component guess. Note 68ch at 16px ≈ 550 px, which changes the visual rhythm —
  verify against the hero subtitle (currently `text-lg`, 20 px) so headline and body do not end up with
  wildly different measured widths.
- **Dependencies:** none.
- **Status:** Confirmed as a measured inconsistency; classification as a defect is **not** asserted (§13 D-9).

### [UX-022] Container and button styling are duplicated rather than shared

- **Type:** Maintainability concern
- **Impact:** Low (user-facing), Medium (change safety)
- **Reach:** Global
- **Confidence:** High
- **Affected users:** future maintainers; indirectly every visitor, because drift is already visible
  (UX-014's five identical primaries, UX-013's empty column)
- **Affected routes:** all
- **Evidence:** `mx-auto max-w-5xl px-6` appears 9 times across 6 components; the accent button class
  string appears 4 times; `max-w-2xl` appears 10 times. There is no `Container`, `Button`, `Section`, or
  `Nav` component. Page-level nav arrays are constructed twice in page files.
- **Affected files or components:** all of `src/components/`, `src/pages/index.astro`,
  `src/pages/[lang]/index.astro`
- **Current behavior:** one design decision lives in 6–10 places.
- **Desired behavior:** presentational primitives own layout and control styling; components own content.
- **Architectural implications:** adding components to a repo that has none is the main structural change
  in this plan. It must stay minimal (see §6) — four small primitives, no prop-explosion, no variants the
  site does not use.
- **Dependencies:** Phase 1; everything else benefits.
- **Status:** Confirmed

### [UX-023] Five translation keys are defined in all three locales and referenced nowhere

- **Type:** Maintainability concern / Content problem
- **Impact:** Low
- **Reach:** Multiple components
- **Confidence:** High
- **Affected users:** future translators (they must translate strings that never render); users, because
  useful affordances were specified but never wired up
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** `grep` across `src/` finds `namePlaceholder`, `emailPlaceholder`, `messagePlaceholder`,
  `successMessage`, `services.ctaLearnMore` only inside `en.ts`, `ca.ts`, `es.ts` — never in a component.
  `organizationPlaceholder` *is* used, so the omission is partial and inconsistent: the organisation field
  has an example value, the name and email fields do not.
- **Affected files or components:** `src/i18n/{en,ca,es}.ts`, `src/components/ContactForm.astro`
- **Current behavior:** three of five fields have no example/format hint; `ctaLearnMore` implies a
  per-service "view related case study" link that does not exist, so services and case studies are not
  cross-linked at all.
- **Desired behavior:** decide per key — wire it up (placeholders as `aria-describedby` hints rather than
  placeholder-only labels, and a service→case-study link) or delete it. Do not leave both.
- **Architectural implications:** `successMessage` is dead **by design** (success navigates to a thanks
  page). Removing it is the honest fix; keeping it invites someone to implement an inline success state
  that would silently diverge from the worker's 303. Record whichever choice is made.
- **Dependencies:** UX-006 (the form's key set changes anyway).
- **Status:** Confirmed
- **Resolution note (2026-10-19):** resolved by deletion. `successMessage`, `ctaLearnMore`,
  `namePlaceholder`, `emailPlaceholder` and `messagePlaceholder` were removed from all three dictionaries
  (`grep` → 0). The organisation field keeps its example value; the other fields carry visible hints instead
  of placeholders.

### [UX-024] No transition or pressed state anywhere; no reduced-motion convention recorded

- **Type:** Visual inconsistency / Maintainability concern
- **Impact:** Low
- **Reach:** Global
- **Confidence:** High
- **Affected users:** pointer users (no feedback), vestibular-sensitive users (nothing to suppress yet)
- **Affected routes:** all
- **Evidence:** scanning every loaded stylesheet for `transition`/`animation` returns **zero** rules;
  `prefers-reduced-motion` appears in no stylesheet. Hover feedback is limited to `hover:opacity-90` on
  accent buttons and `hover:text-accent` on links. No `active:` state exists.
- **Affected files or components:** `src/styles/global.css`, `SiteHeader.astro`, `Hero.astro`,
  `ContactSection.astro`, `ContactForm.astro`
- **Current behavior:** state changes are instantaneous; a pressed accent button is visually identical to a
  hovered one.
- **Desired behavior:** short, consistent transitions on colour/opacity only, an explicit pressed state,
  and a global `@media (prefers-reduced-motion: reduce)` rule that is present **before** any non-trivial
  motion is introduced (including the scroll-spy and any scroll-behaviour change).
- **Architectural implications:** transitions belong to the button/link contract, not to individual
  components. Do not add `scroll-behavior: smooth` globally without a reduced-motion guard.
- **Dependencies:** Phase 1 (primitives).
- **Status:** Confirmed (absence); adding motion is an **opportunity**, not a defect fix.

### [UX-025] Fonts are not preloaded; seven subsets are declared but one is fetched

- **Type:** Performance-related UX (code-level risk)
- **Impact:** Low
- **Reach:** Global
- **Confidence:** High for the measurements; **Low** for the CLS claim (not measured)
- **Affected users:** cold-cache visitors on slow connections
- **Affected routes:** all
- **Evidence:**
  - Built CSS declares 7 `@font-face` rules, all `font-display: swap`.
  - On a fresh load only one file is fetched: `inter-latin-wght-normal.woff2`, 48,256 bytes decoded.
    `inter-latin-ext` (85,068 B), cyrillic (18,748 B), cyrillic-ext (25,960 B), greek (18,996 B),
    greek-ext (11,232 B) and vietnamese (10,252 B) are never requested for en; the bundle is 218,512 B in
    total but the **transfer** is one 48 KB file.
  - `grep -c 'rel="preload"' dist/index.html` → `0`.
  - No `size-adjust`/`ascent-override` metric-matching is used, so the fallback→Inter swap can shift text.
    `performance.getEntriesByType('layout-shift')` returned 0 entries, but the observer did not start at
    navigation start, so **this is not evidence of absence**.
- **Affected files or components:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- **Current behavior:** the font request is discovered only after the render-blocking stylesheet is parsed.
- **Desired behavior:** preload the one latin woff2 the site actually uses; consider trimming the unused
  subsets from the import so the CSS stops advertising files that can never be requested.
- **Architectural implications:** a `<link rel="preload" as="font" type="font/woff2" crossorigin>` in
  `BaseLayout` needs the **hashed** filename, which Astro only knows at build time — resolve via
  `import`/`?url` or an integration, and verify in a production build rather than in `dev` (where filenames
  are unhashed). Trim the subset import only after confirming Catalan characters (`·`, `’`, `à…ü`) fall in
  the `latin` range — the evidence above says they do, but re-verify on `/ca/` with the network panel.
- **Dependencies:** none; verify after Phase 2 so the contact page is measured in its final form.
- **Status:** Measurements confirmed; CLS **requires production monitoring**.

### [UX-026] Language picker uses `aria-current="true"` instead of `"page"`

- **Type:** Accessibility (minor conformance detail)
- **Impact:** Low
- **Reach:** Single component
- **Confidence:** High
- **Affected users:** screen-reader users
- **Affected routes:** all three home pages
- **Evidence:** `LanguagePicker.astro` renders `aria-current={isCurrent ? 'true' : undefined}`; the
  extracted DOM shows `EN — English=true`, others `null`. `"page"` is the token for the link representing
  the current page; `"true"` is the generic fallback.
- **Affected files or components:** `src/components/LanguagePicker.astro`
- **Current behavior:** announcements are correct but generic.
- **Desired behavior:** `aria-current="page"`, and the `sr-only` name separator changed from an em dash to
  a parenthetical so it is not read as punctuation.
- **Architectural implications:** none.
- **Dependencies:** UX-015 edits the same file.
- **Status:** Confirmed
- **Resolution note (2026-10-19):** fixed. The current locale is `aria-current="page"` and the screen-reader
text is `EN (English)` — verified on both the header and footer pickers.

### [UX-027] No imagery, client marks, testimonials or quantified case-study artefacts

- **Type:** Product/design decision (Opportunity)
- **Impact:** Opportunity — affects perceived credibility, which is the primary job of this page
- **Reach:** Global
- **Confidence:** Low (needs owner input; no user data)
- **Affected users:** cold B2B evaluators
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** zero `<img>` elements on any homepage. The only images are `favicon.svg/.ico` and
  `og/og-default.png`. Case-study outcomes are prose, not figures.
- **Affected files or components:** `CaseStudy.astro`, `Hero.astro`, possibly `src/assets/`
- **Current behavior:** a text-only page whose credibility rests on prose.
- **Desired behavior:** **No recommendation is made.** Adding client logos would require permission, and
  naming clients may conflict with the confidentiality of market-surveillance work.
- **Architectural implications:** if any image is added, it must carry intrinsic dimensions, a descriptive
  `alt`, and be served through Astro's image pipeline. Do not add stock imagery.
- **Dependencies:** none.
- **Status:** **Requires research / product decision.** Not a defect.

### [UX-028] Whether page length or CTA order affects conversion is unknown

- **Type:** Hypothesis requiring analytics
- **Impact:** Unknown
- **Reach:** Single journey (contact)
- **Confidence:** Low
- **Affected users:** all
- **Affected routes:** `/`, `/ca/`, `/es/`
- **Evidence:** Cloudflare Web Analytics is injected at the edge (documented in `BaseLayout.astro` and
  `AGENTS.md`), but no funnel, form-start, or form-abandon event exists anywhere.
- **Desired behavior:** instrument the form (start, field focus, validation failure, submission outcome) and
  the booking CTA, in a way that does **not** add a new third-party script.
- **Architectural implications:** Web Analytics' automatic beacon supports no custom events; a funnel needs
  either a beacon API call or a first-party counter. **Do not add a tracker in this plan.**
- **Dependencies:** needs a decision from the owner about analytics scope and privacy (UX-011).
- **Status:** **Requires research.**

---

## 6. Target UI Architecture

### Components to retain unchanged

`CaseStudy.astro` (structure retained, content model changes), `ServiceCard.astro`, `Hero.astro`,
`LanguagePicker.astro` (two attribute changes), `lib/schema.ts`, `src/worker/index.ts` (behaviour
retained; one optional branch).

### Components to modify

| Component | Change | Reason |
| --- | --- | --- |
| `BaseLayout.astro` | skip link, `<main>` focusability, font preload | UX-001, UX-025 |
| `SiteHeader.astro` | mobile panel states, sticky decision, `aria-current`, brand → home | UX-004, UX-015, UX-019 |
| `SiteFooter.astro` | grouped navigation, contact, language, legal | UX-016 |
| `ContactForm.astro` | state model, validation, error summary, focus, no-JS fallback, widget sizing, lazy Turnstile | UX-002, UX-003, UX-005, UX-006, UX-009, UX-010, UX-018 |
| `ContactSection.astro` | two-column `<dl>`, secondary CTA, contact-elements placement | UX-013, UX-014 |
| `HomeSections.astro` | consume `Section`/`Container`, breakpoint corrections, nav data extraction | UX-012, UX-022 |
| `404.astro`, `contact/thanks.astro`, `[lang]/contact/thanks.astro` | render with chrome, `noindex`, single `h1` | UX-008, UX-020 |
| `styles/global.css` | semantic tokens, measure, motion + reduced-motion, no-JS visibility | UX-002, UX-021, UX-024, UX-010 |
| `i18n/{en,ca,es}.ts` | outcome messages, field errors, helper text, footer labels, privacy link | UX-006, UX-009, UX-017, UX-023 |

### Components to consolidate

- **Container**: `mx-auto max-w-5xl px-6` → one primitive. 9 occurrences.
- **Button**: accent-primary and outline-secondary → one primitive with two variants. 5 occurrences of
  the primary string.
- **Prose measure**: `max-w-2xl` on prose → one `Prose` wrapper (or the `--measure` token). 10 occurrences.
- **Navigation data**: the `nav` array built in `index.astro` and `[lang]/index.astro` → one helper that
  takes a locale, so 404/thanks/footer can consume it.

### New components (only where genuinely needed)

| New component | Responsibility | Signature sketch |
| --- | --- | --- |
| `Container.astro` | horizontal rhythm and max width | `{ class?: string; as?: 'div' \| 'section' }` + `<slot />` |
| `Button.astro` | accent fill / outline / link styling, shared states | `{ href?: string; variant?: 'primary' \| 'secondary'; type?: 'button' \| 'submit' }` + `<slot />` |
| `PageShell.astro` | header + main + footer slots, skip link owner | `{ lang: Locale; nav: NavItem[]; … }` — used by home **and** utility pages |
| `FormField.astro` *(optional)* | label + control + error + description wiring | `{ name: string; label: string; error?: string; hint?: string }` + `<slot />` |
| `Prose.astro` *(optional)* | `prose prose-sm` + measure | `{ class?: string }` + `<slot />` |

`FormField` and `Prose` are **optional**. If five fields can be wired with a shared helper and a stable id
convention, skip them — fewer abstractions is the better outcome for a five-field form. Do not create a
design-system folder with unused variants.

### Token strategy

Extend `@theme` with **semantic** tokens; keep the existing raw palette names to avoid a mass rename.

| New token | Purpose | Requirement |
| --- | --- | --- |
| `--color-control-border` | boundary of every form control | ≥3:1 against `--color-control-bg` **and** `--color-bg`, both themes |
| `--color-control-bg` | control fill (currently `--color-surface`) | ≥3:1 against the page background, or a ≥3:1 boundary; do both if possible |
| `--color-danger` | validation error text and icon-free markers | ≥4.5:1 on both backgrounds |
| `--color-danger-border` | invalid control boundary | ≥3:1 (non-text) |
| `--color-success` | reserved for a future inline success state | ≥4.5:1 |
| `--space-section` | vertical section rhythm (replaces the `py-12` / `py-20` split) | one value, responsive |
| `--measure` | **already exists and must be consumed or deleted** | see UX-021 |
| `--duration-fast`, `--ease-standard` | hover/press transitions | must be neutralised by the reduced-motion rule |

**Constraint:** dark overrides cannot live in `@theme` (documented in `global.css` — Tailwind 4's `@theme`
does not accept `@media`). New tokens must be declared in `@theme` **and** overridden in the existing
`@media (prefers-color-scheme: dark) { :root { … } }` block, exactly like the current six colours. Skipping
the second step is the most likely mistake in this whole plan.

**Do not** introduce `light-dark()`; it would require a manual theme attribute to be useful and the site has
no theme switch.

### Styling ownership

- Tokens and element defaults: `src/styles/global.css` only. **No new global selectors for components.**
- Layout and control appearance: primitives (`Container`, `Button`).
- Component-specific composition: Tailwind utilities in the component.
- **No component `<style>` blocks** — the current codebase has zero, and adding one changes what Astro's CSP
  hashes. Keep that property.

### Interaction-state conventions

| State | Requirement |
| --- | --- |
| hover | colour/opacity only, via a 120–160 ms transition |
| focus-visible | 2 px accent outline with 2 px offset (already global) **plus** a clear distinction from the new control border |
| active/pressed | a darkened fill or 1 px translate; visually distinct from hover |
| disabled | reduced opacity **and** `aria-disabled`, never a bare `disabled` on a control the user is mid-interaction with |
| busy | `aria-busy="true"` on the region, label change, focus retained |
| error | `aria-invalid` + described-by message + summary entry + a non-colour indicator (text) |

### Form-state conventions

One module-level state variable, one render function, no duplicated `textContent` writes:

```
type ContactState =
  | { kind: 'idle' }
  | { kind: 'invalid'; errors: FieldError[] }
  | { kind: 'submitting' }
  | { kind: 'rate-limited'; retryAfter?: number }
  | { kind: 'challenge-failed' }
  | { kind: 'delivery-failed' }
  | { kind: 'unavailable' }
```

Transitions are one-way except from every terminal state back to `idle` on retry. Field values are never
cleared except after a confirmed success (which navigates away).

### Accessibility conventions (apply to every change in this plan)

1. Every interactive element has a programmatically determinable name; icons are `aria-hidden`.
2. No state is conveyed by colour alone — always accompanied by text.
3. Every dynamic change that matters is announced via the existing `role="status"` region or a new
   `aria-live` region; nothing announces a message with `assertive` except a hard error summary.
4. Focus is never left on `<body>` after an interaction.
5. `<h1>` exactly once per page; no level skips.
6. Every fragment target is reachable and does not hide under a sticky header (`scroll-margin-top`).
7. `prefers-reduced-motion` is honoured by every transition and any smooth scrolling.
8. Automated checks supplement manual keyboard and screen-reader passes; they never replace them.

---

## 7. Contact Form Specification

### Field structure

| # | Name | Type | Required | Autocomplete | Label (en) | Hint | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `name` | `text` | yes | `name` | Name | — | `maxlength=2000`; server rejects CRLF |
| 2 | `email` | `email` | yes | `email` | Work email | "We reply to this address." | server `maxlength` is **254** — mirror it |
| 3 | `organization` | `text` | yes | `organization` | Organisation | example placeholder exists today | keep |
| 4 | `serviceType` | `select` | yes | — | How can I help? | — | first option must **not** repeat the label |
| 5 | `message` | `textarea` | yes | — | Project overview | "Up to 2,000 characters." | `rows=5`, `maxlength=2000` |
| — | `lang` | hidden | — | — | — | — | drives the 303 target |
| — | `elapsed` | hidden | — | — | — | — | anti-bot timing; JS only |
| — | `form_guard` | text | — | `off` | — | — | honeypot, `tabindex="-1"`, `aria-hidden` |
| — | `cf-turnstile-response` | hidden | — | — | — | — | widget-managed |

Field order stays as-is: it already follows a natural narrative (who → how to reply → where → what kind →
detail).

**Do not** convert labels to placeholders. Wrapping `<label>` already produces correct accessible names
(`textbox "Your Name"`); keep that and add hints through `aria-describedby`.

### Labels and instructions

- The select's disabled first option currently duplicates the label text (`Primary Focus` / `Primary Focus`),
  producing `combobox "Primary Focus"` with `option "Primary Focus"` — replace with an action-shaped
  placeholder ("Select a focus area").
- Add the character limit as visible helper text (the limit is currently enforced only server-side).
- Keep the Turnstile notice, but move it adjacent to the widget and associate it with the widget container
  rather than leaving it as a footnote under the submit button.
- Add a one-line purpose/privacy notice immediately above the submit button (wording in §10) — **pending
  UX-011 approval**.

### Validation behaviour

- **On the form:** `novalidate` is added so the native bubble does not compete with the summary. `required`,
  `type="email"`, and `maxlength` remain in the markup for semantics and for assistive technology.
- **Timing:** validate on **submit only**. Re-validate a field **on blur** once it has already been marked
  invalid (so correction is acknowledged immediately), and clear its message on input once valid. Never show
  an error before the user has finished with a field for the first time.
- **Rules (must mirror `src/worker/index.ts`):**
  - all five fields non-empty after trim;
  - no `\r`/`\n` in any single-line field;
  - name/organization/message ≤ 2000 characters;
  - email ≤ 254 characters and matches the server's dot-atom local-part + label-validated domain rules.
    The client copy of this rule must be *imported or generated from one module* so it cannot drift; if a
    shared module cannot cross the `src/worker` ↔ `src/components` boundary cleanly, put the rule in
    `src/lib/` and import it in both. `astro check` must be the guard.
- **Summary:** after an invalid submit, render a summary at the top of the form: a heading
  ("Please fix N problem(s)"), a list of links, and `role="alert"` **or** `role="status"` — use `alert` only
  for a first invalid submit; subsequent updates stay `polite` so the user is not interrupted on every
  keystroke.
- **Association:** each control gets a stable `id` derived from its name, `aria-invalid="true"` when invalid,
  and `aria-describedby` listing its hint id and its error id in that order.
- **Preservation:** values are never cleared on a validation failure (confirmed today; keep it).

### State model

| State | Visible content | Control availability | Focus | Screen-reader announcement | Retry | Values |
| --- | --- | --- | --- | --- | --- | --- |
| **Idle** | empty form, submit enabled, status region empty | all enabled | user's choice | nothing | n/a | preserved if returning from a failure |
| **Invalid** | summary at top; per-field messages; invalid fields marked | all enabled | moved to the summary heading/container (`tabindex="-1"`) | summary reachable immediately; `alert` on first occurrence | fix and resubmit | **preserved** |
| **Submitting** | submit label → "Sending…"; form container `aria-busy="true"`; all fields `readonly`/`aria-disabled` (not `disabled`) | submit `aria-disabled="true"`; handler ignores re-entry | **unchanged** (still on the submit control) | polite "Sending your message" once | no new submit accepted | preserved |
| **Success** | navigation to the localized thanks page | n/a | browser default on the new page (`<h1>` present) | page title announced by the new document | n/a | irrelevant (left the page) |
| **Rate limited** (429) | summary: "Too many attempts. Please try again in about a minute." + direct email link | enabled | summary | assertive (first occurrence) | yes, after the stated wait | preserved |
| **Challenge failed** (403/400 + challenge) | summary: "The verification check failed. Reload the page and try again." + email link | enabled; Turnstile **reset** | summary | assertive | yes, requires reset | preserved |
| **Recoverable failure** (413/415/400 malformed, 502 delivery) | summary: outcome-specific sentence + `mailto:` link + booking link | enabled; Turnstile reset | summary | assertive | yes | preserved |
| **Non-recoverable / misconfiguration** (500) | summary: "The form is temporarily unavailable. Email …" | submit hidden or `aria-disabled` | summary | assertive | email instead | preserved |
| **Network unreachable** (`fetch` rejects) | summary: "Your connection dropped. Your message was not sent." + email link | enabled | summary | assertive | yes | preserved |

Two invariants: **focus must never end up on `<body>`**, and **the status region must carry exactly one
message at a time**.

### Loading behaviour

- The button keeps its size (fixed min-width or a spinner that does not reflow the row) so the layout does
  not jump when the label changes.
- No artificial delay, no skeleton, no overlay.
- If the request takes longer than ~10 s, append a polite note ("Still sending…") rather than aborting — the
  Worker's own Siteverify timeout is 10 s and a delivery attempt may still be in flight.

### Error recovery

- Every failure message names an action and includes real links: `mailto:contact@vgr.cat` and the booking
  URL. The address must be in the message, not 1,000 px below it (UX-017).
- Turnstile is reset on every failure (already implemented — preserve).
- The `elapsed` field is recomputed on each submit attempt; do not reuse a stale value.

### Success behaviour

- Keep the 303 → localized thanks page. It is the most robust option (no client-side duplicate success UI,
  works with back/forward, no double-submit ambiguity).
- The thanks page must have the site chrome and `noindex` (UX-008, UX-020).
- **Do not** add an inline success state; `i18n.contact.form.successMessage` exists for one and is unused
  (UX-023). Delete it or leave it clearly documented as reserved.

### Focus management

1. On invalid submit → focus the summary container (`tabindex="-1"`), not the first field. The user must
   hear *all* problems first.
2. Summary links move focus to the corresponding control and must also work with Enter/Space.
3. On transport failure → focus the summary (same rationale) but keep the submit control reachable next.
4. During submission → focus stays on the submit control.
5. On recovery → never move focus unless the user acted.

### Screen-reader announcements

- One `role="status" aria-live="polite"` region for progress and recoverable failures; `assertive` only for
  the first invalid-submit summary.
- Field errors are announced through `aria-describedby` when the field receives focus, not through a live
  region (avoids double speech).
- The pending state is conveyed by `aria-busy` on the form **and** a polite message, because `aria-busy`
  alone is inconsistently announced.

### Mobile behaviour

- Keyboard type: `email` → email keyboard; `text` → default; `textarea` → multi-line. Already correct.
- `autocomplete` values are present on three fields and correct; keep them (they enable one-tap fill).
- The widget must fit 320 px (UX-003); the submit button spans the form width below `sm` or keeps a
  ≥44 px touch height.
- Opening a keyboard must not hide the submit button behind a fixed element — there are no fixed elements,
  so this only becomes a risk if UX-019 introduces a sticky header.

### Privacy and trust messaging

- Adjacent to the submit control: one sentence of purpose and retention plus a policy link.
- Suggested shape (owner must approve the substance): "I use these details only to reply to your enquiry.
  No newsletter, no sharing. See the privacy policy."
- The Turnstile notice stays, because it explains why there is a widget.

---

## 8. Responsive Design Specification

Notation: all widths are CSS pixels. "Container" = the `max-w-5xl` wrapper with 24 px horizontal padding
(content width = viewport − 48, capped at 976 px).

### 320 px (and 400 % zoom at 1280 px)

- **Navigation:** brand + icon-only toggle on one row. The opened panel is **full width, below** that row.
  Links stack at 44 px rows.
- **Layout:** single column throughout. **Zero horizontal overflow** — the current 4 px overflow must go.
- **Content order:** identical to DOM order.
- **Typography:** `h1` 36 px / 1.15, `h2` 24 px, body 16 px / 1.6. No fluid clamp in this plan (the current
  type scale wraps acceptably at 320 px — verified at 375 px, not 320 px; re-verify).
- **Spacing:** section padding 48 px vertical; 24 px horizontal.
- **Form:** controls full width; **no 300 px fixed-width child**; the Turnstile widget fits the container;
  long `<select>` option labels must not force width — verify that the selected option text truncates
  gracefully rather than widening the control (the current select already has `min-w-0`; measure after the
  widget fix).
- **Images:** none.
- **Exceptional cases:** the longest German-length strings do not exist here, but Catalan `l·l` and `’` must
  render in Inter's latin subset (verified: only the latin file is fetched).

### 375 px

- Same as 320 px, plus: the current build is already overflow-free here; this is the regression baseline.
- Page height after UX-007 should fall materially from the measured 16,779 px; record the new number.

### 768 px

- **Navigation:** inline nav (≥640 px already switches). Language picker inline.
- **Layout:** service grid → **two columns** (not three); case-study `<dl>` → **stacked or two columns**, not
  three; contact `<dl>` → two columns.
- **Typography:** `h1` 48 px; prose measure capped by `--measure`.
- **Rule:** no prose column below 280 px at any width (UX-012).

### 1024 px

- **Layout:** three columns become acceptable (976 px content − 2 × 24 gaps = 928 ÷ 3 = 309 px).
- Container is at its `max-w-5xl` cap; this is the widest comfortable reading width for the hero.

### 1440 px

- **Layout:** identical to 1024 px plus 208 px of margin each side (measured container = 1024 px). This is a
  deliberate, documented choice — do **not** widen the container without checking prose measure.
- **Typography:** unchanged.
- **Exceptional cases:** if a sticky header is introduced (UX-019), confirm it does not span the full 1440 px
  while the content is 1024 px — a full-bleed bar over a centred column is acceptable, but the *scroll
  offset* must match the header height.

### Cross-cutting

- **Reflow:** 320 px at 400 % zoom must have no horizontal scroll except for genuinely 2-D content (there is
  none).
- **Layout shift:** any new sticky element, spinner, or font preload must be checked with a layout-shift
  budget of 0 for the header and hero.
- **Tap targets:** ≥24 × 24 CSS px for every control, or compliant spacing (SC 2.5.8). Current undersized
  items: 4 nav links (17 px tall) and the `mailto:` link (17 px tall) — both rely on the spacing exception
  today; give nav links vertical padding when the panel is redesigned.
- **Long content:** the `#work` section is the stress case; measure it after UX-007.

---

## 9. Accessibility Requirements

Verification column: **M** = manual, **A** = automated (axe/Playwright), **B** = both. No requirement is
marked verified by automation alone.

### Perceivable

| Requirement | WCAG | Component | Expected behaviour | Verify |
| --- | --- | --- | --- | --- |
| Control boundaries meet 3:1 | 1.4.11 | all form controls | border or fill distinguishes every control from the page in both themes | M+A (computed styles) |
| Text contrast ≥ 4.5:1 | 1.4.3 | global | already met (muted 6.00 light / 7.41 dark); must stay met after token changes | A |
| Reflow at 320 px | 1.4.10 | contact form, header | no horizontal scroll at 320 px or 400 % zoom | M+B |
| No colour-only meaning | 1.4.1 | form errors, current section | errors carry text; current section has weight/colour **and** `aria-current` | M |
| Reduced motion honoured | 2.3.3 (AAA) / best practice | transitions, scroll-spy | any motion is suppressed under `prefers-reduced-motion: reduce` | M |
| Text resizes to 200 % | 1.4.4 | global | no clipping or overlap at 200 % text-only zoom | M |

### Operable

| Requirement | WCAG | Component | Expected behaviour | Verify |
| --- | --- | --- | --- | --- |
| Bypass blocks | 2.4.1 (A) | layout | skip link is the first tab stop and moves focus to `<main>` | M |
| Keyboard operable | 2.1.1 (A) | header, form, links | every control reachable and activatable; no trap | M+B |
| No keyboard trap | 2.1.2 (A) | Turnstile iframe | Tab leaves the challenge iframe both ways | M |
| Focus visible | 2.4.7 (AA) | all | 2 px outline on every focusable element, including inside the new panel | M |
| Focus not obscured | 2.4.11 (AA) | sticky header (if added) | focused element is not hidden under the header; `scroll-margin-top` | M |
| Focus order | 2.4.3 (A) | form | focus moves to the summary on invalid, never to `<body>` | M+B |
| Target size | 2.5.8 (AA) | nav, mailto | ≥24 px or compliant spacing | A+M |
| Page titles | 2.4.2 (A) | all 7 pages | each page has a distinct, descriptive `<title>` (already true) | A |
| Link purpose | 2.4.4 (A) | language picker, footer | names are unambiguous out of context | M |

### Understandable

| Requirement | WCAG | Component | Expected behaviour | Verify |
| --- | --- | --- | --- | --- |
| Language of page | 3.1.1 (A) | 404 | `<html lang>` matches the visible locale; without JS the English section is the only one shown and `lang="en"` is correct | M |
| Language of parts | 3.1.2 (AA) | language picker | each locale link carries `lang` (already true) | A |
| Labels or instructions | 3.3.2 (A) | form | every control has a visible label; hints are described-by | M |
| Error identification | 3.3.1 (A) | form | every error is described in text, at the field and in the summary | M+B |
| Error suggestion | 3.3.3 (AA) | form | messages state what to do next; rate limiting states when to retry | M |
| Consistent navigation | 3.2.3 (AA) | all pages | header/footer order identical on every page, including 404/thanks | M |
| Consistent identification | 3.2.4 (AA) | buttons | the same action has the same label everywhere ("Book…" vs "Schedule Call" must be reconciled) | M |

### Robust

| Requirement | WCAG | Component | Expected behaviour | Verify |
| --- | --- | --- | --- | --- |
| Name, role, value | 4.1.2 (A) | header toggle, submit, select | toggle exposes `aria-expanded`; submit exposes busy state; select exposes its label | A+M |
| Status messages | 4.1.3 (AA) | form | one polite region for progress; assertive only for the first error summary | M |
| Valid, non-duplicated ids | 4.1.1 (deprecated but still useful) | form fields, fragment targets | ids unique; no duplicate `id="top"` | A |
| Parsing/ARIA correctness | 4.1.2 | all | no `aria-hidden` on focusable content; no `role="status"` wrappers around interactive elements | A |

**Explicit non-claims.** This document does **not** claim WCAG 2.2 AA conformance. Notably:
- `2.2.1`/`2.2.2` (timing) are not assessed — there is no time limit in the UI.
- `1.2.x` (media) is not assessed — there is no media.
- Screen-reader testing with NVDA/JAWS/VoiceOver is **not performed** and is required before any conformance
  claim (§16).

---

## 10. Content and Microcopy Changes

| # | Current wording | Proposed wording | Reason | Location |
| --- | --- | --- | --- | --- |
| C1 | `en.contact.form.errorMessage`: "Something went wrong while sending your message. Please reach out directly via email." | Split into `errorSummaryTitle`, `errorRateLimited` ("Too many attempts. Please try again in about a minute, or email contact@vgr.cat."), `errorChallenge` ("The verification check did not pass. Reload the page and try again."), `errorDelivery` ("The message could not be delivered. Email contact@vgr.cat or book a call instead."), `errorUnavailable` ("The form is temporarily unavailable. Email contact@vgr.cat."), `errorNetwork` ("Your connection dropped before the message was sent. Please try again.") | UX-006, UX-017: one sentence cannot describe seven outcomes; the EN string omits the address that CA/ES include | `src/i18n/{en,ca,es}.ts`, `ContactForm.astro` |
| C2 | Select's disabled first option: `Primary Focus` (identical to the label) | `Select a focus area` / `Trieu un àmbit` / `Seleccione un ámbito` | The rendered control announces the label twice | `contact.form.serviceTypePlaceholder` (new key) |
| C3 | (absent) | Message field hint: "Up to 2,000 characters." | A server-enforced limit is invisible to the user | `contact.form.messageHint` |
| C4 | (absent) | Email hint: "We reply to this address." | Sets the expectation the thanks page then confirms | `contact.form.emailHint` |
| C5 | (absent in EN) | Error messages must contain `contact@vgr.cat` as a `mailto:` link in **all** locales | Recovery must be actionable in place | `contact.form.error*` |
| C6 | `contact.form.turnstile`: "Protected by Cloudflare Turnstile." placed after the status paragraph | Keep the wording; move adjacent to the widget and associate with it via `aria-describedby` | It explains the widget, not the submit button | `ContactForm.astro` |
| C7 | (absent) | Purpose/retention notice above submit, e.g. "I use these details only to reply to your enquiry — no newsletter, no third parties. Privacy policy." | UX-011; **owner must approve the substance** | `contact.form.privacyNotice` + new `/privacy` page |
| C8 | `caseStudies.labels.problem`: "The Challenge"; markdown heading: "The Problem" | One term only — use the `<dl>` labels and delete the prose headings (or rename the prose to `####` with the same labels) | UX-007: two names for one idea | `i18n` + 9 markdown files |
| C9 | `header.brand` link `href="#top"` | `href` = localised home (`/`, `/ca/`, `/es/`) | The brand should go home, not scroll | `SiteHeader.astro`, `PageShell` |
| C10 | Booking CTA labels: "Schedule Call" (header), "Book Technical Consultation" (hero), "Book a 30-min Technical Discovery Call" (contact), "or schedule directly" (divider) | One label for one action; keep the most specific ("Book a 30-min technical call") in the contact section and shorten the header to the same noun phrase | WCAG 3.2.4 consistency; four names for one destination | `i18n` |
| C11 | (absent) | Footer nav group labels: "Sections", "Contact", "Language", "Legal" | UX-016; a footer nav needs its own accessible name | `i18n.footer` |
| C12 | `LanguagePicker` SR text: `EN — English` | `EN (English)` | An em dash may be read as punctuation before the language name | `LanguagePicker.astro` |
| C13 | `contact.form.successMessage` (unused) | **Delete** | Dead by design — success navigates away (UX-023) | `i18n` |
| C14 | `services.ctaLearnMore` (unused) | Either implement a service→case-study link or **delete** | Dead key implying an affordance that does not exist | `i18n`, `ServiceCard.astro` |
| C15 | `namePlaceholder` / `emailPlaceholder` / `messagePlaceholder` (unused) | Use as **hints** (not placeholder-only labels) or delete; `organizationPlaceholder` is already used, so the inconsistency is visible in the UI today | UX-023 | `i18n`, `ContactForm.astro` |
| C16 | `errorMessage` for a misconfigured deploy (server 500) | Never surfaced as a validation error; "temporarily unavailable" copy | Avoid implying the user did something wrong | `ContactForm.astro` |

Wording rules for translators/agents: address the reader as "you" (EN) / *vós* (CA, matching existing copy) /
*usted* (ES); never invent legal text (C7); keep every sentence under ~120 characters so error summaries do
not become walls.

---

## 11. Implementation Plan

Phases are ordered so each leaves the application reviewable and shippable. Estimated effort uses
XS/S/M/L/XL from the prioritisation model.

### Phase 1: Token and primitive foundation

- **Goal:** create the shared vocabulary (semantic tokens + three primitives + skip link) without changing
  any behaviour or copy, so every later phase is a small, mechanical edit.
- **Prerequisites:** none.
- **Scope:** `global.css` tokens; `Container.astro`, `Button.astro`, `PageShell.astro`; skip link in the
  shell; replace duplicated container/button classes in the home page components only.
- **Files likely to change:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`,
  `src/components/{Container,Button,PageShell}.astro` (new), `src/components/{Hero,SiteHeader,SiteFooter,
  ContactSection,ServiceCard,CaseStudy,HomeSections}.astro`, `src/pages/index.astro`,
  `src/pages/[lang]/index.astro`.
- **Components likely to change:** all presentational ones, mechanically.
- **Detailed implementation tasks:**
  1. [x] Add the semantic tokens, with dark overrides — see the token-placement deviation below.
  2. [x] Control-border values chosen by measurement, not guesswork; numbers in the evidence block.
  3. [x] `Container.astro` added (`as` + `id` props) and every `mx-auto max-w-5xl px-6` replaced.
  4. [x] `Button.astro` added with `primary`/`secondary` variants, `md`/`sm` sizes and a shared
     hover/active/disabled treatment; all five call sites migrated, including the form submit.
  5. [x] `PageShell.astro` added; `BaseLayout` reduced to a document shell.
  6. [x] Skip link: first focusable element, `sr-only` until focused, `focus:fixed`, `href="#main-content"`.
  7. [x] Reduced-motion guard added. **`--measure` was deliberately not consumed** — see the deviation.
- **Explicitly out of scope:** form behaviour, error copy, breakpoint changes, footer content, 404/thanks
  chrome, Turnstile.
- **Risks:** introducing a component abstraction the codebase does not need; token duplication between
  `@theme` and the dark block (the single most likely regression). Mitigate by measuring contrast in a
  browser in both themes and pasting the numbers into the plan.
- **Acceptance criteria:**
  - [x] A skip link is the first Tab stop on `/`, `/ca/`, `/es/`, is invisible until focused, and moves focus
        to `<main>`.
  - [x] Every form control's boundary measures ≥3:1 against its own fill and the page background in light and
        dark themes (numbers recorded).
  - [x] No visual change to decorative borders (header/footer rules, card outlines) compared with the
        pre-phase build.
  - [x] `grep -c 'mx-auto max-w-5xl' src/` → `0` outside the `Container` component.
  - [x] Every focusable element shows a 2 px focus outline; verify Tab through the header at 375 px and
        1440 px.
- **Automated validation:** `npm run format:check && npm run check && npm run lint && npm run build`.
- **Manual validation:** keyboard Tab through the page in both themes; compare computed border colours with
  the pre-change values.
- **Dependencies on other phases:** none. **Blocks** Phases 2, 3, 5.
- **Parallelisation opportunities:** the token work and the `Container` extraction can proceed in parallel
  with Phase 7's harness setup.

#### Recorded deviations (2026-10-19, at implementation)

1. **Token placement was split.** Colour tokens went into `@theme static`; `--space-section`,
   `--duration-fast`, `--ease-standard` and the existing `--measure` stayed in the plain `:root` block.
   Reasons: (a) `@theme` tree-shakes tokens that no generated utility references, so `--color-danger*` would
   have been emitted in the dark block but not in light, producing a half-defined token; `static` forces every
   declared token out. (b) The three non-colour tokens are not Tailwind utility namespaces, so `@theme` would
   not reliably emit them and a `var()` reference would silently resolve to nothing.
2. **`--measure` is not consumed here.** Task 7 allowed "consume or delete"; neither was done, because Phase 5
   owns exactly this work ("Prose measure: apply `--measure`; verify the hero subtitle still looks
   intentional"). Consuming it now would duplicate Phase 5 and change line length in a foundation phase.
   **This sub-task is deferred, not done** — UX-021 remains open.
3. **`--space-section` is consumed** in the three `py-12` sections via `py-[var(--space-section)]`, with the
   value set to `3rem` so the rendered padding is unchanged (verified: 48 px). Hero `py-20 sm:py-28` and
   contact `py-20` keep their literal values; unifying that split is Phase 5's rhythm work.
4. **`BaseLayout` lost its `<main>`**, so 404 and the two thanks pages now supply their own
   `<main id="main-content">`. That is a structural necessity of moving `main` into `PageShell`, not a
   chrome addition — those pages still have no header, nav or footer (UX-008 remains open).
5. **`Button` gained a `size` prop.** Without it, unifying to one padding would have visibly resized the
   header CTA, which currently uses `px-4 py-2 text-sm`.
6. **`Container` needed an `id` prop** — `astro check` rejected `<Container id="…">` until it was declared.
7. **Two control boundaries changed colour by design:** the header nav-toggle border and the hero's secondary
   CTA moved from `--color-border` (1.24:1) to `--color-control-border` (≥3:1). They are controls, not
   decorative rules. Decorative borders are untouched — see the measured colours below.
8. **`astro check` now reports 33 files**, up from 30, because three components were added.

#### Recorded implementation evidence (2026-10-19)

```console
$ npm run format:check   → exit 0
$ npm run lint           → exit 0
$ npm run check          → 33 files, 0 errors, 0 warnings, 0 hints
$ npm run build          → 7 page(s) built
$ npm run check:placeholders → 0 placeholders remain
$ npx wrangler deploy --dry-run → exit 0

$ grep -rn 'mx-auto max-w-5xl' src/ | grep -v Container.astro | wc -l
0
```

**Token emission** (`dist/_astro/*.css`):

```
--color-control-border : #808690 (light) → #6b7280 (dark)
--color-control-bg     : #f7f8fa (light) → #16181d (dark)
--color-danger         : #b42318 (light) → #ff8f85 (dark)
--color-danger-border  : #d92d20 (light) → #f97583 (dark)
--space-section: 3rem      --measure: 68ch
--duration-fast: .15s      --ease-standard: cubic-bezier(.4, 0, .2, 1)
py-[var(--space-section)]  → padding-block: var(--space-section)
```

**Skip link and focus** (browser, built site):

```
/      first Tab → <a> "Skip to main content"  href="#main-content"  visible, position:fixed, top 16px
       Enter      → activeElement = <main id="main-content">, location.hash = #main-content
/ca/   first Tab → <a> "Salta al contingut principal"  href="#main-content"  visible
1440px header Tab stops 1–9 → all 2px solid outline (skip link, brand, 4 nav links, 3 language links)
 375px Tab stops 1–4        → all 2px solid outline
```

**Control boundaries** (computed styles, all four controls identical):

| Theme | Border | vs page | vs own fill | fill vs page |
| --- | --- | --- | --- | --- |
| light | `rgb(128,134,144)` | **3.66:1** | **3.45:1** | 1.06:1 |
| dark | `rgb(107,114,128)` | **3.91:1** | **3.67:1** | 1.06:1 |

Both themes clear the 3:1 requirement against both backgrounds. Before this phase the same measurements were
1.24:1 / 1.17:1 (light) and 1.23:1 (dark) — that is UX-002's defect, now fixed at the token level.

**Decorative borders unchanged** — computed colours still `rgb(228,231,236)` for the header rule, the footer
rule and a service card outline, i.e. the original `--color-border`.

**Layout unchanged:** `#services` / `#work` / `#about` padding-block **48 px** (was `py-12`), `#contact`
80 px, hero 112 px at 1440 px, container max-width **1024 px**. Horizontal overflow at 320 px is still the
pre-existing 324 vs 305 (UX-003, untouched by this phase); 375 px and 1440 px are clean.

**Transitions compiled:** the button resolves `transition-duration: 0.15s`,
`transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`,
`transition-property: color, background-color, border-color, opacity` — the new duration/easing tokens are
consumed, and `@media (prefers-reduced-motion: reduce)` is present in the built CSS.

### Phase 2: Contact form state model and accessibility


- **Goal:** make the form completable, recoverable, and comprehensible with keyboard, screen reader, slow
  network, and no JavaScript.
- **Prerequisites:** Phase 1 (danger tokens, `Button`).
- **Scope:** `ContactForm.astro` behaviour and markup; new i18n keys for form errors/hints; the 320 px
  reflow fix; the no-JS fallback. **No change to the Worker's JSON bodies.**
- **Files likely to change:** `src/components/ContactForm.astro`, `src/i18n/{en,ca,es}.ts`,
  `src/lib/` (new shared validation module), `src/styles/global.css` (no-JS visibility rules).
- **Components likely to change:** `ContactForm`, optionally `FormField`.
- **Detailed implementation tasks:**
  1. [x] `html.js` marker: `BaseLayout` sets the class from an Astro-hashed inline script; `global.css`
     hides `.requires-js` and shows `.no-js-fallback` without it. The fallback renders the address and the
     booking link as real links.
  2. [x] `novalidate` added; `required` / `type="email"` / `maxlength` kept (email capped at 254).
  3. [x] State model: one `state` variable, one `render()`, one `setState()`; no scattered `textContent`
     writes in the handler.
  4. [x] Client validation mirrors the Worker from `src/lib/contactForm.ts`, which the Worker now imports
     too (`textFieldProblem`, `isValidEmail`); the Worker's bodies are unchanged.
  5. [x] Error summary (count, linked list, `tabindex="-1"`), `aria-invalid`, and `aria-describedby` with
     ids derived from field names — hint first, error second.
  6. [x] `disabled` replaced by `aria-disabled` + `aria-busy` on the control and the form, with an
     `inFlight` guard; focus stays on the submit control.
  7. [x] `response.status` → localised sentence, Turnstile reset on every failure, values preserved.
  8. [x] 320 px: `grid-cols-1` (`minmax(0,1fr)`) + `min-w-0` children + `data-size="flexible"`. **The
     widget still cannot go below 300 px**, so it also gets a `.turnstile-frame` scroll region — see
     deviation 2 below.
  9. [x] Turnstile notice moved under the widget and associated with it (`role="group"` +
     `aria-describedby`).
  10. [x] Select placeholder option (no longer repeats the label) and the email/message hints (C2–C4).
- **Explicitly out of scope:** lazy-loading Turnstile (Phase 6), the privacy policy page (Phase 4), any
  Worker response-shape change.
- **Risks:**
  - **Validation drift** between the shared module and the Worker — the highest-value risk in this plan.
    Mitigation: one module imported by both, plus a recorded manual check against each Worker branch.
  - `novalidate` removes the browser's own error UI; a bug in the JS validator silently blocks submission.
    Mitigation: a Playwright test asserting a valid submission reaches `fetch`.
  - The no-JS class technique interacts with the CSP hash list — verify in a **production build**, not
    `astro dev`.
- **Acceptance criteria:**
  - [x] At 320 CSS px the document does not scroll horizontally (`scrollWidth === clientWidth`) — measured
        **305 / 305**, including with the widget forced to its documented 300 px minimum. The real widget
        iframe cannot render in this environment (see limitations), so the worst case was simulated.
  - [x] Submitting an empty form moves focus to the error summary, not to `<body>`; the summary lists all
        five fields; each summary link moves focus to its field.
  - [x] After fixing one field, its message clears and the summary count decreases (5 → 4).
  - [x] During submission the submit control exposes a busy state, keeps focus, and a second activation
        produces no second request (1 request after two activations).
  - [x] A 429 response renders the rate-limit sentence with a retry expectation and a `mailto:` link; 403,
        502, 500, 400 and a network rejection render their own distinct sentences (verified by stubbing).
  - [x] With JavaScript disabled, the form is not presented as usable and the email/booking fallback is
        visible.
  - [x] Entered values survive every failure state.
- **Automated validation:** `format:check`, `check`, `lint`, `build`, plus the Phase 7 harness once it exists.
- **Manual validation:** Tab-only completion of the happy path against `wrangler dev`; NVDA or VoiceOver pass
  over each state; 320 px and 375 px screenshots.
- **Dependencies on other phases:** Phase 1. **Blocks** Phase 7's form-state tests.
- **Parallelisation opportunities:** the select/hint copy can be written in parallel with the state machine.

#### Recorded deviations (2026-10-19, at implementation)

1. **`script-src` was missing `'self'`, and the form's JavaScript was dead in that state.** Astro inlines a
   page script only while it stays under its inline threshold; adding imports pushed the contact script into
   `/_astro/ContactForm.astro_astro_type_script_index_0_lang.*.js`, and the built page then logged
   `Loading the script '…/_astro/ContactForm…js' violates the following Content Security Policy directive`
   with `script-src` listing only third-party origins and hashes. `'self'` was added to
   `scriptDirective.resources` — an origin, not a hash, so no inline protection is weakened. Without this
   fix none of this phase's behaviour could run at all.
2. **The plan's primary 320 px remedy is not sufficient, and the documented fallback was used.**
   Cloudflare's current widget-configuration docs give `flexible` as **100% width with a 300 px minimum**;
   at a 320 px viewport the form's content box is 257 px, so the widget cannot shrink to fit. The grid fix
   is in place (`grid-cols-1`, `min-w-0`, verified: the track is 257 px rather than 300), and the wrapper
   additionally gets `overflow-x: auto` below the widget's minimum. Consequence, recorded as the plan
   requires: at the narrowest viewports the **widget** scrolls inside its own region while the document does
   not. **Raise with the Architect** if a nested scroll region is unacceptable — the alternatives are
   Cloudflare's `compact` size below a breakpoint, which needs explicit rendering (Phase 6's job), or
   accepting the overflow.
3. **Failure copy uses a shared recovery footer rather than embedding the address in every sentence.**
   C5's requirement is that every message "contain `contact@vgr.cat` as a `mailto:` link"; the implementation
   satisfies it with one localised `recoveryLabel` line — `Or reach me directly: contact@vgr.cat · Book a
   30-min call` — rendered inside the status region under every failure sentence, instead of interpolating
   the address into six sentences (which would have made each sentence untranslatable as a unit).
4. **The client reads its strings from a JSON island, not ~25 `data-` attributes.** `<script
   type="application/json" data-contact-messages>` is inert, so `script-src` does not apply, and the
   component stays readable. It is the same technique as the JSON-LD block in `BaseLayout`.
5. **`ContactForm` takes a `bookingLabel` prop.** The component receives `labels={t.contact.form}`, which
   does not include `directContact`; passing the one label it needs beat widening the prop to the whole
   `contact` dictionary.
6. **Per-field locking during submission is mixed by necessity:** text controls take `readonly`, the
   `<select>` takes `aria-disabled` (a select has no readonly). Both are advisory; the `inFlight` flag is
   what actually prevents a second request.
7. **A 500 keeps the submit control enabled.** §7 allows "hidden or `aria-disabled`"; neither was needed
   because the message itself says the form is unavailable and offers the address. Retrying a transient 500
   is harmless.
8. **`worker-configuration.d.ts` is a landmine for browser code.** Its HTMLRewriter `interface Element`
   merges into the DOM lib, which makes `Element.append(...)` resolve to the `BodyInit` signature and
   breaks `querySelector<E extends Element>` for element unions. Workarounds used: `appendChild`, and
   `querySelector<HTMLElement>` plus `instanceof` narrowing.
9. **A re-render destroyed the summary link under the pointer.** Clicking summary link *n* blurred the
   previously focused field, whose `blur` handler re-rendered the summary; the links are rebuilt with
   `replaceChildren`, so the click target vanished and focus fell to `<body>` (measured: two of five links
   landed on `BODY`). Fixed twice over: `sameErrors()` skips the re-render when the error set is unchanged,
   and `render()` restores focus to the status container if it was inside the region and got detached.

#### Discovered defect — needs an owner decision, not fixed here

**A multi-line message can never be submitted.** `textFieldProblem` (formerly the inline loop in the Worker)
rejects CRLF in `message` along with the single-line fields, so the `<textarea>` accepts line breaks that the
server always refuses. Measured against `wrangler dev`, same payload, only the message differing:

```
message="One line only"          → 403 {"error":"Challenge missing"}   (passes field validation)
message="First line\nSecond line" → 400 {"error":"Invalid field"}      (rejected by the CRLF rule)
```

The client now mirrors this rule, so the user sees "This field cannot contain line breaks." instead of a
mysterious generic failure — correct relative to the server, but a poor answer for a "Project Overview"
field. Changing it is a Worker rule change (the CRLF objection applies to header fields; `message` is only
ever the email body), so it is **not** done here. Owner/Architect decision required.

> **Resolved 2026-10-19 — the owner asked for the body rule to be fixed.** The shared module now exports
> `singleLineProblem` (keeps the CRLF rejection) and `messageProblem` (no CRLF); the Worker applies the first
> to `name`/`email`/`organization` and the second to `message`, and the client mirrors the same split. The
> `message:lineBreak` copy was removed from the JSON island because that state can no longer occur.
> Re-measured against `wrangler dev`: a two-line message now answers `403 Challenge missing` (fields valid),
> while `name` with a line break still answers `400 Invalid field`.

#### Recorded implementation evidence (2026-10-19)

```console
$ npm run format:check      → exit 0
$ npm run lint              → exit 0
$ npm run check             → 34 files, 0 errors, 0 warnings, 0 hints
$ npm run build             → 7 page(s) built
$ npm run check:placeholders → 0 placeholders remain
$ npx wrangler deploy --dry-run → exit 0

script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com 'sha256-…' ×7
```

**No-JS switch** (Chromium, `javaScriptEnabled: false` vs default):

```
no JS : html class ""    form display none    .no-js-fallback display block
        "This form needs JavaScript to protect against spam. Please reach me directly instead:
         contact@vgr.cat · Book a 30-min Technical Discovery Call"
        links: mailto:contact@vgr.cat , https://calendar.app.google/3dd7SXGnZqUZsWXm6
JS    : html class "js"  form display grid    .no-js-fallback display none
```

**Empty submit** (`/`, 1440 px):

```
status hidden=false  role=alert  aria-live=assertive
title  "Please fix 5 fields."
items  Enter your name. / Enter your email address. / Enter your organization. /
       Select a focus area. / Describe your project or question.
focus  document.activeElement === the status container (tabindex="-1"), not <body>
aria-invalid=true on all five controls
aria-describedby  name → "contact-name-error"
                  email → "contact-email-hint contact-email-error"
                  organization → "contact-organization-error"
                  serviceType → "contact-serviceType-error"
                  message → "contact-message-hint contact-message-error"
summary link clicks → INPUT#contact-name, INPUT#contact-email, INPUT#contact-organization,
                      SELECT#contact-serviceType, TEXTAREA#contact-message
after fixing the name → title "Please fix 4 fields.", name error "" and aria-invalid removed
```

**Submitting** (fetch stubbed to hold for 2.5 s, second activation via `requestSubmit()`):

```
requests 1
form aria-busy=true   button aria-disabled=true  button.disabled=false  button aria-busy=true
button text "Submitting..."   focus BUTTON[data-submit]
text controls readOnly=true   select aria-disabled=true
after 10 s with no response   status title "Still sending…"   (polite)
after completion              button "Send Inquiry", form aria-busy=false, readOnly=false
```

**Status mapping** (stubbed `fetch`; each case reloaded first, so each is a first occurrence):

| Stub | Title rendered | Role / live | Recovery |
| --- | --- | --- | --- |
| 429 | "Too many attempts. Please try again in about a minute." | alert / assertive | mailto + booking |
| 403 | "The verification check did not pass. Reload the page and try again." | alert / assertive | mailto + booking |
| 502 | "The message could not be delivered." | alert / assertive | mailto + booking |
| 500 | "The form is temporarily unavailable." | alert / assertive | mailto + booking |
| 400 | "One of the details was rejected. Check the email address and the other fields, then try again." | alert / assertive | mailto + booking |
| network | "Your connection dropped before the message was sent. Please try again." | alert / assertive | mailto + booking |

All six kept every entered value and put focus on the summary.

**Reflow** (built site):

| Viewport | `scrollWidth` / `clientWidth` | Widget frame | Widget |
| --- | --- | --- | --- |
| 320 (widget forced to 300 px) | **305 / 305** | 257 wide, 300 scroll | 300 |
| 375 | 360 / 360 | 312 | 312 |
| 1440 | 1425 / 1425 | 672 | 672 |

**Invalid styling** (light theme, computed): input border `rgb(217,45,32)` (`--color-danger-border`), error
text `rgb(180,35,24)` (`--color-danger`) at 14 px, status border `rgb(217,45,32)`. `aria-disabled:opacity-60`
compiles to `[aria-disabled=true]` and applies to the busy submit control.

**Locale parity**: `/ca/` renders `Corregiu 5 camps.`, the five Catalan field messages, placeholder
`Trieu un àmbit`, hints `Hi responc a aquesta adreça.` / `Fins a 2.000 caràcters.`, `maxlength="254"`,
`novalidate`.

**Attempt timing**: after a 3.2 s dwell on the page the submitted `elapsed` was `3890`, i.e. recomputed at
submit time rather than captured at load.

#### Limitations of this verification

- The Turnstile iframe does not render in this sandbox — the challenge request is aborted
  (`net::ERR_ABORTED` on `challenges.cloudflare.com/…/new/flexible`), which matches the known `110200`
  sitekey/host limitation recorded in `AGENTS.md`. So the **happy path, a real widget token, and the
  widget's rendered geometry are not verified**; the 320 px result stands in for the worst case with a
  300 px widget.
- No screen-reader pass (NVDA/VoiceOver) and no 400 % zoom check were run.
- The `wrangler dev` probe covered the Worker's field rules only (no Turnstile secret was configured, so
  every request stops at `403 Challenge missing`).

### Phase 3: Navigation, footer and page chrome

- **Goal:** every page tells the visitor where they are and offers a way forward; the mobile menu works.
- **Prerequisites:** Phase 1.
- **Scope:** header panel states, current-section indication, brand href, language-fragment preservation,
  footer navigation, chrome for 404/thanks, `noindex` for thanks.
- **Files likely to change:** `src/components/SiteHeader.astro`, `SiteFooter.astro`,
  `src/components/LanguagePicker.astro`, `src/layouts/BaseLayout.astro`,
  `src/pages/{404.astro,contact/thanks.astro,[lang]/contact/thanks.astro}`,
  `src/lib/navigation.ts` (new helper), `src/i18n/{en,ca,es}.ts`, `astro.config.mjs` (sitemap filter).
- **Components likely to change:** header, footer, language picker, page shell.
- **Detailed implementation tasks:**
  1. [x] `src/lib/navigation.ts` exports `sectionNav(locale)`; `PageShell` calls it once and hands the
     same array to the header and the footer.
  2. [x] Mobile panel: display is explicit for both states via `max-sm:hidden` + `data-[open=true]:flex`
     (a specificity pair, not an order dependency), the header row wraps and the panel is `w-full`, rows
     are 44 px, Escape closes and returns focus to the toggle, and a `matchMedia` change resets the state.
  3. [x] Scroll-spy: `IntersectionObserver` on the four sections with a middle-band `rootMargin`, setting
     `aria-current="location"` on the matching link; no-op without `IntersectionObserver` or without
     sections (so the same header works on `/404` and the thanks pages).
  4. [x] Brand href is the localized home; `<main id="main-content">` still backs the skip link.
  5. [x] Language links append `location.hash` at click time, on both picker instances.
  6. [x] Footer: sections, contact (mailto + booking) and language groups, each a `<nav>` with its own
     accessible name; the legal slot renders only when a policy page exists.
  7. [x] 404 and thanks pages render `PageShell`, so they carry skip link, header, footer and main; the
     404 is one content block with a JSON island for the other locales, so there is exactly one `h1`.
  8. [x] Thanks pages are `noindex` and the sitemap integration filters `/contact/thanks`.
- **Explicitly out of scope:** any decision to make the header sticky (record it as a separate decision, §13
  D-8), information-architecture changes beyond adding links.
- **Risks:** a sticky header would require `scroll-margin-top` on every fragment target and interacts with
  the scroll-spy; if introduced here, the phase grows by a step. Sitemap filtering touches `astro.config.mjs`
  — read `.github/instructions/astro-config.instructions.md` first and do not touch the CSP block.
- **Acceptance criteria:**
  - [x] At 375 px the opened menu is a full-width panel below the brand row — measured
        `#site-nav` width **312 px === the container's content width 312 px**, top **76 px** vs brand-row
        bottom **51 px**; also checked at 320 px (257/257, top 76) and 414 px (351/351, top 76).
  - [x] Escape closes the panel and returns focus to the toggle; `aria-expanded` tracks state.
  - [x] The nav link for the visible section exposes `aria-current="location"` and is visually
        distinguishable (weight 600 vs 400, accent colour); exactly one link is current at a time.
  - [x] Switching language from `/#work` lands on `/ca/#work` and remains at that section (`#work` top
        = 0 in the viewport). The footer picker does the same: `/#about` → `/es/#about`.
  - [x] 404 and thanks pages expose `header`, `nav`, `main`, `footer` landmarks; 404 has exactly one `h1`.
  - [x] `/contact/thanks/` emits `<meta name="robots" content="noindex">` and is absent from the built
        sitemap (which now lists only the three home pages).
- **Automated validation:** gate + the Phase 7 landmark/`h1` assertions.
- **Manual validation:** mobile panel at 320/375/414 px; Tab order through header and footer; check the
  sitemap file contents.
- **Dependencies on other phases:** Phase 1. Can run in parallel with Phase 2 **except** both edit
  `SiteHeader`/`ContactForm` — they touch different files, so parallel is safe; coordinate on `i18n` keys.
- **Parallelisation opportunities:** high with Phases 2 and 4 if the i18n edits are landed as one atomic
  commit.

#### Recorded deviations (2026-10-19, at implementation)

1. **The panel's open/closed display had to be a specificity pair, not a global CSS rule.** §6 forbids new
   global selectors for components, so the states live in the component's utility list:
   `max-sm:hidden` (closed below 640) against `data-[open=true]:flex` (`.…[data-open=true]`, specificity
   0,2,0, so it always wins). The old code toggled the `hidden` class, which is why the opened panel fell
   back to `display: block` and collapsed into a 191 px column (UX-004).
2. **`w-full` was missing from the first version of the new panel, and verification caught it.** Without it
   the panel measured 124 px wide and did not wrap; the fix was one class, and the numbers above are from
   the corrected build.
3. **The footer's language group reuses `LanguagePicker`** instead of hand-rolling a second list, so the
   fragment-preserving script covers both instances with one listener set. Cost: the group's visible label
   and the picker's `aria-label` are the same word ("Language" / "Idioma"), so the nav is announced once
   for the group name and once for the region.
4. **The legal slot is a prop pair that renders nothing today.** No policy page exists (Q-2), and a link to
   a 404 would be worse than its absence, so no `legalLabel` key was added to the dictionaries — that would
   be a dead translation (the UX-023 pattern). Phase 4 fills it.
5. **The 404 keeps its locale enhancement by inlining the copy in a JSON island.** The previous markup
   rendered one `<section>` per locale (three `h1` elements, two hidden); now there is one `h1` and the
   script swaps text, `href`, `document.title`, the meta description and `documentElement.lang` from
   `[data-notfound-copy]`. Verified: `/ca/does-not-exist` → `lang="ca"`, `h1` "No s’ha pogut trobar aquesta
   pàgina", back link `/ca/`, one `h1`.
6. **`SiteHeader`'s `lang` prop became required.** It defaulted to `defaultLocale`, which is precisely why
   the 404 could not be localized per request; every caller passes it.
7. **`noindex` also drops `rel="canonical"`** on the thanks pages — that is `BaseLayout`'s existing
   behaviour (a noindex page should not advertise a canonical), recorded here so it is not mistaken for a
   regression.
8. **Two related findings were deliberately left untouched:** UX-026 (the language picker uses
   `aria-current="true"`) and C12 (`EN — English` reads as punctuation). Neither appears in Phase 3's task
   list, and Phase 4's list does not assign them either, so they are currently unassigned.
   *Resolved 2026-10-19:* the owner asked for them to be fixed. The current locale is `aria-current="page"`
   and the screen-reader text is now `EN (English)`; the change landed with Phase 4's i18n batch.

#### Recorded implementation evidence (2026-10-19)

```console
$ npm run format:check      → exit 0
$ npm run lint              → exit 0
$ npm run check             → 35 files, 0 errors, 0 warnings, 0 hints
$ npm run build             → 7 page(s) built
$ npm run check:placeholders → 0 placeholders remain
$ npx wrangler deploy --dry-run → exit 0

$ grep -o '<loc>[^<]*' dist/sitemap-0.xml
<loc>https://vgr.cat/
<loc>https://vgr.cat/ca/
<loc>https://vgr.cat/es/

$ grep -o '<meta name="robots"[^>]*>' dist/{,ca/,es/}contact/thanks/index.html
<meta name="robots" content="noindex">   ×3
```

**Mobile panel** (real click on `#nav-toggle`, real `Escape`):

| Viewport | Panel width vs container content | Panel top vs brand bottom | Nav rows | Document scroll |
| --- | --- | --- | --- | --- |
| 320 | 257 / 257 | 76 / 51 | 44 ×4 | 305 / 305 |
| 375 | 312 / 312 | 76 / 51 | 44 ×4 | 360 / 360 |
| 414 | 351 / 351 | 76 / 51 | 44 ×4 | 399 / 399 |

```
closed : display none, data-open=false, aria-expanded=false
click  : display flex, data-open=true,  aria-expanded=true, panel 312 × 266 at top 76
Escape : display none, data-open=false, aria-expanded=false, focus #nav-toggle
resize → 900 px: data-open=false, aria-expanded=false, display flex (CSS alone)
```

**Scroll-spy** (1440 px, one link current at a time):

```
top of page      aria-current: services null, work null, about null, contact null
at #services     ["services"]  weight 600, colour rgb(122,167,255)
at #work         ["work"]      weight 600, inactive weight 400
at #about        ["about"]     weight 600
at #contact      ["contact"]   weight 600
```

**Language switching** (`/#work` → `CA`): URL `/ca/#work`, `documentElement.lang="ca"`, `#work` top = 0,
brand href `/ca/`. Footer picker: `/#about` → `/es/#about`, `#about` top = 0.

**Landmarks** (from the built pages):

```
/404.html        HEADER, NAV:Primary navigation, NAV:Select language, MAIN, FOOTER,
                 NAV:Sections, NAV:Contact, NAV:Language
                 h1 count 1 ("This page could not be found"), skip link present, 9 footer links
/ca/thanks/      HEADER, NAV:Navegació principal, NAV:Seleccioneu l’idioma, MAIN, FOOTER,
                 NAV:Seccions, NAV:Contacte, NAV:Idioma
                 h1 count 1, robots=noindex, canonical absent, skip link "Salta al contingut principal"
```

**Tab order at 1440 px** (first twelve stops): skip link → brand → Services → Case Studies → About →
Contact → EN → CA → ES → header CTA → hero CTA → "Explore Case Studies".

**CSP**: zero `securitypolicyviolation` events on `/`, `/ca/`, `/es/`, `/404.html` and
`/ca/contact/thanks/`. Only one hashed script file is emitted (`ContactForm…js`); the header, picker and
404 scripts stay under Astro's inline threshold and are hashed instead.

#### Limitations of this verification

- Input events reach the page only when its tab is focused: on the backgrounded tab, `page.click`/`press`
  timed out or no-oped, so the keyboard checks were re-run on a focused tab. All panel/scroll-spy results
  above are from real pointer and key events, not dispatched events.
- No screen-reader pass (NVDA/VoiceOver) was run, and the footer's group announcements therefore rest on
  markup inspection, not listening.
- The Turnstile widget still cannot render locally (production sitekey not allowed on `127.0.0.1`), so the
  `/` measurements above exclude its iframe, as in Phase 2.

### Phase 4: Document structure, microcopy and privacy

- **Goal:** correct heading hierarchy, remove duplicated content, and close the trust gap.
- **Prerequisites:** owner decision on UX-007 (dedupe strategy) and on the privacy wording.
- **Scope:** case-study heading levels or dedupe; CTA label unification; the privacy notice and policy page.
- **Files likely to change:** `src/components/CaseStudy.astro`, `src/content/caseStudies/*.{en,ca,es}.md`
  (9 files), `src/content.config.ts` (only if fields are dropped), `src/i18n/{en,ca,es}.ts`,
  new `src/pages/privacy.astro` + `src/pages/[lang]/privacy.astro`.
- **Components likely to change:** `CaseStudy`, `ServiceCard`, footer, contact section.
- **Detailed implementation tasks:**
  1. [x] Dedupe strategy **D-5b (owner's choice, 2026-10-19): keep both blocks, demote the three prose
     headings to `####`, and rename them to the summary's vocabulary (C8)** — "The Challenge / The
     Architecture / Measurable Impact" and the CA/ES equivalents, across all 9 files. Deleting the prose
     (D-5/A) is deferred as a second, reversible-to-decide step.
  2. [x] No frontmatter fields were removed under D-5b, so `content.config.ts` is unchanged.
  3. [x] One label per destination: hero, contact section, form recovery and footer all say "Book a 30-min
     technical call"; the header keeps the same noun phrase, shortened to "Book a call".
  4. [x] Privacy notice above the submit control plus `/privacy`, `/ca/privacy`, `/es/privacy` rendered with
     the shell, linked from the footer's legal slot and from the notice. **Owner approved authoring the
     copy** ("feel free to create one"); it describes only what this site does and makes no legal claims.
  5. [x] `successMessage`, `ctaLearnMore`, `namePlaceholder`, `emailPlaceholder`, `messagePlaceholder`
     deleted from all three dictionaries (`grep` → 0).
- **Explicitly out of scope:** adding imagery or testimonials (UX-027), analytics (UX-028).
- **Risks:** dropping frontmatter fields is destructive to authored copy — requires explicit owner sign-off
  and must be its own commit. Adding a policy page introduces legal content that must not be fabricated.
- **Acceptance criteria:**
  - [x] The heading outline of `/` reads `h1 → h2 → h3 → h4` with no level skip, and no case-study
        sub-heading is a sibling of its own title (measured: `skip: null`, each article is `H3` + three
        `H4`).
  - [ ] **Deferred, not met:** no case-study statement is present twice on the page. D-5b deliberately keeps
        both blocks, so the duplication remains until D-5 (A) is applied.
  - [x] One label per destination across header, hero and contact section.
  - [x] The submit area states purpose and retention and links to a reachable policy page in all three
        locales.
  - [x] `grep -rn 'successMessage' src/` → `0` (and `ctaLearnMore`, and the three unused placeholders).
- **Automated validation:** gate; a Phase 7 assertion on the heading outline.
- **Manual validation:** read one case study start to finish in each locale; proofread the policy notice.
- **Dependencies on other phases:** Phase 3 for the shell on the new page. **Blocks** Phase 5 (same
  component).
- **Parallelisation opportunities:** the privacy page can proceed independently of the heading work.

#### Owner decisions received (2026-10-19)

| Question | Answer |
| --- | --- |
| UX-007 / D-5 dedupe | **B now, A later** — keep both blocks and demote prose to `####`; deleting the prose is a separate later step |
| UX-011 / Q-2 privacy | **Author it** — the implementer writes the notice and the policy page; owner reviews |
| C10 CTA label | **"Book a 30-min technical call"** |
| UX-003 320 px widget | **A — keep the documented scrollable-widget exception** (no `compact` switch in Phase 6) |
| Multi-line message | **Fix the body** — the CRLF rejection now applies to single-line fields only |
| UX-026 / C12 | Fixed here (unassigned findings, taken on the owner's instruction) |

#### Recorded implementation evidence (2026-10-19)

```console
$ npm run format:check      → exit 0
$ npm run lint              → exit 0
$ npm run check             → 37 files, 0 errors, 0 warnings, 0 hints
$ npm run build             → 10 page(s) built
$ npm run check:placeholders → 0 placeholders remain
$ npx wrangler deploy --dry-run → exit 0

$ grep -rn 'successMessage|ctaLearnMore|namePlaceholder|emailPlaceholder|messagePlaceholder' src/ | wc -l → 0
$ grep -o '<loc>[^<]*' dist/sitemap-0.xml → /, /ca/, /ca/privacy/, /es/, /es/privacy/, /privacy/
```

**Heading outline** (`/`, 1440 px): `H1, H2, H3 ×4, H2, H3, H4 ×3, H3…`, first level skip `null`, one `h1`.
Each of the three long articles is now `H3 title` + `H4 The Challenge` + `H4 The Architecture` +
`H4 Measurable Impact`.

**One label per destination**: header `Book a call`; hero, contact section, form recovery and footer all
`Book a 30-min technical call`.

**Privacy**: notice "Privacy policy" sits **before** the submit button and resolves to `/privacy/`,
`/ca/privacy/`, `/es/privacy/` per locale; the footer legal link uses the same canonical trailing-slash
form; `/ca/privacy/` returns 200 with `lang="ca"`, `h1` "Privacitat i les vostres dades" and seven `h2`
sections. Zero CSP violations, no horizontal overflow on any of the three home pages.

**Multi-line message** (`wrangler dev`, same payload, only the message differing):

```
message="First line\nSecond line"      → 403 {"error":"Challenge missing"}   (was 400 Invalid field)
name="Ana\nRuiz" (single-line field)   → 400 {"error":"Invalid field"}       (injection guard retained)
```

Client side (Chromium, `/es/`, stubbed `fetch`): a three-line message produced no `aria-invalid`, no
summary, and was posted verbatim as `"Primera línea\nSegunda línea\nTercera línea"`.

**Language picker**: accessible name now `EN (English)` with `aria-current="page"` on the current locale
(and `null` on the other two), on both the header and footer instances.

#### Known gaps after this phase

- ~~`banco-estado-iot` still has no body sections~~ — **closed 2026-10-19**: the owner asked for them, and the
  article now carries the same three `####` sections as the other three, in all three locales, written only
  from facts already present in its summary (`200+ offices`, gateway/MQTT/Express ingest, Django + PHP
  service layer, branch-by-branch rollout). Verified: 4 × `H3` + 12 × `H4` per locale, no level skip.
- The privacy copy describes the real data flow (Cloudflare Worker → Email Service, Turnstile check,
  aggregate Web Analytics) but has not had a legal review; the owner asked to author it and should read
  the three locales before it ships.

### Phase 5: Responsive corrections

- **Goal:** no prose column narrower than ~280 px; a documented breakpoint plan.
- **Prerequisites:** Phase 4 (CaseStudy structure settled), Phase 1 (tokens).
- **Scope:** grid breakpoints and the `--measure` decision; touch targets for nav/mailto.
- **Files likely to change:** `src/components/{Hero,ServiceCard,CaseStudy,ContactSection,HomeSections,
  SiteHeader}.astro`, `src/styles/global.css`.
- **Components likely to change:** the five above.
- **Detailed implementation tasks:**
  1. Services: `sm:grid-cols-2 lg:grid-cols-3`. [XS]
  2. Case-study `<dl>`: stacked below `lg`, three columns at `lg`. [XS]
  3. Contact `<dl>`: two columns (or add a third real item). [XS]
  4. Hero metrics: keep three columns only where each metric value stays on one line; verify at 640 px. [XS]
  5. Prose measure: apply `--measure`; verify the hero subtitle still looks intentional. [S]
  6. Nav links and `mailto:` gain vertical padding to reach 24 px without relying on the spacing exception. [XS]
  7. Record the breakpoint policy in the component or the plan: 640 = inline nav, 768 = two columns, 1024 =
         three columns. [XS]
- **Explicitly out of scope:** changing the 1024 px container cap; adding a fluid type scale.
- **Risks:** altering the hero metric grid can cause the "EPREL & ESPR" value to wrap mid-phrase, which reads
  badly; test at 640/768 px specifically.
- **Acceptance criteria:**
  - [ ] At 640 and 768 px no prose column is narrower than 280 px (measured).
  - [ ] The contact `<dl>` has no empty grid track at any width ≥640 px.
  - [ ] No interactive element is under 24 × 24 px without a compliant spacing exception.
  - [ ] Body prose measures between 45 and 80 characters at 1024 px and above.
- **Automated validation:** gate; Phase 7 viewport assertions.
- **Manual validation:** measure at 320/375/640/768/1024/1440.
- **Dependencies on other phases:** 1 and 4. Independently reviewable.
- **Parallelisation opportunities:** can run alongside Phase 6.

### Phase 6: Performance-adjacent UX

- **Goal:** stop loading a third-party challenge for visitors who never reach the form; make font loading
  predictable.
- **Prerequisites:** Phase 2 (widget markup final).
- **Scope:** Turnstile lazy initialisation; font preload; optional Worker `text/html` hardening.
- **Files likely to change:** `src/components/ContactForm.astro`, `src/layouts/BaseLayout.astro`,
  optionally `src/worker/index.ts`.
- **Detailed implementation tasks:**
  1. Load `api.js` on first interaction with the form (focus/pointerdown) or when `#contact` approaches the
     viewport; initialise explicitly with `turnstile.render()` and store the widget id for `reset()`. [M]
  2. Ensure exactly one widget instance even if the loader is triggered twice. [S]
  3. Preload the hashed latin woff2 in `BaseLayout`; verify the filename in a **production** build. [S]
  4. Decide and record the subset trimming (keep all 7 vs import only latin + latin-ext). [XS]
  5. *(Optional hardening)* Worker: when `Accept` includes `text/html`, return a 303 to the localized page
     with `#contact` instead of JSON. Must leave `*/*` responses byte-identical to today's recorded output. [S]
- **Explicitly out of scope:** adding analytics, changing the rate limiter, altering Siteverify logic.
- **Risks:** explicit rendering changes the reset path and can produce a widget that never appears if the
  trigger never fires (e.g. a user landing on `#contact` via the nav anchor and tabbing straight in). Test
  that path explicitly.
- **Acceptance criteria:**
  - [ ] On a fresh load of `/`, no request to `challenges.cloudflare.com` occurs before the visitor interacts
        with the form or scrolls it near the viewport.
  - [ ] A submission after keyboard-only interaction still mints a token and completes.
  - [ ] Exactly one Turnstile widget exists in the DOM after repeated interaction.
  - [ ] The latin woff2 is preloaded and no other subset is requested on `/`, `/ca/`, `/es/`.
- **Automated validation:** gate; a Phase 7 network assertion.
- **Manual validation:** throttled-network run of the happy path; check the network panel for a single font
  request.
- **Dependencies on other phases:** Phase 2. Independent of 3–5.
- **Parallelisation opportunities:** with Phase 5.

### Phase 7: Automated regression coverage

- **Goal:** make the three confirmed barriers impossible to reintroduce silently.
- **Prerequisites:** at least Phase 1; ideally Phases 2–3 so the assertions are written against final markup.
- **Scope:** a Playwright project run against `npm run preview` in CI, plus axe on each route.
- **Files likely to change:** `package.json`, `package-lock.json`, new `playwright.config.ts`, new
  `tests/**`, `.github/workflows/ci.yml`.
- **Detailed implementation tasks:**
  1. Add `@playwright/test` and `@axe-core/playwright` as devDependencies; add `test:e2e` and `test:e2e:ui`
     scripts. [M]
  2. Config: `webServer: { command: 'npm run preview', port: 4321, reuseExistingServer: true }`; projects for
     `chromium` desktop at 1440 × 900 and a `375 × 812` mobile emulation. [S]
  3. Tests — structure: single `h1`, no heading-level skips, skip link is the first tab stop, landmarks on all
     7 routes. [S]
  4. Tests — layout: at 320 CSS px `scrollWidth === clientWidth` on all 7 routes; at 640 px no prose column
     below 280 px. [S]
  5. Tests — form: empty submit → focus in summary; summary link → focus lands on the field; stubbed
     429/403/502 render distinct messages; busy state + single request; values preserved. [M]
  6. Tests — a11y: `axe.analyze()` on all 7 routes with `color-contrast` enabled, asserting zero violations
     of the selected rule set. [S]
  7. Add the job to `ci.yml` following
     `.github/instructions/workflows.instructions.md` (SHA-pinned actions, `permissions: contents: read`,
     `concurrency`, browser install via the official Playwright container or `npx playwright install
     --with-deps`). [S]
- **Explicitly out of scope:** visual-regression snapshots (add later if churn justifies it), Safari/Firefox
  projects, connecting tests to RUM.
- **Risks:** axe `color-contrast` is unreliable on elements over gradient/opacity backgrounds — there are
  none here, so it is safe. CI must not need `TURNSTILE_SECRET_KEY`; the form tests stub the endpoint with
  `page.route`, so no secret is required.
- **Acceptance criteria:**
  - [ ] `npm run test:e2e` passes locally against a fresh `npm run build`.
  - [ ] A deliberately reintroduced regression (removing the skip link) fails the suite.
  - [ ] CI runs the suite on PRs and on `main` and fails the build on a violation.
- **Automated validation:** the suite itself, plus the existing gate.
- **Manual validation:** confirm the suite is not silently skipping (assert test counts are non-zero).
- **Dependencies on other phases:** 1–3 minimum. **Blocks** Phase 8's confidence.
- **Parallelisation opportunities:** the harness/config can be written during Phase 1; assertions land per
  phase.

### Phase 8: Final manual validation

- **Goal:** verify the things automation cannot.
- **Prerequisites:** all other phases.
- **Scope:** keyboard, screen reader, zoom, reduced motion, no-JS, real device, before/after measurements.
- **Detailed implementation tasks:**
  1. Keyboard-only traversal of all 7 routes, recording the first 10 tab stops. [S]
  2. Screen-reader pass (NVDA or VoiceOver) across: header, nav, form (each state), thanks, 404. [M]
  3. 400 % zoom and 200 % text-only zoom at 1280 px. [S]
  4. `prefers-reduced-motion: reduce` emulation across hover/focus/scroll-spy. [XS]
  5. No-JS run: form hidden, fallback visible, no raw JSON reachable. [S]
  6. Long-content pass on `#work` at 375 px; record the new page height next to 16,779 px. [XS]
  7. Record every measurement in this plan's evidence block. [S]
- **Explicitly out of scope:** production deployment.
- **Risks:** screen-reader testing may surface issues requiring a new phase; budget for it.
- **Acceptance criteria:**
  - [ ] No interaction leaves focus on `<body>`.
  - [ ] Every state of the form is announced and understandable without sight.
  - [ ] Nothing is clipped at 320 px or at 400 % zoom.
  - [ ] The no-JS path never shows a JSON document.
- **Automated validation:** none new.
- **Manual validation:** all of the above, recorded.
- **Dependencies on other phases:** all.
- **Parallelisation opportunities:** none.

**Ordering summary.** 1 → {2, 3} in parallel → 4 → 5 → 6 (parallel with 5) → 7 (assertions per phase) → 8.
Hard dependencies: 1 before everything; 4 before 5 (same component); 2 before 6 (widget markup);
2 before the form assertions in 7.

---

## 12. Testing Strategy

### Automated (proposed)

| Layer | Tool | Scope | Runs |
| --- | --- | --- | --- |
| Type + template diagnostics | `astro check` (existing) | all 30 files | CI |
| Lint (incl. 34 `astro/jsx-a11y/*` rules) | `eslint` (existing) | `src/**` | CI |
| Formatting | Prettier (existing) | repo | CI |
| Placeholder guard | `scripts/check-placeholders.mjs` (existing) | `src/`, `wrangler.jsonc` | CI |
| Structural HTML assertions | Playwright | 7 routes: headings, landmarks, skip link, `aria-current` | CI |
| Accessibility scan | axe-core via `@axe-core/playwright` (axe is already present transitively at 4.14.0) | 7 routes, `wcag2a`/`wcag2aa`/`wcag22aa` tags | CI |
| Reflow/overflow | Playwright | all routes at 320 px, 375 px, 640 px, 1440 px | CI |
| Contact-form states | Playwright + `page.route` stubs | idle/invalid/submitting/429/403/502/network | CI |
| Contrast of control boundaries | Playwright computed-style assertions | form controls, both colour schemes | CI |
| Network budget | Playwright resource assertions | no third-party request before interaction; one font file | CI |

**No new dependency alternative (documented, not recommended).** A `node:test` script plus string assertions
over `dist/**/*.html` can cover heading counts, landmark presence, and skip-link ordering without any new
package — but it cannot verify focus behaviour, computed contrast, reflow, or form state transitions, which
are exactly the four areas where the confirmed defects live. If adding Playwright is rejected, Phase 7
degrades to a structural script and Phases 2/3/5 acceptance criteria become **manual-only per release**,
which must be recorded as a known risk rather than silently accepted.

### Manual (required)

| Check | When | Pass condition |
| --- | --- | --- |
| Keyboard-only completion of the contact form | every phase touching the form | no pointer, no trap, focus never on `<body>` |
| Screen reader (NVDA/VoiceOver) over all form states | Phases 2 and 8 | every state announced; summary navigable |
| 400 % zoom at 1280 px | Phases 1, 5, 8 | no horizontal scroll |
| 200 % text-only zoom | Phase 8 | no clipping |
| `prefers-reduced-motion` | Phases 1, 3, 6 | no transitions/scroll animation |
| Both colour schemes, every route | every visual phase | measured contrasts recorded |
| No-JS | Phases 2, 8 | no JSON document, fallback visible |
| Real iOS + Android device | Phase 8 | menu panel, keyboard type, tap sizes |
| Longest content (`#work`) at 375 px | Phases 4, 5, 8 | no clipping, recorded height |

### Not proposed

- **Visual regression snapshots.** Churn would be high during Phases 1–5 and the value arrives only after
  stabilisation. Re-evaluate after Phase 8.
- **Safari/Firefox projects.** Worth adding once the Chromium suite is stable; note that the client uses no
  non-standard APIs.
- **Performance assertions in CI.** No reliable baseline on shared runners; use production RUM.

---

## 13. Decision Log

**D-1 — Build on the existing Tailwind tokens instead of introducing a design-system package.**
*Alternatives:* adopt a component library (shadcn-style), or a CSS framework with its own tokens.
*Rejected:* the entire UI is 12 components and ~1,000 lines; a library would add a dependency, a second
styling vocabulary, and a second source of truth for colour. *Decision:* extend `@theme` with five semantic
tokens. *Evidence:* the palette is already centralised and correct apart from one overloaded token.

**D-2 — Split `--color-border` into decorative and control tokens rather than darkening the existing one.**
*Alternatives:* darken `--color-border` globally. *Rejected:* it would turn every hairline into a heavy rule
and change the visual identity far beyond the defect. *Confidence:* high.

**D-3 — Do not change the Worker's JSON response bodies.**
*Alternatives:* add a `code` field; return structured validation errors.
*Rejected:* the current `{"error": "..."}` bodies appear as recorded output in archived plans
(`2026-10-15-portfolio-regtech-site.md` lines 1188/1214/1934, `2026-10-19-security-audit-remediation.md`
lines 383/402). Altering them falsifies the record, and per `.github/instructions/plans.instructions.md` a
recorded output must never be rewritten. Deriving the message from the HTTP status code is sufficient for the
seven outcomes and requires no server change. *Residual gap:* a 400 can mean four different things
(honeypot, elapsed, invalid field, invalid email) — mitigated by client validation catching all of them
first, so a 400 that reaches the user is almost certainly an email-format disagreement, which the message
names explicitly.

**D-4 — Keep the 303-to-thanks success flow instead of an inline success state.**
*Alternatives:* render success in place. *Rejected:* inline success duplicates the Worker's redirect target,
breaks back/forward semantics, and leaves the dead `successMessage` key tempting someone to implement it.
*Follow-up:* delete that key (C13).

**D-5 — Dedupe case-study content by keeping the `<dl>` summary and removing the three prose sections.**
*Status:* **proposed, awaiting owner sign-off.** *Alternatives:* keep prose and delete the `<dl>`; keep both
and demote prose to `####`. *Trade-off:* removing prose deletes authored detail ("Discrepancy Engine",
"Observability Dashboard") that the `<dl>` does not carry. If the owner prefers to keep prose, the correct
fallback is D-5b: keep both blocks, demote the three headings to `####`, and reword the `<dl>` labels so they
summarise rather than duplicate. **Do not implement either until the owner chooses.**
*Decided 2026-10-19:* the owner chose **D-5b now, D-5 (delete the prose) later**. Implemented in Phase 4:
prose headings are `####` and use the same three terms as the `<dl>`; deleting the prose stays open.

**D-6 — Hide the form without JavaScript rather than making it work without JavaScript.**
*Alternatives:* make the no-JS path succeed. *Rejected:* impossible — Turnstile cannot mint a token without
JS, and loosening the `elapsed` gate does not change that. *Decision:* `html.js` marker + static fallback.
*Consequence:* the Worker needs no change for correctness; a `text/html` branch is optional hardening only.

**D-7 — Use a sitemap `filter` to exclude thanks pages rather than a `robots.txt` disallow.**
*Alternatives:* `Disallow: /contact/thanks/`. *Rejected:* `robots.txt` blocks crawling but a URL can still be
indexed from external links, and it would also block the `noindex` from being read. *Decision:* `noindex`
meta on the page **and** exclusion from the sitemap; leave `robots.txt` permissive.

**D-8 — Do not make the header sticky in this plan.**
*Alternatives:* sticky header, or a back-to-top button. *Reason deferred:* both interact with fragment
scrolling (`scroll-margin-top`), with the mobile keyboard, and with the scroll-spy; bundling them with the
menu fix would make Phase 3 unreviewable. *Decision:* record it as a follow-up (UX-019) to be approved after
Phase 3 ships.

**D-9 — Treat the ~83-character line length as a consistency issue, not a WCAG failure.**
WCAG 2.2 AA has no line-length criterion (1.4.8 at AAA suggests ≤80). The repo declares `--measure: 68ch` and
never uses it, which is a maintainability defect regardless. *Decision:* consume or delete the token; do not
present the change as an accessibility fix.

**D-10 — Add Playwright rather than a DOM-parsing script.**
*No-new-dependency alternative exists* (see §12) but cannot test focus, contrast, or reflow. *Decision:* add
`@playwright/test` + `@axe-core/playwright` as **dev** dependencies only; nothing ships to the Worker.

**D-11 — Keep wrapping `<label>` elements; add ids only for `aria-describedby`.**
Wrapping labels already yield correct accessible names. Replacing them with `for`/`id` would be churn with no
benefit. ids are added solely so hints and errors can be referenced.

**D-12 — Derive form ids from field names, not counters.**
Deterministic markup keeps the build reproducible and makes test selectors stable.

**Decisions still requiring product input:** D-5 (dedupe strategy), UX-011 (privacy wording and whether a
policy is required), UX-027 (imagery/client evidence), UX-028 (analytics scope), D-8 (sticky header).

---

## 14. Open Questions

**Q-1 — Which case-study content is canonical: the `<dl>` summary or the prose?**
*Why it matters:* determines whether Phase 4 deletes authored copy and whether `content.config.ts` loses three
fields across nine files.
*Who:* site owner.
*Can implementation proceed?* Phases 1–3 and 5–7 can. Phase 4 cannot.
*Safe default:* do nothing; leave both blocks and only demote the three prose headings to `####` (reversible).

**Q-2 — Is a privacy policy required, and who authors it?**
*Why it matters:* UX-011 blocks the notice copy; an implementer must not invent legal text.
*Who:* site owner (possibly with legal review).
*Can implementation proceed?* Yes, except C7 and the policy page.
*Safe default:* ship the purpose/retention sentence without a policy link, and add the link when the page
exists. If even that is unacceptable, leave the copy untouched.

**Q-3 — May client names, logos, or anonymised case-study artefacts be published?**
*Why it matters:* the strongest trust lever for a B2B consultancy, but market-surveillance work is often
confidential.
*Who:* site owner.
*Can implementation proceed?* Yes — out of scope for this plan.
*Safe default:* no imagery.

**Q-4 — What is the intended priority between "book a call" and "send a message"?**
*Why it matters:* determines the CTA hierarchy in Phase 5/C10 and whether the hero primary CTA should stay
external.
*Who:* site owner.
*Can implementation proceed?* Yes, with the conservative default of leaving destinations unchanged and only
unifying the **labels**.
*Safe default:* form primary in the contact section, booking secondary.

**Q-5 — Are there legal or insurance constraints on stating a response time ("1–2 business days")?**
*Why it matters:* the thanks page and the proposed rate-limit copy make a promise.
*Who:* site owner.
*Can implementation proceed?* Yes — the current copy already states it; the plan reuses it rather than
inventing a new commitment.

**Q-6 — Is the account's Turnstile sitekey allowlist configurable to include the flexible-size widget and
the preview hostname?**
*Why it matters:* the local preview currently errors with `TurnstileError 110200` because `127.0.0.1` is not
allowed; this limits how much of the widget can be verified locally.
*Who:* site owner (Cloudflare dashboard).
*Can implementation proceed?* Yes — the 320 px fix does not depend on a live widget, but the *verification*
does. Without it, verify with the test sitekey via `PUBLIC_TURNSTILE_SITE_KEY`.
*Safe default:* use the always-passes test sitekey for layout verification and accept that the happy path
cannot be exercised end-to-end (already documented in `AGENTS.md`).

---

## 15. Implementation-Agent Handoff

**Recommended first phase:** Phase 1. It is behaviour-neutral, unblocks the contrast and skip-link criteria,
and produces the primitives every later phase consumes.

**Required implementation order:** 1 → (2 ‖ 3) → 4 → 5 → 6 → 7 → 8. Never start Phase 5 before Phase 4; both
edit `CaseStudy.astro`. Never start Phase 6 before Phase 2; both edit the widget markup.

**Files to inspect first (in this order):**

1. `AGENTS.md` — hard rules; then the scoped instruction matching the file you are about to edit.
2. `src/styles/global.css` — the entire token system, and the `@theme`-vs-`@media` constraint.
3. `src/layouts/BaseLayout.astro` — what a page shell already provides.
4. `src/components/ContactForm.astro` — the only interactive surface; read the whole script block.
5. `src/worker/index.ts` — the validation rules the client must mirror, and the outcomes it must name.
6. `src/i18n/en.ts` — the `Dictionary` contract that forces parity.
7. `src/components/SiteHeader.astro` — the mobile panel defect and the only other script.

**Constraints to preserve (non-negotiable):**

- Astro components only; no React/Vue/Svelte; no new runtime dependency.
- `output: 'static'`; no adapter; do not touch `astro.config.mjs` CSP directives.
- **No inline `style` attributes** and no new component `<style>` blocks — both interact with the CSP hashing
  that `AGENTS.md` documents.
- `worker-configuration.d.ts` is generated; never edit it by hand.
- `src/i18n/en.ts` must not be frozen or const-asserted; every key added there must be added to `ca` and `es`
  in the same commit.
- The `TODO(copy)` / `REPLACE_ME` guard scans comments too — do not write those tokens anywhere under `src/`.
- Do not commit, push, deploy, or run `wrangler rollback` / `wrangler secret` without explicit authorisation.
- Do not reformat `.ai/**` (it is Prettier-ignored).
- Never rewrite recorded command output in a plan; add a dated correction note.

**Validation commands (in this order):**

```bash
npm ci
npm run format:check
npm run lint
npm run check            # expect "30 files, 0 errors, 0 warnings, 0 hints" unless files were added
npm run build            # expect the 7 pages
npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
# after Phase 7 exists:
npm run test:e2e
```

Note: `npm run check`'s file count changes if new components/pages are added — record the new expected number
in the phase evidence rather than treating a different count as a failure.

**Manual checks required before completion:** the full table in §12, recorded with measurements. At minimum:
keyboard-only form completion, focus never on `<body>`, 320 px with no horizontal scroll, both colour schemes'
control-boundary contrast numbers, and the no-JS run.

**Definition of done:**

1. All eight phases' acceptance criteria are checked, or explicitly marked deferred with a reason.
2. The gate passes with the recorded output pasted into this plan.
3. Every measurement in §5 that a phase claimed to fix is re-measured and recorded next to the original.
4. No source change exists that is not listed in §3.
5. This plan has a `## Archive Metadata` footer when it moves to `archive/`.

---

## 16. Coverage and Limitations

### Files reviewed

`astro.config.mjs`; `package.json`; `wrangler.jsonc`; `public/_headers`; `public/robots.txt`;
`eslint.config.js`; `.github/workflows/ci.yml`; `scripts/check-placeholders.mjs`;
`src/layouts/BaseLayout.astro`; `src/pages/index.astro`, `src/pages/404.astro`,
`src/pages/[lang]/index.astro`, `src/pages/contact/thanks.astro`, `src/pages/[lang]/contact/thanks.astro`;
`src/components/{Hero,HomeSections,ServiceCard,CaseStudy,ContactSection,ContactForm,SiteHeader,SiteFooter,
LanguagePicker}.astro`; `src/i18n/{en,ca,es,config,index}.ts`; `src/config.ts`; `src/content.config.ts`;
`src/styles/global.css`; `src/worker/index.ts`; all `src/content/**/*.md` (headings + frontmatter);
`README.md`; `AGENTS.md`; the four `.github/instructions/*.md` files relevant to the touched paths;
`.ai/plans/active/2026-10-19-security-audit.md` (partial); `.ai/plans/archive/*` (grep only, for recorded
Worker output).

### Routes rendered

`/`, `/404.html`, `/contact/thanks/`, `/ca/contact/thanks/` — served from the local `dist/` via
`npm run preview`. `/ca/` and `/es/` were inspected as source and via the shared components but not rendered
and measured; they differ only by dictionary strings. `POST /api/contact` was **not** exercised.

### Viewports tested

320, 375, 640, 768, 1024, 1440 CSS px. Also: `prefers-color-scheme: light` and `dark` emulation. Not tested:
real iOS/Android browsers, Safari, Firefox, 400 % zoom (inferred from the 320 px measurement), 200 % text-only
zoom.

### User journeys examined

All nine in §4, by DOM inspection and measurement. None were observed with a real user.

### Commands and tools used

```console
$ date +%Y-%m-%d
2026-10-19
$ git status --short
                                    # empty: clean
$ git rev-parse --short HEAD
3cc7b3b
$ npm run preview                   # static server on :4321; stopped with `npx astro preview stop`
                                    # (no build, no mutation)
$ npx astro preview stop
preview stop exit=0
```

Browser automation (Playwright via the editor's browser tools) against `http://127.0.0.1:4321`, measuring
geometry, computed styles, contrast ratios, accessibility snapshots and hover/focus submit behaviour. No
files were written by the automation; screenshots could not be retrieved from the remote browser host and are
therefore not cited.

Static inspection:

```console
$ grep -rohE '\b(sm|md|lg|xl|2xl):' src/ | sort | uniq -c
     19 sm:
$ grep -rohE 'max-w-[a-z0-9]+' src/ | sort | uniq -c
     10 max-w-2xl
      1 max-w-3xl
      9 max-w-5xl
      2 max-w-none
$ grep -rn -- '--measure' src/
src/styles/global.css:19:  --measure: 68ch;
$ grep -rn 'style=' src/
                                    # none: no inline style attributes (CSP-safe)
$ grep -rnE '^#{1,6} ' src/content/ | awk -F: '{print $3}' | sort | uniq -c
     27 ### (three per case study × three locales, plus services with none)
```

Recorded measurements (verbatim from the browser session):

```
320px  scrollWidth 324  clientWidth 305  gridTemplateColumns "300px"  form width 257  turnstile left 24
375px  scrollWidth 360  clientWidth 360  #site-nav open: display block, x 145, w 191, h 190
640px  service card 176  padding 24  dl columns "176.328px 176.328px 176.328px"
768px  service card 219  dl columns "219px 219px 219px"
1440px scrollWidth 1425 clientWidth 1425  container 1024
light  input border 1.24:1 vs page; input bg 1.06:1 vs page; muted text 6.00; accent 5.13; button 5.13
dark   input border 1.23:1 vs surface; muted text 7.41; accent 7.11; button 7.91
page heights: 375px 16,779 (#contact at 15,085); 1440px 8,098 (#contact at 6,721)
form submit: submitting { text "Submitting...", disabled true, ariaBusy null, active "BODY:" }
             after failure { active "BODY" }, values preserved, status = single generic sentence
```

### Tests not performed

- No production deployment, no `wrangler dev`, no form submission anywhere (production or preview).
- No build, lint, type-check, or dry-run deploy was executed (Architect-mode restriction). The `dist/` inspected
  is a pre-existing local artifact.
- No screen reader (NVDA/JAWS/VoiceOver/TalkBack) was run; every screen-reader claim in §9 is a *requirement*,
  not a verified result.
- No real device, no Safari/Firefox, no 400 %-zoom session.
- No analytics, session replay, heatmap, or user interview.
- No automated axe run against the rendered pages (axe-core is installed but no browser harness exists yet).

### Remaining blind spots

1. **`/ca/` and `/es/` rendered output** — inferred from shared components, not measured. Long Spanish/Catalan
   strings may wrap differently in the hero `h1` and the select options.
2. **The Turnstile widget's rendering** — it errored locally (`110200`, hostname not allowed), so the widget's
   intrinsic width was measured on a failed-to-render container. The 300 px grid column is real (it is the
   widget wrapper's width), but confirm on a hostname the sitekey allows.
3. **`dist/` freshness** — `dist/index.html` mtime `13:09` vs `src/layouts/BaseLayout.astro` mtime `13:11`.
   Re-verify every BaseLayout claim after a fresh `npm run build`.
4. **CLS from the font swap** — the layout-shift observer did not start at navigation start; the recorded `0`
   is not evidence of absence.
5. **Whether the `latin` subset truly covers Catalan and Spanish** — supported by the single-file fetch on `/`
   but not measured on `/ca/`.
6. **Real conversion impact** of every UX-014/UX-019/UX-027 point — none is measurable from the repository.

---

## 17. Repository Integrity

- **No application changes were implemented.** Only this file was created, under `.ai/plans/active/`.
- **No source files were modified.** No file under `src/`, `public/`, `scripts/`, `.github/`, or the repo root
  was edited.
- **No build, format, lint, or type-check command was run.** No `dist/` content was regenerated.
- **No deployment was performed.** No `wrangler deploy`, no `wrangler rollback`, no `wrangler secret`.
- **No production form was submitted.** The only request to production was a read-only `GET /api/contact`,
  which the Worker answers `405` without side effects; it is recorded in §5 UX-010.
- **A local static preview server was started and stopped** (`npm run preview` → `npx astro preview stop`,
  exit 0) purely to measure rendered geometry. It serves files; it does not build or mutate.

Final status, captured after stopping the server:

```console
$ npx astro preview stop >/dev/null 2>&1; echo "preview stop exit=$?"
preview stop exit=0
$ git status --short
                                    # empty
$ git rev-parse --short HEAD
3cc7b3b
```

The only expected addition to the working tree is this plan file itself:

```console
$ git status --short
?? .ai/plans/active/2026-10-19-ui-ux-improvement.md
```
