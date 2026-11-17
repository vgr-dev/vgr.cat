---
translationKey: banco-estado-iot
locale: es
title: 'Monitorización energética para las oficinas de Banco Estado'
summary: 'Monitorización a nivel de circuito y control remoto para las oficinas de Banco Estado, entregado a través de Fundación Chile.'
problem: 'El consumo llegaba en facturas mensuales. Los circuitos no se podían comparar entre oficinas y las averías se detectaban mucho después.'
approach: 'Monitorización y control a nivel de circuito, puestos en marcha oficina por oficina. Los gateways envían las lecturas por MQTT a una capa de servicios, con paneles para los equipos que gestionan las oficinas. La misma instrumentación puede conmutar circuitos de forma remota.'
outcome: 'Las oficinas tienen datos de consumo en vivo en lugar de análisis de facturas mensuales. Los valores atípicos se ven mientras ocurren y la conmutación rutinaria ya no requiere una visita a la oficina.'
pillar: energy
---

Banco Estado necesitaba visibilidad continua del consumo eléctrico en sus oficinas. El trabajo se
entregó a través de Fundación Chile.

## El problema

El consumo llegaba a la sede central como una factura mensual. Sin lecturas por circuito, las
oficinas de distinto tamaño y uso no se podían comparar, y una avería podía durar un ciclo de
facturación completo antes de que nadie lo notara.

## Lo que construí

Monitorización y control a nivel de circuito, puestos en marcha oficina por oficina para que cada
sede mantuviera su propia monitorización durante el cambio. Los gateways envían las lecturas por
MQTT a una capa de servicios, con paneles para los equipos que gestionan las oficinas. La misma
instrumentación puede conmutar circuitos de forma remota.

## El resultado

Las oficinas tienen datos de consumo en vivo en lugar de análisis de facturas mensuales. Los valores
atípicos se ven mientras ocurren y la conmutación rutinaria ya no requiere una visita a la oficina.
