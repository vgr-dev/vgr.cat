---
translationKey: banco-estado-iot
locale: es
title: 'Monitorización energética IoT para un banco público nacional'
summary: 'Un programa plurianual que comenzó como monitorización y control remoto a nivel de circuito y escaló hasta una flota nacional de telemetría energética en cientos de sucursales.'
problem: 'Un banco público nacional no tenía una visión continua de su consumo eléctrico. Las facturas llegaban cada mes, los circuitos no se podían comparar entre sedes y las averías se descubrían mucho después.'
approach: 'Construí el primer despliegue como monitorización y control directo a nivel de circuito y después extendí el mismo stack a toda la flota: integración de gateways, ingesta de telemetría con Express y MQTT, una capa de servicio con Django y PHP y cuadros de mando para equipos no técnicos, desplegados sucursal por sucursal sin interrumpir la operativa.'
outcome: 'Monitorización y control remoto de circuitos eléctricos en más de 200 oficinas, sustituyendo el análisis de facturas mensuales por datos de consumo en vivo por sucursal.'
pillar: iot
---

Este fue un despliegue físico antes que un proyecto de software. Había que instalar y poner en marcha contadores, gateways y circuitos en toda una red nacional de sucursales, secuenciado de modo que ninguna sucursal perdiera visibilidad de su propio consumo durante el cambio — y el mismo stack llevó después el programa desde un primer despliegue piloto hasta una flota nacional.
