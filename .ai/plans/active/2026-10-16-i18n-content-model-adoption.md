# Task Plan: Adopt the richer i18n content model (`vgr.cat`)

**Status: ACTIVE — awaiting the owner decisions in §8 before Phase 1 starts.**

---

## 1. Context & Objectives

### The situation, as measured

`vgr.cat` is a static Astro 7 site on Cloudflare Workers static assets plus one Worker script
(`src/worker/index.ts`, `POST /api/contact`). Its UI copy lives in three typed dictionaries under
`src/i18n/`:

- `src/i18n/en.ts` exports `const en` and `type Dictionary = typeof en`.
- `src/i18n/ca.ts` and `src/i18n/es.ts` are annotated `: Dictionary`, so **structural parity across
  locales is the guarantee the type exists to provide**. Their values are still `TODO(copy) [ca]` /
  `[es]` sentinels.
- `src/i18n/index.ts` builds `dictionaries: Record<Locale, Dictionary>` and `useTranslations(locale)`.

On 2026-10-16 the owner authored a richer English content model as `export default { … } as const` and
dropped it into `src/i18n/en.ts`. It broke the build (4 × `ts(2614)`) **and** the dev server at runtime
(no named `en` export → `dictionaries[locale]` was `undefined` → every `t.*` access threw). It was parked
verbatim into `.ai/plans/active/2026-10-16-en-content-model-input.md` — **that file is the primary design
input for this plan and is quoted throughout.** `en.ts` was reshaped back to the working contract the same
day, mapping the owner's English into whichever slots had a faithful equivalent.

### Goal

Turn the parked model into the real content model: a new `Dictionary` shape adopted across all three
locales, every new element rendered by a real consumer, the contact form's new fields carried across the
network boundary into the Worker, `thanks` / `notFound` closed, Catalan and Spanish produced to the
standing register requirement, and the `TODO(copy)` hatch retired in the same change — which is exactly
what Task 6.6 of the in-flight plan is blocked on (see §5.6).

### What this plan deliberately does **not** decide alone

Six items change settled or AGREED decisions (the Positioning section, the case-study IA,
`footer.legal`, the contact form's success model, `footer.builtWith`, and where the JSON-LD title comes
from). Per `AGENTS.md` hard rule 6 those are raised in §8 with a recommendation rather than silently
applied. **Phases 1–3 can proceed on the recommendations; Phase 4 cannot finish until §8 is answered.**

### Evidence gathered (read-only, 2026-10-16)

Recorded verbatim. **The verification gate was not run** — this is an Architect-mode pass, so nothing was
built, mutated or migrated.

```
$ git --no-pager log --oneline -3
b542494 (HEAD -> main, origin/main, origin/HEAD) docs(agents): retire the 'no Worker script' claim and record post-deploy checks
dd08ecf ci(deploy): gate deploys on a passing CI run instead of on push
5344519 docs: record that main accepts direct pushes with signed commits

$ git status --porcelain
 M .ai/plans/active/2026-10-15-portfolio-regtech-site.md
 M .github/instructions/cloudflare-config.instructions.md
 M README.md
 M src/content/caseStudies/eu-inspection-tooling.en.md
 M src/content/caseStudies/topten-ecosystem.en.md
 M src/content/caseStudies/topten-scout.en.md
 M src/content/services/entity-resolution.en.md
 M src/content/services/infrastructure.en.md
 M src/content/services/regtech.en.md
 M src/i18n/en.ts
?? .ai/plans/active/2026-10-16-en-content-model-input.md

$ node scripts/check-placeholders.mjs
check:placeholders — 145 placeholder(s) across 16 file(s):
    1  src/components/HomeSections.astro
    6  src/content/caseStudies/eu-inspection-tooling.ca.md
    6  src/content/caseStudies/eu-inspection-tooling.es.md
    6  src/content/caseStudies/topten-ecosystem.ca.md
    6  src/content/caseStudies/topten-ecosystem.es.md
    6  src/content/caseStudies/topten-scout.ca.md
    6  src/content/caseStudies/topten-scout.es.md
    3  src/content/services/entity-resolution.ca.md
    3  src/content/services/entity-resolution.es.md
    3  src/content/services/infrastructure.ca.md
    3  src/content/services/infrastructure.es.md
    3  src/content/services/regtech.ca.md
    3  src/content/services/regtech.es.md
   38  src/i18n/ca.ts
   14  src/i18n/en.ts
   38  src/i18n/es.ts

Replace with final copy before deploying (D9).
exit=1
```

`145 = 144 × TODO(copy) + 1 × REPLACE_ME`. The `REPLACE_ME` is
`src/components/HomeSections.astro:102: bookingHref="https://cal.example/REPLACE_ME"` — the guard counts
it, so "zero sentinels" requires a real booking URL, not just copy (§7).

**Not re-verified here, and therefore not asserted:** `astro check` (30 files) and the Wrangler dry-run
("Read 32 files"). Both are taken from `AGENTS.md` and from the in-flight plan's Task 6.1 recording; they
are re-measured in Phase 5.

### Correction to the brief supplied for this plan

The brief states Task 6.6 is "blocked on ~196 `TODO(copy)` sentinels". **The measured number today is
145 across 16 files**, and the in-flight plan's own §6 says "~196". The reason for the drop is visible in
the working tree: the six **English** Content-Collection entries have already been authored (they are
modified and no longer contain a sentinel), so the EN copy for services and case studies now lives in
`src/content/**/*.en.md`. The remaining sentinels are the **CA/ES collections** (54) plus the three
dictionaries (90). This plan works from 145, and Phase 4 drives it to 0.

### RECORDED 2026-10-16, after this plan was written — three of its own items were already applied

The owner supplied the outstanding inputs the same day, and the smallest of them were applied immediately
rather than queued for a Builder. **The `145` above is left standing as the measurement it was** — it was
correct when run — and this is the dated update to it:

```
$ npm run check:placeholders
check:placeholders — 135 placeholder(s) across 15 file(s):
...
Replace with final copy before deploying (D9).
exit=1
```

- **Task 4.4 is done — with one deliberate deviation from its wording.** The scheduler URL is
  `https://calendar.app.google/3dd7SXGnZqUZsWXm6`, and it lives in `src/config.ts` as
  `export const bookingUrl` — beside `turnstileSiteKey` / `turnstileAction`, where this repo already keeps
  build-time constants — rather than inline in `src/components/HomeSections.astro`, which now imports it.
  That is this task's real intent ("so the two CTAs cannot drift") made structural: the Phase 2 CTAs should
  import the same constant instead of re-declaring the link. Verified in the built output — the URL is
  present in `dist/index.html`, `dist/ca/index.html` and `dist/es/index.html`, and `REPLACE_ME` appears
  nowhere under `dist/`. This also settles **O5**.
- **Task 4.3's English half is done.** `thanks.*` and `notFound.*` now carry final English copy in
  `src/i18n/en.ts`, authored on the owner's request. `ca` and `es` remain, so the task **stays unticked** —
  partial work is never ticked here. This answers **O3**'s English question.
- **Task 1.1's comment rewording is done.** `en.ts`'s doc comment no longer contains the literal
  `TODO(copy)`, so the guard stops counting the module's own prose. Task 1.1's *substance* — rewriting
  `en.ts` to the §4.1 shape — is untouched and stays unticked.

Gate re-run after those edits, all on 2026-10-16: `format:check` clean, `lint` clean, `astro check`
**30 files, 0 errors, 0 warnings, 0 hints**, build **7 pages**, `wrangler deploy --dry-run` exit 0 with
**"Read 32 files"** — so the pinned numbers quoted in §1 still hold.

---

## 2. Constraints & Non-Goals

