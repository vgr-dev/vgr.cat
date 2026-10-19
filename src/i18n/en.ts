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
    bookCall: 'Book a call',
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
    ctaPrimary: 'Book a 30-min technical call',
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
      emailLabel: 'Professional Email',
      emailHint: 'We reply to this address.',
      organizationLabel: 'Organization / Institution',
      organizationPlaceholder: 'Company, Agency, or NGO',
      serviceTypeLabel: 'Primary Focus',
      serviceTypePlaceholder: 'Select a focus area',
      serviceTypes: {
        regtech: 'RegTech / EPREL Integration / ESPR Readiness',
        entityResolution: 'Market Observability / Entity Resolution',
        infrastructure: 'Multi-Tenant Architecture / Tooling',
        iot: 'IoT Monitoring / Field Instrumentation',
        advisory: 'Technical Advisory / Speaking / Other',
      },
      messageLabel: 'Project Overview & Objectives',
      messageHint: 'Up to 2,000 characters.',
      submitButton: 'Send Inquiry',
      submitting: 'Submitting...',
      stillSending: 'Still sending…',
      noJsNotice:
        'This form needs JavaScript to protect against spam. Please reach me directly instead:',
      recoveryLabel: 'Or reach me directly:',
      privacyNotice:
        'I use these details only to reply to your enquiry. No newsletter, no sharing.',
      privacyLink: 'Privacy policy',
      errorRateLimited:
        'Too many attempts. Please try again in about a minute.',
      errorChallenge:
        'The verification check did not pass. Reload the page and try again.',
      errorRejected:
        'One of the details was rejected. Check the email address and the other fields, then try again.',
      errorDelivery: 'The message could not be delivered.',
      errorUnavailable: 'The form is temporarily unavailable.',
      errorNetwork:
        'Your connection dropped before the message was sent. Please try again.',
      errors: {
        summaryOne: 'Please fix 1 field.',
        summaryOther: 'Please fix {count} fields.',
        nameRequired: 'Enter your name.',
        emailRequired: 'Enter your email address.',
        emailFormat: 'Enter a valid address, e.g. name@organization.com.',
        emailTooLong: 'This address is longer than 254 characters.',
        organizationRequired: 'Enter your organization.',
        serviceTypeRequired: 'Select a focus area.',
        messageRequired: 'Describe your project or question.',
        messageTooLong: 'Use 2,000 characters or fewer.',
        lineBreak: 'This field cannot contain line breaks.',
      },
      turnstile: 'Protected by Cloudflare Turnstile.',
    },
    directContact: {
      orDivider: 'or schedule directly',
      calendarButton: 'Book a 30-min technical call',
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
  privacy: {
    title: 'Privacy and data | vgr.cat',
    heading: 'Privacy and your data',
    // Only describes what this site actually does; no legal claims, no invented retention periods.
    intro:
      'This site collects as little as it can. This page describes exactly what happens to anything you send me.',
    updated: 'Last updated 19 October 2026.',
    sections: [
      {
        heading: 'What the contact form sends',
        body: 'Your name, work email, organisation, the focus area you select, your message, and the language of the page you used. The form collects nothing else.',
      },
      {
        heading: 'Why I keep it',
        body: 'Only to reply to your enquiry and to keep a record of the work discussed. There is no newsletter, no marketing list, and no sharing with third parties for their own purposes.',
      },
      {
        heading: 'How it is handled',
        body: 'The form is processed by a Cloudflare Worker and delivered to my mailbox by Cloudflare Email Service. Cloudflare processes the request on my behalf in order to deliver it, and applies its own security checks at the edge.',
      },
      {
        heading: 'Bot protection',
        body: 'The form is protected by Cloudflare Turnstile, which checks that the submission comes from a real browser. That check runs before the message is delivered.',
      },
      {
        heading: 'Visitor statistics',
        body: 'The site uses Cloudflare Web Analytics, which reports aggregate traffic totals.',
      },
      {
        heading: 'How long it is kept',
        body: 'Enquiries stay in my mailbox for as long as it takes to handle the request and to keep a reasonable business record of it.',
      },
      {
        heading: 'Your choices',
        body: 'You can ask what I hold about you, ask for a correction, or ask for it to be deleted. Write to contact@vgr.cat and I will act on it.',
      },
    ],
  },
  footer: {
    tagline:
      'Full-stack engineering for energy efficiency: from field sensors to European registries.',
    builtWith:
      'Engineered with Astro & Tailwind. Hosted on Cloudflare Workers.',
    sectionsLabel: 'Sections',
    contactLabel: 'Contact',
    languageLabel: 'Language',
    legalLabel: 'Privacy',
  },
};

export type Dictionary = typeof en;
