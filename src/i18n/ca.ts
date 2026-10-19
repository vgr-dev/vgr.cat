import type { Dictionary } from './en';

export const ca: Dictionary = {
  site: {
    title: 'VGR | Enginyer Principal de Programari i Consultor',
    description:
      'Enginyeria full-stack per a plataformes d’eficiència energètica: dades normatives europees, supervisió de mercat i monitoratge IoT. Més de 12 anys.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Catalunya',
    jobTitle: 'Enginyer Principal de Programari i Consultor',
  },
  nav: {
    services: 'Serveis',
    caseStudies: 'Casos pràctics',
    about: 'Qui soc',
    contact: 'Contacte',
    bookCall: 'Concertar una reunió',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'Mostra o amaga el menú de navegació',
    primaryNavLabel: 'Navegació principal',
    languageNavLabel: 'Seleccioneu l’idioma',
    skipToContent: 'Salta al contingut principal',
  },
  hero: {
    badge:
      'Disponible per a enginyeria de programari i assessorament a Europa i Catalunya',
    title: 'Enginyeria de les plataformes que fan possible la',
    titleHighlight: 'transició energètica europea',
    subtitle:
      'Més de 12 anys de lliurament d’extrem a extrem en eficiència energètica: motors de compliment normatiu europeu (EPREL, Ecodesign, ESPR), eines de supervisió de mercat, flotes IoT a escala nacional i les plataformes multi-tenant que les operen.',
    ctaPrimary: 'Concertar una consulta tècnica',
    ctaSecondary: 'Explorar els casos pràctics',
    metrics: [
      {
        value: '12+',
        label: 'Anys construint programari per a l’eficiència energètica',
      },
      {
        value: '1,5 M+',
        label:
          'Visitants mensuals als 17 llocs multi-tenant en producció que opero',
      },
      {
        value: '200+',
        label: 'Oficines bancàries instrumentades amb monitoratge IoT',
      },
    ],
  },
  services: {
    eyebrow: 'Capacitats especialitzades',
    title:
      'Enginyeria full-stack de dades energètiques: dels sensors de camp als registres europeus',
    subtitle:
      'Motors normatius, observabilitat de mercat, monitoratge IoT i les plataformes que els fan funcionar. Una sola persona per a tot l’stack: ingesta, model, validació, desplegament i operació.',
    ctaLearnMore: 'Veure el cas pràctic relacionat',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech i compliment normatiu' },
      'entity-resolution': { tag: 'Intel·ligència de dades' },
      infrastructure: { tag: 'Núvol i sistemes' },
      iot: { tag: 'IoT i dades de camp' },
    },
  },
  caseStudies: {
    eyebrow: 'Projectes executats',
    title: 'Plataformes i desplegaments seleccionats',
    subtitle:
      'Sistemes en producció: verificació normativa per a autoritats europees, una plataforma de producte paneuropea, observabilitat de mercat i una flota IoT a escala nacional.',
    labels: {
      problem: 'El repte',
      approach: 'L’arquitectura',
      outcome: 'Impacte mesurable',
    },
  },
  about: {
    eyebrow: 'Trajectòria i experiència',
    title:
      'Enginyeria full-stack per a l’eficiència energètica, dels sensors de camp als registres europeus',
    paragraphs: [
      'Soc enginyer principal de programari i consultor, amb seu a Sant Cugat del Vallès (Barcelona). Fa més de 12 anys que construeixo i opero programari per a l’eficiència energètica i la sostenibilitat: primer com a enginyer en una fundació nacional d’innovació, després com a fundador de la meva pròpia consultora i ara com a enginyer principal d’una flota de 17 llocs multi-tenant en producció que sostenen un 99,99 % de disponibilitat anual a Suïssa, Xile i la UE.',
      'La meva feina se situa als dos extrems de l’stack. Al camp, he instrumentat centenars d’oficines bancàries amb flotes de monitoratge energètic IoT, connectant maquinari, gateways i protocols amb quadres de comandament que els equips de manteniment fan servir cada dia. En dades normatives, converteixo les obligacions d’Ecodesign, etiquetatge energètic i ESPR en programari verificable: integracions amb EPREL, fórmules de tolerància en codi i eines de supervisió de mercat que produeixen evidència auditable.',
      'Soc enginyer full-stack per temperament: PHP, Python, TypeScript i Go al servidor; Vue, React i Next.js al frontal; Docker, Kubernetes, CI/CD, Grafana i Prometheus a sota. Prefereixo ser responsable de tot el camí que no pas passar la feina en una interfície.',
      'També he portat la part de negoci. Vaig fundar i fer créixer una consultora fins als 20.000 USD al mes amb un equip de tres o quatre enginyers i cinc clients de llarg termini, vaig mantenir una aliança estratègica amb una empresa suïssa d’eficiència energètica i vaig acompanyar la plataforma Topten fins a la seva adquisició per una empresa suïssa més gran del mateix sector. Per això em sento còmode amb les parts interessades, els pressupostos i els terminis, no només amb el codi.',
    ],
    experienceTitle: 'On he treballat',
    experience: [
      {
        period: '2025 — actualitat',
        role: 'Enginyer Principal de Programari i Consultor',
        org: 'Operador suís de plataformes d’eficiència energètica · consultora xilena d’eficiència energètica',
        detail:
          '17 llocs multi-tenant en producció, 1,5 M+ visitants mensuals, 99,99 % de disponibilitat.',
      },
      {
        period: '2017 — 2025',
        role: 'Fundador i cap d’equip',
        org: 'VGR SpA (CL)',
        detail:
          'Consultora escalada a un equip de 3–4 persones i 5+ clients de llarg termini.',
      },
      {
        period: '2014 — 2017',
        role: 'Enginyer de programari',
        org: 'Fundació nacional d’innovació',
        detail:
          'Plataformes IoT i d’eficiència energètica per a clients públics i privats.',
      },
    ],
    techStackTitle: 'Competències i stack tècnic principal',
    competencies: [
      'Codificació normativa (EPREL, Ecodesign, ESPR)',
      'Resolució d’entitats i desambiguació de GTIN/EAN',
      'Arquitectura de plataformes multi-tenant',
      'Flotes IoT: gateways, MQTT, Express, ingesta de sèries temporals',
      'Disseny d’APIs i canonades d’ingesta automatitzada',
      'Docker, Kubernetes, CI/CD, Grafana, Prometheus',
      'PHP · Python · TypeScript · Go',
      'Vue · React · Next.js · Tailwind',
    ],
    credentials:
      'Diploma en direcció de projectes TI (PMBOK v6) i membre de PMI; coautor d’un manual universitari sobre lliurament àgil i predictiu (2021).',
  },
  contact: {
    eyebrow: 'Treballem plegats',
    title:
      'Parlem del vostre full de ruta tècnic o de la vostra infraestructura de compliment normatiu',
    subtitle:
      'Disponible per a enginyeria de programari, revisió arquitectònica, auditories tècniques, ponències i contractes especialitzats a Catalunya, Espanya i la Unió Europea.',
    form: {
      nameLabel: 'Nom',
      namePlaceholder: 'p. ex. Maria Puig',
      emailLabel: 'Correu electrònic professional',
      emailPlaceholder: 'nom@organitzacio.cat',
      organizationLabel: 'Organització o institució',
      organizationPlaceholder: 'Empresa, agència o entitat',
      serviceTypeLabel: 'Àmbit principal',
      serviceTypes: {
        regtech: 'RegTech / integració EPREL / preparació per a ESPR',
        entityResolution: 'Observabilitat de mercat / resolució d’entitats',
        infrastructure: 'Arquitectura multi-tenant / eines internes',
        iot: 'Monitoratge IoT / instrumentació de camp',
        advisory: 'Assessorament tècnic / ponències / altres',
      },
      messageLabel: 'Resum del projecte i objectius',
      messagePlaceholder:
        'Descriviu els requisits, les restriccions del sistema o els terminis...',
      submitButton: 'Enviar la consulta',
      submitting: 'S’està enviant...',
      successMessage:
        'Gràcies. He rebut el vostre missatge i us respondré en un termini d’un a dos dies laborables.',
      errorMessage:
        'No s’ha pogut enviar el missatge. Podeu escriure directament a contact@vgr.cat.',
      turnstile: 'Protegit per Cloudflare Turnstile.',
    },
    directContact: {
      orDivider: 'o bé, concertar directament',
      calendarButton: 'Concertar una trucada tècnica de 30 minuts',
      emailDirect: 'Correu directe',
      locationLabel: 'Seu',
      locationValue: 'Sant Cugat del Vallès, Barcelona, Catalunya',
      timezone: 'Hora d’Europa Central (CET/CEST)',
    },
  },
  thanks: {
    title: 'Missatge enviat | vgr.cat',
    heading: 'Gràcies — he rebut el missatge',
    body: 'La vostra consulta s’ha enviat. Rebreu una confirmació al correu electrònic i us respondré personalment, normalment en un o dos dies laborables.',
    back: 'Torna a la pàgina d’inici',
  },
  notFound: {
    title: '404 — Pàgina no trobada | vgr.cat',
    heading: 'No s’ha pogut trobar aquesta pàgina',
    body: 'La pàgina sol·licitada no existeix o s’ha traslladat. Comproveu l’adreça o torneu a la pàgina d’inici per trobar la secció que necessiteu.',
    back: 'Tornar a la pàgina d’inici',
  },
  footer: {
    tagline:
      'Enginyeria full-stack per a l’eficiència energètica: dels sensors de camp als registres europeus.',
    builtWith:
      'Desenvolupat amb Astro i Tailwind. Allotjat a Cloudflare Workers.',
  },
};