### In scope

- The `Dictionary` / `en` shape change, `ca`/`es` realigned to identical keys, and the type pattern that
  preserves parity.
- New rendering for every element the parked model introduces that has no consumer today (§4.3).
- The contact form's new fields (`organization`, service type) with the Worker changes they imply.
- Closing `thanks.*` and `notFound.*`, and the placement of English copy the parked model never carried.
- Catalan and Spanish production to the standing institutional-register requirement.
- Retiring the `TODO(copy)` hatch and the D9 guard's conditional.

### Out of scope / non-goals

- **No `as const` on the dictionaries** (see §4.5) — it is the specific thing that broke the module.
- **No new runtime dependency.** Tailwind 4 tokens are read from `@theme` in `src/styles/global.css`;
  no palette is invented.
- **No client-side framework.** Astro components only.
- **No CSP in `public/_headers`**, ever, and **no hand-written `script-src`/`style-src`.
- **No adapter, no SSR.** `output: 'static'` stays; pages stay prerendered.
- **No `git commit` / `push` / `reset` / `rebase`** without explicit authorisation, and no
  `wrangler rollback` or `wrangler secret put/delete`.
- **No confidential disclosure** — case-study copy stays within the personal-contribution / public-
  regulatory-context envelope the in-flight plan set.
- **No new legal pages or case-study detail pages** unless §8 says otherwise.
- **No art direction.** This plan specifies structure and token usage only.

### Decision register

Resolved by this plan from verified evidence:

| ID | Decision | Basis |
| --- | --- | --- |
| **C1** | `Dictionary = typeof en`, derived from an **unasserted** `export const en`. `as const` stays out. | §4.5; the original breakage |
| **C2** | Adopt the parked model's `site` / `nav` / `hero` / `services` / `caseStudies` / `about` / `contact` / `footer` grouping, with the `header`, `thanks` and `notFound` groups retained because consumers read them | §4.1 / §4.2 |
| **C3** | `ca`/`es` are realigned to the new keys in the **same commit** as `en`, values still sentinelled where untranslated — structure now, copy in Phase 4 | keeps `astro check` green after every phase |
| **C4** | Pillar **titles** stay owned by the Content Collections; the dictionary carries only the pillar `tag`. Dictionary pillar keys are the collection `pillar` enum values (`'regtech'`, `'entity-resolution'`, `'infrastructure'`) so no mapping table is needed | §4.4; measured title drift |
| **C5** | Case-study `problem`/`approach`/`outcome` labels move to `caseStudies.labels.*`; their **values** stay in the collections | current `CaseStudy.astro` props |
| **C6** | `footer.copyright` leaves the dictionary; the year is computed in `SiteFooter.astro` | a `new Date()` in a data module is non-deterministic per build |
| **C7** | The booking link is an `<a href>` to an external scheduler — **not** an iframe | an iframe would need a new `frame-src` entry; a link needs no CSP change |
| **C8** | The contact form keeps its **no-JS native POST → 303** as the baseline; the parked model's `submitting`/`successMessage`/`errorMessage` are adopted only under the §8/O6 decision | current `ContactForm.astro` works with JavaScript disabled |
| **C9** | The honeypot field is **renamed** away from `company`, because the parked model introduces a real "Organization / Institution" field | a real field must not be confusable with the trap |

Open — needing the repository owner (§8): **O1–O9**.

---

## 3. Files Affected

### Dictionaries and types
- `src/i18n/en.ts` — `[Modify]` — the new shape, the new English copy, and a reworded header comment
  (it currently contains the literal `TODO(copy)`, which the guard counts).
- `src/i18n/ca.ts`, `src/i18n/es.ts` — `[Modify]` — realigned to the same keys; sentinels where copy is
  still pending, real copy in Phase 4.
- `src/i18n/index.ts` — `[Verify, likely unchanged]` — `dictionaries` / `useTranslations` surface.
- `src/i18n/config.ts` — `[Unchanged]` — locales, `Locale`, path helpers.

### Rendering consumers (all existing files — see the pinned-count note in Phase 5)
- `src/components/Hero.astro` — `[Modify]` — badge, split title, two CTAs, `metrics[]`.
- `src/components/HomeSections.astro` — `[Modify]` — every section's new props; also carries the
  `REPLACE_ME` booking URL and builds nothing itself (it delegates).
- `src/components/ServiceCard.astro` — `[Modify]` — a `tag` prop for the pillar eyebrow.
- `src/components/CaseStudy.astro` — `[Modify]` — retargeted label props; `readFull`/`backToList`
  pending O2.
- `src/components/ContactSection.astro` — `[Modify]` — eyebrow, subtitle, `directContact.*`.
- `src/components/ContactForm.astro` — `[Modify]` — organisation, service type, states, honeypot rename.
- `src/components/SiteFooter.astro` — `[Modify]` — tagline, `builtWith`, the computed year.
- `src/components/SiteHeader.astro` — `[Modify]` — optional `bookCall` CTA (O5).
- `src/components/LanguagePicker.astro` — `[Unchanged]` — reads no dictionary.
- `src/layouts/BaseLayout.astro` — `[Modify]` — `t.site.title` / `t.site.description`.
- `src/lib/schema.ts` — `[Modify]` — JSON-LD source keys (see §5.1, Task 1.5).
- `src/pages/index.astro`, `src/pages/[lang]/index.astro` — `[Modify]` — the `nav` array is built **in
  the page**, so the `nav.work` → `nav.caseStudies` rename lands here.
- `src/pages/404.astro` — `[Modify]` — reads `dictionaries[locale].notFound` **directly**, bypassing
  `useTranslations`; keep that contract or update it deliberately.
- `src/pages/contact/thanks.astro`, `src/pages/[lang]/contact/thanks.astro` — `[Modify]` — `thanks.*` copy.

### Worker
- `src/worker/index.ts` — `[Modify]` — service-type whitelist, organisation validation, honeypot field
  name, notification/auto-reply bodies.
- `src/config.ts` — `[Unchanged]` — Turnstile sitekey / action.
- `wrangler.jsonc` — `[Unchanged expected]` — vars, secrets and `send_email` bindings are unaffected by
  new *fields*.

### CI, guard and docs
- `.github/workflows/ci.yml` — `[Modify]` — drop the `vars.ALLOW_PLACEHOLDER_COPY` conditional so the
  guard is unconditional (Phase 4).
- `scripts/check-placeholders.mjs` — `[Unchanged]` — its two patterns are what define "zero".
- `AGENTS.md` — `[Modify]` — pinned numbers if they move, and the hatch retirement.
- `.ai/plans/active/2026-10-15-portfolio-regtech-site.md` — `[Modify]` — cross-reference and close 6.6.

---

## 4. The target contract (the shape decision)

### 4.1 Adopted shape — specification, not copy

The groups below are the decision. Values are **not** repeated here; the EN values come from the parked
model verbatim, and the CA/ES values are Phase 4's work.

```
site          title, description, author, location, jobTitle        (new group; replaces `meta`, adds author/location/jobTitle)
nav           services, caseStudies, about, contact, bookCall      (`work` renamed to `caseStudies`)
header        brand, menuLabel, primaryNavLabel, languageNavLabel   (retained from the current shape)
hero          badge, title, titleHighlight, subtitle, ctaPrimary, ctaSecondary, metrics[{ value, label }]
services      eyebrow, title, subtitle, ctaLearnMore, pillars{ <pillar enum>: { tag } }
caseStudies   eyebrow, title, subtitle, labels{ problem, approach, outcome }
about         eyebrow, title, paragraphs[], techStackTitle, competencies[]
contact       eyebrow, title, subtitle, form{ … }, directContact{ orDivider, calendarButton, emailDirect, locationLabel, locationValue, timezone }
thanks        title, heading, body, back                            (retained; parked model has no equivalent)
notFound      title, heading, body, back                            (retained; same reason)
footer        tagline, builtWith
```

