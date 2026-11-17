# Proposed English copy

Draft for review. Items in `[brackets]` depend on the open questions in `spec.md`. Every number used
here appears in the CV; nothing new has been invented.

Voice rules applied throughout: first person, plain verbs, no "leveraging / bespoke / seamless /
cutting-edge", metrics only where they are sourced, one idea per sentence.

---

## Home page order

1. Hero
2. Services (4 cards)
3. **How I work** (new)
4. Selected work (case studies)
5. **Ways to engage** (new)
6. About teaser
7. CTA band + contact

The two new sections sit next to the things they explain: the method beside the services, the
engagement models after the evidence.

---

## Site meta

- **title:** `Victor Gonzalez | Senior Full-Stack Engineer & Fractional Tech Lead`
- **author:** `Victor Gonzalez`
- **description:** `Senior full-stack engineer and fractional tech lead near Barcelona. I build, modernise
  and run production web platforms, using AI agents inside a reviewed, spec-driven process. 12+ years,
  specialised in energy and EU product data.`
- **jobTitle:** `Senior Full-Stack Engineer & Fractional Tech Lead`

## Hero

- **badge:** `Barcelona · remote across the EU · English, Spanish, Catalan`
- **title:** `Production software, built fast`
- **titleHighlight:** `and reviewed line by line`
- **subtitle:** `I'm a senior full-stack engineer and fractional tech lead. I use AI agents to write code
  faster, inside a spec-driven process where I approve every plan and review every change before it ships.
  You get the speed without the code nobody can maintain.`
- **ctaPrimary:** `Book a 30-min call`
- **ctaSecondary:** `See how I work`
- **metrics:**
  - `12+` · `Years shipping software for clients, remotely`
  - `1.5M+` · `Monthly visitors on the 17 production sites I run, at 99.99% uptime`
  - `200+` · `Bank branches I instrumented with IoT energy monitoring`

## Services

- **eyebrow:** `Services`
- **title:** `What I can take off your plate`
- **subtitle:** `One senior engineer across the whole path: the spec, the code, the infrastructure and
  the handover.`

### 1. `build` — New products and internal tools

- **summary:** `MVPs, customer portals, back-office tools, APIs and data pipelines: from a written spec
  to software in production, in weeks rather than quarters.`
- **body:**

  Most companies don't need a team of ten to get a working product. They need someone who can turn a
  vague requirement into a clear spec, build it, and put it in production without cutting corners.

  - **Spec first:** in the first days we agree, in writing, what "done" means. You approve it before any
    code is written.
  - **Working software early:** small, reviewed increments you can click through, not a big reveal at the
    end.
  - **Full stack:** TypeScript, PHP or Python on the server; Vue, React or Astro on the front; the
    database, the deployment and the monitoring included.
  - **Built for whoever comes next:** tests, written decisions and a repository your team can pick up
    without me.

### 2. `modernize` — Legacy modernisation and rescue

- **summary:** `The application your business depends on and nobody wants to touch: upgraded, tested and
  deployable again, without a risky rewrite.`
- **body:**

  Many companies run on a PHP or Python application written years ago by someone who has left. It works,
  until it doesn't. A rewrite is rarely the answer.

  - **Assessment:** I read the code, map the risks and give you a written, prioritised plan.
  - **Safety net first:** tests around the parts that matter, then CI so every change is checked.
  - **Incremental upgrades:** Laravel, Symfony, Yii, Django or Node versions moved forward step by step,
    with the application running throughout.
  - **Containers and deployment:** from "copied over FTP" to repeatable builds and one-command deploys.

  AI agents are very good at reading old code and drafting tests for it. I use them for that, and I
  review what they produce.

  Example: I'm moving Topten from its legacy Yii2 platform to a new Laravel CMS, one country at a time;
  Topten.ch is already live on it.

### 3. `platform` — Platform reliability and operations

- **summary:** `Hosting, caching, monitoring, security and CI/CD for sites that cannot go down. I run 17
  production sites at 99.99% annual uptime today.`
- **body:**

  If your platform matters to revenue, someone should own it. For many teams a full-time platform
  engineer is too much; a part-time senior one is not.

  - **Observability:** Grafana and Prometheus dashboards and alerts that tell you about a problem before
    your customers do.
  - **Performance and caching:** tiered caching and CDN configuration for traffic peaks.
  - **Security:** headers, dependency updates, secrets handling, access reviews.
  - **CI/CD:** GitHub Actions or GitLab CI pipelines that test and deploy every change the same way.
  - **Cost:** infrastructure sized to the traffic you actually have, on AWS, Cloudflare or plain Linux.

### 4. `energy` — Energy and EU product-data engineering

- **summary:** `Twelve years in energy efficiency: EU product regulation (Ecodesign, Energy Labelling,
  ESPR and the Digital Product Passport), energy monitoring and bill analytics.`
