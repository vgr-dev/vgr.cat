---
status: draft # draft | active | done | abandoned
created: 2026-11-17
status-date: 2026-11-17
---

# Content repositioning: senior engineering with an energy specialism

## Goal

Help a buyer recognise a service they can buy from Victor Gonzalez: building a web product,
modernising a legacy application, or taking part-time ownership of a production platform. Energy and
EU product data remain a differentiating specialism, not a requirement for becoming a client.

The primary audience hypothesis is a small team with business-critical web software and no senior
technical owner, in Spain or elsewhere in the EU. Founders, business owners and technical managers
should understand the offer without understanding the tooling. This is a positioning hypothesis to
test with enquiries and sales conversations, not a validated market-size or conversion claim.

> Build, modernise and run the software your business depends on.
>
> A senior full-stack engineer and fractional tech lead near Barcelona, with a background in energy
> efficiency and EU product data. Small delivery steps, personal review and a documented handover.

AI is a delivery method explained after client work, not a promise of faster delivery. The public
repository illustrates decisions, checks and workflow artifacts; it does not prove a speed advantage,
universal human review or client outcomes.

## Review correction (2026-11-17)

This revision supersedes the initial review narrative and draft copy. There are no implementation
results yet. The previous draft mixed facts, assumptions and internal instructions, and treated a CV
as verification even though one of its figures was known to be wrong.

- The current hero, services and CTA are energy-oriented; their effect on enquiries has not been measured.
- Claims about five-second departures, buyer search vocabulary and readers identifying AI-written copy
  were hypotheses, not research findings. They are not publication evidence.
- Quantitative traffic, uptime, deployment, revenue and productivity claims are omitted from the new
  copy until their definitions, dates, sources and permission to publish are established.
- Existing client rates and unreleased third-party product plans have been removed from this working
  document. This does not remove earlier Git objects or copies. No history rewrite is authorised;
  review the complete branch and its history before any authorised push.
- English copy, the home order and engagement terms are now specified in `copy-en.md`. Proposed changes
  remain subject to human sign-off; this request to fix the documents is not implementation approval.

## Scope

- Rewrite UI copy and the four services in English, then translate the approved English into Catalan
  and Spanish. Implement all three locales together in each step to preserve dictionary and route parity.
- Replace the pillars with `build`, `modernize`, `platform`, `energy`.
- Retire product entity resolution as an advertised service. Energy work covers regulatory calculation
  software, product-data readiness, monitoring and bill analytics within the service boundary below.
- Remove Topten Scout. Publish the case studies in this order: Topten, inspection tooling, Banco Estado,
  this website. The website is engineering-process evidence, not a substitute for a client result.
- Associate Topten with both modernisation and platform services through explicit related-work mapping,
  without duplicating the case study or changing its canonical `pillar: platform`.
- Add compact How I work and Ways to work together home sections; remove the separate About teaser.
  Keep Victor's name and specialism in the hero, and keep the About navigation link.
- Show the three selected prices with scoped terms. Link service-detail visitors to the engagement
  section, and make GitHub references real links.
- Add verification for renamed contact options and the new section layout; do not weaken existing budgets.

## Non-goals

- Visual redesign, new colours, photography or layout overhaul.
- Blog, newsletter, CMS, new tracking services or a separate pricing page without further approval.
- Editing the CV or LinkedIn, undertaking outreach, obtaining client endorsements or publishing new
  client metrics. These are owner follow-ups, not builder deliverables.
- Dependency upgrades, production configuration changes, deployment, commits or pushes as part of
  this document revision. A failing dependency audit must be resolved separately before release.

## Decisions

These carry forward the recorded owner choices, with publication corrections from the review. The
plan's sign-off remains blank. New offer clarifications are proposals to approve with the copy, not
terms already agreed with any customer.

- **D1 Identity and attribution:** use Victor Gonzalez. The previously selected names are Topten,
  Bush Energie, Brandes Energie, Banco Estado and Fundación Chile. The copy uses Topten, Bush Energie,
  Banco Estado and Fundación Chile only where relevant. Do not add other clients, ministry names or
  endorsements. Owner review of contracts, confidentiality and permission for each attribution remains
  a release requirement; naming an organisation does not imply it endorses Victor's services.
- **D2 Headline title:** `Senior Full-Stack Engineer & Fractional Tech Lead`. In Spanish/Catalan,
  describe the part-time role as `tech lead a tiempo parcial` / `tech lead a temps parcial`.
  This is the headline positioning, not a replacement for accurate historical role titles. Use
  `Sant Cugat del Vallès, near Barcelona` as the canonical English location, with contextually shorter
  references to Barcelona permitted. Update structured data as well as visible copy.