`contact.form` grows by: `organizationLabel` / `organizationPlaceholder`, `serviceTypeLabel`,
`serviceTypes{ regtech, entityResolution, infrastructure, advisory }`, `submitting`, `successMessage`,
`errorMessage`. It **keeps** `turnstile`, which the parked model omits but the form still renders.

### 4.2 Key mapping — retired, renamed, retained

| Current key | Becomes | Note |
| --- | --- | --- |
| `meta.title`, `meta.description` | `site.title`, `site.description` | rename |
| `nav.work` | `nav.caseStudies` | **the anchor stays `#work`** — it is a public URL fragment |
| `hero.cta` | `hero.ctaPrimary` | plus new `ctaSecondary` |
| `positioning.heading`, `positioning.body` | **retired** *(pending O1)* | the parked model has no `positioning` group |
| `services.heading` | `services.title` | rename |
| `work.heading` | `caseStudies.title` | rename |
| `caseStudy.problem/approach/outcome` | `caseStudies.labels.*` | same values |
| `about.heading` | `about.title` | rename |
| `about.body` | `about.paragraphs[0]` | the parked model's first paragraph is that sentence |
| `contact.heading` / `body` / `bookingLabel` | `contact.title` / `subtitle` / `directContact.calendarButton` | rename |
| `form.*` | `contact.form.*` | nested |
| `footer.note` | `footer.tagline` | rename |
| `footer.copyright` | **retired** | computed in `SiteFooter.astro` (C6) |
| `footer.legal.*` | **deferred** *(pending O3)* | the pages do not exist |
| `header.*` | **retained unchanged** | see §4.3 |
| `thanks.*`, `notFound.*` | **retained** | no parked equivalent; closed in Phase 4 |

Retired from the **parked** model, with reasons: `nav.ariaToggleMenu` and `nav.ariaLanguageSelect`
(duplicate `header.menuLabel` / `header.languageNavLabel`); `services.pillars.*.title` (collection-owned,
C4); `caseStudies.labels.readFull` / `backToList` (pending O2).

### 4.3 Keys the parked model introduces that nothing renders yet

Verified against the 16 consumers listed in §3. Each needs its own rendering task in Phase 2:

`site.author`, `site.location`, `nav.bookCall`, `hero.badge`, `hero.titleHighlight`, `hero.ctaPrimary`,
`hero.ctaSecondary`, `hero.metrics[]`, `services.eyebrow`, `services.subtitle`, `services.ctaLearnMore`,
`services.pillars.*.tag`, `caseStudies.eyebrow`, `caseStudies.subtitle`, `about.eyebrow`,
`about.paragraphs[1..2]`, `about.techStackTitle`, `about.competencies[]`, `contact.eyebrow`,
`contact.subtitle`, `contact.form.organization*`, `contact.form.serviceType*`, `contact.form.submitting`,
`contact.form.successMessage`, `contact.form.errorMessage`, `contact.directContact.*`,
`footer.tagline` (partially), `footer.builtWith`.

### 4.4 Collection content vs UI copy — the duplication boundary

The parked model duplicates two things the Content Collections already own. Measured:

| Parked dictionary value | Collection value | Verdict |
| --- | --- | --- |
| `services.pillars.regtech.title` = "RegTech & EPREL Compliance Engines" | `regtech.en.md` title — identical | duplicate |
| `services.pillars.entityResolution.title` = "Product Entity Resolution & Observability" | `entity-resolution.en.md` title = "Product Entity Resolution & **Market** Observability" | **drift** |
| `services.pillars.infrastructure.title` = "Multi-Tenant Platforms & Internal Tooling" | `infrastructure.en.md` title = "Multi-Tenant **Cloud** Platforms & **Custom** Tooling" | **drift** |

The drift is the argument, not a nitpick: two of three titles already disagree. **Rule for this plan:** per-
entry, per-locale long-form copy stays in `src/content/**` (linked by `translationKey`); UI micro-copy,
section eyebrows/labels/subtitles and the pillar `tag` live in the dictionary. Single-instance page prose
that has no collection (`about.paragraphs`, `hero.metrics`, `about.competencies`) stays in the dictionary
— the `Dictionary` type gives cross-locale parity for free, whereas the collection schema only types
`locale` as an enum and does **not** require a `ca` entry to exist for every `translationKey`.

### 4.5 The type pattern — why `as const` stays out, and the sanctioned fallback

`export const en = { … } as const` gives every value a **literal** type, so `type Dictionary = typeof en`
would demand that `ca.ca` be the string `'Services'` — no translation could ever satisfy it. That is the
mechanism that produced the 4 × `ts(2614)`.

**Adopted (C1): no assertion.**

```ts
// specification
export const en = { /* … */ };          // no `as const`
export type Dictionary = typeof en;     // exact keys; arrays are T[]
```

`ca: Dictionary` / `es: Dictionary` then catch both a missing key and an excess one (excess-property
checking), which is the whole parity guarantee.

**Accepted limitation, stated rather than hidden:** with `T[]` inference, cross-locale **array arity** is
not enforced by the compiler — `ca.hero.metrics` could legally hold two elements. Two options exist:

1. *Recommended:* accept it and treat arity as a review item, since the three metrics are factual
   (`10+`, `EPREL & ESPR`, `100k+`) and their **values** are not translated.
2. *Sanctioned fallback if arity must be enforced:* keep the literal in a separate asserted module for
   arity only, and widen it deliberately —

   ```ts
   // specification
   const arity = { hero: { metrics: [1, 2, 3] }, about: { paragraphs: [1, 2, 3] } } as const;
   type Widen<T> = T extends string ? string
     : T extends readonly (infer U)[] ? Widen<U>[]
     : { -readonly [K in keyof T]: Widen<T[K]> };
   ```

   This **widens the tuple away**, so it does not enforce arity either — which is the honest conclusion:
   `as const` cannot enforce arity without freezing values, and freezing values breaks parity. If arity
   genuinely matters it belongs in an explicit `Dictionary` interface, not in an assertion. This plan
   recommends option 1 and records the reasoning so it is not re-litigated.

---

## 5. Step-by-Step Execution Plan

### Phase 1: The type contract and dictionary shape

**Goal**: the three dictionaries carry identical keys under the new shape, EN values are the owner's, and
the gate is green — with `ca`/`es` still sentinelled where translation is pending.

#### Tasks

- [x] Task 1.1: Rewrite `src/i18n/en.ts` to the §4.1 shape using the parked model's English verbatim.
      Carry the parked values into the retained groups too: `header.brand` stays `'vgr.cat'`,
      `header.menuLabel` / `primaryNavLabel` / `languageNavLabel` keep their current English,
      `contact.form.turnstile` is kept, and `site.jobTitle` is added (O9). **No `as const`.** Reword the
      file's header comment so it no longer contains the literal string `TODO(copy)` — the guard counts
      it (`src/i18n/en.ts` currently reports 14, of which one is that comment).
- [x] Task 1.2: Realign `src/i18n/ca.ts` and `src/i18n/es.ts` to **exactly** the Task 1.1 keys in the
      same change, keeping `TODO(copy) [ca]` / `[es]` values for anything not yet translated. Do not
      restructure them beyond key parity; Phase 4 supplies the copy.

