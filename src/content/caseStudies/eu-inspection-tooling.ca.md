---
translationKey: eu-inspection-tooling
locale: ca
title: 'Eines automatitzades de supervisió de mercat per a la verificació a la UE'
summary: 'Programari algorísmic a mida que permet a les autoritats de supervisió de mercat auditar el compliment dels productes amb les directrius europees d’Ecodesign a escala.'
problem: 'Les autoritats de supervisió de mercat acumulaven endarreriments importants per la inspecció manual de fitxes tècniques heterogènies, fórmules de tolerància complexes i registres públics desconnectats.'
approach: 'Es va construir una plataforma de validació especialitzada que tradueix les fórmules europees d’assaig en algorismes de verificació automatitzada amb verificació directa a EPREL.'
outcome: 'El temps d’avaluació tècnica va passar de dies a minuts per lot, i els inspectors van obtenir informes de no-conformitat reproduïbles i jurídicament defensables.'
pillar: regtech
---

La supervisió de mercat és essencial perquè les directrius europees d’Ecodesign i d’etiquetatge energètic generin reduccions reals d’emissions. Tanmateix, les autoritats nacionals de supervisió de mercat (MSA) de tot Europa sovint operen amb recursos limitats davant d’un volum aclaparador d’aparells importats i nacionals.

## El repte

Verificar si un producte del mercat compleix les normes de la UE requeria tradicionalment:

1. Localitzar manualment la documentació tècnica i les declaracions de conformitat.
2. Contrastar els paràmetres del producte amb les fórmules normatives de desenes de reglaments delegats de la UE.
3. Calcular a mà les toleràncies matemàtiques per determinar si un producte supera o no els llindars d’inspecció.

Aquest coll d’ampolla manual feia que només una fracció mínima del mercat es pogués auditar cada any, cosa que deixava espai per a models no conformes i etiquetatge energètic fraudulent.

## L’arquitectura

Vaig dissenyar i implementar eines a mida per a avaluadors públics i experts en supervisió:

- **Directrius normatives codificades:** transformació de les fórmules matemàtiques oficials dels índexs d’eficiència energètica (EEI), el consum anual i els paràmetres de rendiment en biblioteques de càlcul automatitzades i versionades.
- **Validació creuada automatitzada amb registres:** connexió directa amb bases de dades oficials (com EPREL) per assenyalar immediatament fitxes absents, paràmetres incorrectes o declaracions invàlides.
- **Registres d’auditoria defensables:** implementació de traces d’auditoria immutables amb les dades d’entrada, la versió de la fórmula i la derivació matemàtica de cada anomalia detectada, a punt per a procediments sancionadors.

## Impacte mesurable

Les eines van transformar la manera com operen els equips de supervisió:

- **Verificació instantània:** auditories de paràmetres matemàtics complexos que abans requerien hores de fulls de càlcul passen a executar-se automàticament en segons.
- **Perfilat de riscos proactiu:** les autoritats poden prioritzar els assajos de laboratori en els productes que ja presenten discrepàncies estadístiques o de paràmetres a les seves declaracions digitals.
- **Transferència de coneixement:** els tècnics no programadors poden executar canonades de validació de dades sofisticades mitjançant interfícies internes clares i focalitzades.
