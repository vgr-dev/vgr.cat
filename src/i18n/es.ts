import type { Dictionary } from './en';

export const es: Dictionary = {
  site: {
    title:
      'Victor Gonzalez | Ingeniero full-stack sénior y tech lead a tiempo parcial',
    description:
      'Ingeniero full-stack sénior y tech lead a tiempo parcial cerca de Barcelona. Construyo, modernizo y opero software, con foco en energía y datos de producto de la UE.',
    author: 'Victor Gonzalez',
    location: 'Sant Cugat del Vallès, cerca de Barcelona',
    jobTitle: 'Ingeniero full-stack sénior y tech lead a tiempo parcial',
  },
  nav: {
    services: 'Servicios',
    caseStudies: 'Proyectos seleccionados',
    about: 'Sobre mí',
    contact: 'Contacto',
    bookCall: 'Reservar una llamada',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'Mostrar u ocultar el menú de navegación',
    primaryNavLabel: 'Navegación principal',
    languageNavLabel: 'Seleccione el idioma',
    skipToContent: 'Saltar al contenido principal',
    themeLabel: 'Modo oscuro',
  },
  breadcrumbs: {
    label: 'Ruta de navegación',
    home: 'Inicio',
  },
  hero: {
    badge:
      'Sant Cugat del Vallès, cerca de Barcelona · en remoto en toda la UE · inglés y español; consultas en catalán bienvenidas',
    title: 'Construir, modernizar y operar',
    titleHighlight: 'el software del que depende su negocio.',
    subtitle:
      'Soy Victor Gonzalez, ingeniero full-stack sénior y tech lead a tiempo parcial. Ayudo a equipos pequeños a lanzar productos, a mejorar aplicaciones heredadas y a mantener la producción fiable. La energía y los datos de producto de la UE son mi especialidad.',
    ctaPrimary: 'Reservar una llamada de 30 minutos',
    ctaSecondary: 'Ver los proyectos seleccionados',
    metrics: [
      {
        value: 'Construir',
        label:
          'Productos nuevos, herramientas internas y API, de una especificación escrita a producción.',
      },
      {
        value: 'Modernizar',
        label:
          'Aplicaciones heredadas en PHP, Python y JavaScript actualizadas de forma incremental.',
      },
      {
        value: 'Operar',
        label:
          'Alojamiento, caché, monitorización, seguridad y CI/CD para plataformas donde la fiabilidad importa.',
      },
    ],
  },
  services: {
    eyebrow: 'Servicios',
    title: 'Lo que puedo quitarte de encima',
    subtitle:
      'Un solo ingeniero sénior para todo el camino: la especificación, el código, la infraestructura y el traspaso.',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      build: { tag: 'Nuevos productos' },
      modernize: { tag: 'Rescate de aplicaciones heredadas' },
      platform: { tag: 'Operación de plataformas' },
      energy: { tag: 'Energía y normativa' },
    },
    // Detail-page copy for `/services/<pillar>/`.
    readService: 'Descubre este servicio',
    relatedWork: 'Trabajos relacionados',
    noRelatedWork:
      'Todavía no hay ningún caso práctico público listado para este servicio.',
    engageLink: 'Ver las formas de trabajar juntos',
  },
  caseStudies: {
    eyebrow: 'Proyectos seleccionados',
    title: 'Sistemas en producción',
    subtitle:
      'Plataformas y herramientas que he construido u operado, para organizaciones en Suiza, la UE y Chile.',
    labels: {
      problem: 'El problema',
      approach: 'Lo que construí',
      outcome: 'El resultado',
    },
    // Card affordance and `/work/<translationKey>/` navigation.
    readCase: 'Leer el caso práctico',
    backToWork: 'Todos los proyectos seleccionados',
    nextCase: 'Siguiente caso práctico',
  },
  process: {
    eyebrow: 'Cómo trabajo',
    title: 'La IA ayuda con los borradores. Yo sigo siendo responsable.',
    subtitle:
      'La entrega asistida por IA es opcional. Antes de empezar, acordamos qué herramientas pueden ver qué código y qué revisaré.',
    steps: [
      {
        title: 'Especificación',
        body: 'Acordamos por escrito qué significa «hecho». Usted la aprueba.',
      },
      {
        title: 'Plan',
        body: 'Divido el trabajo en pasos pequeños que puede ver antes de que exista una sola línea de código.',
      },
      {
        title: 'Construcción',
        body: 'Los agentes de IA ayudan a redactar código y pruebas dentro de las herramientas y los límites de código aprobados.',
      },
      {
        title: 'Revisión',
        body: 'Reviso lo que se publica y dejo constancia de las decisiones y las comprobaciones.',
      },
      {
        title: 'Entrega',
        body: 'Las especificaciones, las decisiones y las notas de verificación se quedan en su repositorio.',
      },
    ],
    dataBoundary:
      'El código y los datos del cliente quedan fuera de las herramientas de IA salvo que hayamos acordado por escrito las herramientas y los datos permitidos.',
    proof:
      'Este sitio se desarrolla con el mismo proceso y el repositorio es público: la especificación actual, las decisiones de arquitectura y los registros de planificación anteriores.',
    proofLinkLabel: 'Ver las especificaciones y el historial en GitHub',
  },
  engage: {
    eyebrow: 'Formas de trabajar juntos',
    title: 'Tres formas de empezar',
    subtitle: 'Cada una empieza con un alcance por escrito.',
    items: [
      {
        name: 'Auditoría o segunda opinión',
        description:
          'Revisión de una aplicación, un entorno o un plan técnico acordados, con un informe priorizado y una sesión de presentación.',
        price: '2.500 € precio fijo',
        detail:
          'Hasta 5 días laborables, normalmente repartidos en 1–2 semanas naturales. No es una prueba de intrusión ni una certificación de cumplimiento.',
      },
      {
        name: 'Proyecto',
        description:
          'Una construcción o una modernización que empieza con dos días de descubrimiento de pago y una especificación escrita.',
        price: '640 € por día',
        detail:
          'El descubrimiento cuesta 1.280 € y se abona una sola vez a un presupuesto cerrado de proyecto aceptado. Si lo deja, se queda con la especificación.',
      },
      {
        name: 'Tech lead a tiempo parcial',
        description:
          'Cuatro días de ocho horas al mes como tech lead o ingeniero de plataforma a tiempo parcial.',
        price: '2.400 € al mes',
        detail:
          'Mínimo de tres meses (7.200 €), después un mes de preaviso. Los horarios y las expectativas de respuesta se acuerdan por escrito.',
      },
    ],
    terms: [
      'Los precios no incluyen el IVA. Los viajes y los costes de terceros se acuerdan por escrito antes de incurrir en ellos.',
      'La tarifa diaria del proyecto es una base de estimación de ocho horas, no un cargo adicional sobre un presupuesto cerrado. El descubrimiento produce un presupuesto para el alcance acordado; la complejidad sin resolver se comunica antes de seguir con trabajo de pago. El total cerrado incluye el descubrimiento, descontando una sola vez los 1.280 € ya pagados.',
      'El trabajo adicional, los horarios y las expectativas de respuesta requieren un acuerdo por escrito. La iguala no incluye guardia 24/7.',
      'Idiomas de trabajo: inglés y español. Las consultas en catalán son bienvenidas; acordamos por escrito el idioma de entrega. En remoto en toda la UE; presencialmente en el área de Barcelona.',
    ],
  },
  about: {
    eyebrow: 'Sobre mí',
    title: 'Ingeniero, constructor y operador',
    paragraphs: [
      'Soy Victor Gonzalez, ingeniero full-stack sénior y tech lead a tiempo parcial, con sede en Sant Cugat del Vallès, cerca de Barcelona. Construyo, modernizo y opero software en producción, con un foco especial en energía y datos de producto de la UE. Trabajo en remoto en toda la UE y presencialmente en el área de Barcelona. Actualmente lidero la ingeniería de plataforma de Topten.',
      'Antes de eso, fundé y dirigí VGR SpA, mi consultora de software en Chile, incluido trabajo con Bush Energie en Suiza. Dirigir un negocio me enseñó lo que les importa a los clientes: presupuestos, plazos y alguien que conteste el teléfono.',
      'Soy generalista por elección. PHP, Python y TypeScript son mis lenguajes principales; también trabajo con Go y he usado C#, Rust y Java. Me desenvuelvo igual de bien en una base de código Laravel que en un panel de Grafana o en un servidor Linux.',
      'Uso agentes de programación con IA como parte de un proceso revisado y guiado por especificaciones. La entrega asistida por IA es opcional: acordamos las herramientas y los límites del código antes de empezar. Los agentes ayudan a redactar código y pruebas; yo reviso lo que se publica y conservo las decisiones en el repositorio.',
      'Gran parte de mi trabajo ha sido en eficiencia energética y sostenibilidad, desde la medición IoT en oficinas bancarias hasta la normativa europea de producto. Es el dominio que mejor conozco y la razón por la que me importa el software que es eficiente de ejecutar y también de escribir.',
    ],
    experienceTitle: 'Experiencia',
    experience: [
      {
        period: '2025 — actualidad',
        role: 'Ingeniero líder de plataforma y consultor',
        org: 'Topten (Suiza)',
        detail:
          'Arquitectura de plataforma, la transición de Yii2 a Laravel y la operación de una plataforma de producto de consumo multilingüe.',
      },
      {
        period: '2017 — 2025',
        role: 'Fundador y jefe de equipo',
        org: 'VGR SpA (Chile)',
        detail:
          'Entrega de software para clientes de energía, sostenibilidad y datos de producto.',
      },
      {
        period: '2014 — 2017',
        role: 'Ingeniero de software',
        org: 'Fundación Chile',
        detail:
          'Plataformas IoT y de eficiencia energética, incluido trabajo para Banco Estado.',
      },
    ],
    techStackTitle: 'Con qué trabajo',
    competencies: [
      'TypeScript, PHP, Python, Go',
      'Laravel, Symfony, Django, Node',
      'Vue, React, Astro, Tailwind',
      'AWS, Cloudflare, Docker, Kubernetes, Linux',
      'GitHub Actions, GitLab CI, Grafana, Prometheus',
      'Entrega guiada por especificaciones y asistida por IA',
      'Gestión remota de proyectos',
      'EPREL, Ecodesign, ESPR / DPP',
      'Monitorización energética IoT',
      'Análisis de facturas',
    ],
    credentials:
      'Alcance por escrito, decisiones documentadas y un traspaso que su equipo puede usar.',
  },
  contact: {
    eyebrow: 'Contacto',
    title: 'Cuénteme qué necesita',
    subtitle:
      'Proyectos, auditorías y trabajo como responsable técnico a tiempo parcial. En remoto en toda la UE o presencial en el área de Barcelona. Inglés y español; las consultas en catalán son bienvenidas.',
    form: {
      nameLabel: 'Su nombre',
      emailLabel: 'Correo electrónico de trabajo',
      emailHint: 'Respondo a esta dirección.',
      organizationLabel: 'Empresa u organización',
      organizationPlaceholder: 'Empresa, organización o su propio nombre',
      serviceTypeLabel: '¿Qué necesita?',
      serviceTypePlaceholder: 'Seleccione un tema',
      serviceTypes: {
        build: 'Producto nuevo o herramienta interna',
        modernize: 'Modernización de aplicaciones heredadas',
        platform: 'Fiabilidad y operación de plataformas',
        energy: 'Energía o datos de producto de la UE',
        audit: 'Auditoría o segunda opinión',
        other: 'Otra cosa',
      },
      messageLabel: '¿Qué quiere conseguir?',
      messageHint: 'Hasta 2.000 caracteres.',
      submitButton: 'Enviar mensaje',
      submitting: 'Enviando...',
      stillSending: 'El envío sigue en curso…',
      noJsNotice:
        'Este formulario necesita JavaScript para protegerse del spam. Puede contactarme directamente:',
      recoveryLabel: 'O contácteme directamente:',
      privacyNotice:
        'Utilizo estos datos solo para responder a su consulta. Sin boletín y sin cederlos.',
      privacyLink: 'Política de privacidad',
      errorRateLimited:
        'Demasiados intentos. Vuelva a intentarlo en un minuto.',
      errorChallenge:
        'La verificación no ha pasado. Recargue la página y vuelva a intentarlo.',
      errorRejected:
        'Se ha rechazado uno de los datos. Revise la dirección de correo y el resto de campos, y vuelva a intentarlo.',
      errorDelivery: 'No se ha podido entregar el mensaje.',
      errorUnavailable: 'El formulario no está disponible temporalmente.',
      errorNetwork:
        'La conexión se ha interrumpido antes de enviar el mensaje. Vuelva a intentarlo.',
      errors: {
        summaryOne: 'Corrija 1 campo.',
        summaryOther: 'Corrija {count} campos.',
        nameRequired: 'Escriba su nombre.',
        emailRequired: 'Escriba su dirección de correo.',
        emailFormat:
          'Escriba una dirección válida, p. ej. nombre@organizacion.es.',
        emailTooLong: 'Esta dirección supera los 254 caracteres.',
        organizationRequired: 'Escriba su organización.',
        serviceTypeRequired: 'Seleccione un ámbito.',
        messageRequired: 'Describa su proyecto o su consulta.',
        messageTooLong: 'Utilice 2.000 caracteres o menos.',
        lineBreak: 'Este campo no puede contener saltos de línea.',
      },
      turnstile: 'Protegido por Cloudflare Turnstile.',
    },
    directContact: {
      orDivider: 'o reserve directamente',
      calendarButton: 'Reservar una llamada de 30 minutos',
      emailDirect: 'Correo electrónico',
      locationLabel: 'Con sede en',
      locationValue: 'Sant Cugat del Vallès, cerca de Barcelona',
      timezone: 'Hora de Europa Central (CET/CEST)',
    },
  },
  thanks: {
    title: 'Mensaje enviado | vgr.cat',
    heading: 'Gracias — he recibido el mensaje',
    body: 'Su consulta se ha enviado. Recibirá una confirmación por correo electrónico y le responderé personalmente, normalmente en uno o dos días laborables.',
    back: 'Volver a la página de inicio',
  },
  notFound: {
    title: '404 — Página no encontrada | vgr.cat',
    heading: 'No se ha podido encontrar esta página',
    body: 'La página solicitada no existe o se ha trasladado. Compruebe la dirección o vuelva a la página de inicio para encontrar la sección que necesita.',
    back: 'Volver a la página de inicio',
  },
  privacy: {
    title: 'Privacidad y datos | vgr.cat',
    heading: 'Privacidad y sus datos',
    intro:
      'Este sitio recopila lo mínimo posible. Esta página explica exactamente qué ocurre con lo que me envía.',
    updated: 'Última actualización: 19 de octubre de 2026.',
    sections: [
      {
        heading: 'Qué envía el formulario de contacto',
        body: 'Su nombre, correo profesional, organización, el ámbito que seleccione, el mensaje y el idioma de la página que ha utilizado. El formulario no recopila nada más.',
      },
      {
        heading: 'Para qué lo conservo',
        body: 'Solo para responder a su consulta y dejar constancia del trabajo comentado. No hay boletín, ni lista de marketing, ni cesión a terceros para sus propios fines.',
      },
      {
        heading: 'Cómo se trata',
        body: 'El formulario se procesa en un Worker de Cloudflare y se entrega en mi buzón con Cloudflare Email Service. Cloudflare trata la petición en mi nombre para poder entregarla y aplica sus propios controles de seguridad.',
      },
      {
        heading: 'Protección contra bots',
        body: 'El formulario está protegido por Cloudflare Turnstile, que comprueba que el envío procede de un navegador real. Esa comprobación se hace antes de entregar el mensaje.',
      },
      {
        heading: 'Estadísticas de visitas',
        body: 'El sitio utiliza Cloudflare Web Analytics, que informa de totales agregados de tráfico.',
      },
      {
        heading: 'Cuánto tiempo se conserva',
        body: 'Las consultas permanecen en mi buzón el tiempo necesario para atender la petición y dejar un registro profesional razonable de ella.',
      },
      {
        heading: 'Sus opciones',
        body: 'Puede preguntar qué tengo sobre usted, pedir una corrección o pedir su supresión. Escriba a contact@vgr.cat y lo haré.',
      },
    ],
  },
  ctaBand: {
    title: '¿Algo que construir, arreglar o mantener en marcha?',
    body: 'Cuénteme qué quiere conseguir. Respondo personalmente, normalmente en dos días laborables.',
    primary: 'Reservar una llamada de 30 minutos',
    secondary: 'Ver los proyectos seleccionados',
  },
  footer: {
    tagline:
      'Ingeniero full-stack sénior y tech lead a tiempo parcial cerca de Barcelona. Energía y datos de producto de la UE, con entrega asistida por IA y revisión integradas en el proceso.',
    builtWith:
      'Hecho con Astro y Tailwind, alojado en Cloudflare Workers, con un proceso revisado y guiado por especificaciones.',
    sourceLabel: 'Ver el código fuente en GitHub',
    sectionsLabel: 'Secciones',
    contactLabel: 'Contacto',
    languageLabel: 'Idioma',
    legalLabel: 'Privacidad',
  },
};
