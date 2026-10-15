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

## Open questions for the user (block Phase 2 confirmation, not Phase 1)

- Is a single long page correct, or should Selected work / About become their own routes?
- Should the calendar booking be primary (hero CTA) or live only in the Contact section?
- Any section to drop for a leaner first launch (e.g. merge Positioning into Hero)?
