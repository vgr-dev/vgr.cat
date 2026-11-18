# Proposed English copy deck: vgr.cat repositioning

**Status:** proposed. Every item here awaits human approval. No client name is a certification, an
endorsement, or proof of a contractual right to publish. Confirm permissions before publication.

This file is the authoritative English copy source for the repositioning. It is a copy deck, not a
plan: `plan.md` owns sequencing, verification and file changes.

## Rules for using this deck

1. **Retain existing strings unless listed here.** Keep every key/value not named in this deck exactly
   as it is in `src/i18n/en.ts`, including the utility, privacy and error strings listed under
   “Retained unchanged” below. Notes outside value tables and fenced content bodies are not site copy.
2. **Three locales.** English is authoritative. `ca` and `es` must follow this deck and be reviewed
   before deploy. Every body link in this deck uses the English path; translations must use the
   locale-prefixed equivalent (for example `/ca/work/topten-ecosystem/` and
   `/es/work/topten-ecosystem/`).
3. **Links are separate from prose.** Labels and targets are listed in “Links” below. Do not bury a
   URL in a sentence unless it is a body link that Markdown needs to render.
4. **No inferred facts.** This deck deliberately omits scale, traffic, uptime, revenue, team, client,
   bank and bill counts, and it makes no blanket speed, availability, review or signature guarantee.
5. **Proposed, not certified.** This wording awaits approval; case studies describe past work whose
   attribution still needs owner review. Client names are not certifications or endorsements.

## Home page order

1. Hero
2. Services
3. Selected work
4. How I work
5. Ways to work together
6. CTA band + contact

There is **no About teaser band** on the home page. `about.teaser` and `about.readMore` are removed.

Section anchors: `#work` for Selected work, `#how-i-work` for How I work, `#engage` for Ways to work
together, and `#contact` for the contact section.

---

## Dictionary: `site`

- `site.title`: `Victor Gonzalez | Senior Full-Stack Engineer & Fractional Tech Lead`
- `site.description`: `Senior full-stack engineer and fractional tech lead near Barcelona. I build, modernise and run software, with a focus on energy and EU product data.`
- `site.author`: `Victor Gonzalez`
- `site.location`: `Sant Cugat del Vallès, near Barcelona`
- `site.jobTitle`: `Senior Full-Stack Engineer & Fractional Tech Lead`

The location string above is canonical for full addresses. Shorter references to “near Barcelona” or
“the Barcelona area” are permitted in descriptive sentences; they do not imply a different base.

## Dictionary: `nav`

| Key               | English value   |
| ----------------- | --------------- |
| `nav.services`    | `Services`      |
| `nav.caseStudies` | `Selected work` |
| `nav.about`       | `About`         |
| `nav.contact`     | `Contact`       |
| `nav.bookCall`    | `Book a call`   |

The key `nav.caseStudies` is retained for schema stability; only its label changes.

## Dictionary: `hero`

| Key                   | English value                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero.badge`          | `Sant Cugat del Vallès, near Barcelona · remote across the EU · English and Spanish; Catalan enquiries welcome`                                                                                                         |
| `hero.title`          | `Build, modernise and run`                                                                                                                                                                                              |
| `hero.titleHighlight` | `the software your business depends on.`                                                                                                                                                                                |
| `hero.subtitle`       | `I'm Victor Gonzalez, a senior full-stack engineer and fractional tech lead. I help small teams ship products, improve legacy applications and keep production reliable. Energy and EU product data are my specialism.` |
| `hero.ctaPrimary`     | `Book a 30-min call`                                                                                                                                                                                                    |
| `hero.ctaSecondary`   | `See selected work`                                                                                                                                                                                                     |

`hero.metrics` keeps the existing array shape of `{ value, label }`, but the values become the three
offers rather than unverified numbers:

1. `{ value: 'Build', label: 'New products, internal tools and APIs, from a written spec to production.' }`
2. `{ value: 'Modernise', label: 'Legacy PHP, Python and JavaScript applications moved forward incrementally.' }`
3. `{ value: 'Run', label: 'Hosting, caching, monitoring, security and CI/CD for platforms where reliability matters.' }`

