# Companion: Information Architecture — `vgr.cat`

Companion to `2026-10-15-portfolio-regtech-site.md` (Task 1.1). Move both together when archiving.

## Status

**AGREED 2026-10-15.** The user accepted the proposed defaults ("go"): single long page per locale,
calendar booking as the hero CTA *and* in the Contact section, all eight sections kept. Phase 2 is
unblocked.

## Shape

**Single page** per locale (`/`, `/ca/`, `/es/`), long-scroll, anchor-linked from the header. A separate
`/contact/thanks` page receives the post-submit redirect (Phase 4). This matches the restrained,
typographic reference direction and the component set already named in the plan.

## Section inventory (ordered)

1. **Header** — wordmark, in-page anchors, `LanguagePicker`. (`SiteHeader.astro`)
2. **Hero** — one-line value proposition + sub-line + primary action (contact/booking). (`Hero.astro`)
3. **Positioning** — short paragraph: who this is for and the problem domain (EU energy-market
   surveillance, EPREL, DPP/ESPR).
4. **Services** — the three pillars, one `ServiceCard` each:
   - RegTech / EPREL compliance
   - Entity Resolution & Market Observability
   - Multi-tenant Cloud Infrastructure
5. **Selected work** — three `CaseStudy` entries (Topten ecosystem, Topten Scout, EU inspection
   tooling), each problem → technical approach → public, non-confidential outcome.
6. **About / credibility** — concise bio, location (Sant Cugat del Vallès), engagement model.
7. **Contact** — `ContactSection`: spam-protected form (Phase 4) + calendar booking link.
8. **Footer** — minimal legal / social / language links. (`SiteFooter.astro`)

## Resolved (2026-10-15)

The user accepted the defaults ("go"): a single long page, calendar booking as the hero CTA *and* in the
Contact section, all eight sections kept. No section was dropped.

## Tone guidelines for the copy phase (Task 3.4)

House style for the final EN/CA/ES copy. Until then every string carries a `TODO(copy)` sentinel (D8/D9).

- **Pragmatic and authoritative, never salesy.** State what was built and what it changed. No
  "passionate", "rockstar", "ninja", or "I love solving problems".
- **Metrics-driven where public.** Operational ROI, regulatory certainty, system resilience — and only
  numbers that are already public or that you own. See the confidentiality non-goal.
- **No generic developer clichés.** No "full-stack", no "10x", no "clean-code advocate".
- **Regulatory precision is the credibility signal.** Cite frameworks by real name and scope: EPREL,
  ecodesign, energy labelling, ESPR/DPP, GTIN/EAN, MSAs. For this audience, correct terminology
  outperforms polished marketing.
- **Audience-first framing.** Public agencies (ICAEN, IDAE, EU MSAs) care about mandate and
  verifiability; marketplaces, distributors and manufacturers care about the cost of non-compliance and
  automation.
- **Catalan is written, not translated.** Institutional / public-tender register — "administració",
  "compliment normatiu", "supervisió de mercat" — not a machine gloss of the English. Same for Spanish.
  Where a phrase only works in English, rewrite it per locale rather than translate it.
- **Keep sentences short.** The layout is typographic and single-column; long clauses read badly in it.
