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

#### The Challenge

Energy decisions at a national bank were being taken on data that arrived weeks after the fact:

- **Monthly resolution:** consumption reached head office as a utility bill, long after the meter had already recorded it, so a fault could run for a full billing cycle before anyone noticed.
- **No like-for-like comparison:** without per-circuit readings, two branches of different size and use could be compared on nothing but total spend.
- **Standalone systems:** each site was its own island, so nothing aggregated branch consumption into a fleet-wide picture.
- **No interruption allowed:** the programme had to be delivered across a live branch network, where taking a branch offline for instrumentation was not an option.

#### The Architecture

One stack, extended rather than replaced, from the first pilot to the national rollout:

- **Circuit-level instrumentation:** meters and gateways commissioned branch by branch, with installs sequenced so that each site kept its own monitoring throughout the changeover.
- **Telemetry ingest:** gateways stream readings into an Express and MQTT pipeline, so data arrives continuously rather than in batches.
- **Service layer:** a Django and PHP backend holds the readings and exposes the per-branch and fleet-level views the programme needed.
- **Dashboards for non-technical teams:** consumption shown in terms the people who run the branches can act on, rather than raw registers.
- **Remote control:** the same instrumentation that reports a circuit can actuate it, so a site does not need a visit to switch one off.

#### Measurable Impact

- **Scope:** remote monitoring and control across 200+ offices.
- **From bills to live data:** monthly billing analysis replaced by per-branch consumption available as it is measured.
- **Fleet-wide comparison:** branches finally comparable against each other, so outliers stand out instead of blending into a total.
- **Faults visible early:** a circuit that drifts is now visible while it is drifting, not at the next invoice.