The hero preserves the first-person introduction, so no portrait or new visual asset is required.

## Dictionary: `services`

| Key                      | English value                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `services.eyebrow`       | `Services`                                                                                            |
| `services.title`         | `What I can take off your plate`                                                                      |
| `services.subtitle`      | `One senior engineer across the whole path: the spec, the code, the infrastructure and the handover.` |
| `services.readService`   | Retain existing: `Explore this service`                                                               |
| `services.relatedWork`   | `Related work`                                                                                        |
| `services.noRelatedWork` | `No public case study is listed for this service yet.`                                                |

`services.pillars` uses the new keys, in this order, with these tags:

| Key         | Tag                   |
| ----------- | --------------------- |
| `build`     | `New products`        |
| `modernize` | `Legacy rescue`       |
| `platform`  | `Platform operations` |
| `energy`    | `Energy & regulation` |

## Dictionary: `process`

New section. Short steps only; no FAQ and no new multi-paragraph component.

| Key                      | English value                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `process.eyebrow`        | `How I work`                                                                                                                                         |
| `process.title`          | `AI helps with the drafting. I stay accountable.`                                                                                                    |
| `process.subtitle`       | `AI-assisted delivery is opt-in. Before work starts, we agree which tools may see which code and what I will review.`                                |
| `process.dataBoundary`   | `Client code and data stay outside AI tools unless we have agreed the tools and permitted data in writing.`                                          |
| `process.proof`          | `This site is developed with the same process, and the repository is public: the current spec, architecture decisions and earlier planning records.` |
| `process.proofLinkLabel` | `See the specs and history on GitHub`                                                                                                                |

`process.steps` is an ordered list of `{ title, body }`:

1. **Spec** — `We agree in writing what "done" means. You approve it.`
2. **Plan** — `I break the work into small steps you can see before any code exists.`
3. **Build** — `AI agents help draft code and tests inside the approved tools and code boundaries.`
4. **Review** — `I review what ships and record the decisions and checks.`
5. **Hand over** — `Specs, decisions and verification notes stay in your repository.`

## Dictionary: `engage`

New section. Compact offer cards plus short terms underneath.

| Key               | English value                       |
| ----------------- | ----------------------------------- |
| `engage.eyebrow`  | `Ways to work together`             |
| `engage.title`    | `Three ways to start`               |
| `engage.subtitle` | `Each starts with a written scope.` |

`engage.items` is an ordered list of three offers:

### Offer 1

- `name`: `Audit or second opinion`
- `description`: `Review of one agreed application, environment or technical plan, with a prioritised report and walkthrough.`
- `price`: `€2,500 fixed`
- `detail`: `Up to 5 working days, normally over 1–2 calendar weeks. Not a penetration test or compliance certification.`

### Offer 2

- `name`: `Project`
- `description`: `A build or modernisation, starting with two days of paid discovery and a written spec.`
- `price`: `€640 per day`
- `detail`: `Discovery is €1,280, credited once towards an accepted fixed project quote. You keep the spec if you stop.`

### Offer 3

- `name`: `Fractional tech lead`
- `description`: `Four eight-hour days a month as your part-time tech lead or platform engineer.`
- `price`: `€2,400 per month`
- `detail`: `Three-month minimum (€7,200), then one month's notice. Scheduling and response expectations agreed in writing.`

`engage.terms` is a short list under the cards:

1. `Prices exclude VAT. Travel and third-party costs are agreed in writing before they are incurred.`
2. `The project day rate is an eight-hour estimating basis, not an extra charge on a fixed quote. Discovery produces a quote for the agreed scope; unresolved complexity is reported before further paid work. The fixed total includes discovery, with the €1,280 already paid deducted once.`
3. `Extra work, scheduling and response expectations require written agreement. The retainer does not include 24/7 on-call.`
4. `Working languages: English and Spanish. Catalan enquiries are welcome; we agree the delivery language in writing. Remote across the EU; on site in the Barcelona area.`