- **D3 Service boundary:** do not advertise product search, retailer feeds or APIs, procurement exports,
  market monitoring, GTIN matching, or combined registry/market-data integration as standalone services.
  Do not name or compare an unreleased third-party offering, disclose its plans, or link to its
  development URL in public copy or new public planning material. General data-pipeline engineering
  is allowed outside these excluded product-data services.
- **D4 Topten Scout:** remove the three content entries and their home/order references. Do not replace
  them with a claim about why the underlying work is unavailable.
- **D5 Bill analytics:** retain a qualitative description only. The earlier per-client volume claim was
  incorrect; the corrected owner-reported scope is aggregate across clients. No volume is published
  without dated processing evidence, a counting definition and permission. Correct the CV separately.
- **D6 Public prices:** keep prices for all three engagement models. Prices are business decisions,
  not validated market medians or evidence that the offer is cheap in a particular country.
- **D7 Offers:** audit €2,500 fixed, up to five working days normally scheduled over one to two calendar
  weeks; project reference rate €640 for an eight-hour day; discovery €1,280 for two working days;
  fractional €2,400/month for four eight-hour days, three-month minimum (€7,200), then one month's notice.
  The proposed audit scope is one agreed application, environment or technical plan, with a prioritised
  report and walkthrough, not a penetration test or compliance certification. Discovery produces an
  owned specification and a quote for the agreed scope; unresolved complexity is reported before
  further paid work. If accepted, the fixed project total includes discovery and the €1,280 already
  paid is credited once. The day rate is an estimating basis, not an additional charge on a fixed quote.
  Scheduling, extra work, response expectations and any out-of-hours support require written agreement;
  the retainer does not include 24/7 on-call. VAT, travel and third-party costs are stated separately
  and agreed before they are incurred. Review rates after three clients or six months alongside lead
  quality, proposal outcomes and actual effort; acceptance without negotiation alone is not proof of
  underpricing.
- **D8 Topten:** owner-confirmed architecture is a Yii2 platform behind Topten.eu and partner sites,
  followed by a Laravel CMS live on Topten.ch and intended for country-by-country migration. Use this
  as modernisation and operations evidence. Omit the corporate transaction timeline, employment-status
  assumptions, automated failover and unsubstantiated scale/performance claims.
- **D9 Inspection tooling:** describe the work qualitatively. The owner reports that results retain
  input data, formula version and calculation. Do not claim measured time savings, immutable audit
  trails, legal defensibility, regulatory approval or certification.
- **D10 Publication and method:** owner approval of wording is not third-party permission. Public
  workflow evidence is illustrative, including historical files under `.ai/plans/archive/`; do not
  claim the current `specs/` layout existed for every historical change. Avoid universal signature,
  speed, zero-defect, zero-downtime or security/accessibility-conformance claims.

## Evidence and publication register

Status dates below are 2026-11-17. A statement in an existing website or CV is not independent
evidence. Private evidence stays outside this public repository; record only a non-sensitive
description and the owner's publication decision here when available.

