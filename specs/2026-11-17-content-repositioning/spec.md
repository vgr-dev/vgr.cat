---
status: draft # draft | active | done | abandoned
created: 2026-11-17
status-date: 2026-11-17
---

# Content repositioning: from "EPREL specialist" to "senior builder with an energy niche"

## Goal

Reposition vgr.cat so a Catalan, Spanish or EU company looking for a senior engineer recognises an
offer it can buy. Today the site sells EU energy-regulation engineering (EPREL, market surveillance, GTIN
resolution) almost exclusively. That is a narrow market, and the EPREL Services team's upcoming site
(product search, retailer data and API, procurement exports, market monitoring, EPREL plus market data)
will cover most of the "Data Intelligence" pillar and part of "RegTech". The new positioning:

> A senior full-stack engineer and fractional tech lead who ships production software quickly, using AI agents
> inside a spec-driven process where a human (me) approves every plan and reviews every change. My
> specialism is energy and EU product data, but it is not the whole offer.

The AI angle is presented as a **delivery method with evidence** (this repository is public and shows
specs, ADRs, verification logs, signed commits), not as a buzzword.

## Findings from the review

### Positioning

1. **The offer is too narrow for the target market.** Every service, the hero, the CTA band and the footer
   say "energy efficiency / EPREL". A Barcelona SME that needs a back-office tool, a Laravel upgrade or
   someone to keep its platform up will leave in five seconds.
2. **Direct overlap with EPREL Services.** `entity-resolution` (GTIN matching, market observability,
   price and availability tracking) is, more or less, their "EPREL & Market Data Integration" and "Market
   Monitoring". `regtech` partially overlaps. Selling these as services competes with them.
3. **Strongest evidence is not on the site:** how the work is done. Twelve years of experience is a
   commodity claim. "AI-assisted, spec-driven, human-reviewed, with a public repo showing it" is not.
4. **Missing proof from the CV:** energy-bill analytics tooling that processes 1,000+ bills a month per
   client (document automation, a very sellable capability); the founder story is on About but not used
   as a selling point (budgets, clients, small teams).
5. **No engagement model.** A buyer cannot tell whether to ask for a project, a monthly retainer or an
   audit. There is no "how we would work together".

### Tone

6. Copy reads like generic agency marketing: "Specialized Capabilities", "Proven Deliverables",
   "Headquarters" (for a solo consultant), "Algorithmic Regulatory Validation", "Zero-Maintenance CI/CD",
   "Bridge Built". It weakens trust, and in 2026 readers associate this register with AI-generated copy,
   which is the opposite of the message.
