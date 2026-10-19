import type { Dictionary } from './en';

export const ca: Dictionary = {
  site: {
    title: 'VGR | Enginyer Principal de Programari i Consultor RegTech',
    description:
      'Arquitectura de programari, automatització de la supervisió de mercat, integracions amb EPREL i canonades de dades d’alta escala per a la transició energètica europea.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Catalunya',
    jobTitle: 'Enginyer Principal de Programari',
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
  },
  hero: {
    badge: 'Disponible per a assessorament tècnic a Europa i a Catalunya',
    title: 'Arquitectura de programari i observabilitat de dades per a la',
    titleHighlight: 'transició energètica',
    subtitle:
      'Enginyer principal de programari especialitzat en sistemes europeus de compliment normatiu (RegTech/GovTech), canonades automatitzades de dades EPREL, observabilitat de la supervisió de mercat i plataformes multilloguer d’alta resiliència.',
    ctaPrimary: 'Concertar una consulta tècnica',
    ctaSecondary: 'Explorar els casos pràctics',
    metrics: [
      {
        value: '10+',
        label: 'Anys construint plataformes paneuropees de dades energètiques',
      },
      {
        value: 'EPREL i ESPR',
        label: 'Implementació directa de marcs normatius',
      },
      {
        value: '100k+',
        label: 'Identitats de producte resoltes i auditades',
      },
    ],
  },
  services: {
    eyebrow: 'Capacitats especialitzades',
    title:
      'Solucions d’enginyeria per a entorns normatius i de dades complexos',
    subtitle:
      'Connectem directrius tècniques, algorismes de verificació automatitzada i infraestructura escalable per eliminar colls d’ampolla manuals.',
    ctaLearnMore: 'Veure el cas pràctic relacionat',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech i compliment normatiu' },
      'entity-resolution': { tag: 'Intel·ligència de dades' },
      infrastructure: { tag: 'Núvol i sistemes' },
    },
  },
  caseStudies: {
    eyebrow: 'Projectes executats',
    title: 'Desplegaments tècnics destacats',
    subtitle:
      'Sistemes reals que aporten verificació automatitzada, alta disponibilitat i eficiència operativa a institucions europees i plataformes públiques.',
    labels: {
      problem: 'El repte',
      approach: 'L’arquitectura',
      outcome: 'Impacte mesurable',
    },
  },
  about: {
    eyebrow: 'Trajectòria i experiència',
    title:
      'Lideratge arquitectònic pràctic a la cruïlla entre la política energètica i el programari',
    paragraphs: [
      'Soc enginyer principal de programari, amb seu a Sant Cugat del Vallès (Barcelona), i m’ocupo d’infraestructura, enginyeria de dades i eines de programari a mida per a grans iniciatives europees d’eficiència energètica, com Topten.eu i Topten.ch.',
      'La meva tasca tècnica se centra a reduir la distància entre la normativa europea complexa (Ecodesign, etiquetatge energètic, ESPR) i la supervisió real del mercat. Construeixo canonades d’alt rendiment que contrasten els registres de certificació estàtics amb els canals minoristes fragmentats mitjançant la resolució d’entitats per algorisme i el mapatge de GTIN.',
      'Tant si aconsello administracions públiques sobre infraestructura de supervisió, com si preparo fabricants per als passaports digitals de producte o construeixo eines internes que donen autonomia als analistes, prioritzo sistemes robustos i sense excés de complexitat, amb un retorn operatiu elevat.',
    ],
    techStackTitle: 'Competències i stack tècnic principal',
    competencies: [
      'Codificació de fórmules normatives (EPREL, Ecodesign)',
      'Resolució d’entitats i desambiguació de cadenes (GTIN/EAN)',
      'Arquitectura de plataformes multilloguer',
      'Disseny d’APIs i canonades d’ingestió automatitzada',
      'Infraestructura sense servidor i a la vora (Cloudflare Workers)',
      'Eines internes a mida i experiència d’usuari per a analistes',
    ],
  },
  contact: {
    eyebrow: 'Treballem plegats',
    title:
      'Parlem del vostre full de ruta tècnic o de la vostra infraestructura de compliment normatiu',
    subtitle:
      'Disponible per a assessorament arquitectònic, auditories tècniques, ponències i contractes d’enginyeria especialitzada a Catalunya, Espanya i la Unió Europea.',
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
        infrastructure: 'Arquitectura multilloguer / eines internes',
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
      'Arquitectura de sistemes basats en dades per a la transició energètica europea.',
    builtWith:
      'Desenvolupat amb Astro i Tailwind. Allotjat a Cloudflare Workers.',
  },
};
