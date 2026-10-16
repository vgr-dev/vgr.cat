/**
 * English UI dictionary. This module is the contract: `Dictionary` is derived from it, and `ca`/`es`
 * must match its shape exactly.
 *
 * 2026-10-16 — the user's richer content model was parked rather than adopted here, because the
 * components do not render it yet and it omitted keys this shape requires. Where the parked model had a
 * faithful equivalent, that English copy is used below; the slots it did not cover keep the sentinel so
 * the D9 guard still accounts for them — except `thanks` and `notFound`, whose English copy was written
 * on request the same day. See `.ai/plans/active/2026-10-16-en-content-model-input.md` for the parked
 * model, the gaps, and the adoption work.
 *
 * Do not add `as const`: it would make every value a literal type, and no `ca`/`es` translation could
 * ever satisfy `Dictionary`.
 */
export const en = {
  meta: {
    title: 'VGR | Principal Software Engineer & RegTech Consultant',
    description:
      'Software architecture, market surveillance automation, EPREL integrations, and high-scale data pipelines for the European energy transition.',
  },
  nav: {
    services: 'Services',
    // Named "Case Studies" in the parked model; the anchor the pages link to is still `#work`.
    work: 'Case Studies',
    about: 'About',
    contact: 'Contact',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'TODO(copy) — Menu',
    primaryNavLabel: 'TODO(copy) — Primary',
    languageNavLabel: 'Select language',
  },
  hero: {
    // The parked model splits this across `title` + `titleHighlight` for a styled span; joined here
    // for the single-string slot the current component takes.
    title:
      'Software Architecture & Data Observability for the Energy Transition',
    subtitle:
      'Principal Software Engineer specializing in European regulatory compliance systems (RegTech/GovTech), automated EPREL data pipelines, market surveillance observability, and resilient multi-tenant cloud platforms.',
    cta: 'Book Technical Consultation',
  },
  positioning: {
    heading: 'TODO(copy) — Positioning heading',
    body: 'TODO(copy) — who this is for and the problem domain.',
  },
  services: {
    heading: 'Engineering solutions for complex regulatory & data landscapes',
  },
  work: { heading: 'Featured Technical Deployments' },
  caseStudy: {
    problem: 'The Challenge',
    approach: 'The Architecture',
    outcome: 'Measurable Impact',
  },
  about: {
    heading:
      'Hands-on architectural leadership at the intersection of energy policy and software',
    // First of three paragraphs in the parked model; the other two need the richer component.
    body: 'I am a Principal Software Engineer based in Sant Cugat del Vallès (Barcelona), driving infrastructure, data engineering, and bespoke software tooling for major European energy efficiency initiatives, including Topten.eu and Topten.ch.',
  },
  contact: {
    heading:
      'Let us discuss your technical roadmap or compliance infrastructure',
    body: 'Available for architectural advisory, technical auditing, speaking engagements, and specialized engineering contracts across Catalonia, Spain, and the European Union.',
    bookingLabel: 'Book a 30-min Technical Discovery Call',
  },
  form: {
    name: 'Your Name',
    email: 'Professional Email',
    message: 'Project Overview & Objectives',
    submit: 'Send Inquiry',
    turnstile: 'TODO(copy) — Protected by Cloudflare Turnstile.',
  },
  thanks: {
    title: 'Message sent | vgr.cat',
    heading: 'Thank you — message received',
    // Doubles as the page's meta description, so it has to read standalone.
    body: 'Your enquiry has been sent. A confirmation is on its way to your inbox, and I reply personally, usually within one or two business days.',
    back: 'Back to the home page',
  },
  notFound: {
    title: '404 — Page not found | vgr.cat',
    heading: 'This page could not be found',
    // Doubles as the page's meta description, so it has to read standalone.
    body: 'The page you requested does not exist or has moved. Check the address, or return to the home page to find the section you need.',
    back: 'Return to the home page',
  },
  footer: {
    note: 'Architecting data-driven systems for the European energy transition.',
  },
};

export type Dictionary = typeof en;
