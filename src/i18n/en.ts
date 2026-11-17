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
    title:
      'Victor Gonzalez | Senior Full-Stack Engineer & Fractional Tech Lead',
    description:
      'Senior full-stack engineer and fractional tech lead near Barcelona. I build, modernise and run software, with a focus on energy and EU product data.',
    author: 'Victor Gonzalez',
    location: 'Sant Cugat del Vallès, near Barcelona',
    jobTitle: 'Senior Full-Stack Engineer & Fractional Tech Lead',
  },
  nav: {
    services: 'Services',
    caseStudies: 'Selected work',
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
    themeLabel: 'Dark mode',
  },
  breadcrumbs: {
    label: 'Breadcrumb',
    home: 'Home',
  },
  hero: {
    badge:
      'Sant Cugat del Vallès, near Barcelona · remote across the EU · English and Spanish; Catalan enquiries welcome',
    title: 'Build, modernise and run',
    titleHighlight: 'the software your business depends on.',
    subtitle:
      "I'm Victor Gonzalez, a senior full-stack engineer and fractional tech lead. I help small teams ship products, improve legacy applications and keep production reliable. Energy and EU product data are my specialism.",
    ctaPrimary: 'Book a 30-min call',
    ctaSecondary: 'See selected work',
    metrics: [
      {
        value: 'Build',
        label:
          'New products, internal tools and APIs, from a written spec to production.',
      },
      {
        value: 'Modernise',
        label:
          'Legacy PHP, Python and JavaScript applications moved forward incrementally.',
      },
      {
        value: 'Run',
        label:
          'Hosting, caching, monitoring, security and CI/CD for platforms where reliability matters.',
      },
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'What I can take off your plate',
    subtitle:
      'One senior engineer across the whole path: the spec, the code, the infrastructure and the handover.',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      build: { tag: 'New products' },
      modernize: { tag: 'Legacy rescue' },
      platform: { tag: 'Platform operations' },
      energy: { tag: 'Energy & regulation' },
    },
    // Detail-page copy for `/services/<pillar>/`.
    readService: 'Explore this service',
    relatedWork: 'Related work',
    noRelatedWork: 'No public case study is listed for this service yet.',
  },
  caseStudies: {
    eyebrow: 'Selected work',
    title: 'Systems in production',
    subtitle:
      'Platforms and tools I have built or run, for organisations in Switzerland, the EU and Chile.',
    labels: {
      problem: 'Problem',
      approach: 'What I built',
      outcome: 'Result',
    },
    // Card affordance and `/work/<translationKey>/` navigation.
    readCase: 'Read the case study',
    backToWork: 'All selected work',
    nextCase: 'Next case study',
  },
  process: {
    eyebrow: 'How I work',
    title: 'AI helps with the drafting. I stay accountable.',
    subtitle:
      'AI-assisted delivery is opt-in. Before work starts, we agree which tools may see which code and what I will review.',
    steps: [
      {
        title: 'Spec',
        body: 'We agree in writing what "done" means. You approve it.',
      },
      {
        title: 'Plan',
        body: 'I break the work into small steps you can see before any code exists.',
      },
      {
        title: 'Build',
        body: 'AI agents help draft code and tests inside the approved tools and code boundaries.',
      },
      {
        title: 'Review',
        body: 'I review what ships and record the decisions and checks.',
      },
      {
        title: 'Hand over',
        body: 'Specs, decisions and verification notes stay in your repository.',
      },
    ],
    dataBoundary:
      'Client code and data stay outside AI tools unless we have agreed the tools and permitted data in writing.',
    proof:
      'This site is developed with the same process, and the repository is public: the current spec, architecture decisions and earlier planning records.',
    proofLinkLabel: 'See the specs and history on GitHub',
  },
  about: {
    eyebrow: 'About',
    title: 'Engineer, builder, and operator',
    paragraphs: [
      "I'm Victor Gonzalez, a senior full-stack engineer and fractional tech lead based in Sant Cugat del Vallès, near Barcelona. I build, modernise and run production software, with a particular focus on energy and EU product data. I work remotely across the EU and on site in the Barcelona area. Today I lead platform engineering for Topten.",
      'Before that, I founded and ran VGR SpA, my software consultancy in Chile, including work with Bush Energie in Switzerland. Running a business taught me what clients care about: budgets, deadlines and someone who answers the phone.',
      "I'm a generalist by choice. PHP, Python and TypeScript are my main languages; I also work in Go and have used C#, Rust and Java. I'm as comfortable in a Laravel codebase as in a Grafana dashboard or a Linux host.",
      'I use AI coding agents as part of a reviewed, spec-driven process. AI-assisted delivery is opt-in: we agree the tools and the code boundaries before work starts. The agents help draft code and tests; I review what ships and keep the decisions in the repository.',
      'Most of my work has been in energy efficiency and sustainability, from IoT metering in bank branches to EU product regulation. It is the domain I know best, and the reason I care about software that is efficient to run as well as to write.',
    ],
    experienceTitle: 'Experience',
    experience: [
      {
        period: '2025 — present',
        role: 'Lead Platform Engineer & Consultant',
        org: 'Topten (Switzerland)',
        detail:
          'Platform architecture, the Yii2-to-Laravel transition, and operations for a multilingual consumer product platform.',
      },
      {
        period: '2017 — 2025',
        role: 'Founder & Team Lead',
        org: 'VGR SpA (Chile)',
        detail:
          'Software delivery for energy, sustainability and product-data clients.',
      },
      {
        period: '2014 — 2017',
        role: 'Software Engineer',
        org: 'Fundación Chile',
        detail:
          'IoT and energy-efficiency platforms, including work for Banco Estado.',
      },
    ],
    techStackTitle: 'What I work with',
    competencies: [
      'TypeScript, PHP, Python, Go',
      'Laravel, Symfony, Django, Node',
      'Vue, React, Astro, Tailwind',
      'AWS, Cloudflare, Docker, Kubernetes, Linux',
      'GitHub Actions, GitLab CI, Grafana, Prometheus',
      'Spec-driven, AI-assisted delivery',
      'Remote project management',
      'EPREL, Ecodesign, ESPR / DPP',
      'IoT energy monitoring',
      'Bill analytics',
    ],
    credentials:
      'Written scopes, documented decisions and a handover your team can use.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell me what you need',
    subtitle:
      'Projects, audits and fractional tech-lead work. Remote across the EU, or on site in the Barcelona area. English and Spanish; Catalan enquiries welcome.',
    form: {
      nameLabel: 'Your name',
      emailLabel: 'Work email',
      emailHint: 'I reply to this address.',
      organizationLabel: 'Company or organisation',
      organizationPlaceholder: 'Company, organisation, or your own name',
      serviceTypeLabel: 'What do you need?',
      serviceTypePlaceholder: 'Select a topic',
      serviceTypes: {
        build: 'New product or internal tool',
        modernize: 'Legacy modernisation',
        platform: 'Platform reliability and operations',
        energy: 'Energy or EU product data',
        audit: 'Audit or second opinion',
        other: 'Something else',
      },
      messageLabel: 'What are you trying to do?',
      messageHint: 'Up to 2,000 characters.',
      submitButton: 'Send message',
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
      orDivider: 'or book directly',
      calendarButton: 'Book a 30-min call',
      emailDirect: 'Email',
      locationLabel: 'Based in',
      locationValue: 'Sant Cugat del Vallès, near Barcelona',
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
  ctaBand: {
    title: 'Something to build, fix or keep running?',
    body: 'Tell me what you are trying to do. I reply personally, usually within two business days.',
    primary: 'Book a 30-min call',
    secondary: 'See selected work',
  },
  footer: {
    tagline:
      'Senior full-stack engineer and fractional tech lead near Barcelona. Energy and EU product data, with AI-assisted delivery and review built into the process.',
    builtWith:
      'Built with Astro and Tailwind, hosted on Cloudflare Workers, using a reviewed, spec-driven process.',
    sourceLabel: 'View the source on GitHub',
    sectionsLabel: 'Sections',
    contactLabel: 'Contact',
    languageLabel: 'Language',
    legalLabel: 'Privacy',
  },
};

export type Dictionary = typeof en;
