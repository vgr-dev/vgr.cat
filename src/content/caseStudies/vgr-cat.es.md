---
translationKey: vgr-cat
locale: es
title: 'vgr.cat: un sitio trilingüe creado con un proceso revisado y asistido por IA'
summary: 'Un sitio web de marketing multilingüe pequeño, con formulario de contacto, una Content Security Policy y requisitos de accesibilidad, creado y documentado en abierto.'
problem: 'El sitio necesitaba tres idiomas, un formulario de contacto protegido contra el spam, una Content Security Policy y requisitos de accesibilidad, sin añadir un CMS ni un framework que el mantenedor tuviera que operar.'
approach: 'Astro genera el sitio de forma estática para los activos de Cloudflare Workers, con el punto de entrada del contacto en un Worker pequeño. El repositorio contiene planes, decisiones y notas de verificación. La CI cubre tipos, lint, accesibilidad y paridad de los diccionarios en las pull requests y los pushes a main; una ejecución en seco del despliegue es una comprobación local adicional.'
outcome: 'El sitio está en producción en inglés, español y catalán. El repositorio muestra el proceso, las decisiones y las comprobaciones, y mantiene disponibles los registros de planificación anteriores.'
pillar: build
---

vgr.cat es mi propio sitio: un sitio web de marketing multilingüe pequeño, con formulario de contacto
y requisitos de seguridad y de accesibilidad, mantenido por mí.

## El problema

El sitio necesitaba tres idiomas, un formulario de contacto protegido contra el spam, una Content
Security Policy y requisitos de accesibilidad, sin añadir un CMS ni un framework que el mantenedor
tuviera que operar.

## Lo que construí

Astro genera el sitio de forma estática para los activos de Cloudflare Workers, con el punto de
entrada del contacto en un Worker pequeño. El repositorio contiene planes, decisiones y notas de
verificación. Las comprobaciones automáticas cubren tipos, lint, accesibilidad y paridad de los
diccionarios entre idiomas. La CI se ejecuta en las pull requests y en los pushes a main; la
ejecución en seco del despliegue es una comprobación local adicional. Los registros de planificación
anteriores se conservan en `.ai/plans/archive/` como historial de solo lectura; la estructura actual
de `specs/` se adoptó más tarde.

## El resultado

El sitio está en producción en inglés, español y catalán. El repositorio muestra el proceso, las
decisiones y las comprobaciones, y mantiene disponibles los registros de planificación anteriores,
de modo que otro ingeniero puede seguir el trabajo.
