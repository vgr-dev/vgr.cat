/**
 * English UI dictionary. This module is the contract: `Dictionary` is derived from it, and `ca`/`es`
 * must match its shape exactly.
 *
 * The shape and English values come from the adopted content model in
 * `.ai/plans/active/2026-10-16-en-content-model-input.md`; the keys the model omitted but consumers
 * still read (`header`, `thanks`, `notFound`, `contact.form.turnstile`) are retained here.
 *
 * Do not freeze this object's literals: it would make every value a literal type, and no `ca`/`es`
 * translation could ever satisfy `Dictionary`.
 */
export const en = {
  site: {
    title: 'VGR | Principal Software Engineer & RegTech Consultant',
    description:
      'Software architecture, market surveillance automation, EPREL integrations, and high-scale data pipelines for the European energy transition.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Catalonia',
    jobTitle: 'Principal Software Engineer',
  },
  nav: {
    services: 'Services',
    caseStudies: 'Case Studies',
    about: 'About',
    contact: 'Contact',
    bookCall: 'Schedule Call',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'Toggle navigation menu',
    primaryNavLabel: 'TODO(copy) — Primary',
    languageNavLabel: 'Select language',
  },
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
  services: {
    eyebrow: 'Specialized Capabilities',
    title: 'Engineering solutions for complex regulatory & data landscapes',
    subtitle:
      'Bridging technical directives, automated testing algorithms, and scalable infrastructure to eliminate manual bottlenecks.',
    ctaLearnMore: 'View related case study',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech & Compliance' },
      'entity-resolution': { tag: 'Data Intelligence' },
      infrastructure: { tag: 'Cloud & Systems' },
    },
  },
  caseStudies: {
    eyebrow: 'Proven Deliverables',
    title: 'Featured Technical Deployments',
    subtitle:
      'Real-world systems delivering automated verification, high uptime, and operational efficiency across European institutions and public platforms.',
    labels: {
      problem: 'The Challenge',
      approach: 'The Architecture',
      outcome: 'Measurable Impact',
    },
  },
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
      turnstile: 'TODO(copy) — Protected by Cloudflare Turnstile.',
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
    tagline:
      'Architecting data-driven systems for the European energy transition.',
    builtWith:
      'Engineered with Astro & Tailwind. Hosted on Cloudflare Workers.',
  },
};

export type Dictionary = typeof en;
