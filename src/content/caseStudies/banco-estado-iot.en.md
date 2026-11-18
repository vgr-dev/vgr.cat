---
translationKey: banco-estado-iot
locale: en
title: 'Energy monitoring for Banco Estado branches'
summary: 'Circuit-level monitoring and remote control for Banco Estado branches, delivered through Fundación Chile.'
problem: 'Consumption arrived as monthly bills. Circuits could not be compared across sites, and faults surfaced long after the fact.'
approach: 'Circuit-level monitoring and control, commissioned branch by branch. Gateways stream readings through MQTT into a service layer, with dashboards for the teams who run the branches. The same instrumentation can switch circuits remotely.'
outcome: 'Branches have live consumption data instead of monthly billing analysis. Outliers are visible while they are happening, and routine switching no longer needs a site visit.'
pillar: energy
---

Banco Estado needed continuous visibility of electricity use across its branches. The work was
delivered through Fundación Chile.

## Problem

Consumption reached head office as a monthly bill. Without per-circuit readings, branches of
different size and use could not be compared, and a fault could run for a full billing cycle before
anyone noticed.

## What I built

Circuit-level monitoring and control, commissioned branch by branch so each site kept its own
monitoring through the changeover. Gateways stream readings through MQTT into a service layer, with
dashboards for the teams who run the branches. The same instrumentation can switch circuits
remotely.

## Result

Branches have live consumption data instead of monthly billing analysis. Outliers are visible while
they are happening, and routine switching no longer needs a site visit.
