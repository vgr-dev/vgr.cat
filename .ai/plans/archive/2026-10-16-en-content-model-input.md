# Input: proposed English content model (`src/i18n/en.ts`)

**Status: not a plan, and not archived.** This is the design input for the *planned* adoption of a richer
information architecture. It was authored by the user on 2026-10-16 and had to be parked here because it
existed only as uncommitted working-tree content: `src/i18n/en.ts` was reshaped back to the current
`Dictionary` contract the same day so the gate would pass (see "What was parked and why" below).

A plan for turning this into the real content model belongs in this directory alongside this file.

---

## What was parked and why

The user's `en.ts` was written as `export default { … } as const`. That broke the repository in two ways:

1. **The module contract.** No named `en` export and no `Dictionary` type, so `ca.ts`, `es.ts` and
   `index.ts` failed to compile (`ts(2614)` ×4). At runtime `en` was `undefined`, so `dictionaries[locale]`
   was `undefined` and every `t.*` access threw — `npm run dev` was broken, not just `npm run check`.
2. **The information architecture.** The object describes sections that no component renders yet, and it
   omits keys that seven files do read. Roughly 90 % of it has no consumer today.

`as const` is load-bearing for this repository and **must not** come back unexamined: it gives every value a
*literal* type, so a `Dictionary = typeof en` would be unsatisfiable by any `ca`/`es` translation, killing
the cross-locale parity guarantee that the type exists to provide.

## Output the plan must produce

Adopting this model means, at minimum:

- `Dictionary` / `en` shape change, with `ca` and `es` realigned to the same keys (they are still
  `TODO(copy) [ca]` / `[es]` placeholders today).
- New or extended components to render `hero.badge`, `hero.metrics[]`, `services.pillars`, the
  `caseStudies.labels`, `about.paragraphs[]` / `competencies[]`, `contact.form` (organization, service
  type, submitting / success / error states) and `footer.legal`.
- A decision on the contact form's new fields, because they cross the network boundary: the Worker
  (`src/worker/index.ts`) validates and formats what the form posts, so organisation and service-type
  fields imply Worker changes, not just markup.
- Confirm-and-close for the slots this model does **not** cover (see "Gaps" below), and for the
  `TODO(copy)` sentinels that remain after adoption, since the D9 guard fails the build when
  placeholders outlive the hatch.

## Gaps in the model, as measured against the current consumers

Keys the current site reads that this model has no equivalent for, so they keep their sentinels:
`positioning.heading`, `positioning.body`, `header.menuLabel`, `header.primaryNavLabel`,
`form.turnstile`, and all of `thanks.*` and `notFound.*`.

Keys this model introduces that nothing renders yet: `site.author`, `site.location`, `nav.bookCall`,
`nav.ariaLanguageSelect`, `nav.ariaToggleMenu`, `hero.badge`, `hero.titleHighlight`, `hero.ctaPrimary`,
`hero.ctaSecondary`, `hero.metrics[]`, `services.eyebrow`, `services.subtitle`, `services.ctaLearnMore`,
`services.pillars.*`, `caseStudies.*`, `about.eyebrow`, `about.techStackTitle`, `about.competencies[]`,
`contact.eyebrow`, `contact.subtitle`, `contact.form.*` (beyond labels), `contact.directContact.*`,
`footer.tagline` (partially), `footer.copyright`, `footer.builtWith`, `footer.legal.*`.

## The parked content, verbatim