The English prices are formatted as above. `ca` and `es` use local formatting (`2.500 €`, `640 €`,
and so on); the amounts and terms do not change.

## Dictionary: `caseStudies`

| Key                           | English value                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `caseStudies.eyebrow`         | `Selected work`                                                                                |
| `caseStudies.title`           | `Systems in production`                                                                        |
| `caseStudies.subtitle`        | `Platforms and tools I have built or run, for organisations in Switzerland, the EU and Chile.` |
| `caseStudies.labels.problem`  | `Problem`                                                                                      |
| `caseStudies.labels.approach` | `What I built`                                                                                 |
| `caseStudies.labels.outcome`  | `Result`                                                                                       |
| `caseStudies.readCase`        | Retain existing: `Read the case study`                                                         |
| `caseStudies.backToWork`      | `All selected work`                                                                            |
| `caseStudies.nextCase`        | Retain existing: `Next case study`                                                             |

Case-study order: `topten-ecosystem`, `eu-inspection-tooling`, `banco-estado-iot`, `vgr-cat`.

## Dictionary: `about`

| Key                     | English value                                                            |
| ----------------------- | ------------------------------------------------------------------------ |
| `about.eyebrow`         | `About`                                                                  |
| `about.title`           | `Engineer, builder, and operator`                                        |
| `about.experienceTitle` | `Experience`                                                             |
| `about.techStackTitle`  | `What I work with`                                                       |
| `about.credentials`     | `Written scopes, documented decisions and a handover your team can use.` |

`about.paragraphs` is five paragraphs:

1. `I'm Victor Gonzalez, a senior full-stack engineer and fractional tech lead based in Sant Cugat del Vallès, near Barcelona. I build, modernise and run production software, with a particular focus on energy and EU product data. I work remotely across the EU and on site in the Barcelona area. Today I lead platform engineering for Topten.`
2. `Before that, I founded and ran VGR SpA, my software consultancy in Chile, including work with Bush Energie in Switzerland. Running a business taught me what clients care about: budgets, deadlines and someone who answers the phone.`
3. `I'm a generalist by choice. PHP, Python and TypeScript are my main languages; I also work in Go and have used C#, Rust and Java. I'm as comfortable in a Laravel codebase as in a Grafana dashboard or a Linux host.`
4. `I use AI coding agents as part of a reviewed, spec-driven process. AI-assisted delivery is opt-in: we agree the tools and the code boundaries before work starts. The agents help draft code and tests; I review what ships and keep the decisions in the repository.`
5. `Most of my work has been in energy efficiency and sustainability, from IoT metering in bank branches to EU product regulation. It is the domain I know best, and the reason I care about software that is efficient to run as well as to write.`

`about.experience` is three entries. The role is the actual role; it is deliberately separate from the
headline title:

1. `period`: `2025 — present` · `role`: `Lead Platform Engineer & Consultant` · `org`: `Topten (Switzerland)` · `detail`: `Platform architecture, the Yii2-to-Laravel transition, and operations for a multilingual consumer product platform.`
2. `period`: `2017 — 2025` · `role`: `Founder & Team Lead` · `org`: `VGR SpA (Chile)` · `detail`: `Software delivery for energy, sustainability and product-data clients.`
3. `period`: `2014 — 2017` · `role`: `Software Engineer` · `org`: `Fundación Chile` · `detail`: `IoT and energy-efficiency platforms, including work for Banco Estado.`

`about.competencies` stays a flat array for JSON-LD `knowsAbout`, ordered by Build, Run, Lead and
Domain:

1. `TypeScript, PHP, Python, Go`
2. `Laravel, Symfony, Django, Node`
3. `Vue, React, Astro, Tailwind`
4. `AWS, Cloudflare, Docker, Kubernetes, Linux`
5. `GitHub Actions, GitLab CI, Grafana, Prometheus`
6. `Spec-driven, AI-assisted delivery`
7. `Remote project management`
8. `EPREL, Ecodesign, ESPR / DPP`
9. `IoT energy monitoring`
10. `Bill analytics`

