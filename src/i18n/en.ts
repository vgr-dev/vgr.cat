/**
 * English UI dictionary. This module is the contract: `Dictionary` is derived from it, and `ca`/`es`
 * must match its shape exactly.
 *
 * The shape and English values come from the adopted content model in
 * `.ai/plans/archive/2026-10-16-en-content-model-input.md`; the keys the model omitted but consumers
 * still read (`header`, `thanks`, `notFound`, `contact.form.turnstile`) are retained here.
 *
 * Do not freeze this object's literals: it would make every value a literal type, and no `ca`/`es`
 * translation could ever satisfy `Dictionary`.
 */
export const en = {
  site: {
    title: 'VGR | Principal Software Engineer & Consultant',
    description:
      'Full-stack engineering for energy-efficiency platforms: EU regulatory data systems, market surveillance tooling and nationwide IoT monitoring. 12+ years.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Catalonia',
    jobTitle: 'Principal Software Engineer & Consultant',
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
    primaryNavLabel: 'Primary navigation',
    languageNavLabel: 'Select language',
    skipToContent: 'Skip to main content',
  },
  hero: {
    badge: 'Available for European & Catalan software engineering and advisory',
    title: 'Engineering the platforms behind',
    titleHighlight: 'European energy efficiency',
    subtitle:
      '12+ years of end-to-end delivery in energy efficiency: EU compliance engines (EPREL, Ecodesign, ESPR), market-surveillance tooling, nationwide IoT fleets, and the multi-tenant platforms that operate them.',
    ctaPrimary: 'Book Technical Consultation',
    ctaSecondary: 'Explore Case Studies',
    metrics: [
      {
        value: '12+',
        label: 'Years building software for energy efficiency',
      },
      {
        value: '1.5M+',
        label:
          'Monthly visitors across the 17 multi-tenant production sites I operate',
      },
      {
        value: '200+',
        label: 'Bank branches instrumented with IoT energy monitoring',
      },
    ],
  },
  services: {
    eyebrow: 'Specialized Capabilities',
    title:
      'Full-stack engineering for energy data: from field sensors to European registries',
    subtitle:
      'Regulatory engines, market observability, IoT monitoring and the platforms that run them. One engineer across the whole stack: ingest, model, validate, ship, operate.',
    ctaLearnMore: 'View related case study',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech & Compliance' },
      'entity-resolution': { tag: 'Data Intelligence' },
      infrastructure: { tag: 'Cloud & Systems' },
      iot: { tag: 'IoT & Field Data' },
    },
  },
  caseStudies: {
    eyebrow: 'Proven Deliverables',
    title: 'Selected platforms and deployments',
    subtitle:
      'Systems in production: regulatory verification for European authorities, a pan-European product platform, market observability, and a nationwide IoT fleet.',
    labels: {
      problem: 'The Challenge',
      approach: 'The Architecture',
      outcome: 'Measurable Impact',
    },
  },
  about: {
    eyebrow: 'Background & Track Record',
    title:
      'Full-stack engineering for energy efficiency, from field sensors to European registries',
    paragraphs: [
      'I am a principal software engineer and consultant based in Sant Cugat del Vallès (Barcelona). For 12+ years I have built and operated software for energy efficiency and sustainability: first as an engineer at a national innovation foundation, then as founder of my own consultancy, and now as lead engineer for a fleet of 17 multi-tenant production sites sustaining 99.99% annual uptime across Switzerland, Chile and the EU.',
      'My work sits at both ends of the stack. In the field, I have instrumented hundreds of bank branches with IoT energy-monitoring fleets, wiring hardware, gateways and protocols into dashboards that facilities teams use daily. In regulatory data, I turn Ecodesign, Energy Labelling and ESPR obligations into verifiable software: EPREL integrations, tolerance formulas in code, and market-surveillance tooling that produces audit-ready evidence.',
      'I am a full-stack engineer by temperament: PHP, Python, TypeScript and Go on the server; Vue, React and Next.js on the front; Docker, Kubernetes, CI/CD, Grafana and Prometheus underneath. I would rather own the whole path than hand off at an interface.',
      'I have also run the business side. I founded and grew a consulting firm to $20k+ a month with a team of three to four engineers and five long-term clients, held a strategic partnership with a Swiss energy-efficiency firm, and carried the Topten platform through its acquisition by a larger Swiss energy company. That is why I am comfortable with stakeholders, budgets and timelines, not only code.',
    ],
    experienceTitle: 'Where I have worked',
    experience: [
      {
        period: '2025 — present',
        role: 'Principal Software Engineer & Consultant',
        org: 'Swiss energy-efficiency platform operator · Chilean energy consultancy',
        detail:
          '17 multi-tenant production sites, 1.5M+ monthly visitors, 99.99% uptime.',
      },
      {
        period: '2017 — 2025',
        role: 'Founder & Team Lead',
        org: 'VGR SpA (CL)',
        detail: 'Consultancy scaled to a team of 3–4 and 5+ long-term clients.',
      },
      {
        period: '2014 — 2017',
        role: 'Software Engineer',
        org: 'National innovation foundation',
        detail:
          'IoT and energy-efficiency platforms for public and private clients.',
      },
    ],
    techStackTitle: 'Core Technical Stack & Competencies',
    competencies: [
      'Regulatory codification (EPREL, Ecodesign, ESPR)',
      'Entity resolution & GTIN/EAN disambiguation',
      'Multi-tenant platform architecture',
      'IoT fleets: gateways, MQTT, Express, time-series ingest',
      'API design & automated ingest pipelines',
      'Docker, Kubernetes, CI/CD, Grafana, Prometheus',
      'PHP · Python · TypeScript · Go',
      'Vue · React · Next.js · Tailwind',
    ],
    credentials:
      'IT project management diploma (PMBOK v6) and PMI member; co-author of a university textbook on agile and predictive delivery (2021).',
  },
  contact: {
    eyebrow: 'Work Together',
    title: 'Let us discuss your technical roadmap or compliance infrastructure',
    subtitle:
      'Available for software engineering, architectural review, technical auditing, speaking, and specialised contracts across Catalonia, Spain and the European Union.',
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
        iot: 'IoT Monitoring / Field Instrumentation',
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
      turnstile: 'Protected by Cloudflare Turnstile.',
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
    body: 'Your inquiry has been sent. A confirmation is on its way to your inbox, and I reply personally, usually within one or two business days.',
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
      'Full-stack engineering for energy efficiency: from field sensors to European registries.',
    builtWith:
      'Engineered with Astro & Tailwind. Hosted on Cloudflare Workers.',
  },
};

export type Dictionary = typeof en;
