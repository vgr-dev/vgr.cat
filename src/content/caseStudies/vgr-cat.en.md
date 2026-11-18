---
translationKey: vgr-cat
locale: en
title: 'vgr.cat: a trilingual site built with a reviewed, AI-assisted process'
summary: 'A small multilingual marketing site with a contact form, a Content Security Policy and accessibility requirements, built and documented in public.'
problem: 'The site needed three languages, a spam-protected contact form, a Content Security Policy and accessibility requirements, without adding a CMS or a framework the maintainer would have to operate.'
approach: 'Astro statically generates the site for Cloudflare Workers assets, with the contact endpoint in a small Worker. The repository contains plans, decisions and verification notes. CI covers types, lint, accessibility and dictionary parity on pull requests and pushes to main; a deploy dry-run is an additional local check.'
outcome: 'The site is live in English, Spanish and Catalan. The repository shows the process, decisions and checks, and keeps earlier planning records available.'
pillar: build
---

vgr.cat is my own site: a small multilingual marketing site with a contact form, security and
accessibility requirements, maintained by me.

## Problem

The site needed three languages, a spam-protected contact form, a Content Security Policy and
accessibility requirements, without adding a CMS or a framework the maintainer would have to operate.

## What I built

Astro statically generates the site for Cloudflare Workers assets, with the contact endpoint in a
small Worker. The repository contains plans, decisions and verification notes. Automated checks cover
types, lint, accessibility and dictionary parity across languages. CI runs on pull requests and pushes
to main; the deploy dry-run is an additional local check. Earlier planning records remain in
`.ai/plans/archive/` as read-only history; the current `specs/` structure was adopted later.

## Result

The site is live in English, Spanish and Catalan. The repository shows the process, decisions and
checks, and keeps earlier planning records available, so another engineer can follow the work.