`about.teaser` and `about.readMore` are removed.

## Dictionary: `ctaBand`

| Key                 | English value                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `ctaBand.title`     | `Something to build, fix or keep running?`                                                 |
| `ctaBand.body`      | `Tell me what you are trying to do. I reply personally, usually within two business days.` |
| `ctaBand.primary`   | `Book a 30-min call`                                                                       |
| `ctaBand.secondary` | `See selected work`                                                                        |

## Dictionary: `contact`

| Key                | English value                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contact.eyebrow`  | `Contact`                                                                                                                                                 |
| `contact.title`    | `Tell me what you need`                                                                                                                                   |
| `contact.subtitle` | `Projects, audits and fractional tech-lead work. Remote across the EU, or on site in the Barcelona area. English and Spanish; Catalan enquiries welcome.` |

`contact.form` labels that change:

| Key                                    | English value                             |
| -------------------------------------- | ----------------------------------------- |
| `contact.form.nameLabel`               | `Your name`                               |
| `contact.form.emailLabel`              | `Work email`                              |
| `contact.form.emailHint`               | `I reply to this address.`                |
| `contact.form.organizationLabel`       | `Company or organisation`                 |
| `contact.form.organizationPlaceholder` | `Company, organisation, or your own name` |
| `contact.form.serviceTypeLabel`        | `What do you need?`                       |
| `contact.form.serviceTypePlaceholder`  | `Select a topic`                          |
| `contact.form.messageLabel`            | `What are you trying to do?`              |
| `contact.form.submitButton`            | `Send message`                            |

`contact.form.serviceTypes` becomes six options:

| Key         | English value                         |
| ----------- | ------------------------------------- |
| `build`     | `New product or internal tool`        |
| `modernize` | `Legacy modernisation`                |
| `platform`  | `Platform reliability and operations` |
| `energy`    | `Energy or EU product data`           |
| `audit`     | `Audit or second opinion`             |
| `other`     | `Something else`                      |

`contact.directContact` changes:

| Key                                    | English value                           |
| -------------------------------------- | --------------------------------------- |
| `contact.directContact.orDivider`      | `or book directly`                      |
| `contact.directContact.calendarButton` | `Book a 30-min call`                    |
| `contact.directContact.emailDirect`    | `Email`                                 |
| `contact.directContact.locationLabel`  | `Based in`                              |
| `contact.directContact.locationValue`  | `Sant Cugat del Vallès, near Barcelona` |

Retain `contact.directContact.timezone` as `Central European Time (CET/CEST)`.

## Dictionary: `footer`

| Key                  | English value                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `footer.tagline`     | `Senior full-stack engineer and fractional tech lead near Barcelona. Energy and EU product data, with AI-assisted delivery and review built into the process.` |
| `footer.builtWith`   | `Built with Astro and Tailwind, hosted on Cloudflare Workers, using a reviewed, spec-driven process.`                                                          |
| `footer.sourceLabel` | `View the source on GitHub`                                                                                                                                    |

The shared `repositoryUrl` constant is rendered as an anchor with `footer.sourceLabel`, not as plain
text inside `builtWith`. Process and footer link destinations are not duplicated across dictionaries.

## Retained unchanged

These strings are utility, privacy or error copy and are **not** rewritten by this deck. Keep the
existing English values exactly:

- `header.*`, `breadcrumbs.*`
- `privacy.*`
- `thanks.*`
- `notFound.*`
- `contact.form.messageHint`, `contact.form.privacyNotice`, `contact.form.privacyLink`,
  `contact.form.noJsNotice`, `contact.form.recoveryLabel`, `contact.form.turnstile`
- `contact.form.errors.*` and `contact.form.errorRateLimited`, `errorChallenge`, `errorRejected`,
  `errorDelivery`, `errorUnavailable`, `errorNetwork`
- `contact.form.stillSending` and the other unchanged form progress labels
- `footer.sectionsLabel`, `footer.contactLabel`, `footer.languageLabel`, `footer.legalLabel`
- `services.readService`, `caseStudies.readCase`, `caseStudies.nextCase`
- `contact.directContact.timezone`

The retained `thanks.*` copy uses the existing “inquiry” spelling. If a single spelling convention is
required, change it in a separate editorial pass, not in this repositioning.

---

## Content: services

### `build` — New products and internal tools

```yaml
translationKey: build
locale: en
title: 'New products and internal tools'
summary: 'MVPs, customer portals, back-office tools, APIs and data pipelines: from a written spec to working software in reviewed increments.'
pillar: build
```

```markdown
A useful first release starts with a clear scope. I help turn a vague requirement into a written spec
and deliver it in reviewed increments, with the deployment and handover included in the agreed scope.