7. Clients and employers are anonymised ("a national public bank", "a Swiss energy-efficiency platform
   operator"), while the CV and LinkedIn name them. Named work is far more credible.

### Accuracy (must be fixed regardless of repositioning)

8. **Job title differs across channels:** site "Principal Software Engineer & Consultant"; CV "Senior
   Software Engineer Consultant · Remote Project Lead" and "Lead Platform Engineer and Consultant".
   LinkedIn could not be read (it blocks automated fetches, HTTP 999), so check it by hand.
9. **Topten scope:** the site says I architected Topten.eu, Topten.ch and the international instances
   "from the ground up"; the CV says lead platform engineer for topten.ch plus 17 production sites.
   Confirm which is accurate.
10. **`eu-inspection-tooling` contradicts itself:** the outcome says "days to minutes per batch", the
    impact says "hours ... to seconds". "Legally defensible" is a strong claim. Confirm both.
11. **Unsupported metrics** in `topten-ecosystem`: onboarding "weeks to hours", "zero maintenance downtime",
    "sub-second catalog response times", "negligible infrastructure costs", new categories "in days rather
    than months". Keep only what can be backed up.
12. Location: site "Sant Cugat del Vallès", CV "Barcelona". Both are fine; pick one primary form.

## Scope

- Rewrite English copy in `src/i18n/en.ts` and `src/content/**/*.en.md` per `copy-en.md`.
- Replace the four service pillars with: `build`, `modernize`, `platform`, `energy`.
- Retire `entity-resolution` as a service; fold the remaining regulatory and IoT work into `energy`.
- Reorder and retitle case studies; drop Topten Scout; add a case study for this website (the delivery
  method, shown on a real project).
- Show prices for the three engagement models.
- Add two short home sections: **How I work** and **Ways to engage**.
- Then translate to `ca` and `es` (after the English copy is approved).

## Non-goals

- Visual redesign, new colours or layout overhaul.
- Prices on the site (open question below).
- Blog, newsletter, CMS.

## Relevant files

- `src/i18n/en.ts`, `ca.ts`, `es.ts`: all UI copy; `Dictionary` parity is enforced by `astro check`.
- `src/content/services/*.md`, `src/content/caseStudies/*.md`: service and case-study bodies.
- `src/content.config.ts`: the `pillar` enum must change with the new pillars.
- `src/components/HomeSections.astro`: section order; the two new sections need small components.
- `src/components/ContactForm.astro`, `src/worker/**`: the "Primary Focus" values (check whether the Worker
  validates them before renaming; read `.github/instructions/worker.instructions.md`).

## Constraints (do not touch)

- Settled architecture in AGENTS.md (static output, CSP, Workers, no client framework).
- No `TODO(copy)` / `REPLACE_ME` sentinels under `src/`.
- Do not publish a comparison with, or a link to, the EPREL Services development URL.

## Acceptance criteria

- [ ] Hero, services, case studies, about, CTA band, contact and footer match the approved `copy-en.md`.
- [ ] No service page offers GTIN resolution or market monitoring as a service.
- [ ] Every metric on the site appears in the CV or is confirmed by me in this spec.
- [ ] One job title and one location form used across site, CV and LinkedIn.
- [ ] `ca` and `es` translated; `astro check` passes (dictionary parity).
- [ ] Full verification gate from AGENTS.md passes; page count updated in AGENTS.md if it changes.

## Decisions (2026-11-17)

- **D1 Name and clients:** use "Victor Gonzalez" and name Topten, Bush Energie, Brandes Energie, Banco
  Estado and Fundación Chile.
- **D2 Title:** `Senior Full-Stack Engineer & Fractional Tech Lead`, used on the site, the CV and LinkedIn.
  Reasoning: "full-stack" is the search term buyers use; "fractional tech lead" names a product an SME
  can buy (part-time senior ownership) and is honest given the founder and team-lead history.
  "Fractional CTO" was rejected because it overclaims. "Principal" was rejected because it is a
  big-company ladder rung that means little to a small buyer. In `es`/`ca`, "fractional" is not common
  usage: render it as "tech lead a tiempo parcial" / "tech lead a temps parcial".
  LinkedIn headline (longer form): `Senior Full-Stack Engineer & Fractional Tech Lead · AI-assisted,
  spec-driven delivery · Energy & EU product data · Barcelona`.
- **D3 EPREL Services:** I sit on its consulting team representing Topten. So the site must not offer
  anything EPREL Services sells: product search, retailer data/API, procurement exports, market
  monitoring, or EPREL plus market-data integration. The `energy` service keeps only ESPR/DPP readiness,
  regulation in code, energy monitoring and bill analytics. The site does not name EPREL Services while it
  is unreleased. Once it is public, add the consulting role as a credential on About.
- **D4 Topten Scout:** dropped (it is not publicly reachable). Delete
  `src/content/caseStudies/topten-scout.{en,ca,es}.md`; the `entity-resolution` pillar goes with it.
- **D5 Bill analytics:** 1,000+ bills a month **across all clients** (the CV's "per client" is wrong and
  must be corrected there too). Not enough detail for a case study, so it is a line in the `energy`
  service only.
- **D6 Prices:** shown, for all three engagement models. Figures still needed (open question 1).
- **Topten history (for accurate copy):** Topten started under Bush Energie, became Topten GmbH, and was
  sold by Bush Energie to Brandes Energie about two years ago; it still operates under Brandes. VGR SpA
  was my own consultancy and freelance vehicle in Chile. The CV's "Bush Energie" is correct.
- **AI agents:** building with agents since August 2025.

- **D7 Prices** (market data gathered 2026-11-17, small and vendor-heavy samples, so indicative only):
  Spain senior full-stack freelance roughly €55–80/h, median about €65/h; Germany and Netherlands senior
  contractors roughly €650–1,000/day. Current Topten rate is about 50 CHF/h, which is below both. Chosen:
  **€640/day (€80/h)**: top of the Spanish range, bottom of the northern-EU range, so it is credible
  locally and cheap for EU clients. All prices exclude VAT.
  - Audit: **€2,500 fixed**, up to 5 days of work, written report. Priced below 5 × day rate on purpose,
    as the entry offer.
  - Project: **€640/day**; a paid spec phase of **€1,280** (2 days) produces a fixed quote, and that fee is
    deducted if the project goes ahead.
  - Fractional tech lead: **€2,400/month for 4 days** (€600/day for the commitment), 3-month minimum,
    then a month's notice.
  - Review the rates after the first 3 clients or 6 months. If every quote is accepted without
    pushback, the rate is too low.
- **D8 Topten scope:** I architected the Topten.eu platform (legacy Yii2, which still runs Topten.eu and
  most partner sites) and a new Laravel CMS, live on Topten.ch and being rolled out to other countries.
  This is also the flagship proof for the `modernize` service.
- **D9 Inspection tooling:** no time-saving figure (not measured). Describe the change qualitatively.
  Replace "legally defensible" with "reproducible": every result records its input data, formula version
  and calculation.
- **D10 EPREL Services wording:** cleared (no conflict raised from my side).

## Open questions

None. Ready for `/spec-plan`.

## Resolved questions (kept for the record)

1. **Name and clients.** Can the site use "Victor Gonzalez" and name Topten, Brandes Energie, Banco
   Estado and Fundación Chile? (Recommended: yes, matching the CV.)
2. **Title.** Which one? Proposal: "Senior full-stack engineer & remote tech lead".
3. **EPREL Services relationship.** Is it your employer's or a partner's product? If so, the `energy`
   service can position you as the complement ("I integrate EPREL data into your own systems and prepare
   your product data for ESPR / Digital Product Passport"), and could even refer clients to them once
   they are live. If they are unrelated, keep the complement wording without naming them.
4. **Topten Scout.** Keep it as a case study (it is past work, and it is proof), or drop it because it
   is now the EPREL Services team's product territory, or confidential?
5. **Bill-processing case study.** Facts for the Chilean tooling (client type, input formats, volume,
   what it replaced, stack)? Without them it stays a one-line mention.
6. **Other AI-era proof.** Any other project built with the agent workflow (internal tools, scripts, a
   migration) you can describe, even anonymised?
7. **Prices.** Show "from" prices or day rates for the three engagement models, or keep "ask me"?
   (Recommended: a price range for the audit only, since it is the lowest-friction entry point.)
8. **Topten scope and inspection-tooling metrics:** see findings 9 to 11.
