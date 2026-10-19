---
translationKey: banco-estado-iot
locale: ca
title: 'Monitoratge energètic IoT per a un banc públic nacional'
summary: 'Un programa pluriennal que va començar com a monitoratge i control remot a nivell de circuit i va escalar fins a una flota nacional de telemetria energètica en centenars de sucursals.'
problem: 'Un banc públic nacional no tenia una visió contínua del seu consum elèctric. Les factures arribaven cada mes, els circuits no es podien comparar entre seus i les avaries es descobrien molt després.'
approach: 'Vaig construir el primer desplegament com a monitoratge i control directe a nivell de circuit i després vaig estendre el mateix stack a tota la flota: integració de gateways, ingesta de telemetria amb Express i MQTT, una capa de servei amb Django i PHP i quadres de comandament per a equips no tècnics, desplegats sucursal per sucursal sense interrompre l’operativa.'
outcome: 'Monitoratge i control remot de circuits elèctrics en més de 200 oficines, substituint l’anàlisi de factures mensuals per dades de consum en viu per sucursal.'
pillar: iot
---

Aquest va ser un desplegament físic abans que un projecte de programari. Calia instal·lar i posar en marxa comptadors, gateways i circuits a tota una xarxa nacional de sucursals, seqüenciat de manera que cap sucursal perdés visibilitat del seu propi consum durant el canvi — i el mateix stack va portar després el programa des d’un primer desplegament pilot fins a una flota nacional.