- **Spec first:** we agree in writing what "done" means. You approve it before code is written.
- **Working software early:** small, reviewed increments you can click through, rather than one big
  reveal at the end.
- **Full stack:** TypeScript, PHP or Python on the server; Vue, React or Astro on the front; the
  database, deployment and monitoring included.
- **Built for whoever comes next:** tests, written decisions and a repository your team can pick up
  without me.
```

### `modernize` — Legacy modernisation and rescue

```yaml
translationKey: modernize
locale: en
title: 'Legacy modernisation and rescue'
summary: 'The application your business depends on and nobody wants to touch: upgraded, tested and deployable without a big-bang rewrite.'
pillar: modernize
```

```markdown
Many companies run on a PHP or Python application written years ago by someone who has left. It
works, until it does not. A rewrite is rarely the answer.

- **Assessment:** I read the code, map the risks and give you a written, prioritised plan.
- **Safety net first:** tests around the parts that matter, then CI so changes are checked.
- **Incremental upgrades:** Laravel, Symfony, Yii, Django or Node versions moved forward step by
  step, in releases that can ship as they are ready.
- **Containers and deployment:** from "copied over FTP" to repeatable builds and one-command deploys.

AI agents are useful for reading old code and drafting tests. I use them for that, and I review what
they produce.

At Topten I architected the Yii2 platform behind Topten.eu and later a new Laravel CMS. Topten.ch is
live on the new CMS, which is designed for other countries to adopt one at a time.
[Topten case study](/work/topten-ecosystem/)
```

### `platform` — Platform reliability and operations

```yaml
translationKey: platform
locale: en
title: 'Platform reliability and operations'
summary: 'Hosting, caching, monitoring, security and CI/CD for sites where reliability matters.'
pillar: platform
```

```markdown
If your platform matters to revenue, someone should own it. For many teams a full-time platform
engineer is too much; a part-time senior one is not.

- **Observability:** Grafana and Prometheus dashboards and alerts to help your team investigate
  problems, rather than depend on customer reports alone.
- **Performance and caching:** tiered caching and CDN configuration for demand peaks.
- **Security:** headers, dependency updates, secrets handling and access reviews.
- **CI/CD:** GitHub Actions or GitLab CI pipelines that test and deploy changes the same way.
- **Cost:** infrastructure sized to the demand you actually have, on AWS, Cloudflare or plain Linux.

My platform engineering work for Topten includes the existing Yii2 application and the new Laravel CMS.
[Topten case study](/work/topten-ecosystem/)
```

### `energy` — Energy and EU product-data engineering

```yaml
translationKey: energy
locale: en
title: 'Energy and EU product-data engineering'
summary: 'EU product regulation (Ecodesign, Energy Labelling, ESPR and the Digital Product Passport), energy monitoring and bill analytics.'
pillar: energy
```

```markdown
This is where I have the deepest domain knowledge. If your product or your data touches EU energy
regulation, I already speak the language.

