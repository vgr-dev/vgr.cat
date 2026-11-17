import type { Dictionary } from './en';

export const ca: Dictionary = {
  site: {
    title:
      'Victor Gonzalez | Enginyer full-stack sènior i tech lead a temps parcial',
    description:
      'Enginyer full-stack sènior i tech lead a temps parcial a prop de Barcelona. Construeixo, modernitzo i opero programari, amb focus en energia i dades de producte de la UE.',
    author: 'Victor Gonzalez',
    location: 'Sant Cugat del Vallès, a prop de Barcelona',
    jobTitle: 'Enginyer full-stack sènior i tech lead a temps parcial',
  },
  nav: {
    services: 'Serveis',
    caseStudies: 'Projectes seleccionats',
    about: 'Qui soc',
    contact: 'Contacte',
    bookCall: 'Reservar una trucada',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'Mostra o amaga el menú de navegació',
    primaryNavLabel: 'Navegació principal',
    languageNavLabel: 'Seleccioneu l’idioma',
    skipToContent: 'Salta al contingut principal',
    themeLabel: 'Mode fosc',
  },
  breadcrumbs: {
    label: 'Ruta de navegació',
    home: 'Inici',
  },
  hero: {
    badge:
      'Sant Cugat del Vallès, a prop de Barcelona · en remot arreu de la UE · anglès i castellà; consultes en català benvingudes',
    title: 'Construir, modernitzar i operar',
    titleHighlight: 'el programari del qual depèn el vostre negoci.',
    subtitle:
      'Soc Victor Gonzalez, enginyer full-stack sènior i tech lead a temps parcial. Ajudo equips petits a llançar productes, a millorar aplicacions heretades i a mantenir la producció fiable. L’energia i les dades de producte de la UE són la meva especialitat.',
    ctaPrimary: 'Reservar una trucada de 30 minuts',
    ctaSecondary: 'Veure els projectes seleccionats',
    metrics: [
      {
        value: 'Construir',
        label:
          'Productes nous, eines internes i API, d’una especificació escrita a producció.',
      },
      {
        value: 'Modernitzar',
        label:
          'Aplicacions heretades en PHP, Python i JavaScript actualitzades de manera incremental.',
      },
      {
        value: 'Operar',
        label:
          'Allotjament, memòria cau, monitoratge, seguretat i CI/CD per a plataformes on la fiabilitat importa.',
      },
    ],
  },
  services: {
    eyebrow: 'Serveis',
    title: 'El que et puc treure de sobre',
    subtitle:
      'Una sola persona sènior per a tot el camí: l’especificació, el codi, la infraestructura i el traspàs.',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      build: { tag: 'Nous productes' },
      modernize: { tag: 'Rescat d’aplicacions heretades' },
      platform: { tag: 'Operació de plataformes' },
      energy: { tag: 'Energia i normativa' },
    },
    // Detail-page copy for `/services/<pillar>/`.
    readService: 'Descobreix aquest servei',
    relatedWork: 'Treballs relacionats',
    noRelatedWork:
      'Encara no hi ha cap cas pràctic públic llistat per a aquest servei.',
  },
  caseStudies: {
    eyebrow: 'Projectes seleccionats',
    title: 'Sistemes en producció',
    subtitle:
      'Plataformes i eines que he construït o operat, per a organitzacions a Suïssa, la UE i Xile.',
    labels: {
      problem: 'El problema',
      approach: 'Què he construït',
      outcome: 'El resultat',
    },
    // Card affordance and `/work/<translationKey>/` navigation.
    readCase: 'Llegeix el cas pràctic',
    backToWork: 'Tots els projectes seleccionats',
    nextCase: 'Cas pràctic següent',
  },
  process: {
    eyebrow: 'Com treballo',
    title: 'La IA ajuda amb els esborranys. Jo en continuo sent responsable.',
    subtitle:
      'El lliurament assistit per IA és opcional. Abans de començar, acordem quines eines poden veure quin codi i què revisaré.',
    steps: [
      {
        title: 'Especificació',
        body: 'Acordem per escrit què vol dir «fet». L’aproveu vosaltres.',
      },
      {
        title: 'Pla',
        body: 'Divideixo la feina en passos petits que podeu veure abans que existeixi cap línia de codi.',
      },
      {
        title: 'Construcció',
        body: 'Els agents d’IA ajuden a redactar codi i proves dins de les eines i els límits de codi aprovats.',
      },
      {
        title: 'Revisió',
        body: 'Reviso el que es publica i deixo constància de les decisions i les comprovacions.',
      },
      {
        title: 'Lliurament',
        body: 'Les especificacions, les decisions i les notes de verificació es queden al vostre repositori.',
      },
    ],
    dataBoundary:
      'El codi i les dades del client es queden fora de les eines d’IA tret que n’hàgim acordat per escrit les eines i les dades permeses.',
    proof:
      'Aquest lloc es desenvolupa amb el mateix procés, i el repositori és públic: l’especificació actual, les decisions d’arquitectura i els registres de planificació anteriors.',
    proofLinkLabel: 'Veure les especificacions i l’historial a GitHub',
  },
  about: {
    eyebrow: 'Qui soc',
    title: 'Enginyer, constructor i operador',
    paragraphs: [
      'Soc Victor Gonzalez, enginyer full-stack sènior i tech lead a temps parcial, amb seu a Sant Cugat del Vallès, a prop de Barcelona. Construeixo, modernitzo i opero programari en producció, amb un focus especial en energia i dades de producte de la UE. Treballo en remot arreu de la UE i presencialment a l’àrea de Barcelona. Actualment lidero l’enginyeria de plataforma de Topten.',
      'Abans d’això, vaig fundar i dirigir VGR SpA, la meva consultora de programari a Xile, incloent-hi feina amb Bush Energie a Suïssa. Dirigir un negoci em va ensenyar què els importa als clients: pressupostos, terminis i algú que respongui el telèfon.',
      'Soc generalista per elecció. PHP, Python i TypeScript són els meus llenguatges principals; també treballo amb Go i he fet servir C#, Rust i Java. Em moc igual de bé en una base de codi Laravel que en un quadre de comandament de Grafana o en un servidor Linux.',
      'Faig servir agents de codificació amb IA com a part d’un procés revisat i guiat per especificacions. El lliurament assistit per IA és opcional: acordem les eines i els límits del codi abans de començar. Els agents ajuden a redactar codi i proves; jo reviso el que es publica i conservo les decisions al repositori.',
      'Gran part de la meva feina ha estat en eficiència energètica i sostenibilitat, des del mesurament IoT en oficines bancàries fins a la normativa europea de producte. És el domini que conec millor i el motiu pel qual m’importa un programari que sigui eficient d’executar i també d’escriure.',
    ],
    experienceTitle: 'Experiència',
    experience: [
      {
        period: '2025 — actualitat',
        role: 'Enginyer líder de plataforma i consultor',
        org: 'Topten (Suïssa)',
        detail:
          'Arquitectura de plataforma, la transició de Yii2 a Laravel i l’operació d’una plataforma de producte de consum multilingüe.',
      },
      {
        period: '2017 — 2025',
        role: 'Fundador i cap d’equip',
        org: 'VGR SpA (Xile)',
        detail:
          'Lliurament de programari per a clients d’energia, sostenibilitat i dades de producte.',
      },
      {
        period: '2014 — 2017',
        role: 'Enginyer de programari',
        org: 'Fundación Chile',
        detail:
          'Plataformes IoT i d’eficiència energètica, incloent-hi feina per a Banco Estado.',
      },
    ],
    techStackTitle: 'Amb què treballo',
    competencies: [
      'TypeScript, PHP, Python, Go',
      'Laravel, Symfony, Django, Node',
      'Vue, React, Astro, Tailwind',
      'AWS, Cloudflare, Docker, Kubernetes, Linux',
      'GitHub Actions, GitLab CI, Grafana, Prometheus',
      'Lliurament guiat per especificacions i assistit per IA',
      'Gestió remota de projectes',
      'EPREL, Ecodesign, ESPR / DPP',
      'Monitoratge energètic IoT',
      'Anàlisi de factures',
    ],
    credentials:
      'Abast per escrit, decisions documentades i un traspàs que el vostre equip pot fer servir.',
  },
  contact: {
    eyebrow: 'Contacte',
    title: 'Expliqueu-me què necessiteu',
    subtitle:
      'Projectes, auditories i feina de direcció tècnica a temps parcial. En remot arreu de la UE o presencialment a l’àrea de Barcelona. Anglès i castellà; les consultes en català són benvingudes.',
    form: {
      nameLabel: 'El vostre nom',
      emailLabel: 'Correu electrònic de feina',
      emailHint: 'Hi responc a aquesta adreça.',
      organizationLabel: 'Empresa o organització',
      organizationPlaceholder: 'Empresa, organització o el vostre nom',
      serviceTypeLabel: 'Què necessiteu?',
      serviceTypePlaceholder: 'Trieu un tema',
      serviceTypes: {
        build: 'Producte nou o eina interna',
        modernize: 'Modernització d’aplicacions heretades',
        platform: 'Fiabilitat i operació de plataformes',
        energy: 'Energia o dades de producte de la UE',
        audit: 'Auditoria o segona opinió',
        other: 'Una altra cosa',
      },
      messageLabel: 'Què voleu aconseguir?',
      messageHint: 'Fins a 2.000 caràcters.',
      submitButton: 'Enviar el missatge',
      submitting: 'S’està enviant...',
      stillSending: 'L’enviament continua…',
      noJsNotice:
        'Aquest formulari necessita JavaScript per protegir-se de l’spam. Podeu contactar-me directament:',
      recoveryLabel: 'O contacteu-me directament:',
      privacyNotice:
        'Faig servir aquestes dades només per respondre a la vostra consulta. Sense butlletí i sense cedir-les.',
      privacyLink: 'Política de privacitat',
      errorRateLimited: 'Massa intents. Torneu-ho a provar d’aquí a un minut.',
      errorChallenge:
        'La verificació no ha passat. Recarregueu la pàgina i torneu-ho a provar.',
      errorRejected:
        'S’ha rebutjat una de les dades. Reviseu l’adreça de correu i la resta de camps i torneu-ho a provar.',
      errorDelivery: 'No s’ha pogut lliurar el missatge.',
      errorUnavailable: 'El formulari no està disponible temporalment.',
      errorNetwork:
        'La connexió s’ha interromput abans d’enviar el missatge. Torneu-ho a provar.',
      errors: {
        summaryOne: 'Corregiu 1 camp.',
        summaryOther: 'Corregiu {count} camps.',
        nameRequired: 'Escriviu el vostre nom.',
        emailRequired: 'Escriviu la vostra adreça de correu.',
        emailFormat: 'Escriviu una adreça vàlida, p. ex. nom@organitzacio.cat.',
        emailTooLong: 'Aquesta adreça supera els 254 caràcters.',
        organizationRequired: 'Escriviu la vostra organització.',
        serviceTypeRequired: 'Trieu un àmbit.',
        messageRequired: 'Descriviu el vostre projecte o la vostra consulta.',
        messageTooLong: 'Feu servir 2.000 caràcters o menys.',
        lineBreak: 'Aquest camp no pot contenir salts de línia.',
      },
      turnstile: 'Protegit per Cloudflare Turnstile.',
    },
    directContact: {
      orDivider: 'o reserveu directament',
      calendarButton: 'Reservar una trucada de 30 minuts',
      emailDirect: 'Correu electrònic',
      locationLabel: 'Amb seu a',
      locationValue: 'Sant Cugat del Vallès, a prop de Barcelona',
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
  privacy: {
    title: 'Privacitat i dades | vgr.cat',
    heading: 'Privacitat i les vostres dades',
    intro:
      'Aquest lloc recull el mínim possible. Aquesta pàgina explica exactament què passa amb el que m’envieu.',
    updated: 'Darrera actualització: 19 d’octubre de 2026.',
    sections: [
      {
        heading: 'Què envia el formulari de contacte',
        body: 'El vostre nom, el correu professional, l’organització, l’àmbit que trieu, el missatge i l’idioma de la pàgina que heu fet servir. El formulari no recull res més.',
      },
      {
        heading: 'Per a què el guardo',
        body: 'Només per respondre la vostra consulta i per deixar constància del treball comentat. No hi ha butlletí, ni llista de màrqueting, ni cessió a tercers per a finalitats pròpies.',
      },
      {
        heading: 'Com es tracta',
        body: 'El formulari es processa en un Worker de Cloudflare i es lliura a la meva bústia amb Cloudflare Email Service. Cloudflare tracta la petició en nom meu per poder-la lliurar i hi aplica els seus propis controls de seguretat.',
      },
      {
        heading: 'Protecció contra bots',
        body: 'El formulari està protegit per Cloudflare Turnstile, que comprova que l’enviament prové d’un navegador real. Aquesta comprovació es fa abans que el missatge es lliuri.',
      },
      {
        heading: 'Estadístiques de visites',
        body: 'El lloc fa servir Cloudflare Web Analytics, que informa de totals agregats de trànsit.',
      },
      {
        heading: 'Quant de temps es guarda',
        body: 'Les consultes es queden a la meva bústia el temps necessari per atendre la petició i per deixar-ne un registre professional raonable.',
      },
      {
        heading: 'Les vostres opcions',
        body: 'Podeu demanar què tinc sobre vós, demanar una correcció o demanar-ne la supressió. Escriviu a contact@vgr.cat i ho faré.',
      },
    ],
  },
  ctaBand: {
    title: 'Alguna cosa per construir, arreglar o mantenir en marxa?',
    body: 'Expliqueu-me què voleu aconseguir. Responc personalment, normalment en dos dies laborables.',
    primary: 'Reservar una trucada de 30 minuts',
    secondary: 'Veure els projectes seleccionats',
  },
  footer: {
    tagline:
      'Enginyer full-stack sènior i tech lead a temps parcial a prop de Barcelona. Energia i dades de producte de la UE, amb lliurament assistit per IA i revisió integrats en el procés.',
    builtWith:
      'Fet amb Astro i Tailwind, allotjat a Cloudflare Workers, amb un procés revisat i guiat per especificacions.',
    sourceLabel: 'Veure el codi font a GitHub',
    sectionsLabel: 'Seccions',
    contactLabel: 'Contacte',
    languageLabel: 'Idioma',
    legalLabel: 'Privacitat',
  },
};
