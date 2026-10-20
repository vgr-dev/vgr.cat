---
translationKey: topten-ecosystem
locale: ca
title: 'Arquitectura de la infraestructura paneuropea de Topten'
summary: 'Una plataforma multi-tenant escalable que impulsa Topten.eu, Topten.ch i diverses instàncies internacionals amb canonades de dades centralitzades i fluxos de treball optimitzats per als analistes.'
problem: 'Gestionar portals nacionals independents amb criteris nacionals divergents, requisits lingüístics i bases de codi desconnectades generava un cost operatiu enorme.'
approach: 'Es va dissenyar una plataforma multi-tenant consolidada amb modelatge de dades centralitzat, motors de criteris modulars i eines internes d’alta de productes a mida.'
outcome: 'Es va unificar l’operació dels portals europeus i suïssos, es van reduir dràsticament les hores de manteniment dels analistes i es van assolir temps de resposta inferiors a un segon sense interrupcions de servei.'
pillar: infrastructure
---

Topten és una iniciativa de consumidors europea capdavantera que fa seguiment i presenta els productes més eficients del mercat, per orientar consumidors, equips de compra corporativa i responsables polítics.

## El repte

A mesura que Topten va passar de projectes pilot nacionals a ser una referència europea en diversos àmbits (Topten.eu, Topten.ch i diversos llocs associats), la pila tècnica va patir els problemes del creixement:

- **Instàncies fragmentades:** cada portal regional tenia criteris de selecció, categories de producte i conjunts de dades localitzats divergents.
- **Colls d’ampolla analítics:** els analistes de recerca dedicaven massa temps a formatar fulls de càlcul manualment i a lluitar amb backends complexos en lloc d’avaluar dades de producte.
- **Cost d’infraestructura:** mantenir servidors i bases de codi dispars consumia capacitat de desenvolupament i augmentava la vulnerabilitat operativa.

## L’arquitectura

Com a enginyer principal de programari, vaig redissenyar l’arquitectura de la plataforma des de zero:

- **Base multi-tenant:** consolidació de desplegaments dispars en una arquitectura modular unificada. Un únic motor central gestiona el modelatge de la base de dades, les capes d’API i la lògica de negoci, tot donant suport a criteris, imatge de marca i contingut multilingüe específics de cada llogater.
- **Eines internes i alta de productes a mida:** substitució de fluxos fragmentats per eines administratives intuïtives dissenyades a partir del cicle operatiu real d’un analista de Topten. L’alta de nous membres de l’equip va passar de setmanes a hores.
- **Ingestió i memòria cau robustes:** disseny de canonades de dades resilients per sincronitzar actualitzacions de catàleg, llindars de referència i fluxos de proveïdors, amb memòria cau agressiva a la vora que ofereix temps de càrrega inferiors a un segon fins i tot en pics de trànsit.
- **Automatització CI/CD:** estandardització dels fluxos de prova i desplegament amb integració contínua moderna, garantint que els canvis en un portal no afectin les instàncies germanes.

## Impacte mesurable

- **Eficiència operativa:** els investigadors de domini poden actualitzar referències, aprovar propostes de productes i publicar categories noves sense intervenció d’enginyeria.
- **Alta disponibilitat i velocitat:** la plataforma suporta trànsit intens de consumidors i B2B de manera fiable amb costos d’infraestructura irrellevants.
- **Agilitat de la plataforma:** afegir països, organitzacions associades o categories emergents (com bombes de calor o refrigeració comercial) ara es configura en dies en lloc d’exigir mesos de desenvolupament.