- **ESPR and Digital Product Passport readiness:** for manufacturers and retailers, organise the
  product data you already have against the requirements applicable to your product group. The rules
  are phased and product-specific; this is engineering preparation, not a compliance certification.
- **Regulation in code:** energy-class thresholds, tolerances and calculation rules implemented as
  tested, versioned code instead of spreadsheets.
- **Energy monitoring:** IoT metering from circuit to dashboard, including remote control, for bank
  branches and other sites.
- **Bill analytics:** tooling that extracts and analyses data from energy bills for reporting and
  comparison across billing periods.

I have built regulation-in-code tooling for market-surveillance inspectors and IoT monitoring for a
bank branch network.
[Market-surveillance case study](/work/eu-inspection-tooling/) ·
[Banco Estado case study](/work/banco-estado-iot/)
```

---

## Content: case studies

### 1. `topten-ecosystem` — Topten

```yaml
translationKey: topten-ecosystem
locale: en
title: 'Topten: a European product platform, from Yii2 to Laravel'
summary: 'A multilingual product platform, with national sites that differ in language, criteria and content, and a country-by-country path from Yii2 to Laravel.'
problem: 'National Topten sites needed their own criteria, languages and content, while the shared platform was replaced.'
approach: 'I architected the Topten.eu platform on Yii2, which still runs Topten.eu and most partner sites. I later architected a new Laravel CMS, launched on Topten.ch and designed so other countries can move onto it one at a time.'
outcome: 'Topten.eu and most partner sites continue on the Yii2 platform. The Laravel CMS is live on Topten.ch and is the path for other countries, one country at a time.'
pillar: platform
```

```markdown
Topten is a consumer platform for energy-efficient products. Its national sites have different
languages, selection criteria and content, creating both shared engineering needs and local ones.

## Problem

The sites were growing in different directions on a shared platform. Each country needed local
criteria and content, and the platform had to keep serving readers while it was replaced.

## What I built

I architected the Topten.eu platform on Yii2, which still runs Topten.eu and most partner sites. I
then architected a new Laravel CMS, launched on Topten.ch and designed so other countries can move
onto it one at a time.

## Result

Topten.eu and most partner sites continue on the Yii2 platform. The Laravel CMS is live on
Topten.ch and is the path for other countries, one country at a time. The migration can move country
by country rather than as a single rewrite.
```

### 2. `eu-inspection-tooling` — Market-surveillance tooling

```yaml
translationKey: eu-inspection-tooling
locale: en
title: 'Turning EU energy regulation into code for product inspectors'
summary: 'Tooling that turns Ecodesign and Energy Labelling checks into reproducible calculations for market-surveillance inspectors.'
problem: 'Inspectors had to find technical documentation, compare product parameters against formulas across regulations, and calculate tolerances by hand.'
approach: 'I built tooling that turns the formulas for energy-efficiency indexes, annual consumption and performance parameters into versioned calculations. It records the input data, formula version and calculation behind each result.'
outcome: 'Checks that were manual now run automatically. Results are reproducible, so inspectors can spend their time on the products that look wrong.'
pillar: energy
```

```markdown
Market-surveillance inspectors check product declarations against Ecodesign and Energy Labelling
rules. Much of that work is manual, and small differences in method can change the result.

## Problem

Inspectors had to find the relevant technical documentation, compare product parameters against
formulas spread across regulations, and calculate tolerances by hand. The work was slow to repeat
consistently.

## What I built

I built tooling that turns the formulas for energy-efficiency indexes, annual consumption and
performance parameters into versioned calculations. It records the input data, formula version and
calculation behind each result.

## Result

