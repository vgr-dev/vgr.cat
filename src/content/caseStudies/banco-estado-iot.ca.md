---
translationKey: banco-estado-iot
locale: ca
title: 'Monitoratge energètic per a les oficines de Banco Estado'
summary: 'Monitoratge a nivell de circuit i control remot per a les oficines de Banco Estado, lliurat a través de Fundación Chile.'
problem: 'El consum arribava en factures mensuals. Els circuits no es podien comparar entre oficines i les avaries es detectaven molt després.'
approach: 'Monitoratge i control a nivell de circuit, posats en servei oficina per oficina. Els gateways envien les lectures per MQTT a una capa de serveis, amb quadres de comandament per als equips que gestionen les oficines. La mateixa instrumentació pot commutar circuits en remot.'
outcome: 'Les oficines tenen dades de consum en directe en lloc d’anàlisi de factures mensuals. Els valors atípics es veuen mentre passen i la commutació rutinària ja no requereix una visita a l’oficina.'
pillar: energy
---

Banco Estado necessitava visibilitat contínua del consum elèctric a les seves oficines. La feina es
va lliurar a través de Fundación Chile.

## El problema

El consum arribava a la seu central com una factura mensual. Sense lectures per circuit, les
oficines de mida i ús diferents no es podien comparar, i una avaria podia durar un cicle de
facturació complet abans que ningú se n’adonés.

## Què he construït

Monitoratge i control a nivell de circuit, posats en servei oficina per oficina perquè cada lloc
mantingués el seu propi monitoratge durant el canvi. Els gateways envien les lectures per MQTT a una
capa de serveis, amb quadres de comandament per als equips que gestionen les oficines. La mateixa
instrumentació pot commutar circuits en remot.

## El resultat

Les oficines tenen dades de consum en directe en lloc d’anàlisi de factures mensuals. Els valors
atípics es veuen mentre passen i la commutació rutinària ja no requereix una visita a l’oficina.
