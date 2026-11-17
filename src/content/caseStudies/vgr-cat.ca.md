---
translationKey: vgr-cat
locale: ca
title: 'vgr.cat: un lloc trilingüe creat amb un procés revisat i assistit per IA'
summary: 'Un lloc web de màrqueting multilingüe petit, amb formulari de contacte, una Content Security Policy i requisits d’accessibilitat, creat i documentat en obert.'
problem: 'El lloc necessitava tres llengües, un formulari de contacte protegit contra el correu brossa, una Content Security Policy i requisits d’accessibilitat, sense afegir un CMS ni un framework que el mantenidor hagués d’operar.'
approach: 'Astro genera el lloc de manera estàtica per als actius de Cloudflare Workers, amb el punt d’entrada del contacte en un Worker petit. El repositori conté plans, decisions i notes de verificació. La CI cobreix tipus, lint, accessibilitat i paritat dels diccionaris en les pull requests i els pushes a main; una execució en sec del desplegament és una comprovació local addicional.'
outcome: 'El lloc és en producció en anglès, castellà i català. El repositori mostra el procés, les decisions i les comprovacions, i conserva disponibles els registres de planificació anteriors.'
pillar: build
---

vgr.cat és el meu propi lloc: un lloc web de màrqueting multilingüe petit, amb formulari de contacte
i requisits de seguretat i d’accessibilitat, mantingut per mi.

## El problema

El lloc necessitava tres llengües, un formulari de contacte protegit contra el correu brossa, una
Content Security Policy i requisits d’accessibilitat, sense afegir un CMS ni un framework que el
mantenidor hagués d’operar.

## Què he construït

Astro genera el lloc de manera estàtica per als actius de Cloudflare Workers, amb el punt d’entrada
del contacte en un Worker petit. El repositori conté plans, decisions i notes de verificació. Les
comprovacions automàtiques cobreixen tipus, lint, accessibilitat i paritat dels diccionaris entre
llengües. La CI s’executa en les pull requests i en els pushes a main; l’execució en sec del
desplegament és una comprovació local addicional. Els registres de planificació anteriors es
conserven a `.ai/plans/archive/` com a historial de només lectura; l’estructura actual de `specs/`
es va adoptar més tard.

## El resultat

El lloc és en producció en anglès, castellà i català. El repositori mostra el procés, les decisions
i les comprovacions, i conserva disponibles els registres de planificació anteriors, de manera que un
altre enginyer pot seguir la feina.