Checks that were manual now run automatically. Results are reproducible, so inspectors can spend
their time on the products that look wrong. The tooling gives inspectors a consistent first pass, not
a replacement for their judgement.
```

### 3. `banco-estado-iot` — Banco Estado

```yaml
translationKey: banco-estado-iot
locale: en
title: 'Energy monitoring for Banco Estado branches'
summary: 'Circuit-level monitoring and remote control for Banco Estado branches, delivered through Fundación Chile.'
problem: 'Consumption arrived as monthly bills. Circuits could not be compared across sites, and faults surfaced long after the fact.'
approach: 'Circuit-level monitoring and control, commissioned branch by branch. Gateways stream readings through MQTT into a service layer, with dashboards for the teams who run the branches. The same instrumentation can switch circuits remotely.'
outcome: 'Branches have live consumption data instead of monthly billing analysis. Outliers are visible while they are happening, and routine switching no longer needs a site visit.'
pillar: energy
```

```markdown
Banco Estado needed continuous visibility of electricity use across its branches. The work was
delivered through Fundación Chile.

## Problem

Consumption reached head office as a monthly bill. Without per-circuit readings, branches of
different size and use could not be compared, and a fault could run for a full billing cycle before
anyone noticed.

## What I built

Circuit-level monitoring and control, commissioned branch by branch so each site kept its own
monitoring through the changeover. Gateways stream readings through MQTT into a service layer, with
dashboards for the teams who run the branches. The same instrumentation can switch circuits
remotely.

## Result

Branches have live consumption data instead of monthly billing analysis. Outliers are visible while
they are happening, and routine switching no longer needs a site visit.
```

### 4. `vgr-cat` — This website (last)

```yaml
translationKey: vgr-cat
locale: en
title: 'vgr.cat: a trilingual site built with a reviewed, AI-assisted process'
summary: 'A small multilingual marketing site with a contact form, a Content Security Policy and accessibility requirements, built and documented in public.'
problem: 'The site needed three languages, a spam-protected contact form, a Content Security Policy and accessibility requirements, without adding a CMS or a framework the maintainer would have to operate.'
approach: 'Astro statically generates the site for Cloudflare Workers assets, with the contact endpoint in a small Worker. The repository contains plans, decisions and verification notes. CI covers types, lint, accessibility and dictionary parity on pull requests and pushes to main; a deploy dry-run is an additional local check.'
outcome: 'The site is live in English, Spanish and Catalan. The repository shows the process, decisions and checks, and keeps earlier planning records available.'
pillar: build
```

```markdown
vgr.cat is my own site: a small multilingual marketing site with a contact form, security and
accessibility requirements, maintained by me.

## Problem

The site needed three languages, a spam-protected contact form, a Content Security Policy and
accessibility requirements, without adding a CMS or a framework the maintainer would have to operate.

## What I built

Astro statically generates the site for Cloudflare Workers assets, with the contact endpoint in a
small Worker. The repository contains plans, decisions and verification notes. Automated checks cover
types, lint, accessibility and dictionary parity across languages. CI runs on pull requests and pushes
to main; the deploy dry-run is an additional local check. Earlier planning records remain in
`.ai/plans/archive/` as read-only history; the current `specs/` structure was adopted later.

## Result

The site is live in English, Spanish and Catalan. The repository shows the process, decisions and
checks, and keeps earlier planning records available, so another engineer can follow the work.
```

---

## Related-work contract (not rendered)

The current related-work list is derived from the `pillar` field, so `modernize` would show no case
study. The plan adds a modernisation override to the existing pillar-derived matching; the resulting
relations must be:

| Service     | Case studies                                |
| ----------- | ------------------------------------------- |
| `build`     | `vgr-cat`                                   |
| `modernize` | `topten-ecosystem`                          |
| `platform`  | `topten-ecosystem`                          |
| `energy`    | `eu-inspection-tooling`, `banco-estado-iot` |

The `modernize` and `platform` bodies also link to `/work/topten-ecosystem/` directly. Translations
must use `/ca/work/topten-ecosystem/` and `/es/work/topten-ecosystem/`.

## Links

| Key                                    | Label                                 | Target                                                         |
| -------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `hero.ctaPrimary`                      | `Book a 30-min call`                  | `bookingUrl` (`https://calendar.app.google/3dd7SXGnZqUZsWXm6`) |
| `hero.ctaSecondary`                    | `See selected work`                   | `#work`                                                        |
| `process.proofLinkLabel`               | `See the specs and history on GitHub` | `https://github.com/vgr-dev/vgr.cat`                           |
| `ctaBand.primary`                      | `Book a 30-min call`                  | `bookingUrl`                                                   |
| `ctaBand.secondary`                    | `See selected work`                   | `#work`                                                        |
| `contact.directContact.calendarButton` | `Book a 30-min call`                  | `bookingUrl`                                                   |
| `contact.directContact.emailDirect`    | `Email`                               | `mailto:contact@vgr.cat`                                       |
| `footer.sourceLabel`                   | `View the source on GitHub`           | `https://github.com/vgr-dev/vgr.cat`                           |
| `services.engageLink`                  | `See ways to work together`           | `/#engage`                                                     |
| `nav.services`                         | `Services`                            | `#services`                                                    |
| `nav.caseStudies`                      | `Selected work`                       | `#work`                                                        |
| `nav.about`                            | `About`                               | `/about/`                                                      |
| `nav.contact`                          | `Contact`                             | `#contact`                                                     |
| `nav.bookCall`                         | `Book a call`                         | `bookingUrl`                                                   |

