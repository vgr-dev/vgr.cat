import type { Dictionary } from './en';

export const es: Dictionary = {
  site: {
    title: 'VGR | Ingeniero Principal de Software y Consultor RegTech',
    description:
      'Arquitectura de software, automatización de la supervisión de mercado, integraciones con EPREL y canalizaciones de datos a gran escala para la transición energética europea.',
    author: 'VGR',
    location: 'Sant Cugat del Vallès, Cataluña',
    jobTitle: 'Ingeniero Principal de Software',
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
  },
  hero: {
    badge: 'Disponible para asesoramiento técnico en Europa y Cataluña',
    title: 'Arquitectura de software y observabilidad de datos para la',
    titleHighlight: 'transición energética',
    subtitle:
      'Ingeniero principal de software especializado en sistemas europeos de cumplimiento normativo (RegTech/GovTech), canalizaciones automatizadas de datos EPREL, observabilidad de la supervisión de mercado y plataformas en la nube multiinquilino de alta resiliencia.',
    ctaPrimary: 'Agendar una consulta técnica',
    ctaSecondary: 'Explorar los casos prácticos',
    metrics: [
      {
        value: '10+',
        label: 'Años construyendo plataformas paneuropeas de datos energéticos',
      },
      {
        value: 'EPREL y ESPR',
        label: 'Implementación directa de marcos normativos',
      },
      {
        value: '100k+',
        label: 'Identidades de producto resueltas y auditadas',
      },
    ],
  },
  services: {
    eyebrow: 'Capacidades especializadas',
    title:
      'Soluciones de ingeniería para entornos normativos y de datos complejos',
    subtitle:
      'Conectamos directrices técnicas, algoritmos de verificación automatizada e infraestructura escalable para eliminar cuellos de botella manuales.',
    ctaLearnMore: 'Ver el caso práctico relacionado',
    // Keys mirror the collection `pillar` enum, so `entry.data.pillar` indexes this directly.
    pillars: {
      regtech: { tag: 'RegTech y cumplimiento normativo' },
      'entity-resolution': { tag: 'Inteligencia de datos' },
      infrastructure: { tag: 'Nube y sistemas' },
    },
  },
  caseStudies: {
    eyebrow: 'Proyectos ejecutados',
    title: 'Despliegues técnicos destacados',
    subtitle:
      'Sistemas reales que aportan verificación automatizada, alta disponibilidad y eficiencia operativa a instituciones europeas y plataformas públicas.',
    labels: {
      problem: 'El reto',
      approach: 'La arquitectura',
      outcome: 'Impacto medible',
    },
  },
  about: {
    eyebrow: 'Trayectoria y experiencia',
    title:
      'Liderazgo arquitectónico práctico en la intersección entre la política energética y el software',
    paragraphs: [
      'Soy ingeniero principal de software, con sede en Sant Cugat del Vallès (Barcelona), y me ocupo de infraestructura, ingeniería de datos y herramientas de software a medida para grandes iniciativas europeas de eficiencia energética, como Topten.eu y Topten.ch.',
      'Mi trabajo técnico se centra en reducir la distancia entre la normativa europea compleja (Ecodesign, etiquetado energético, ESPR) y la supervisión real del mercado. Construyo canalizaciones de alto rendimiento que contrastan los registros de certificación estáticos con los canales minoristas fragmentados mediante resolución de entidades algorítmica y mapeo de GTIN.',
      'Tanto si asesoro a administraciones públicas sobre infraestructura de supervisión, como si preparo a fabricantes para los pasaportes digitales de producto o construyo herramientas internas que dan autonomía a los analistas, priorizo sistemas robustos y sin exceso de complejidad, con un retorno operativo elevado.',
    ],
    techStackTitle: 'Competencias y stack técnico principal',
    competencies: [
      'Codificación de fórmulas normativas (EPREL, Ecodesign)',
      'Resolución de entidades y desambiguación de cadenas (GTIN/EAN)',
      'Arquitectura de plataformas multiinquilino',
      'Diseño de API y canalizaciones de ingesta automatizada',
      'Infraestructura sin servidor y en el edge (Cloudflare Workers)',
      'Herramientas internas a medida y experiencia de usuario para analistas',
    ],
  },
  contact: {
    eyebrow: 'Trabajemos juntos',
    title:
      'Hablemos de su hoja de ruta técnica o de su infraestructura de cumplimiento normativo',
    subtitle:
      'Disponible para asesoramiento arquitectónico, auditorías técnicas, ponencias y contratos de ingeniería especializada en Cataluña, España y la Unión Europea.',
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
        advisory: 'Asesoramiento técnico / ponencias / otros',
      },
      messageLabel: 'Resumen del proyecto y objetivos',
      messagePlaceholder:
        'Describa los requisitos, las restricciones del sistema o los plazos...',
      submitButton: 'Enviar consulta',
      submitting: 'Enviando...',
      successMessage:
        'Gracias. Hemos recibido su mensaje y le responderemos en un plazo de uno a dos días laborables.',
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
    heading: 'Gracias — hemos recibido el mensaje',
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
      'Arquitectura de sistemas basados en datos para la transición energética europea.',
    builtWith:
      'Desarrollado con Astro y Tailwind. Alojado en Cloudflare Workers.',
  },
};