- **body:**

  This is where I have the deepest domain knowledge. If your product or your data touches EU energy
  regulation, I already speak the language.

  - **ESPR and Digital Product Passport readiness:** for manufacturers and retailers, organise the product
    data you already have so it can meet upcoming DPP requirements.
  - **Regulation in code:** energy-class thresholds, tolerances and calculation rules implemented as
    tested, versioned code instead of spreadsheets.
  - **Energy monitoring:** IoT metering from circuit to dashboard, including remote control, proven across
    200+ bank branches.
  - **Bill analytics:** tooling that reads and analyses energy bills automatically, processing 1,000+
    bills a month across my current clients.

  (Per D3: no product search, retailer data, procurement exports, market monitoring or EPREL plus
  market-data integration. Those belong to EPREL Services.)

## How I work (new section)

- **eyebrow:** `How I work`
- **title:** `AI does the typing. I stay accountable.`
- **subtitle:** `AI coding agents make a senior engineer much faster, and they make mistakes. My process
  keeps the speed and catches the mistakes.`
- **steps:**
  1. **Spec** — `We write down the goal, the scope and how we'll know it's done. You approve it.`
  2. **Plan** — `I break the work into small steps. You can see the plan before any code exists.`
  3. **Build** — `AI agents draft code and tests, one step at a time. Each step passes an automated gate:
     types, lint, tests, accessibility, build.`
  4. **Review** — `I review every change. Nothing ships that I haven't read, and every commit is signed.`
  5. **Hand over** — `Specs, decisions and verification logs live in your repository, so your team, or
     the next engineer, can continue without me.`
- **proof line:** `This website was built this way, and its repository is public: specs, architecture
  decisions and verification logs included.` → link `github.com/vgr-dev/vgr.cat`

## Selected work

- **eyebrow:** `Selected work`
- **title:** `Systems in production`
- **subtitle:** `Platforms I built or run, for clients in Switzerland, the EU and Chile.`
- **labels:** `Problem` · `What I built` · `Result`

Order and retitling:

1. **Topten platform** (pillar `platform`) — `Topten: architecting and running a European product
   platform through two owners`. Facts (D8): I architected the Topten.eu platform on Yii2, which still
   runs Topten.eu and most partner sites, and then a new Laravel CMS, live on Topten.ch and being rolled
   out to other countries. The fleet: 17 production sites, 1.5M+ unique visitors and 5M+ pageviews a
   month, 99.99% uptime, tiered caching, observability, automated failover. The story is continuity:
   built with VGR SpA in partnership with Bush Energie, carried through Topten becoming its own company
   and its sale to Brandes Energie, and now run in-house. Drop the unsourced metrics.
   - **Problem:** `National Topten sites across Europe, each with its own criteria, languages and
     content, running on one ageing platform that had to keep serving traffic while it was replaced.`
   - **What I built:** `The shared Yii2 platform behind Topten.eu and its partner sites; then a new
     Laravel CMS, launched on Topten.ch, designed so other countries can move onto it one at a time.
     Underneath: tiered caching, monitoring and automated failover.`
   - **Result:** `17 production sites, 1.5M+ visitors and 5M+ pageviews a month, 99.99% uptime, and a
     migration path that moves country by country instead of a big-bang rewrite.`
   - Cross-link from the `modernize` service: `Example: moving Topten from a legacy Yii2 platform to
     Laravel, one country at a time.`
2. **This website** (new, pillar `build`) — `vgr.cat: a trilingual site built with AI agents and a
   reviewed spec process`. Problem: a consultant site in three languages, with a contact form, strict
   security and accessibility, and a solo maintainer. What I built: Astro on Cloudflare Workers; specs,
   plans and progress logs per change; an automated gate (type checks, 34 accessibility lint rules,
   dictionary parity across languages, deploy dry-run); signed commits and a strict Content Security
   Policy. Result: state facts only (37 pages in 3 languages, gate on every push, public history). Avoid
   claiming build-time numbers you haven't measured.
3. **Market-surveillance tooling** (pillar `energy`) — `Turning EU energy regulation into code for
   product inspectors`. Keep the substance (D9):
   - **Result:** `Checks that inspectors did by hand in spreadsheets now run automatically, so their time
     goes to the products that look wrong. Every result is reproducible: it records the input data, the
     formula version and the calculation behind it.`
   - Remove "days to minutes", "hours to seconds" and "legally defensible".
4. **Banco Estado IoT** (pillar `energy`) — `Energy monitoring across 200+ branches of Chile's public
   bank`. Content is good; name Banco Estado and Fundación Chile, shorten the intro.

Topten Scout is dropped (D4). The bill analytics stay a line in the `energy` service (D5).

## Ways to engage (new section)