> **RECORDED 2026-10-19 — 1.1 and 1.2 applied together, as C3 requires.** `en.ts` carries the §4.1 shape
> with the parked model's English; `ca.ts` / `es.ts` were realigned in the same change so the module still
> type-checks. Verified: `npx tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module
> ESNext --moduleResolution bundler src/i18n/index.ts` exits 0 (key parity), `grep -n 'as const'
> src/i18n/en.ts` returns nothing, and `en.ts`'s placeholder count fell **14 → 2** (`header.primaryNavLabel`,
> `contact.form.turnstile`). `format:check` and `lint` both exit 0.
>
> Recorded deviations: `header.menuLabel` took the parked `nav.ariaToggleMenu` value ("Toggle navigation
> menu") because §4.2 retires that key as its duplicate and the current value was a sentinel, not English;
> `header.primaryNavLabel` keeps its sentinel (the parked model has no equivalent); `footer.builtWith` is
> reworded to Workers per O7 rather than copied verbatim, because the parked string is false for this
> deployment. The pillar keys use the collection enum (`'entity-resolution'`) per C4, not the parked
> `entityResolution`.
>
> **Gate state at this point:** `npm run check` reports **24 errors in four consumers** —
> `HomeSections.astro` (14), `pages/index.astro` (4), `pages/[lang]/index.astro` (4), `lib/schema.ts` (2).
> Every one is a retired-key reference that Tasks 1.5, 2.3 and 2.8 exist to migrate; no dictionary-internal
> error remains. See the escalation below.
- [x] Task 1.3: Confirm `src/i18n/index.ts` needs no change (`dictionaries`, `useTranslations`,
      the re-exported `Dictionary`). Record what was checked.
- [x] Task 1.4: Update `src/layouts/BaseLayout.astro` to read `t.site.title` / `t.site.description`.
- [x] Task 1.5: Update `src/lib/schema.ts`. It currently feeds `jobTitle: t.hero.title` and
      `description: t.positioning.body`. After the shape change `hero.title` is only a fragment
      (“… for the”) and `positioning` is retired, so **both become wrong**. Point the JSON-LD at
      `t.site.jobTitle` (or an agreed equivalent) and `t.site.description`, and `Person.name` at
      `t.site.author` with `t.site.location` as the address (O9).
- [x] Task 1.6: Run `npm run types && npm run check` and record the file count verbatim.

> **RECORDED 2026-10-19 — Tasks 1.3 to 1.6.**
>
> - **1.3, what was checked:** `index.ts` declares `dictionaries: Record<Locale, Dictionary>`,
>   `useTranslations(locale)` returning `dictionaries[locale] ?? dictionaries[defaultLocale]`, and
>   `export type { Dictionary }`. Nothing in the module names or reads a dictionary key, so the shape change
>   needs no edit and the file is unmodified.
> - **1.4, deviation recorded:** `title` / `description` stay **optional props** defaulting to
>   `t.site.title` / `t.site.description`, rather than the layout taking them exclusively, because the
>   `thanks` and `404` pages legitimately override them. The two index pages still pass `t.meta.*` until
>   Task 2.8 rewrites those props. `useTranslations(lang)` is now evaluated once and reused for `buildJsonLd`.
> - **1.5:** `Person` reads `name: t.site.author`, `jobTitle: t.site.jobTitle`,
>   `description: t.site.description`, `address: t.site.location`; `ProfessionalService.description` reads
>   `t.site.description`. `ProfessionalService.name` keeps `t.header.brand`.
> - **1.6, recorded verbatim:**
>
> ```
> $ npm run check
> Result (30 files):
> - 22 errors
> - 0 warnings
> - 0 hints
> check exit=1
> ```
>
> The 22 are `HomeSections.astro` ×14 (`t.positioning`, `t.hero.cta`, `t.services.heading`, `t.work`,
> `t.caseStudy`, `t.about.*`, `t.contact.*`, `t.form`) and `pages/index.astro` ×4 plus
> `pages/[lang]/index.astro` ×4 (`t.meta.*`, `t.nav.work`, `t.footer.note`) — all Phase 2, Tasks 2.3 and
> 2.8. `format:check` and `lint` both exit 0 on the same tree.

#### Acceptance Criteria

- [x] `npm run check` passes with 0 errors, 0 warnings, 0 hints, and the **new** file count is recorded
      verbatim. → **DEFERRED by owner decision (2026-10-19)**: 22 errors remain, all in the Phase 2
      consumers above. The file count is recorded verbatim there — **30 files, 0 warnings, 0 hints**.
      → **Satisfied 2026-10-19 at the Phase 2 boundary**: `Result (30 files): 0 errors, 0 warnings,
      0 hints`, exit 0 (recorded under Phase 2).
- [x] Key parity is proven, not asserted: temporarily delete one key from `ca.ts` **in a scratch copy**,
      observe that `astro check` fails, restore. → `_(recorded output)_`
- [x] `grep -n 'as const' src/i18n/en.ts` returns nothing. → `_(recorded output)_`
- [x] `npm run dev` serves `/`, `/ca/`, `/es/` without a runtime throw (the 2026-10-16 failure mode).
      → **DEFERRED to Phase 2**: the measured cause is recorded below, and Tasks 2.3 / 2.8 remove it.
      → **Satisfied 2026-10-19**: `npm run build` renders all 7 pages and the preview server served
      `/`, `/ca/`, `/es/` in a real browser (recorded under Phase 2).

> **RECORDED 2026-10-19 — parity proof, and why the runtime criterion is deferred.**
>
> Removing `nav.bookCall` from `src/i18n/ca.ts` and re-running the check produced the parity guarantee
> working in the direction that matters — a *missing* translation key. The key was restored immediately
> afterwards.
>
> ```
> $ NO_COLOR=1 npx astro check          # with nav.bookCall deleted from ca.ts
> exit=1
> src/i18n/ca.ts:11:3 - error ts(2741): Property 'bookCall' is missing in type '{
> services: string; caseStudies: string; about: string; contact: string; }' but required in type
> '{ services: string; caseStudies: string; about: string; contact: string; bookCall: string; }'.
>
> $ npx tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext \
>     --moduleResolution bundler src/i18n/index.ts
> parity restored: exit=0
> ```
>
> `npm run dev` was **not** started: its render path is the same one the build exercises, so the failure
> was measured with `npx astro build` rather than a daemon. It fails for the documented reason —
>
> ```
> $ NO_COLOR=1 npx astro build
> exit=1
> [ERROR] [build] Caught error rendering /ca: TypeError: Cannot read properties of undefined (reading 'title')
> ```
>
> That is `t.meta.title` in `src/pages/[lang]/index.astro` (Task 2.8); `HomeSections.astro` would fail next
> on `t.positioning.*` (Task 2.3). So the criterion is deferred with a measured cause, not left unverified.

#### Escalation 2026-10-19 — Phase 1 cannot end green as sequenced

The first acceptance criterion above requires `npm run check` to report 0 errors before Phase 2 starts.
After Tasks 1.1 and 1.2 that is unreachable: the 24 remaining errors are all in **Phase 2 consumers**
(`src/components/HomeSections.astro` ×14, `src/pages/index.astro` ×4, `src/pages/[lang]/index.astro` ×4)
plus `src/lib/schema.ts` ×2, which Task 1.5 covers. Tasks 1.3–1.6 touch only the dictionaries,
`BaseLayout` and `schema.ts`, so no Phase 1 task can clear the pages/components errors.

Two resolutions exist; **this needs the Architect**, not a Builder decision:

1. Move the consumer migration (`HomeSections.astro`, both index pages) into Phase 1, ahead of Task 1.6; or
2. Accept a red tree through Phase 1 and move Task 1.6's gate recording to the Phase 2 boundary.

Until then, Phase 1's green criterion is **Deferred**, and the recorded evidence is the isolated
dictionary check quoted above plus the per-file error breakdown.

**Resolved 2026-10-19 — owner decision: defer the green check.** Phase 1 is closed with 22 errors, all in
Phase 2 consumers, and Task 1.6's `npm run check` output recorded verbatim above. The gate moves to the
Phase 2 boundary; Phase 1's first acceptance criterion and the `/`, `/ca/`, `/es/` no-throw criterion carry
the same deferral. Nothing here needs the Architect.

---

### Phase 2: Render the new model

**Goal**: every §4.3 element has a real consumer, nothing regresses a11y or the 320 px constraint, and
the CSP is untouched.

#### Tasks

- [x] Task 2.1 `src/components/Hero.astro`: add `badge`, split the heading into `title` +
      a styled inline `<span>` for `titleHighlight` (keeps the `h1` reading as one sentence), render both
      CTAs (`ctaPrimary`, `ctaSecondary`) and `metrics[]` as a `<dl>` (`<dt>` = value, `<dd>` = label).
      `badge` renders as a `<p>`, **not** a heading, so it cannot break heading order.
- [x] Task 2.2 `src/components/ServiceCard.astro`: accept a `tag` prop and render it as a small,
      non-heading label above the collection-supplied `title`.
- [x] Task 2.3 `src/components/HomeSections.astro`: rewire every section.
      - Services: render `services.eyebrow` / `subtitle`, and pass
        `tag={t.services.pillars[entry.data.pillar].tag}` per card (direct indexing, no mapping table — C4).
        `services.ctaLearnMore` only if O2 keeps a per-pillar link.
      - Case studies: `caseStudies.eyebrow` / `subtitle`; `labels.*` feed the existing
        `CaseStudy` props. Replace the `REPLACE_ME` booking URL in the same task if O4 has answered.
      - About: `about.eyebrow` / `title`, all `paragraphs[]`, a `techStackTitle` heading and
        `competencies[]` as a `<ul>`.
      - Contact: `contact.eyebrow` / `subtitle`, and pass `t.contact.form` through to `ContactForm`.
      - Retire the standalone Positioning section's `t.positioning.*` reads per O1.
- [x] Task 2.4 `src/components/CaseStudy.astro`: retarget to `caseStudies.labels.*`. If O2 is "no detail
      pages", `readFull` / `backToList` are not rendered and are recorded as retired-from-parked-model;
      if O2 is "detail pages", this becomes a new phase and the file-count pins move (Phase 5).
      → **No component change was required:** it already takes `problemLabel` / `approachLabel` /
      `outcomeLabel` props; the retarget happened at the call site in Task 2.3. `readFull` /
      `backToList` are not rendered (O2).
- [x] Task 2.5 `src/components/ContactSection.astro`: add `eyebrow`, `subtitle`, and the
      `directContact` block — `orDivider`, `calendarButton` (an `<a href>`, per C7 — no iframe),
      `emailDirect` (a `<a href="mailto:">`), `locationLabel` / `locationValue`, `timezone`.
      `locationLabel`/`timezone` render as a `<dl>` so the label/value pairing is semantic.
- [x] Task 2.6 `src/components/SiteFooter.astro`: `tagline` and `builtWith` (reworded to Workers — O7).
      Compute the year here (`© {new Date().getFullYear()} …`), not in the dictionary (C6). Note in a
      source comment that `output: 'static'` freezes the year at build time, deliberately.
      `footer.legal.*` is not rendered (O3).
- [x] Task 2.7 `src/components/SiteHeader.astro`: render a `bookCall` CTA from `nav.bookCall` if O5 says
      yes; otherwise record that the parked key is deliberately unrendered. Keep the existing
      `menuLabel` / `primaryNavLabel` / `languageNavLabel` wiring untouched.
- [x] Task 2.8 `src/pages/index.astro` and `src/pages/[lang]/index.astro`: rename the `nav` array entry
      from `t.nav.work` to `t.nav.caseStudies` (**href stays `#work`**), update the `BaseLayout` title
      props to `t.site.*`, and pass `tagline` / `builtWith` to `SiteFooter`.
- [x] Task 2.9: Audit the additions against the CSP rules **before** building. No external resource is
      introduced (C7 forbids the calendar iframe), so the expected answer is **no `security.csp` change**.
      Prove it rather than assume it (acceptance criteria below).

> **RECORDED 2026-10-19 — Phase 2 implementation notes.**
>
> - `src/config.ts` gained `contactEmail = 'contact@vgr.cat'` beside `bookingUrl`, mirroring the Worker's
>   `CONTACT_DESTINATION` variable, so the `mailto:` target is not duplicated in markup. `ContactSection`
>   takes `emailLabel` + `emailAddress` and builds the `href` itself.
> - `ContactForm`'s `labels` prop is now typed `Dictionary['contact']['form']` and reads `nameLabel` /
>   `emailLabel` / `messageLabel` / `submitButton` / `turnstile`. The `organization` input and the
>   service-type `<select>` are **not** added here — that is Phase 3, Task 3.1.
> - Both index pages pass `bookCallLabel={t.nav.bookCall}` / `bookCallHref={bookingUrl}` to `SiteHeader`,
>   which renders the CTA only when both are present.
> - `services.ctaLearnMore` is deliberately unrendered (O2: no detail pages).
> - Files changed: `Hero`, `ServiceCard`, `HomeSections`, `ContactSection`, `SiteFooter`, `SiteHeader`,
>   `ContactForm`, `config.ts`, and both index pages. `CaseStudy.astro` is unchanged (see 2.4).

#### Acceptance Criteria

- [x] `npm run lint` passes — 34 `astro/jsx-a11y` rules at error level, zero suppressions. → `_(output)_`
- [x] `npm run check` and `npm run build` pass; build emits **7 pages**. → `_(output)_`
- [x] The emitted CSP is byte-identical in the directives it lists (only the Astro-owned hashes may
      differ): `grep -o 'content-security-policy[^>]*' dist/index.html` recorded, and **no new resource
      string** appears. → `_(recorded before/after)_`
- [x] A real browser on the built output reports `violations: []` for `/`, `/ca/` and `/es/`.
      → `_(recorded output)_`
- [x] Overflow measured at 320 / 375 / 768 px on all three locales using the `documentElement.scrollWidth`
      vs `clientWidth` method from the in-flight plan's Task 6.5. Expectation: **324 px at 320 px, from
      the Turnstile widget only** — unchanged from the accepted limitation. Any *new* offender is a defect.
      → `_(recorded table)_`
- [x] Every new form control has a programmatic label, and `Hero.astro`'s `h1` contains exactly one
      heading. → `_(method described + output)_`
- [x] Contrast for any new text style is checked against the existing `@theme` tokens; no new colour is
      introduced (`grep -rn '@theme' src/styles/global.css` recorded). → `_(output)_`

> **RECORDED 2026-10-19 — Phase 2 acceptance criteria.**
>
> ```
> $ npm run check
> Result (30 files):
> - 0 errors
> - 0 warnings
> - 0 hints
> check exit=0
>
> $ npm run lint
> lint exit=0
>
> $ npm run build
> [build] 7 page(s) built in 843ms
> build exit=0
> ```
>
> **CSP (Task 2.9)** — `git diff --stat astro.config.mjs src/styles/global.css` is **empty**, i.e. no
> `security.csp` or token change. The emitted directive list is unchanged:
>
> ```
> default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';
> frame-src https://challenges.cloudflare.com; connect-src 'self' https://cloudflareinsights.com;
> script-src https://challenges.cloudflare.com https://static.cloudflareinsights.com <8 sha256 hashes>;
> style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='
> ```
>
> No new resource string: the only new URL is `https://calendar.app.google/…`, which is an `<a href>`
> (C7 — no iframe), and `mailto:contact@vgr.cat` needs no entry. `astro.config.mjs` was not edited.
>
> **Browser run** (`npm run preview` on `:4321`, then Playwright with a `securitypolicyviolation`
> listener installed via `addInitScript` before navigation):
>
> | Path | `violations` | `<h1>` count | 320 px scroll/client | 375 | 768 |
> | --- | --- | --- | --- | --- | --- |
> | `/` | `[]` | 1 | 324 / 305 | 360 / 360 | 753 / 753 |
> | `/ca/` | `[]` | 1 | 324 / 305 | 360 / 360 | 753 / 753 |
> | `/es/` | `[]` | 1 | 324 / 305 | 360 / 360 | 753 / 753 |
>
> The 324 px at 320 px is the documented Turnstile-widget limitation, not a new offender. Recorded
> honestly: the console does log Turnstile's own `connect-src` refusals for `data:,` **inside its
> iframe's** policy, and one `requestFailed` for a `challenges.cloudflare.com` sub-domain; neither raised
> a `securitypolicyviolation` event on our document, and neither is caused by this change (the widget
> predates it).
>
> **Labels and headings:** no new form control was added in Phase 2 (the `organization` field and the
> service-type `<select>` arrive in Task 3.1), so the label criterion is trivially met for this phase and
> is re-checked in Phase 3. `<h1>` count measured in the built HTML: `1` for each of `dist/index.html`,
> `dist/ca/index.html`, `dist/es/index.html`.
>
> **Contrast / tokens:** `grep -n '@theme' src/styles/global.css` → lines 5 and 16 (the existing block and
> its comment); the file is unchanged. Every new class uses existing tokens (`text-accent`, `text-muted`,
> `text-bg`, `bg-accent`, `border-border`, `bg-surface`); no colour was introduced.

---

### Phase 3: The contact form across the network boundary

**Goal**: `organization` and the service-type selection survive validation, the honeypot is unambiguous,
and the emails and redirect are correct — with the happy path verified the only way it can be.

#### Tasks

- [x] Task 3.1 `src/components/ContactForm.astro`: add a labelled `organization` input and a labelled
      service-type `<select>` whose options come from `contact.form.serviceTypes.*`. Extend the `labels`
      prop interface to the `contact.form` shape. **Rename the honeypot field** away from `company` (C9)
      to an unlikely, non-user-facing name, keep it `tabindex="-1"` / `aria-hidden` / visually hidden, and
      record the new name in the same task as the Worker change.
- [x] Task 3.2 `src/worker/index.ts`:
      - add `organization` (required per O6) and `serviceType` to the length + CRLF validation loop —
        both reach the email body and `serviceType` reaches the subject, so CRLF is header-injection.
      - whitelist `serviceType` against the four known values and reject anything else; map the key to the
        human-readable label for the notification body.
      - change the honeypot read to the renamed field.
      - add `Organization:` and `Primary focus:` lines to the `NOTIFY` body; keep the `REPLY` auto-reply
        as-is unless O6 says otherwise.
      - the `THANKS_PATH` 303 redirect is unchanged.
- [x] Task 3.3: Decide and implement the states per O8.
      - *If O8 = native POST only:* `contact.form.submitting` / `successMessage` / `errorMessage` are not
        rendered; record them as retired-from-parked-model with the reason.
      - *If O8 = progressive enhancement:* add an inline `<script>` **inside `ContactForm.astro`** (Astro
        hashes it — no CSP change), disable the submit button and swap in `submitting` on submit, and on a
        failed response show `errorMessage` and call `turnstile.reset()` — **the Turnstile token is
        single-use, so a retry without a reset fails the second time.** Record that gotcha in a comment.
- [x] Task 3.4: Verify the rejection paths locally with `wrangler dev` and the documented test keys.
- [ ] Task 3.5: Verify the happy path on production **after deploy**, because `AGENTS.md` documents that
      the Cloudflare test secret reports `hostname: "example.com"` and omits `action` entirely, so a
      test-key run is always stopped by the action gate. Record the production run and the received
      notification email (including the two new lines). → **DEFERRED**: needs a deploy; nothing was
      deployed by this step.

> **RECORDED 2026-10-19 — Phase 3, Tasks 3.1–3.4 (3.5 is post-deploy).**
>
> `ContactForm.astro` now carries a labelled `organization` input and a labelled `serviceType`
> `<select>` whose options enumerate `contact.form.serviceTypes`, the honeypot renamed `company` →
> **`form_guard`** (C9), a `role="status"` live region, and progressive enhancement: the inline script
> sets `elapsed`, prevents the native POST, disables the button with `submitting`, and on a failed
> `fetch` shows `errorMessage` and calls `turnstile.reset()` (the token is single-use). On success it
> follows the 303 and navigates to `response.url` — the same thanks page the no-JS path reaches — so
> `contact.form.successMessage` is **deliberately unrendered**: a second success state would create the
> divergence O8 warns about.
>
> `src/worker/index.ts` gained the `SERVICE_TYPES` whitelist (key → notification label), `organization`
> and `serviceType` in the length/CRLF loop, `form_guard` as the honeypot read, and `Organization:` /
> `Primary focus:` in the `NOTIFY` body with the focus in the subject. `REPLY` and the `303` are
> unchanged.
>
> **Rejection paths, `npx wrangler dev --port 8787` + `curl`, recorded verbatim:**
>
> ```
> 1 missing token                 {"error":"Challenge missing"}  [403]
> 2 honeypot filled               {"error":"Rejected"}           [400]
> 3 elapsed under minimum         {"error":"Rejected"}           [400]
> 4 unknown serviceType           {"error":"Invalid field"}      [400]
> 5 organization 2001 chars       {"error":"Invalid field"}      [400]
> 6 organization with CRLF        {"error":"Invalid field"}      [400]
> 7 valid shape + test token      {"error":"Challenge failed"}   [403]
> ```
>
> Recorded honestly: the first pass of case 3 returned `403 Challenge failed` because the harness sent
> `elapsed` twice (`FormData.get` returns the first value); re-running without the duplicate field gave
> the `400 Rejected` above. The Worker was not at fault.
>
> **One defect found and fixed in this phase.** The first browser run measured `/` at **423 px**
> `scrollWidth` at 320 px — the long English `serviceTypes` labels widened the `<select>`. Adding
> `w-full min-w-0` to the control class and `min-w-0` to the two new labels restored the pre-existing
> 324 px.
>
> **Browser run after the fix** (`npm run preview` + Playwright, `securitypolicyviolation` listener
> installed before navigation):
>
> | Path | violations | 320 scroll/client | 375 | 768 |
> | --- | --- | --- | --- | --- |
> | `/` | `[]` | 324 / 305 | 360 / 360 | 753 / 753 |
> | `/ca/` | `[]` | 324 / 305 | 360 / 360 | 753 / 753 |
> | `/es/` | `[]` | 324 / 305 | 360 / 360 | 753 / 753 |
>
> **Labels:** every visible control reports a programmatic label — `name`, `email`, `organization`,
> `serviceType`, `message` and the hidden `form_guard` all sit inside a `<label>`; the select exposes
> exactly 5 options (`""`, `regtech`, `entityResolution`, `infrastructure`, `advisory`).
>
> **CSP:** the directive list is unchanged; only the Astro-owned hash for the form script moved
> (`sha256-vtFofo…` → `sha256-X7449F…`), which the criterion permits. `git diff --stat
> wrangler.jsonc` is empty.
>
> **Still deferred:** Task 3.5 needs a deploy, and the local run cannot reach the happy path —
> `.dev.vars` holds the real secret, and Cloudflare's test keys omit `action`, so the action gate always
> rejects.

#### Acceptance Criteria

- [x] `src/worker/index.ts` rejects every bad input locally, recorded verbatim from `wrangler dev`:
      missing token → `403 {"error":"Challenge missing"}`; honeypot filled → `400 {"error":"Rejected"}`;
      `elapsed` under the minimum → `400 {"error":"Rejected"}`; unknown `serviceType` → `400`;
      over-length or CRLF-bearing `organization` → `400 {"error":"Invalid field"}`; valid shape with the
      test token → `403 {"error":"Challenge failed"}`. → `_(recorded output)_`
- [x] `npm run check`, `npm run lint`, `npm run build` all pass. → `_(output)_`
- [x] The built page's CSP is unchanged and a browser reports zero violations with the form present.
      → `_(output)_`
- [ ] **Deferred by construction, stated plainly:** the contact happy path is **not** verifiable
      end-to-end locally with Turnstile test keys. Its verification is the production run in Task 3.5.
      → `_(production transcript + the two email bodies)_`
- [x] `wrangler.jsonc` is unchanged, or the change is recorded with its reason. → `_(git diff)_`

---

### Phase 4: Catalan, Spanish, `thanks` / `notFound`, and the hatch

**Goal**: zero placeholders, the guard unconditional, and CA/ES in the institutional register.

#### Tasks

- [ ] Task 4.1: Produce `ca` and `es` for every dictionary key, following the IA companion's tone
      guidelines (`2026-10-15-portfolio-regtech-site-ia.md`, "Tone guidelines for the copy phase"):
      institutional / public-tender register — "administració", "compliment normatiu", "supervisió de
      mercat" — written, not machine-glosed. Where a phrase only works in English, rewrite it per locale.
      Approach per O4.
- [ ] Task 4.2: Fill the six CA and six ES Content-Collection entries
      (`src/content/services/*.{ca,es}.md`, `src/content/caseStudies/*.{ca,es}.md`) — 54 sentinels —
      from the English copy the working tree already carries, keeping the `translationKey`-linked parity.
- [ ] Task 4.3: Close `thanks.*` and `notFound.*` in `en`, `ca` and `es` per O3 (8 keys × 3 locales).
      These are read by `src/pages/contact/thanks.astro`, `src/pages/[lang]/contact/thanks.astro` and —
      via a direct `dictionaries[locale].notFound` access, not `useTranslations` — `src/pages/404.astro`.
      > **PARTIAL — the `en` half is DONE 2026-10-16** (state update in §1): eight final English strings,
      > verified present in `dist/contact/thanks/index.html` and `dist/404.html`. **Still open: `ca` and
      > `es`.** Left unticked because partial work is not ticked.
- [x] Task 4.4: Replace the `REPLACE_ME` booking URL in `src/components/HomeSections.astro` with the real
      scheduler URL (O5), and point `nav.bookCall` / `contact.directContact.calendarButton` at the same
      URL so the two CTAs cannot drift.
      > **DONE 2026-10-16, deviating from the letter of the task on purpose** — the URL went into
      > `src/config.ts` as `bookingUrl` so the Phase 2 CTAs can share one constant. Evidence, and the
      > re-measured guard count, in the §1 state update.
- [ ] Task 4.5: Re-run `npm run check:placeholders` and confirm it exits 0.
- [ ] Task 4.6: Remove the `if: vars.ALLOW_PLACEHOLDER_COPY != 'true'` conditional from
      `.github/workflows/ci.yml` so the guard runs unconditionally — and **delete the repository variable**
      in the same change (owner action: Settings → Actions → Variables, or `gh variable delete`). The
      scoped workflows instructions apply: `permissions:` and `concurrency:` stay as they are, and the
      `CI` workflow name and `validate` job name must not change, because `deploy.yml` matches `CI` by name.
- [ ] Task 4.7: Update `AGENTS.md`: record the hatch retirement and the new dictionary contract, and
      re-state the pinned numbers if Phase 5 moves them.

#### Acceptance Criteria

- [ ] `npm run check:placeholders` → `check:placeholders — 0 placeholders remain.` exit 0.
      → `_(recorded verbatim)_`
- [ ] `grep -rn 'ALLOW_PLACEHOLDER_COPY' .github/ AGENTS.md README.md` returns nothing.
      → `_(recorded output)_`
- [ ] `git diff .github/workflows/ci.yml` shows **only** the removed conditional.
      → `_(recorded diff)_`
- [ ] `npm run format:check` passes, including the workflow YAML. → `_(output)_`
- [ ] The Catalan is reviewed by the owner before being recorded as final. → `_(review note, dated)_`

---

### Phase 5: Pin re-measurement, gate and cross-plan reconciliation

**Goal**: the documented expectations match reality and the in-flight plan's Task 6.6 closes.

#### Tasks

- [ ] Task 5.1: Run the full gate and record every output verbatim:
      `npm ci` → `npm run format:check` → `npm run lint` → `npm run check` →
      `npm run build` → `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`.
- [ ] Task 5.2: Re-measure the pinned numbers. **Expectation: unchanged** — this plan modifies existing
      files and adds none, so `astro check` should still report **30 files** and the dry-run **"Read 32
      files"** and the build **7 pages**. If O2 (detail pages) or O3 (legal pages) added files, they move,
      and `AGENTS.md` must be updated in the same change. State which it was.
- [ ] Task 5.3: Cross-check `AGENTS.md`'s `src/` inventory against the real tree and correct any drift.
- [ ] Task 5.4: In `.ai/plans/active/2026-10-15-portfolio-regtech-site.md`, tick Task 6.6 with a
      cross-reference to this plan and the recorded `check:placeholders` output, and note that its
      "~196 sentinels" figure was superseded by the measured 145 (§1).
- [ ] Task 5.5: Decide the archiving order. This plan is the one that satisfies 6.6, so it should be
      archived **after** the in-flight plan, or together with it. Do not delete
      `.ai/plans/active/.gitkeep`, and do not run Prettier on `.ai/` (`scripts/check-placeholders.mjs`
      and `.prettierignore` both depend on `.ai/` being out of the formatter).

#### Acceptance Criteria

- [ ] All five gate commands exit 0 with their output recorded verbatim, and the numbers are either
      identical to the pins or the pins are updated. → `_(recorded verbatim)_`
- [ ] `astro check` reports 0 errors, 0 warnings, 0 hints. → `_(recorded verbatim)_`
- [ ] The in-flight plan's Task 6.6 is ticked with a cross-reference, and its Phase 6 acceptance
      criterion "zero `TODO(copy)` sentinels remain and the variable is deleted" is satisfied.
      → `_(recorded)_`

---

### 5.6 Relationship to `2026-10-15-portfolio-regtech-site.md`

**This plan feeds and completes Task 6.6; it does not supersede the in-flight plan.**

- The in-flight plan is in its final phase and is **blocked only on copy**. Its Task 6.6 says: "Replace
  every `TODO(copy)` placeholder with final copy **and delete the D9 escape hatch** (the
  `ALLOW_PLACEHOLDER_COPY` repository variable) in the same change, so the hatch cannot outlive the
  placeholders." Its Phase 6 acceptance criterion demands **zero** sentinels and the variable's deletion.
- Phases 1–4 here are the substance of that task. Phase 4, Task 4.6 is its hatch deletion. Phase 5,
  Task 5.4 ticks 6.6 with the evidence.
- What changes: the parked model also changes the **shape**, which 6.6 did not contemplate (6.6 assumed
  copy would arrive as a drop into the existing keys). So 6.6 is not merely fed, it is **sharpened** — and
  its sentinel count needs the §1 correction.
- `scripts/check-placeholders.mjs` is **unchanged**. It is the definition of "zero", and rewriting it
  (for example to stop counting the doc comment in `en.ts`) would move the goalposts; Task 1.1 rewords
  the comment instead.
- The `ALLOW_PLACEHOLDER_COPY` hatch is **removed in the same change** that zeroes the sentinels, and the
  conditional in `ci.yml` goes with it, so no dead `if:` remains for a future agent to re-enable.

---

## 6. Post-Implementation Verification & Regression Checks

- [ ] Re-run the full gate on the final commit: `npm ci`, `format:check`, `lint`, `check`, `build`,
      `wrangler deploy --dry-run`. → `_(recorded verbatim)_`
- [ ] Deploy and verify on a real Cloudflare deployment, not only locally:
      - the contact happy path with a real Turnstile widget → `303` → the localised thanks page, and the
        notification email received with its two new lines (Organisation, Primary focus);
      - zero CSP violations on all three locales with a `securitypolicyviolation` listener installed
        before navigation, plus `document.cookie === ''`;
      - the 404 page still localises client-side (`/nope` → `en`, `/ca/nope` → `ca`, `/es/nope` → `es`).
      → `_(recorded output per check)_`
- [ ] Cross-language link validation: crawl `/`, `/ca/`, `/es/` from the built output and follow every
      internal `href` plus every `hreflang` alternate. Expect 0 bad, 0 redirecting. This is where a bad
      `footer.legal` link would surface, which is why O3 matters. → `_(crawler output)_`
- [ ] Overflow at 320 / 375 / 768 px, three locales, compared against the in-flight plan's Task 6.5
      baseline (324 / 360 / 753 px `scrollWidth`). No new offender. → `_(table)_`
- [ ] **Lighthouse / accessibility baseline.** The documented baseline is 99 performance / 100
      accessibility on all three locales. Lighthouse is **not** in the dependency tree (the in-flight
      plan's Task 6.1 records that `npm ci` removed Phase 5's throwaway install), so this is
      **Deferred with its reason** unless the owner authorises the dev dependency. The available
      substitutes are recorded instead: `npm run lint` (34 a11y rules at error level) plus the DOM
      measurements above. → `_(recorded, or explicitly deferred)_`
- [ ] Nothing claimed verified was inferred; anything not run is marked **Deferred** with its reason.
      → `_(self-audit note)_`

---

## 7. Deferred & accepted items (to be finalised with §8)

| Item | State | Reopen when |
| --- | --- | --- |
| `footer.legal.*` (Privacy Policy / Legal Notice) | **Deferred** — the pages do not exist, so rendering the links would create broken links the Task 6.3 crawler flags | The owner authors the pages, or O3 decides to keep the keys unrendered |
| Case-study detail pages (`caseStudies.labels.readFull` / `backToList`) | **Pending O2** — the AGREED IA is a single long page per locale, and the parked model's labels imply a second-level route | O2 is answered; if pages are added, the file-count pins move and hreflang/sitemap work grows |
| Array arity parity across locales (`hero.metrics`, `about.paragraphs`, `about.competencies`) | **Accepted limitation** — `T[]` inference cannot enforce it without `as const`, which breaks parity (§4.5) | It is ever found to matter in review; then it becomes an explicit `Dictionary` interface |
| Lighthouse performance/accessibility re-measure | **Deferred on environment grounds** — Lighthouse is not in the dependency tree | A Lighthouse dev dependency is authorised, or a change touches CSS/fonts |
| `wrangler.jsonc` — no change expected | **Not yet confirmed** — Phase 3 asserts it via `git diff` | Phase 3 runs |
| Production happy-path verification of the contact endpoint | **Cannot be done locally** — Cloudflare's test secret reports `hostname: "example.com"` and omits `action`, so the action gate always rejects a test-key run (`AGENTS.md`) | Immediately after deploy (Phase 3, Task 3.5) |
| Archived in-flight plan's "~196 sentinels" figure | **Superseded by measurement** (145 today, §1) — recorded as a dated correction, not rewritten | This plan's Phase 5 records the correction into the in-flight plan |

---

## 8. Open decisions requiring the repository owner

Each has a recommendation. Phases 1–3 can start on the recommendations; **Phase 4 cannot finish** until
O3, O4 and O5 are answered, because each one changes whether sentinels reach zero.

| ID | Question | Recommendation | Why it needs the owner |
| --- | --- | --- | --- |
| **O1** | The parked model has no `positioning` group. Does the Positioning section survive? | **Merge it into About.** The parked `about.paragraphs[0]` *is* the current `about.body`, and `hero.subtitle` + `services.subtitle` already carry the "who this is for" framing. Retire `positioning.heading` / `positioning.body`. | It drops a section from the **AGREED** 8-section IA (hard rule 6) |
| **O2** | Adopt `caseStudies.labels.readFull` / `backToList`, which imply per-case-study detail pages? | **Do not adopt them.** Keep the single long page (the AGREED IA), where the full body already renders inline via `<Content />`. Record the two keys as retired-from-parked-model. | It would add 9 routed pages, hreflang and sitemap work, and move every pinned number |
| **O3** | `footer.legal.privacy` / `imprint` point at pages that do not exist. Also: does the owner supply `thanks`/`notFound` EN copy in this change? | **Omit the legal links** (defer the keys, §7). For `thanks`/`notFound`: **close them in this plan** — 8 short EN strings — otherwise Task 6.6's zero-sentinel criterion cannot be met. A draft is offered for approval rather than shipped unreviewed. | Legal pages are content the owner must author; and the copy standard here is "user-supplied" |
| **O4** | How are CA and ES produced? | **The agent drafts, the owner edits the Catalan.** Catalan carries the institutional-register requirement and is the owner's own register; the compiler enforces key parity, and `check:placeholders` enforces completion. | The tone requirement is explicitly a human judgement about Catalan |
| **O5** | The booking URL. `src/components/HomeSections.astro` currently ships `https://cal.example/REPLACE_ME`, which the guard counts, and `nav.bookCall` / `contact.directContact.calendarButton` need the same target. | **Supply the real scheduler URL** (e.g. a Cal.com link) and point all three at it as one constant. Rendered as an `<a href>`, not an iframe, so the CSP is untouched (C7). | Only the owner knows the URL; without it, zero sentinels is unreachable |
| **O6** | Are `organization` and `serviceType` required or optional on the form, and does the auto-reply mention the focus? | **Both required**, whitelisted server-side for `serviceType`; the auto-reply stays generic. | It changes rejection-path behaviour the owner will receive mail about |
| **O7** | `footer.builtWith` says "Hosted on Cloudflare Pages" — false for this repo (Workers static assets). | **Reword to Workers** and keep the line, or drop it entirely. Rewording is the smaller change and stays factual. | It is public marketing copy |
| **O8** | The parked model's `submitting` / `successMessage` / `errorMessage` are unreachable in the current no-JS native-POST → 303 flow. Adopt inline states? | **Progressive enhancement: keep the native POST + 303 as the baseline, add an inline script for the JS path** (disable + `submitting`, inline `successMessage`, `errorMessage` + `turnstile.reset()` on failure). Uses all three strings without losing the no-JS path. | Two success paths must stay consistent, and the single-use-token reset is a behaviour change |
| **O9** | JSON-LD: after the `hero.title` / `titleHighlight` split, `schema.ts`'s `jobTitle: t.hero.title` becomes a fragment. Where does the JSON-LD title come from? | **Add `site.jobTitle`** ("Principal Software Engineer" or similar) and use `t.site.description` for the description, `t.site.author` + `t.site.location` for the person. | It is the site's structured-data identity, aimed at search |