```ts
export default {
  // Global / Metadata
  site: {
    title: 'VGR | Principal Software Engineer & RegTech Consultant',
    description:
      'Software architecture, market surveillance automation, EPREL integrations, and high-scale data pipelines for the European energy transition.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Catalonia',
  },

  // Navigation
  nav: {
    services: 'Services',
    caseStudies: 'Case Studies',
    about: 'About',
    contact: 'Contact',
    bookCall: 'Schedule Call',
    ariaLanguageSelect: 'Select language',
    ariaToggleMenu: 'Toggle navigation menu',
  },

  // Hero Section
  hero: {
    badge: 'Available for European & Catalan Technical Advisory',
    title: 'Software Architecture & Data Observability for the',
    titleHighlight: 'Energy Transition',
    subtitle:
      'Principal Software Engineer specializing in European regulatory compliance systems (RegTech/GovTech), automated EPREL data pipelines, market surveillance observability, and resilient multi-tenant cloud platforms.',
    ctaPrimary: 'Book Technical Consultation',
    ctaSecondary: 'Explore Case Studies',
    metrics: [
      {
        value: '10+',
        label: 'Years building pan-European energy data platforms',
      },
      {
        value: 'EPREL & ESPR',
        label: 'Direct regulatory framework implementation',
      },
      {
        value: '100k+',
        label: 'Product identities resolved and audited',
      },
    ],
  },

  // Services Pillar Section
  services: {
    eyebrow: 'Specialized Capabilities',
    title: 'Engineering solutions for complex regulatory & data landscapes',
    subtitle:
      'Bridging technical directives, automated testing algorithms, and scalable infrastructure to eliminate manual bottlenecks.',
    ctaLearnMore: 'View related case study',
    pillars: {
      regtech: {
        tag: 'RegTech & Compliance',
        title: 'RegTech & EPREL Compliance Engines',
      },
      entityResolution: {
        tag: 'Data Intelligence',
        title: 'Product Entity Resolution & Observability',
      },
      infrastructure: {
        tag: 'Cloud & Systems',
        title: 'Multi-Tenant Platforms & Internal Tooling',
      },
    },
  },

  // Case Studies Section
  caseStudies: {
    eyebrow: 'Proven Deliverables',
    title: 'Featured Technical Deployments',
    subtitle:
      'Real-world systems delivering automated verification, high uptime, and operational efficiency across European institutions and public platforms.',
    labels: {
      problem: 'The Challenge',
      approach: 'The Architecture',
      outcome: 'Measurable Impact',
      readFull: 'Read full technical breakdown',
      backToList: 'Back to all case studies',
    },
  },

  // About / Experience Section
  about: {
    eyebrow: 'Background & Track Record',
    title:
      'Hands-on architectural leadership at the intersection of energy policy and software',
    paragraphs: [
      'I am a Principal Software Engineer based in Sant Cugat del Vallès (Barcelona), driving infrastructure, data engineering, and bespoke software tooling for major European energy efficiency initiatives, including Topten.eu and Topten.ch.',
      'My technical focus centers on closing the gap between complex EU regulations (Ecodesign, Energy Labelling, ESPR) and real-world market surveillance. I engineer high-throughput pipelines that cross-examine static certification registries against fragmented retail channels through algorithmic entity resolution and GTIN mapping.',
      'Whether advising public agencies on surveillance infrastructure, preparing manufacturers for Digital Product Passports, or building internal tools that empower domain analysts, I prioritize robust, zero-bloat systems with high operational ROI.',
    ],
    techStackTitle: 'Core Technical Stack & Competencies',
    competencies: [
      'Regulatory Formula Codification (EPREL, Ecodesign)',
      'Entity Resolution & String Disambiguation (GTIN/EAN)',
      'Multi-Tenant Platform Architecture',
      'API Design & Automated Ingest Pipelines',
      'Serverless & Edge Infrastructure (Cloudflare Pages/Workers)',
      'Bespoke Internal Tooling & Analyst UX',
    ],
  },

  // Contact / Lead Gen Section
  contact: {
    eyebrow: 'Work Together',
    title: 'Let us discuss your technical roadmap or compliance infrastructure',
    subtitle:
      'Available for architectural advisory, technical auditing, speaking engagements, and specialized engineering contracts across Catalonia, Spain, and the European Union.',
    form: {
      nameLabel: 'Your Name',
      namePlaceholder: 'e.g. Maria Puig',
      emailLabel: 'Professional Email',
      emailPlaceholder: 'name@organization.com',
      organizationLabel: 'Organization / Institution',
      organizationPlaceholder: 'Company, Agency, or NGO',
      serviceTypeLabel: 'Primary Focus',
      serviceTypes: {
        regtech: 'RegTech / EPREL Integration / ESPR Readiness',
        entityResolution: 'Market Observability / Entity Resolution',
        infrastructure: 'Multi-Tenant Architecture / Tooling',
        advisory: 'Technical Advisory / Speaking / Other',
      },
      messageLabel: 'Project Overview & Objectives',
      messagePlaceholder:
        'Describe your requirements, system constraints, or timelines...',
      submitButton: 'Send Inquiry',
      submitting: 'Submitting...',
      successMessage:
        'Thank you. Your message has been received. I will respond within 1–2 business days.',
      errorMessage:
        'Something went wrong while sending your message. Please reach out directly via email.',
    },
    directContact: {
      orDivider: 'or schedule directly',
      calendarButton: 'Book a 30-min Technical Discovery Call',
      emailDirect: 'Direct Email',
      locationLabel: 'Headquarters',
      locationValue: 'Sant Cugat del Vallès, Barcelona, Catalonia',
      timezone: 'Central European Time (CET/CEST)',
    },
  },

  // Footer
  footer: {
    tagline:
      'Architecting data-driven systems for the European energy transition.',
    copyright: `© ${new Date().getFullYear()} VGR. All rights reserved.`,
    builtWith: 'Engineered with Astro & Tailwind. Hosted on Cloudflare Pages.',
    legal: {
      privacy: 'Privacy Policy',
      imprint: 'Legal Notice',
    },
  },
} as const;
```

## Two content notes to verify during adoption, not defects

- `footer.builtWith` reads *"Hosted on Cloudflare Pages"*; this site runs on **Workers static assets**
  (a settled decision recorded in `AGENTS.md`). The string needs rewording, not the architecture.
- `footer.copyright` computes `new Date().getFullYear()` inside the dictionary. With `output: 'static'`
  that evaluates **at build time**, so the year freezes at the build date. Decide deliberately whether
  that is acceptable or whether it belongs in the footer component instead.
