---
translationKey: topten-scout
locale: ca
title: 'Topten Scout: observabilitat de mercat en temps real i resolució de GTIN'
summary: 'Una plataforma de supervisió de mercat que combina les dades oficials d’EPREL amb APIs de mercat de la UE en directe per resoldre identitats de producte i observar tendències d’eficiència.'
problem: 'Els registres oficials (EPREL) estan aïllats de la realitat minorista; les diferències entre els números de model tècnics i els anuncis comercials deixaven els reguladors cecs davant l’estoc real del mercat.'
approach: 'Es va construir una canonada automatitzada que aparella EPREL amb una API de mercat finançada per la UE, impulsada per un motor de resolució d’entitats marca/model a GTIN.'
outcome: 'Es va automatitzar la resolució d’entitats de milers de productes, cosa que permet seguir en directe els preus minoristes, la disponibilitat real d’estoc i la coherència de l’etiquetatge.'
pillar: entity-resolution
---

Mentre la Unió Europea manté bases de dades sòlides per a la certificació de productes, la realitat del mercat avança molt més de pressa. El Registre Europeu de Productes per a l’Etiquetatge Energètic (EPREL) conté declaracions certificades dels fabricants, però els consumidors compren productes a partir de noms comercials, SKU de minoristes i promocions.

## El repte

Connectar les dades normatives amb les dades reals de venda era històricament gairebé impossible:

- **Fragmentació d’identificadors:** els fabricants registren un codi de model intern a EPREL, però comercialitzen el mateix aparell amb noms minoristes diferents, lots conjunts o codis comercials regionals.
- **Codis de barres absents:** els llocs minoristes i els rastrejadors sovint no tenen codis GTIN/EAN, cosa que impedeix les unions simples de bases de dades amb les declaracions oficials.
- **Invisibilitat del mercat:** els reguladors i els programes d’eficiència no podien respondre fàcilment preguntes polítiques fonamentals: _els productes d’alta eficiència certificats a EPREL són realment en estoc a les botigues? les etiquetes energètiques que s’anuncien són exactes?_

## L’arquitectura

Per resoldre-ho, vaig dissenyar i desenvolupar **Topten Scout**, una plataforma d’observabilitat que mapitza i monitora contínuament el mercat minorista:

- **Ingestió de dades de doble flux:** sincronització d’especificacions normatives d’EPREL amb fluxos de catàleg en temps real d’una API de dades de mercat finançada per la UE.
- **Motor de resolució d’entitats per algorisme:** implementació de tokenització de cadenes, heurístiques de neteja normalitzada de marca/model i algorismes d’aparellament probabilístic que vinculen noms comercials no estandarditzats amb identificadors **GTIN / EAN** verificats.
- **Motor de discrepàncies:** comparació de l’etiqueta energètica declarada i les mètriques de consum emmagatzemades a EPREL amb les especificacions en directe dels principals portals minoristes, assenyalant discrepàncies automàticament.
- **Quadre d’observabilitat:** gràfics dinàmics que mostren la quota de mercat de cada classe d’eficiència energètica sobre l’estoc minorista actiu, amb seguiment de l’evolució de preus i de la retirada de models.

## Impacte mesurable

- **Pont construït:** es va tancar la bretxa entre les declaracions teòriques de compliment de la UE i les prestatgeries reals dels principals mercats europeus.
- **Escala:** es va automatitzar l’aparellament de milers de productes que abans exigien un contrast manual laboriós de catàlegs.
- **Intel·ligència accionable:** ONG, agències d’energia i analistes de polítiques disposen d’evidència factual i en temps real sobre la velocitat amb què les tecnologies més netes penetren el mercat de consum.