| Claim or commitment                                                        | Source / evidence status                                                                                                                                                                                              | Publication treatment                                                                                                              |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Topten Yii2/Laravel work and migration scope                               | Owner statement D8; public relaunch corroborated by [Topten's announcement](https://www.topten.eu/private/article/new-topten-switzerland-website-successfully-launched), which does not prove authorship or framework | Qualitative draft; owner must confirm attribution and permission before release                                                    |
| Fundación Chile / Banco Estado IoT work                                    | Existing case study and recorded owner attribution, not independent deployment records                                                                                                                                | Qualitative draft with Fundación Chile attribution; owner permission review required                                               |
| Inspection-result traceability                                             | Owner statement D9; underlying client implementation not inspected in this repo                                                                                                                                       | Qualitative draft; owner must confirm the described fields actually exist and may be disclosed                                     |
| Consultancy/founder history and historical role dates                      | Recorded owner history; no CV supplied in this review                                                                                                                                                                 | Keep qualitative history and role dates subject to owner review; no revenue/team/client counts                                     |
| Traffic, pageviews, uptime, fleet size and monitored locations             | No dated analytics, monitoring definition or deployment inventory supplied                                                                                                                                            | Omitted, including from hero cards, metadata and structured data                                                                   |
| Bill-processing volume                                                     | Earlier CV wording corrected by owner; no dated measurement supplied                                                                                                                                                  | Omitted; retain capability only                                                                                                    |
| Years working remotely and current credentials                             | Not independently established; no current qualification/publication/membership evidence supplied                                                                                                                      | No duration, membership or textbook claim                                                                                          |
| Working languages                                                          | English/Spanish delivery and welcoming Catalan enquiries are proposed service commitments, not externally tested proficiency levels                                                                                   | Owner must approve this offer before publication; agree delivery language with the client and do not claim fluency or a CEFR level |
| AI use since August 2025                                                   | Recorded personal statement, not evidence of daily use or productivity gain                                                                                                                                           | Duration omitted; describe agreed method, review and tool/data boundaries                                                          |
| Astro static output, three locales, public code and workflow configuration | `astro.config.mjs`, `src/i18n/config.ts`, `.github/workflows/ci.yml`, repository history                                                                                                                              | Publish qualitative implementation facts; no hardcoded page/rule/asset totals                                                      |
| Automated checks                                                           | CI runs on PRs, `main` pushes and manual dispatch; dry-run is an additional local check                                                                                                                               | Describe these separately; no claim that every feature push runs CI                                                                |
| ESPR / Digital Product Passport readiness                                  | [European Commission implementation overview](https://green-forum.ec.europa.eu/news/ecodesign-sustainable-products-regulation-moves-implementation-2026-07-02_en): phased, product-specific framework                 | Engineering preparation only; no universal deadline, legal advice or compliance guarantee                                          |
| Prices and engagement boundaries                                           | Owner-selected amounts; clarifications in D7 proposed for sign-off                                                                                                                                                    | Publish only after copy/terms approval; no market-median comparison                                                                |
| Response time, availability and AI-tool handling                           | Prospective service commitments, not historical performance evidence                                                                                                                                                  | Use bounded wording; agree schedule, tools and permitted data before access                                                        |

## Acceptance criteria

- [ ] Human sign-off covers this spec, the complete English copy, related-work mapping and proposed terms.
- [ ] Home, service, case-study, About, contact, footer and structured-data copy match `copy-en.md`;
      retained strings follow its explicit retain-existing rule. No editorial instructions render as copy.
- [ ] No excluded product-data service, unreleased partner name/URL, internal client rate or unsupported
      quantitative/performance/legal claim is introduced in the site or new public planning material.
- [ ] Owner review confirms every named attribution, historical role and client implementation statement
      in the evidence register. Missing permission/evidence blocks that claim, not an invented substitute.
- [ ] Headline title and canonical location are consistent across site metadata and visible identity;
      historical titles and shorter geographic references remain semantically accurate.
- [ ] Catalan and Spanish translations are reviewed by the owner before release; dictionary parity,
      translated content routes and locale-aware links pass checks.
- [ ] Modernisation and platform pages both link to Topten as related work; service pages link to the
      localised home engagement section, and public repository references are clickable.
- [ ] All six contact keys (`build`, `modernize`, `platform`, `energy`, `audit`, `other`) agree between
      dictionaries, rendered options and the Worker's accepted map. Verification distinguishes stubbed
      browser responses from actual Worker handling.
- [ ] Existing desktop/mobile/word budgets pass in every locale, with explicit layout coverage for the
      new engagement cards. Do not increase budgets to make the content fit.
- [ ] Full repository gate, dependency audit, E2E and deployment dry-run pass with exact evidence in
      `progress.md`; any failure stays blocked and counts are updated only from actual output.
- [ ] Owner separately records CV/LinkedIn follow-up and confirms publication review before any authorised
      push/deploy. Mark `done` only after the owner confirms the live result, not merely a local build.

## Owner follow-ups and outreach evaluation

- Review the draft commercial clarifications, identity, client attribution and technical case-study facts.
- Align CV/LinkedIn headline and location; correct the bill-volume wording there. This is not an
  instruction for the builder to access or edit external accounts.
- Select approved AI tools and code/data-sharing boundaries with each client; do not invent provider
  training, retention, IP or data-residency guarantees. A procurement FAQ can follow once policy exists.
- Consider an approved portrait and client quote as a separate enhancement. No invented testimonials,
  implied endorsements, availability dates or local clients are added by this plan.
- Use existing locale pages as outreach destinations. After launch, privately record enquiry source,
  qualification, calls and proposals over a six-week review window using existing tools; do not add
  tracking or claim a statistically established conversion gain. Revisit the audience hypothesis with
  actual sales conversations, not pageviews alone.

## Relevant files and constraints

`src/i18n/{en,ca,es}.ts`, content collections and `src/content.config.ts`, `src/lib/content.ts`,
`src/components/HomeSections.astro`, the service/detail templates, `PageShell.astro`, `SiteFooter.astro`,
the contact Worker and form tests, and layout/page-weight tests are detailed in `plan.md`.

Settled static architecture, CSP, Workers routing, no client framework and the placeholder guard remain
unchanged. Read the scoped source/Worker instructions before implementation. Retired service/Scout URLs
may 404 under the recorded decision; no redirects are scheduled in this plan. This trades away possible
existing links and indexing, and does not assert that the unpromoted site has none.

## Approval state

Draft revised after review. Commercial clarifications, copy, evidence/permission checks and translations
still require owner approval. No implementation step is complete and no plan sign-off is implied.
