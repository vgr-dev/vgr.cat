---
translationKey: banco-estado-iot
locale: en
title: 'Nationwide IoT Energy Monitoring for a National Public Bank'
summary: 'A multi-year programme that began as circuit-level monitoring and remote control, then scaled into a nationwide energy-telemetry fleet across hundreds of branches.'
problem: 'A national public bank had no continuous view of its electricity use. Bills arrived monthly, circuits could not be compared across sites, and faults surfaced long after the fact.'
approach: 'Built the first rollout as direct circuit-level monitoring and control, then extended the same stack into a fleet: gateway integration, Express and MQTT telemetry ingest, a Django and PHP service layer, and dashboards for non-technical teams — deployed branch by branch without disrupting operations.'
outcome: 'Remote monitoring and control across 200+ offices, replacing monthly billing analysis with live, per-branch consumption data.'
pillar: iot
---

This was a physical deployment before it was a software one. Meters, gateways and circuits had to be installed and commissioned across a national branch network, sequenced so that no branch lost visibility of its own consumption during the changeover — and the same stack then carried the programme from a first pilot rollout to a nationwide fleet.
