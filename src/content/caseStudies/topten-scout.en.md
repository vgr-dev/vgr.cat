---
translationKey: topten-scout
locale: en
title: 'Topten Scout: Real-Time Market Observability & GTIN Resolution'
summary: 'A market surveillance platform combining official EPREL registry data with live EU market APIs to resolve product identities and observe efficiency trends.'
problem: 'Official registries (EPREL) are isolated from retail realities; differences between technical model numbers and commercial listings left regulators blind to real market stock.'
approach: 'Engineered an automated pipeline pairing EPREL with an EU-funded market API, powered by a brand/model-to-GTIN entity resolution engine.'
outcome: 'Automated entity resolution mapping thousands of products, enabling live tracking of retail prices, actual stock availability, and labeling consistency.'
pillar: entity-resolution
---

While the European Union maintains robust databases for product certification, market realities move much faster. The official European Product Registry for Energy Labelling (EPREL) holds certified declarations from manufacturers, but consumers purchase products based on commercial names, retailer SKUs, and retail promotions.

## The Challenge

Connecting regulatory data with real-world sales data was historically nearly impossible:

- **Identifier Fragmentation:** Manufacturers register an internal model code in EPREL, but market the same appliance under different retail names, bundle packages, or regional trade codes.
- **Missing Barcodes:** Retail sites and scrapers frequently lack GTIN/EAN barcodes, preventing simple database joins against official filings.
- **Market Invisibility:** Regulators and efficiency programs could not easily answer fundamental policy questions: _Are the high-efficiency products certified in EPREL actually in stock in retail stores? Are their advertised energy labels accurate?_

## The Architecture

To solve this, I designed and developed **Topten Scout**, an observability platform that continuously maps and monitors the retail market:

- **Dual-Stream Data Ingestion:** Synchronizes regulatory specifications from EPREL with real-time catalog feeds from a modern EU-funded market data API.
- **Algorithmic Entity Resolution Engine:** Implemented string tokenization, normalized brand/model cleaning heuristics, and probabilistic matching algorithms that link unstandardized commercial product names back to verified **GTIN / EAN** identifiers.
- **Discrepancy Engine:** Compares the declared energy label and consumption metrics stored in EPREL against the live specifications displayed across major retail portals, flagging discrepancies automatically.
- **Observability Dashboard:** Delivers dynamic charts showing the market share of each energy efficiency class across active retail inventory, tracking price evolutions and model phase-outs over time.

## Measurable Impact

- **Bridge Built:** Closed the gap between theoretical EU compliance filings and actual retail shelves across major European markets.
- **Scale:** Automated the matching of thousands of products that previously required laborious manual catalog cross-referencing.
- **Actionable Intelligence:** Provides NGOs, energy agencies, and policy analysts with factual, real-time evidence on how quickly cleaner technologies penetrate the consumer market.
