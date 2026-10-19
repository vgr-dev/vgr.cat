import type { Dictionary } from './en';

export const es: Dictionary = {
  site: {
    title: 'VGR | Ingeniero Principal de Software y Consultor',
    description:
      'Ingeniería full-stack para plataformas de eficiencia energética: datos normativos europeos, supervisión de mercado y monitorización IoT. Más de 12 años.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Cataluña',
    jobTitle: 'Ingeniero Principal de Software y Consultor',
  },
  nav: {
    services: 'Servicios',
    caseStudies: 'Casos prácticos',
    about: 'Sobre mí',
    contact: 'Contacto',
    bookCall: 'Agendar una llamada',
  },
  header: {
    brand: 'vgr.cat',
    menuLabel: 'Mostrar u ocultar el menú de navegación',
    primaryNavLabel: 'Navegación principal',
    languageNavLabel: 'Seleccione el idioma',
    skipToContent: 'Saltar al contenido principal',
  },
  hero: {
    badge:
      'Disponible para ingeniería de software y asesoramiento en Europa y Cataluña',
    title: 'Ingeniería de las plataformas que hacen posible la',
    titleHighlight: 'eficiencia energética europea',
    subtitle:
      'Más de 12 años de entrega de extremo a extremo en eficiencia energética: motores de cumplimiento normativo europeo (EPREL, Ecodesign, ESPR), herramientas de supervisión de mercado, flotas IoT a escala nacional y las plataformas multiinquilino que las operan.',
    ctaPrimary: 'Agendar una consulta técnica',
    ctaSecondary: 'Explorar los casos prácticos',
    metrics: [
      {
        value: '12+',
        label: 'Años construyendo software para la eficiencia energética',
      },
      {
        value: '1,5 M+',
        label:
          'Visitantes mensuales en los 17 sitios multiinquilino en producción que opero',
      },
      {
        value: '200+',
        label: 'Oficinas bancarias instrumentadas con monitorización IoT',
      },
    ],
  },
  services: {
    eyebrow: 'Capacidades especializadas',
    title:
      'Ingeniería full-stack de datos energéticos: de los sensores de campo a los registros europeos',
    subtitle:
      'Motores normativos, observabilidad de mercado, monitorización IoT y las plataformas que los hacen funcionar. Una sola persona para todo el stack: ingesta, modelo, validación, despliegue y operación.',
    ctaLearnMore: 'Ver el caso práctico relacionado',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech y cumplimiento normativo' },
      'entity-resolution': { tag: 'Inteligencia de datos' },
      infrastructure: { tag: 'Nube y sistemas' },
      iot: { tag: 'IoT y datos de campo' },
    },
  },
  caseStudies: {
    eyebrow: 'Proyectos ejecutados',
    title: 'Plataformas y despliegues seleccionados',
    subtitle:
      'Sistemas en producción: verificación normativa para autoridades europeas, una plataforma de producto paneuropea, observabilidad de mercado y una flota IoT a escala nacional.',
    labels: {
      problem: 'El reto',
      approach: 'La arquitectura',
      outcome: 'Impacto medible',
    },
  },
  about: {
    eyebrow: 'Trayectoria y experiencia',
    title:
      'Ingeniería full-stack para la eficiencia energética, de los sensores de campo a los registros europeos',
    paragraphs: [
      'Soy ingeniero principal de software y consultor, con sede en Sant Cugat del Vallès (Barcelona). Llevo más de 12 años construyendo y operando software para la eficiencia energética y la sostenibilidad: primero como ingeniero en una fundación nacional de innovación, después como fundador de mi propia consultora y ahora como ingeniero principal de una flota de 17 sitios multiinquilino en producción que sostienen un 99,99 % de disponibilidad anual en Suiza, Chile y la UE.',
      'Mi trabajo se sitúa en los dos extremos del stack. En el campo, he instrumentado cientos de oficinas bancarias con flotas de monitorización energética IoT, conectando hardware, gateways y protocolos con cuadros de mando que los equipos de mantenimiento usan a diario. En datos normativos, convierto las obligaciones de Ecodesign, etiquetado energético y ESPR en software verificable: integraciones con EPREL, fórmulas de tolerancia en código y herramientas de supervisión de mercado que producen evidencia auditable.',
      'Soy ingeniero full-stack por temperamento: PHP, Python, TypeScript y Go en el servidor; Vue, React y Next.js en el frontal; Docker, Kubernetes, CI/CD, Grafana y Prometheus por debajo. Prefiero ser responsable de todo el camino antes que pasar el trabajo en una interfaz.',
      'También he llevado la parte de negocio. Fundé y hice crecer una consultora hasta los 20.000 USD al mes con un equipo de tres o cuatro ingenieros y cinco clientes de largo plazo, mantuve una alianza estratégica con una empresa suiza de eficiencia energética y acompañé la plataforma Topten hasta su adquisición por otra empresa suiza de mayor tamaño del mismo sector. Por eso me siento cómodo con las partes interesadas, los presupuestos y los plazos, no solo con el código.',
    ],
    experienceTitle: 'Dónde he trabajado',
    experience: [
      {
        period: '2025 — actualidad',
        role: 'Ingeniero Principal de Software y Consultor',
        org: 'Operador suizo de plataformas de eficiencia energética · consultora chilena de eficiencia energética',
        detail:
          '17 sitios multiinquilino en producción, 1,5 M+ visitantes mensuales, 99,99 % de disponibilidad.',
      },
      {
        period: '2017 — 2025',
        role: 'Fundador y jefe de equipo',
        org: 'VGR SpA (CL)',
        detail:
          'Consultora escalada a un equipo de 3–4 personas y 5+ clientes de largo plazo.',
      },
      {
        period: '2014 — 2017',
        role: 'Ingeniero de software',
        org: 'Fundación nacional de innovación',
        detail:
          'Plataformas IoT y de eficiencia energética para clientes públicos y privados.',
      },
    ],
    techStackTitle: 'Competencias y stack técnico principal',
    competencies: [
      'Codificación normativa (EPREL, Ecodesign, ESPR)',
      'Resolución de entidades y desambiguación de GTIN/EAN',
      'Arquitectura de plataformas multiinquilino',
      'Flotas IoT: gateways, MQTT, Express, ingesta de series temporales',
      'Diseño de APIs y canalizaciones de ingesta automatizada',
      'Docker, Kubernetes, CI/CD, Grafana, Prometheus',
      'PHP · Python · TypeScript · Go',
      'Vue · React · Next.js · Tailwind',
    ],
    credentials:
      'Diploma en dirección de proyectos TI (PMBOK v6) y miembro de PMI; coautor de un manual universitario sobre entrega ágil y predictiva (2021).',
  },
  contact: {
    eyebrow: 'Trabajemos juntos',
    title:
      'Hablemos de su hoja de ruta técnica o de su infraestructura de cumplimiento normativo',
    subtitle:
      'Disponible para ingeniería de software, revisión arquitectónica, auditorías técnicas, ponencias y contratos especializados en Cataluña, España y la Unión Europea.',
    form: {
      nameLabel: 'Nombre',
      namePlaceholder: 'p. ej. Maria Puig',
      emailLabel: 'Correo electrónico profesional',
      emailPlaceholder: 'nombre@organizacion.es',
      organizationLabel: 'Organización o institución',
      organizationPlaceholder: 'Empresa, agencia o entidad',
      serviceTypeLabel: 'Ámbito principal',
      serviceTypes: {
        regtech: 'RegTech / integración EPREL / preparación para ESPR',
        entityResolution: 'Observabilidad de mercado / resolución de entidades',
        infrastructure: 'Arquitectura multiinquilino / herramientas internas',
        iot: 'Monitorización IoT / instrumentación de campo',
        advisory: 'Asesoramiento técnico / ponencias / otros',
      },
      messageLabel: 'Resumen del proyecto y objetivos',
      messagePlaceholder:
        'Describa los requisitos, las restricciones del sistema o los plazos...',
      submitButton: 'Enviar consulta',
      submitting: 'Enviando...',
      successMessage:
        'Gracias. He recibido su mensaje y le responderé en un plazo de uno a dos días laborables.',
      errorMessage:
        'No se ha podido enviar el mensaje. Puede escribir directamente a contact@vgr.cat.',
      turnstile: 'Protegido por Cloudflare Turnstile.',
    },
    directContact: {
      orDivider: 'o bien, agendar directamente',
      calendarButton: 'Agendar una llamada técnica de 30 minutos',
      emailDirect: 'Correo directo',
      locationLabel: 'Sede',
      locationValue: 'Sant Cugat del Vallès, Barcelona, Cataluña',
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
  footer: {
    tagline:
      'Ingeniería full-stack para la eficiencia energética: de los sensores de campo a los registros europeos.',
    builtWith:
      'Desarrollado con Astro y Tailwind. Alojado en Cloudflare Workers.',
  },
};
