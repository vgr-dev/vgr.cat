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

## El reto

Las decisiones energéticas de un banco nacional se tomaban con datos que llegaban semanas después de los hechos:

- **Resolución mensual:** el consumo llegaba a la central como una factura, mucho después de que el contador ya lo hubiera registrado, de modo que una avería podía durar un ciclo de facturación entero antes de que nadie la viera.
- **Sin comparación equivalente:** sin lecturas por circuito, dos sucursales de tamaño y uso distintos solo se podían comparar por el gasto total.
- **Sistemas aislados:** cada sede era una isla, y nada agregaba el consumo de las sucursales en una visión de flota.
- **Ninguna interrupción permitida:** el programa debía desplegarse en una red de sucursales en funcionamiento, donde dejar una sucursal fuera de servicio para instrumentarla no era una opción.

## La arquitectura

Un solo stack, extendido en lugar de sustituido, desde el primer piloto hasta el despliegue nacional:

- **Instrumentación a nivel de circuito:** contadores y gateways puestos en marcha sucursal por sucursal, con las instalaciones secuenciadas para que cada sede mantuviera su propio monitoreo durante el cambio.
- **Ingesta de telemetría:** los gateways envían las lecturas a un pipeline con Express y MQTT, de modo que los datos llegan de forma continua y no en lotes.
- **Capa de servicio:** un backend con Django y PHP que guarda las lecturas y expone las vistas por sucursal y de flota que el programa necesitaba.
- **Cuadros de mando para equipos no técnicos:** el consumo mostrado en términos sobre los que puede actuar quien gestiona la sucursal, no registros en bruto.
- **Control remoto:** la misma instrumentación que informa de un circuito puede accionarlo, de modo que una sede no necesita una visita para desconectarlo.

## Impacto medible

- **Alcance:** monitorización y control remoto en más de 200 oficinas.
- **De las facturas a los datos en vivo:** el análisis de facturas mensuales sustituido por consumo por sucursal disponible a medida que se mide.
- **Comparación de flota:** las sucursales, por fin comparables entre sí, de modo que los valores atípicos destacan en lugar de fundirse en un total.
- **Averías visibles antes:** un circuito que se desvía ahora se ve mientras se desvía, no en la factura siguiente.
