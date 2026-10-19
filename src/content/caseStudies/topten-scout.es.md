---
translationKey: topten-scout
locale: es
title: 'Topten Scout: observabilidad de mercado en tiempo real y resolución de GTIN'
summary: 'Una plataforma de supervisión de mercado que combina los datos oficiales de EPREL con API de mercado de la UE en directo para resolver identidades de producto y observar tendencias de eficiencia.'
problem: 'Los registros oficiales (EPREL) están aislados de la realidad minorista; las diferencias entre los números de modelo técnicos y los anuncios comerciales dejaban a los reguladores ciegos ante el stock real del mercado.'
approach: 'Se construyó una canalización automatizada que empareja EPREL con una API de mercado financiada por la UE, impulsada por un motor de resolución de entidades marca/modelo a GTIN.'
outcome: 'Se automatizó la resolución de entidades de miles de productos, lo que permite seguir en directo los precios minoristas, la disponibilidad real de stock y la coherencia del etiquetado.'
pillar: entity-resolution
---

Mientras la Unión Europea mantiene bases de datos sólidas para la certificación de productos, la realidad del mercado avanza mucho más rápido. El Registro Europeo de Productos para el Etiquetado Energético (EPREL) contiene declaraciones certificadas de los fabricantes, pero los consumidores compran productos a partir de nombres comerciales, SKU de minoristas y promociones.

### El problema

Conectar los datos normativos con los datos reales de venta era históricamente casi imposible:

- **Fragmentación de identificadores:** los fabricantes registran un código de modelo interno en EPREL, pero comercializan el mismo aparato con nombres minoristas distintos, lotes conjuntos o códigos comerciales regionales.
- **Códigos de barras ausentes:** los sitios minoristas y los rastreadores a menudo carecen de códigos GTIN/EAN, lo que impide las uniones simples de bases de datos con las declaraciones oficiales.
- **Invisibilidad del mercado:** los reguladores y los programas de eficiencia no podían responder fácilmente a preguntas políticas fundamentales: _¿los productos de alta eficiencia certificados en EPREL están realmente en stock en las tiendas? ¿son exactas las etiquetas energéticas que se anuncian?_

### Enfoque técnico

Para resolverlo, diseñé y desarrollé **Topten Scout**, una plataforma de observabilidad que mapea y monitoriza continuamente el mercado minorista:

- **Ingesta de datos de doble flujo:** sincronización de especificaciones normativas de EPREL con flujos de catálogo en tiempo real de una API de datos de mercado financiada por la UE.
- **Motor de resolución de entidades algorítmico:** implementación de tokenización de cadenas, heurísticas de limpieza normalizada de marca/modelo y algoritmos de emparejamiento probabilístico que vinculan nombres comerciales no estandarizados con identificadores **GTIN / EAN** verificados.
- **Motor de discrepancias:** comparación de la etiqueta energética declarada y las métricas de consumo almacenadas en EPREL con las especificaciones en directo de los principales portales minoristas, señalando discrepancias automáticamente.
- **Panel de observabilidad:** gráficos dinámicos que muestran la cuota de mercado de cada clase de eficiencia energética sobre el stock minorista activo, con seguimiento de la evolución de precios y de la retirada de modelos.

### El impacto

- **Puente construido:** se cerró la brecha entre las declaraciones teóricas de cumplimiento de la UE y las estanterías reales de los principales mercados europeos.
- **Escala:** se automatizó el emparejamiento de miles de productos que antes exigían un contraste manual laborioso de catálogos.
- **Inteligencia accionable:** ONG, agencias de energía y analistas de políticas disponen de evidencia factual y en tiempo real sobre la velocidad con la que las tecnologías más limpias penetran en el mercado de consumo.
