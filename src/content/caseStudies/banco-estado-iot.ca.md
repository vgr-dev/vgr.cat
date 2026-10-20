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

## El repte

Les decisions energètiques d’un banc nacional es prenien amb dades que arribaven setmanes després dels fets:

- **Resolució mensual:** el consum arribava a la central com una factura, molt després que el comptador ja l’hagués registrat, de manera que una avaria podia durar un cicle de facturació sencer abans que ningú la veiés.
- **Sense comparació equivalent:** sense lectures per circuit, dues sucursals de mida i ús diferents només es podien comparar per la despesa total.
- **Sistemes aïllats:** cada seu era una illa, i res agregava el consum de les sucursals en una visió de flota.
- **Cap interrupció permesa:** el programa s’havia de desplegar en una xarxa de sucursals en funcionament, on deixar una sucursal fora de servei per instrumentar-la no era una opció.

## L’arquitectura

Un sol stack, estès en lloc de substituït, des del primer pilot fins al desplegament nacional:

- **Instrumentació a nivell de circuit:** comptadors i gateways posats en marxa sucursal per sucursal, amb les instal·lacions seqüenciades perquè cada seu mantingués el seu propi monitoratge durant el canvi.
- **Ingesta de telemetria:** els gateways envien les lectures a un pipeline amb Express i MQTT, de manera que les dades arriben de forma contínua i no en lots.
- **Capa de servei:** un backend amb Django i PHP que guarda les lectures i exposa les vistes per sucursal i de flota que el programa necessitava.
- **Quadres de comandament per a equips no tècnics:** el consum mostrat en termes sobre els quals pot actuar qui gestiona la sucursal, no pas registres en brut.
- **Control remot:** la mateixa instrumentació que informa d’un circuit el pot accionar, de manera que una seu no necessita una visita per desconnectar-lo.

## Impacte mesurable

- **Abast:** monitoratge i control remot en més de 200 oficines.
- **De les factures a les dades en viu:** l’anàlisi de factures mensuals substituïda per consum per sucursal disponible a mesura que es mesura.
- **Comparació de flota:** les sucursals, finalment comparables entre elles, de manera que els valors atípics destaquen en lloc de fondre’s en un total.
- **Avaries visibles abans:** un circuit que es desvia ara es veu mentre es desvia, no a la factura següent.