- **eyebrow:** `Ways to work together`
- **title:** `Three ways to start`
- **items:**
  - **Audit or second opinion** — `One to two weeks. I review your code, infrastructure or plan and give
    you a written report with priorities. A low-risk way to see how I work.` · `€2,500 fixed`
  - **Project** — `A build or modernisation. We start with a two-day paid spec (€1,280) that ends in a
    fixed quote; if you go ahead, the spec fee is deducted. Delivered in reviewed increments.` ·
    `€640 per day`
  - **Fractional tech lead** — `Four days a month as your part-time tech lead or platform engineer, for
    teams without a senior engineer in-house. Three-month minimum, then a month's notice.` ·
    `€2,400 per month`
- **price note:** `Prices exclude VAT. No hidden extras: hosting and third-party services are billed at
  cost, and agreed up front.`
- **footnote:** `Remote across the EU; on site in the Barcelona area. I work in English, Spanish and
  Catalan.`

## About

- **eyebrow:** `About`
- **title:** `Engineer, former founder, remote by default`
- **paragraphs:**
  1. `I'm Victor Gonzalez, a senior full-stack engineer based in Sant Cugat del Vallès, near Barcelona.
     I've been shipping software remotely for more than twelve years. Today I lead the platform for
     Topten, part of Brandes Energie (Switzerland): a fleet of 17 production websites serving over 1.5
     million visitors a month at 99.99% uptime. I also advise energy consultancies in Chile.`
  2. `Before that, I ran VGR SpA, my own software consultancy in Chile. I grew it to a team of three to
     four engineers and $20k+ in monthly revenue, with five long-term clients and a recurring partnership
     with Bush Energie in Switzerland. When Topten became its own company and was later sold to Brandes
     Energie, I carried the platform through both changes. Running a business taught me what clients
     actually care about: budgets, deadlines, and someone who answers the phone.`
  3. `I'm a generalist by choice. PHP, Python and TypeScript are my main languages; I also work in Go, and
     have used C#, Rust and Java. I'm as comfortable in a Laravel codebase as in a Grafana dashboard or a
     Kubernetes cluster.`
  4. `Since August 2025 I've built with AI coding agents every day. What I've learnt is that they make a good
     engineer much faster and an unsupervised one dangerous. My process is designed around that.`
  5. `Most of my career has been in energy efficiency and sustainability, from IoT metering in bank
     branches to EU product regulation. It's my specialism, and the reason I care about software that
     is efficient to run, not only to write.`
- **experience:**
  - `2025 — present` · `Lead Platform Engineer & Consultant` · `Topten GmbH / Brandes Energie (CH) ·
    Negawatt SpA (CL)` · `17 production sites, 1.5M+ monthly visitors, 99.99% uptime.`
  - `2017 — 2025` · `Founder & Team Lead` · `VGR SpA (CL)` · `Team of 3–4 engineers, 5+ long-term
    clients, recurring partnership with Bush Energie (CH).`
  - `2014 — 2017` · `Software Engineer` · `Fundación Chile` · `IoT and energy-efficiency platforms for
    Banco Estado, the Ministry of Energy and others.`

  (Per-role titles stay as they were; the headline title is D2.)
- **competencies:** regroup into `Build` (TypeScript, PHP, Python, Go; Laravel, Symfony, Django, Node;
  Vue, React, Astro, Tailwind), `Run` (AWS, Cloudflare, Docker, Kubernetes, GitHub Actions, GitLab CI,
  Grafana, Prometheus, Linux), `Lead` (spec-driven AI-assisted delivery, remote project management,
  PMBOK diploma, client relationships), `Domain` (EPREL, Ecodesign, ESPR / DPP, IoT energy monitoring).
- **teaser:** `Senior full-stack engineer near Barcelona and former founder. Twelve years of remote
  delivery; today I run 17 production sites at 99.99% uptime and build with AI agents inside a reviewed,
  spec-driven process.`


## CTA band

- **title:** `Something to build, fix or keep running?`
- **body:** `Tell me about it in a few lines. I reply personally within two business days.`
- **primary:** `Book a 30-min call` · **secondary:** `See selected work`

## Contact

- **eyebrow:** `Contact`
- **title:** `Tell me what you need`
- **subtitle:** `Projects, audits and part-time tech-lead roles, remote across the EU or on site around
  Barcelona. English, Spanish or Catalan.`
- **serviceTypes:** `New product or internal tool` · `Legacy modernisation` · `Platform reliability /
  operations` · `Energy or EU product data` · `Audit, second opinion or something else`
- **organizationPlaceholder:** `Company or organisation`
- **messageLabel:** `What are you trying to do?`
- **locationLabel:** `Based in` (replaces "Headquarters")

## Footer

- **tagline:** `Senior full-stack engineer and fractional tech lead near Barcelona. Fast, AI-assisted
  delivery, reviewed by a human.`
- **builtWith:** `Built with Astro and Tailwind using a spec-driven AI workflow. Source on GitHub.`