Body links in this deck use the English paths. For `ca` and `es`, use the locale-prefixed equivalents.
`services.engageLink` is `/#engage` in English, `/ca/#engage` in Catalan and `/es/#engage` in Spanish.
Nav and page targets use the existing localized path helpers; `/about/` becomes `/ca/about/` and
`/es/about/`. The implementation keeps link labels separate from prose and must not render a bare
URL as the link text. Both GitHub anchors use `repositoryUrl` from `src/config.ts`; the table records
the approved destination, not duplicate translated URL fields.

## Source and permission notes (not copy)

- **Topten:** limited to the owner-attested D8 facts (Yii2 platform, Laravel CMS, Topten.ch rollout).
  No ownership, acquisition or reorganisation story is published.
- **Banco Estado:** attributed through Fundación Chile. No bank, branch or bill counts are asserted.
- **Inspection tooling:** reproducible per D9; no legal, certification or enforcement claim.
- **Scale:** no traffic, uptime, revenue, team, client, bank or bill counts are asserted.
- **Permissions:** the owner must check contracts, confidentiality and permission for named
  attribution before publication. A client name is not an endorsement or certification; this deck
  does not determine whether a particular use requires written third-party consent.

## Dictionary contract (not rendered)

- Add dictionary sections `process` and `engage`.
- `process.steps` is `{ title, body }[]`; `engage.items` is `{ name, description, price, detail }[]`;
  `engage.terms` is `string[]`.
- Add `process.dataBoundary`, `process.proofLinkLabel`, `footer.sourceLabel`, `services.engageLink`.
  Use the shared repository URL constant rather than translated URL fields.
- Use section anchors `#work`, `#how-i-work`, `#engage` and `#contact`.
- Replace `about.credentials`; change `about.experienceTitle`, `about.techStackTitle`,
  `about.paragraphs`, `about.experience`, `about.competencies`, `about.title`, `about.eyebrow`.
- Remove `about.teaser` and `about.readMore`.
- Replace `services.pillars` keys with `build`, `modernize`, `platform`, `energy` and update their tags.
  `modernize` is the chosen English slug; visible copy uses British “modernise”. The previous service
  slugs are intentionally retired, not preserved by this change.
- Add `contact.form.serviceTypes.audit`; replace the old service types with the six keys above.
- Change `contact.form` labels listed above; retain the privacy, error and utility strings.
- Change `contact.directContact` labels listed above; retain the timezone.
- Add `caseStudies` order and the new `vgr-cat` entry; remove `topten-scout`.
- Add the explicit related-work mapping for `modernize` and `platform`.
- Add `audit` to the Worker's `SERVICE_TYPES` and update the form test fixture.
- Update `about.teaser`/`readMore` removal, `nav.caseStudies` label, and `SERVICE_TYPES` shape in
  `ca` and `es` as well.
