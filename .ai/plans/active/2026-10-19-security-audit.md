# Security Audit Summary

- **Overall risk rating: LOW–MEDIUM.** No confirmed critical or directly exploitable vulnerability was found in the application code. The only High-severity item is a CI/CD privilege-boundary weakness whose exploitability depends on GitHub settings that a repository-only audit cannot read.
- **Audit type:** read-only security and software-supply-chain audit. No files were modified, nothing was deployed, no production endpoint was contacted, and no secret was read, printed, or transmitted.
- **Audit date:** 2026-10-19. Working tree clean (`git status --short` → empty).

## Audit scope

In scope and reviewed line-by-line:

| Area | Files |
| --- | --- |
| Worker / endpoint | `src/worker/index.ts` (entire file, 216 lines) |
| Contact form client | `src/components/ContactForm.astro` |
| Page/layout rendering | `src/layouts/BaseLayout.astro`, `src/pages/**`, `src/components/**` |
| Content rendering | `src/content.config.ts`, `src/content/**/*.md` |
| Build-time constants | `src/config.ts`, `src/i18n/**` |
| CSP / build config | `astro.config.mjs` |
| Cloudflare config | `wrangler.jsonc`, `public/_headers` |
| CI/CD | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml` |
| Build scripts | `scripts/check-placeholders.mjs`, `scripts/check-production-env.mjs` |
| Supply chain | `package.json`, `package-lock.json` (560 packages), installed `node_modules` metadata |
| Built artifact | `dist/**` (existing local build) |
| Repo hygiene | `.gitignore`, `.vscode/*`, `public/robots.txt`, git history |

Out of scope by construction: Cloudflare zone/dashboard settings, GitHub repository settings (environment
protection rules, fork-PR policy, secret scanning, CodeQL enablement), the Turnstile sitekey's configured
domain list, and the e-mail provider's MIME serialisation. These are listed in finding **I-11**.

## Important limitations

1. **No production traffic was generated.** The audit is static plus local build-artifact inspection. The
   contact happy path and the anti-bot chain were **not** re-executed in this session; the repository's own
   recorded evidence (`.ai/plans/archive/…`, `AGENTS.md`) was used where a production measurement was
   needed, and is labelled as such.
2. **No `wrangler deploy --dry-run` was run.** Architect-mode constraints forbid build/mutate commands, and
   `wrangler deploy --dry-run` writes `.wrangler/dry-run`. The committed `dist/` from a prior build was
   inspected instead.
3. **Two findings depend on settings a repository audit cannot read** — H-1 (GitHub environment protection /
   fork-PR policy) and M-1 (the inert dashboard rate-limit rule). Both are labelled with reduced confidence.
4. **`npm audit` requires a network call.** It uploads only the dependency graph to npm's public,
   unauthenticated advisory endpoint; it does not mutate the repository, authenticate, or deploy.
5. **One dependency-vulnerability claim is a negative result.** `npm audit` reporting zero does not cover
   advisories published after 2026-10-19, nor unpublished/hallucinated packages, nor non-CVE supply-chain risk.

### Verification log

```console
$ git status --short
                                    # empty: clean working tree
$ node -e "...versions..."
astro 7.4.0
wrangler 4.151.1
@astrojs/sitemap 3.7.4
@tailwindcss/vite 4.3.3
eslint 10.13.0
typescript 6.0.3
prettier 3.9.10

$ npm audit --json | ...
vulnerabilities: {"info":0,"low":0,"moderate":0,"high":0,"critical":0,"total":0}
advisories: none

$ grep -o '"resolved": "https?://[^/]*' package-lock.json | sort | uniq -c
    559 "resolved": "https://registry.npmjs.org
# 0 non-registry / git / file: / link: resolutions; lockfileVersion 3

$ node -e "...hasInstallScript..."
node_modules/esbuild 0.28.2
node_modules/fsevents 2.3.3
node_modules/workerd 1.20261012.1

$ find dist -name '*.map' -o -name '*.dev.vars' -o -name '.env*'
                                    # empty: no source maps, no env files in the artifact
$ grep -rIl -E 'TURNSTILE_SECRET_KEY|CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID|1x0000000000000000000000000000000AA' dist
                                    # empty: no secret identifiers in the artifact

$ grep -c "unsafe-inline\|unsafe-eval" dist/index.html
0

$ for f in dist/**.html …; do grep -c 'content-security-policy' "$f"; done
dist/index.html: 1
dist/404.html: 1
dist/ca/index.html: 1
dist/es/index.html: 1
dist/contact/thanks/index.html: 1
dist/ca/contact/thanks/index.html: 1
dist/es/contact/thanks/index.html: 1

$ git log --all --oneline --name-only -- .dev.vars '.dev.vars*' '.env' '.env.*'
                                    # empty: no environment file was ever tracked
$ git log -5 --format='%h %G? %s'
6d2d0c5 G chore: finalize plans
a012c81 G docs: close pending tasks
c85d3e8 G chore(deps): migrate lint stack to ESLint 10 and eslint-plugin-astro v3
ebeeea6 G fix(i18n): correct language and gramatical errors
28ca321 G docs(plans): archive the i18n content-model plan and record the gate
                                    # all signed (G); 46 commits total

$ grep -rnE '<[a-zA-Z/][^>]*>' src/content
                                    # empty: no raw HTML in content markdown
$ ls src/middleware.ts
no src/middleware.ts                # no Astro middleware exists
$ grep -nE 'workers_dev|preview_urls|compatibility_flags|limits|triggers' wrangler.jsonc
                                    # none declared
```

### Cloudflare API verification (2026-10-19, read-only)

Account `VGR SpA Domains` (`94b2d5ba6453a558df79f8e77b02942b`), zone `vgr.cat`
(`cde2a5cda4abb8c41587e343c2c487cc`). Read-only `GET`s only; no mutation, no request to a live hostname, and no
secret value was read or printed.

```console
$ GET /zones/{zone}/settings          → ssl=strict, min_tls_version=1.0, always_use_https=on, tls_1_3=on,
                                        security_header.strict_transport_security.enabled=false,
                                        cache_level=aggressive, browser_cache_ttl=14400, development_mode=off
$ GET /zones/{zone}/rulesets          → http_request_sanitize, http_request_firewall_managed (managed free v74),
                                        ddos_l7, http_request_dynamic_redirect (zone v1), http_ratelimit (zone v1)
                                        — NO http_request_cache_settings, NO http_request_firewall_custom
$ GET /zones/{zone}/rulesets/05d3061297a5476f91ff8f0c91b4c46b
  → rule "Contact Rate Limit", action=block, enabled=true,
    expression: http.request.uri.path eq "/api/contact",
    ratelimit: { characteristics: [ip.src, cf.colo.id], requests_per_period: 5, period: 10,
                 mitigation_timeout: 10 }
$ GET /zones/{zone}/rulesets/a6089f82e5914e45acbd3db0ad7a5a32
  → single 301 rule: (http.request.full_uri wildcard r"https://www.*"), preserve_query_string
$ GET /zones/{zone}/workers/routes   → only { pattern: "vgr.cat", script: "vgr-cat" }  (no wildcard route)
$ GET /accounts/{id}/workers/scripts/vgr-cat/settings
  → bindings: ASSETS(assets), CONTACT_DESTINATION(plain_text), NOTIFY(send_email), REPLY(send_email),
               TURNSTILE_HOSTNAMES(plain_text), TURNSTILE_SECRET_KEY(secret_text)
  → observability: enabled=true, head_sampling_rate=1, redact_query_string=false,
                   logs={enabled:true, persist:true, invocation_logs:true, head_sampling_rate:1}, traces.disabled
  → workers_dev / previews_enabled / preview_urls: absent from the payload (not asserted false)
  → tail_consumers: 0, logpush: false
$ GET /accounts/{id}/challenges/widgets → sitekey 0x4AAAAAAFX7NYXtXTGajTgb ("vgr.cat (Spin)"), mode=managed,
                                          domains=[127.0.0.1, localhost, vgr.cat], bot_fight_mode=false
$ GET /zones/{zone}/dns_records      → no "*" wildcard record; apex AAAA=100:: proxied (Worker sentinel);
                                        www CNAME→vgr.cat proxied; MX vgr.cat→smtp.google.com
$ GET /accounts/{id}/workers/subdomain → vgr-spa-domains
```

**Not verified:** live HTTP headers, live CSP behaviour, the *behaviour* of the edge rate limit (exercising it
would mean probing production, which this audit forbids), `workers_dev` / preview-URL exposure (the settings
payload simply omits those keys — proving exposure needs a request to a live hostname), GitHub environment
protection rules and fork-PR policy, the Cloudflare API token's scope (`GET /user/tokens` → `9109
Unauthorized`), and e-mail authentication (SPF/DKIM/DMARC records were listed by name only and were not
assessed).

## Counts by severity

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 9 |
| Informational | 12 |

**Corrections, 2026-10-19 (after live read-only Cloudflare API verification).** The corrections below leave the
original numbers in place rather than overwriting them.

1. The table as first written said *Medium 3 / Low 6*. That `Low 6` was itself an arithmetic error — findings
   L-1 through L-7 are **seven**. Corrected counts before the API review were therefore
   Critical 0 / High 1 / Medium 3 / Low 7 / Informational 11.
2. The API review **demoted M-1 from Medium to Low** (an enabled, correctly-phased edge rate limit exists — see
   the Correction note under M-1) and added **L-8** (`min_tls_version: 1.0`) and **I-12** (Turnstile widget
   allows `localhost`). Current totals: Critical 0 / High 1 / Medium 2 / Low 9 / Informational 12.

## Was a production-compromise path identified?

**Not confirmed.** One *conditional* path was identified (H-1): if GitHub's `workflow_run` branch filter
admits a `pull_request`-origin `CI` run, a passing PR build would be checked out and deployed by the job that
holds `CLOUDFLARE_API_TOKEN`, giving an attacker write access to the production Worker. The application code
itself contains no path to credential theft, RCE, or data exposure.

---

# Architecture and Attack Surface

## Rendering and deployment model

- **Astro 7.4.0**, `output: 'static'`, **no adapter**. Seven pages are prerendered at build time; there is no
  SSR, no Astro Actions, and **no `src/middleware.ts`** (verified).
- **Deployment:** Cloudflare Workers *Static Assets* — Wrangler uploads `dist/` verbatim as assets and also
  ships one Worker script (`main: ./src/worker/index.ts`).
- **Routing is asset-first.** `assets.run_worker_first: ["/api/*"]` is the only reason the Worker sees
  browser form POSTs; every other request that matches an asset never reaches JavaScript.
- **Custom domain only:** `routes: [{ pattern: "vgr.cat", custom_domain: true }]`. `workers_dev` and
  `preview_urls` are not declared, so per Wrangler's documented default they are disabled when `routes`
  exists (inference — see I-11).
- **No client framework, no CMS, no database, no auth.** No cookies, no sessions, no tokens, no CORS
  responses, no redirects derived from user input, no file uploads, no dynamic imports of user-supplied paths.

## Entry points

| Entry point | Method | Handler | Untrusted input |
| --- | --- | --- | --- |
| `/api/contact` | POST | `contact()` in `src/worker/index.ts` | Full form body: `name`, `email`, `organization`, `message`, `serviceType`, `lang`, `elapsed`, `form_guard`, `cf-turnstile-response` |
| `/api/*` (other) | any | falls through to `env.ASSETS.fetch` → 404 page | URL path |
| Every prerendered page | GET | static asset layer | none (no query-string or path-derived output) |
| Unknown path | GET | `404-page` handling + client-side re-localisation script | first path segment (compared against a fixed allowlist) |

## Trust boundaries and data flow

```
Visitor browser
  │  (1) HTML form + hidden lang/elapsed + honeypot + Turnstile widget
  │      src/components/ContactForm.astro  (client validation = UX only)
  ▼
POST /api/contact  ──►  Cloudflare edge (Worker invoked because of run_worker_first)
  │                        │
  │                        ├─ request.formData()        ← NO body-size limit
  │                        ├─ honeypot / elapsed gate    ← client-controlled, friction only
  │                        ├─ per-field trim + length + CRLF rejection
  │                        ├─ EMAIL_RE format check
  │                        ├─ serviceType → fixed label map (allowlist)
  │                        └─ Turnstile Siteverify: success + action=contact + hostname∈TURNSTILE_HOSTNAMES
  │                             (fail-closed on missing secret, empty allowlist, timeout, non-2xx)
  ▼
Email Service bindings
  ├─ NOTIFY → pinned destination contact@vgr.cat     (notification, includes visitor text)
  └─ REPLY  → attacker-supplied `email`              (static auto-reply text, arbitrary recipient)
  ▼
303 Location: /{lang}/contact/thanks   (from a fixed map — no open redirect)
  │
  └─ Workers Logs (observability.enabled: true)
        console.warn('siteverify rejected', {action, hostname, codes})   ← no token/secret
        console.error('contact delivery failed', error)                  ← may include recipient address
```

Build/deploy chain:

```
git push / PR
  → CI (permissions: contents:read; no secrets; npm ci → format → check → lint → placeholders → build)
      → upload-artifact dist (7 days)
  → Deploy (workflow_run on "CI" completed && conclusion==success, branches: [main])   ← see H-1
      → checkout workflow_run.head_sha
      → npm ci → check:production-env → wrangler types → build
      → cloudflare/wrangler-action@v4 with CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
      → production Worker + assets
```

## Security controls verified as present and correctly enforced server-side

- Turnstile is genuinely enforced **server-side** with all three gates (`success`, `action === 'contact'`,
  `hostname ∈ allowlist`), and it **fails closed** on a missing secret, an empty hostname allowlist, a
  non-2xx Siteverify response, or a timeout (`AbortSignal.timeout(10_000)`). The token is length-capped
  (2048) and single-use at Cloudflare.
- CRLF rejection covers every field that reaches a mail header (`name`, `email`, `organization`) and the body.
- `serviceType` is a lookup into a fixed map — no reflection of arbitrary input.
- The redirect target is a fixed per-locale map; no user-controlled redirect.
- Client-side validation is explicitly *not* the boundary (`checkValidity()` only avoids a network round trip).
- No `set:html`/`innerHTML` anywhere except one JSON-LD block built from trusted build-time data.
- No `unsafe-inline` / `unsafe-eval` in the shipped CSP; every page carries a per-build hash-based CSP.
- No source maps, no `.env`/`.dev.vars`, no secret identifiers in `dist/`.
- No secret ever entered git history; `.dev.vars`/`.env*` are gitignored.
- CI holds **no** secrets and `permissions: contents: read`; deployments rebuild from the CI-validated SHA.

---

# Findings

## [H-1] Deploy gate accepts any `CI` run that matches `branches: [main]` — no assertion on the triggering event or repository

- **Severity:** High
- **Confidence:** Medium — the workflow logic is directly verified; the deciding factor is GitHub's
  `workflow_run.branches` evaluation for `pull_request`-origin runs plus repository settings that cannot be
  read from the repository.
- **Category:** CI/CD privilege boundary / untrusted-code checkout (`workflow_run` injection)
- **CWE:** CWE-345 (Insufficient Verification of Data Authenticity), CWE-829 (Inclusion of Functionality from
  Untrusted Control Sphere), CWE-284 (Improper Access Control)
- **Affected files:** `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`
- **Affected lines or symbols:** `deploy.yml:12-15` (`on.workflow_run.workflows/branches`), `deploy.yml:29`
  (job `if:`), `deploy.yml:41` (`ref: ${{ github.event.workflow_run.head_sha || github.sha }}`),
  `deploy.yml:31` (`environment: production`), `deploy.yml:58-60` (the token-bearing step); `ci.yml:2-5`
  (`CI` triggers on `pull_request` unrestricted).
- **Attack preconditions:**
  1. The attacker can open a pull request whose `CI` run concludes `success` (trivial — they control the code
     and `CI` only builds/tests it), **and**
  2. that run's head branch evaluates as `main` under the `branches: [main]` filter (the classic case is a fork
     PR opened from a branch literally named `main`), **and**
  3. fork-origin workflows run for this repository (automatic for a public repo; opt-in for a private one), **and**
  4. the `production` environment has no required-reviewer rule (automatic deploys after every successful
     `CI` imply it does not).
- **Evidence:**
  `ci.yml` runs on every `pull_request` with no `branches` filter. `deploy.yml` consumes the completion of any
  workflow named `CI` on `branches: [main]`, gates only on `conclusion == 'success'`, then checks out
  `github.event.workflow_run.head_sha` — an attacker-authored commit under that hypothesis — and hands
  `secrets.CLOUDFLARE_API_TOKEN` to `cloudflare/wrangler-action@v4`. There is **no**
  `github.event.workflow_run.event == 'push'` check and **no**
  `github.event.workflow_run.head_repository.full_name == github.repository` check.
  GitHub's own documentation warns for this trigger: *"Running untrusted code on the `workflow_run` trigger may
  lead to security vulnerabilities."*
- **Exploit or failure scenario:** Attacker forks the repo, pushes `main` with a modified
  `src/worker/index.ts` (or a `postinstall` script, or a `dist`-shaping build step), opens a PR. `CI` builds it
  and the run concludes `success`. If the branch filter admits it, `Deploy` starts, checks out the attacker's
  SHA, and `wrangler deploy` publishes it to `vgr.cat`. The attacker can redirect the contact form's mail,
  exfiltrate visitor messages to their own address, or ship arbitrary script on the production origin.
- **Impact:** Production artifact tampering and a persistent malicious Worker on the apex domain. The
  Cloudflare API token itself is not exfiltrated by `wrangler-action` unless the shipped code does so at
  runtime (secrets live in Cloudflare, not in the bundle), so blast radius is the deployed site plus whatever
  the token's scopes permit if a build step reads it from `INPUT_*`/env — `wrangler-action` exposes the token
  to its own step's environment, where a compromised `node_modules` package could read it.
- **Existing controls:** `conclusion == 'success'` gate; checkout pinned to `head_sha` (stops a mid-run push
  from being deployed unverified); `permissions: contents: read`; `environment: production` exists as a hook
  for protection rules; `cancel-in-progress: false` prevents half-finished deploys.
- **Recommended remediation:** make the trust decision explicit in the job `if:` —
  `github.event_name == 'workflow_dispatch' || (github.event.workflow_run.event == 'push' && github.event.workflow_run.head_branch == 'main' && github.event.workflow_run.head_repository.full_name == github.repository && github.event.workflow_run.conclusion == 'success')`
  — and add required reviewers to the `production` environment as a second, independent gate.

## [M-1] No *global* abuse ceiling on `POST /api/contact`; e-mail amplification to arbitrary recipients is bounded only per-IP at the edge

- **Severity:** **Low** (demoted from Medium on 2026-10-19 after live API verification — see the Correction note
  below; the `M-1` ID is retained for traceability with the audit and the remediation plan)
- **Confidence:** High for the code path and for the current zone state; the *behaviour* of the edge rule was
  not exercised (that would require probing production).
- **Category:** Abuse prevention / resource exhaustion / e-mail amplification
- **CWE:** CWE-770 (Allocation of Resources Without Limits), CWE-799 (Improper Control of Interaction Frequency)
- **Affected files:** `src/worker/index.ts`, `wrangler.jsonc`
- **Affected lines or symbols:** `contact()` (`src/worker/index.ts:132-213`); `env.NOTIFY.send` (`:185`),
  `env.REPLY.send` (`:194`); `send_email` bindings (`wrangler.jsonc:24-30`).
- **Attack preconditions:** Solve the Turnstile challenge (managed mode is not a hard barrier for a motivated
  or paid attacker, and the widget is public); repeat.
- **Evidence:** the Worker contains no counter, no KV/Durable-Object rate-limiter binding, no
  `RateLimit` binding, and no per-IP throttle. `wrangler.jsonc` declares only `send_email` bindings,
  `vars`, and `assets`.
- **Correction (2026-10-19):** this finding originally asserted there was **no** rate limiting anywhere,
  citing the project's records (`AGENTS.md`; `src/worker` review notes) that the "Contact Rate Limit" rule sat
  in the inert `dynamic-redirect` phase. The live API read shows that record is **stale**: ruleset
  `05d3061297a5476f91ff8f0c91b4c46b` is in phase **`http_ratelimit`**, version 1, and its rule is enabled —
  `action=block` on `http.request.uri.path eq "/api/contact"`, 5 requests per 10 s per `(ip.src, cf.colo.id)`,
  `mitigation_timeout: 10`. The `dynamic-redirect` ruleset now holds only the www→apex 301. Genuine residual
  gaps, which is what keeps this finding alive at Low: the rule is **per-IP**, so a distributed attacker with
  many source addresses is unconstrained; there is **no global ceiling** on outbound mail; and the rule exists
  only in the dashboard, so no repository check can regress-test it — it has already drifted once.
- **Exploit or failure scenario:** An attacker solves one challenge then loops the endpoint. Every pass
  produces (a) a notification to `contact@vgr.cat` (inbox flood / notification fatigue) and (b) an outbound
  message **to an arbitrary address of the attacker's choosing** via the deliberately unrestricted `REPLY`
  binding, with a static body. Used against a harvested address list this is an outbound-mail relay with the
  domain's reputation at stake and no ceiling on volume.
- **Impact:** Outbound-mail reputation damage and potential blocklisting of `vgr.cat`; inbox exhaustion;
  unbounded Workers invocations and Email Service usage. Not confidentiality-integrity breaking.
- **Existing controls:** an **enabled, correctly-phased edge rate limit** (5 req / 10 s per IP+colo, 10 s
  mitigation — verified 2026-10-19) is the effective volume limit; Turnstile (server-verified, three gates)
  limits automation; honeypot (`form_guard`, `:142`) and elapsed-time (`MIN_ELAPSED_MS`, `:144`) are advisory.
  `NOTIFY` is destination-pinned, which bounds the *inbound* target but not volume.
- **Recommended remediation:** treat the repository-side limiter as **defence in depth, not a missing
  control** — add a `ratelimits` binding in `wrangler.jsonc` keyed on `CF-Connecting-IP` so the guarantee is
  version-controlled and survives dashboard drift; consider not auto-replying on every successful submission;
  and keep the zone rule in the dashboard as the outer layer (do **not** delete it — the earlier advice to
  "fix or delete the inert rule" is withdrawn because it is no longer inert).

## [M-2] Third-party Actions are pinned to mutable major tags, including the one that receives the production Cloudflare token

- **Severity:** Medium
- **Confidence:** High
- **Category:** Supply chain / build integrity
- **CWE:** CWE-1357 (Reliance on Insufficiently Trustworthy Component), CWE-829
- **Affected files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- **Affected lines or symbols:** `ci.yml:20,22,36` (`actions/checkout@v7`, `actions/setup-node@v7`,
  `actions/upload-artifact@v7`); `deploy.yml:33,44,57` (`actions/checkout@v7`, `actions/setup-node@v7`,
  `cloudflare/wrangler-action@v4`).
- **Attack preconditions:** Compromise or malicious retargeting of a major tag upstream; the repository then
  runs whatever that tag resolves to on the next deploy.
- **Evidence:** every `uses:` is `owner/repo@vN`. Git tags and branch-protection on third-party repositories
  are mutable by their owners; GitHub's own guidance is that referencing a commit SHA is the safest option.
- **Exploit or failure scenario:** `wrangler-action@v4` is retagged (or its maintainer account compromised) to
  code that reads `INPUT_APITOKEN`, writes it out, or deploys a modified bundle. The next successful `CI` run
  triggers `Deploy` and the token is used by that code. The same applies to `actions/checkout@v7` in the
  privileged deploy job.
- **Impact:** Production deployment compromise / credential exposure via the deploy path — the highest-impact
  node in the chain.
- **Existing controls:** majors are intentional per `.github/instructions/workflows.instructions.md`; Dependabot
  watches `github-actions` weekly; `permissions: contents: read` limits the `GITHUB_TOKEN`.
- **Recommended remediation:** pin all third-party actions to full commit SHAs (keep Dependabot's
  `github-actions` updates so the pins are refreshed) — starting with `cloudflare/wrangler-action`.

## [M-3] The request body is parsed with no size limit before any validation

- **Severity:** Medium (bounded by platform limits)
- **Confidence:** High that the control is absent; Medium on realised impact because Workerd enforces its own
  request-size and memory ceilings.
- **Category:** Resource exhaustion (fail-open on cost)
- **CWE:** CWE-400 (Uncontrolled Resource Consumption), CWE-770
- **Affected files:** `src/worker/index.ts`
- **Affected lines or symbols:** `src/worker/index.ts:134-137` (`await request.formData()`), with
  `MAX_FIELD_LENGTH = 2000` only applied *afterwards* at `:156-163`.
- **Attack preconditions:** none beyond network access — the body is parsed **before** the Turnstile check and
  before any field is inspected, so no challenge is required.
- **Evidence:** no `Content-Length` check, no `Content-Type` allowlist, no streaming size cap, and no
  `problem(413, …)` path exists. `request.formData()` buffers and materialises the entire body, including
  arbitrarily large multipart parts and a large number of parts.
- **Exploit or failure scenario:** An unauthenticated client posts a very large `multipart/form-data` body (or
  many parts) repeatedly. Each request costs full parse/alloc work while the response is a single `400`.
  Combined with M-1 this turns cheap requests into disproportionate CPU/memory consumption.
- **Impact:** Availability degradation and Workers-usage cost; a malicious body that exceeds the isolate's
  memory limit produces `1102`-class errors.
- **Existing controls:** Cloudflare's platform request-size cap, and `field()` trimming/`MAX_FIELD_LENGTH`
  rejection *after* parse. No application-level control.
- **Recommended remediation:** reject early on `Content-Length` above a small cap (e.g. 16 KiB) with `413`,
  enforce `content-type` ∈ {`multipart/form-data`, `application/x-www-form-urlencoded`}, and reject any body
  whose parsed field count exceeds the expected set.

## [L-1] E-mail address validation is permissive and the recipient is never normalised or re-validated locally

- **Severity:** Low
- **Confidence:** Medium — depends on how the Email Service binding serialises `{ email, name }`.
- **Category:** Input validation / mail-header injection (defence in depth)
- **CWE:** CWE-20 (Improper Input Validation), CWE-93 (CRLF Injection — mitigated), CWE-88 (Argument Injection,
  analogous)
- **Affected files:** `src/worker/index.ts`
- **Affected lines or symbols:** `EMAIL_RE` (`:11`), `:164`, `env.REPLY.send({ to: { email, name } })` (`:194-199`)
- **Attack preconditions:** submit a value that satisfies the regex but is not a valid address.
- **Evidence:** `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` accepts quotes, angle brackets, commas, parentheses and
  control characters other than CR/LF in the local part (e.g. `a,b@x.com`, `"<x>"@y.com`). CRLF is blocked
  (`CRLF_RE`), so header *line* injection is closed; the residual risk is a structured recipient that expands
  to multiple addresses, or a display-name/`Reply-To` parsing quirk, in the provider's serialiser.
- **Exploit or failure scenario:** a crafted local part is interpreted by the MIME serialiser as a second
  recipient. Because `REPLY` is already unrestricted, the marginal capability gain is small — this is why the
  severity is Low, not Medium.
- **Impact:** additional unsolicited outbound mail; malformed `Reply-To` on the notification.
- **Existing controls:** CRLF rejection on `email`; the address is passed as a structured object, not
  concatenated into a raw header; provider-side validation (assumed).
- **Recommended remediation:** tighten to a pragmatic RFC 5322 subset (no `<`, `>`, `,`, `"`, whitespace,
  control characters; length caps on local/domain parts), or use a vetted validator, and re-validate before
  passing to `REPLY`.

## [L-2] Delivery failures log the thrown error object into Workers Logs, which are enabled with full sampling

- **Severity:** Low
- **Confidence:** Medium (the contents of the provider's error object are not observable from the repository).
- **Category:** Privacy / sensitive information in logs
- **CWE:** CWE-532 (Insertion of Sensitive Information into Log File), CWE-209 (Generation of Error Message
  Containing Sensitive Information)
- **Affected files:** `src/worker/index.ts`, `wrangler.jsonc`
- **Affected lines or symbols:** `console.error('contact delivery failed', error)` (`:201`);
  `observability: { enabled: true }` (`wrangler.jsonc:32`)
- **Attack preconditions:** induce a send failure (bad recipient domain, provider error) and read the logs;
  requires Cloudflare account access, so the threat is insider/over-retention rather than external.
- **Evidence:** the whole `error` is logged by reference; Errors from binding calls commonly embed the failing
  recipient/parameters in `message`. No `head_sampling_rate` is configured, so the default applies to all
  invocations. `console.warn` in `challengePasses` is clean (action/hostname/codes only).
- **Exploit or failure scenario:** persistent log retention stores submitted visitor e-mail addresses alongside
  `contact@vgr.cat` traffic; a leaked log export discloses PII.
- **Impact:** personal-data over-retention; no integrity or availability impact.
- **Existing controls:** `AGENTS.md` documents that the Worker never logs `messageId` and never logs the secret
  or the Turnstile token; the rejection log is deliberately field-limited.
- **Recommended remediation:** log a discriminator and the binding name only (`console.error('contact delivery
  failed', { binding: 'NOTIFY', name: error?.name })`), and set an explicit `head_sampling_rate` /
  retention on `observability`.

## [L-3] `set:html` writes `JSON.stringify` output directly into a `<script>` element without `</script>` escaping

- **Severity:** Low
- **Confidence:** High that the sink exists; exploitation requires write access to i18n/content files.
- **Category:** Unsafe HTML rendering (latent stored XSS)
- **CWE:** CWE-79 (Improper Neutralisation of Input During Web Page Generation)
- **Affected files:** `src/layouts/BaseLayout.astro`, `src/lib/schema.ts`, `src/i18n/*.ts`
- **Affected lines or symbols:** `BaseLayout.astro:92`
  (`<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`); `buildJsonLd()` and
  `useTranslations()`.
- **Attack preconditions:** a contributor able to change a dictionary string (or content frontmatter) so that
  it contains `</script>`; i.e. a compromised or malicious PR author, not an anonymous visitor.
- **Evidence:** `JSON.stringify` does not escape `<` or `/`, so a value containing `</script><script>…`
  terminates the data block. The value is *not* attacker-reachable at runtime — every input is a build-time
  constant — which is what keeps this Low. Astro auto-escapes every other interpolation in the codebase
  (verified: `set:html` appears exactly once in `src/`).
- **Exploit or failure scenario:** a PR adds `"</script><script>fetch('/steal?c='+document.cookie)</script>"`
  to a dictionary field. It ships on every page. The hash-based CSP mitigates inline execution (no matching
  `script-src` hash for the injected block), so the practical fallout is a CSP violation rather than execution
  — but the CSP is meta-delivered, and adding a hash for attacker content is not required for the payload to
  corrupt the JSON-LD.
- **Impact:** at most page/structured-data corruption under CSP; potential executed script if CSP were relaxed.
- **Existing controls:** CSP with build-time hashes; all `jsonLd` inputs are repository-controlled; no runtime
  user input reaches this sink.
- **Recommended remediation:** serialise with `<` escaped — `JSON.stringify(jsonLd).replace(/</g, '\\u003c')` —
  so the sink is safe by construction.

## [L-4] The Turnstile test-key guard validates only the environment override, not the committed default sitekey

- **Severity:** Low
- **Confidence:** High
- **Category:** Configuration risk (silent disablement of a security control)
- **CWE:** CWE-1188 (Initialization of a Resource with an Insecure Default), CWE-778 (Insufficient Logging)
- **Affected files:** `scripts/check-production-env.mjs`, `src/config.ts`, `.github/workflows/deploy.yml`
- **Affected lines or symbols:** `check-production-env.mjs:12-22`; `src/config.ts:11-12`;
  `deploy.yml:48-49` (the guard step runs *before* `build`)
- **Attack preconditions:** merge a change that replaces `PRODUCTION_SITE_KEY` with one of Cloudflare's
  always-passes test keys.
- **Evidence:** the script reads `process.env.PUBLIC_TURNSTILE_SITE_KEY` and exits 0 when it is unset —
  explicitly deferring to the committed key — but never asserts anything about that committed key.
  `src/config.ts` then falls back to `PRODUCTION_SITE_KEY` with `||`, so an empty env var silently yields it.
- **Exploit or failure scenario:** a PR "modernises" the sitekey; with a test sitekey the widget always passes,
  the Worker's Siteverify still rejects (the test secret omits `action`), so the effect is a *broken form*
  rather than a *disabled control* — unless a matching test secret is also configured, in which case bot
  protection is genuinely off and no CI check objects.
- **Impact:** potential silent loss of the only effective anti-automation control.
- **Existing controls:** the guard is wired into the deploy job and `AGENTS.md` documents the invariant; the
  Worker's action/hostname gates independently reject test-key tokens.
- **Recommended remediation:** also import the committed default from `src/config.ts` and fail when *it* is in
  `TEST_SITE_KEYS`.

## [L-5] `/api/contact` responses carry no `Cache-Control`, and `405` carries no `Allow`

- **Severity:** Low
- **Confidence:** High
- **Category:** Response behaviour / cache handling
- **CWE:** CWE-525 (Use of Web Page Containing Sensitive Information — analogous), CWE-116 (Improper Encoding or
  Escaping of Output — HTTP correctness)
- **Affected files:** `src/worker/index.ts`
- **Affected lines or symbols:** `problem()` (`:53-60`), the `303` response (`:205-209`), the method gate (`:133`)
- **Attack preconditions:** a misconfigured cache rule or an intermediary that caches non-GET responses.
- **Evidence:** `SECURITY_HEADERS` (`:47-51`) contains HSTS, `nosniff` and `Referrer-Policy` only; no response
  path sets `Cache-Control: no-store`, and Cloudflare does not cache `POST` by default, so today this is
  defence in depth. `problem(405, …)` omits `Allow: POST`.
- **Exploit or failure scenario:** a future cache rule (e.g. a zone-wide "cache everything" rule) stores a
  `303`/`400` body and serves it to a different client.
- **Impact:** incorrect caching of submission outcomes; HTTP conformance issue.
- **Existing controls:** HTTP semantics (POST is not cached), asset-first routing, and Turnstile's single-use
  tokens prevent replay of a cached redirect into a second e-mail.
- **Recommended remediation:** add `Cache-Control: no-store` to `SECURITY_HEADERS` and `Allow: POST` to the 405.

## [L-6] Manual `workflow_dispatch` deploys build and ship whatever ref is dispatched, using production credentials

- **Severity:** Low
- **Confidence:** High
- **Category:** Deployment authorisation boundary
- **CWE:** CWE-284 (Improper Access Control)
- **Affected files:** `.github/workflows/deploy.yml`
- **Affected lines or symbols:** `deploy.yml:16` (`workflow_dispatch:` with no `ref`/branch restriction);
  `deploy.yml:29` (job `if:`), `:41` (`ref: … || github.sha`)
- **Attack preconditions:** write access to the repository (a trusted insider), or a compromised maintainer account.
- **Evidence:** the `if:` admits `workflow_dispatch` unconditionally and the checkout falls back to
  `github.sha` of the dispatched ref. Nothing verifies that the ref is `main` or that it was CI-validated.
- **Exploit or failure scenario:** a maintainer (or an attacker with a stolen session) dispatches Deploy from a
  feature branch and ships unreviewed, un-CI'd code to production.
- **Impact:** unverified code in production; operator-triggered only.
- **Existing controls:** requires write access to dispatch; `environment: production` is available as a gate;
  `concurrency: deploy-production` prevents overlap.
- **Recommended remediation:** restrict the environment's deployment branches to `main` (GitHub setting), and
  add `github.ref == 'refs/heads/main'` to the `workflow_dispatch` branch of the `if:`.

## [L-7] Content markdown is rendered to HTML with raw HTML enabled by default

- **Severity:** Low
- **Confidence:** High (the default) — mitigated by CSP.
- **Category:** Stored XSS surface (trusted-content boundary)
- **CWE:** CWE-79
- **Affected files:** `src/content.config.ts`, `src/content/**/*.md`, `src/components/HomeSections.astro`
- **Affected lines or symbols:** `render(entry)` in `HomeSections.astro:37,44`; `<Content />` at `:76,94`;
  no `markdown` hardening options in `astro.config.mjs`
- **Attack preconditions:** write access to `src/content/**/*.md`.
- **Evidence:** no `markdown.rehypePlugins` / sanitisation is configured, so raw HTML in Markdown is emitted.
  Current content contains **zero** HTML tags (verified by grep), and the runtime CSP has no
  `'unsafe-inline'`, so an injected `<script>` would be blocked. Frontmatter fields are auto-escaped.
- **Exploit or failure scenario:** a malicious PR adds `<img src=x onerror=…>` to a case study; CSP blocks
  inline event handlers and inline scripts, so the practical effect is a broken rendering rather than
  execution — unless a future CSP relaxation removes that mitigation.
- **Impact:** potential stored XSS if CSP is weakened; currently contained.
- **Existing controls:** hash-based CSP without `unsafe-inline`; content is repository-controlled and
  PR-reviewed.
- **Recommended remediation:** add a rehype sanitisation step (or disable raw HTML) for the content
  collections, so the containment does not depend solely on CSP.

## [L-8] `min_tls_version` is `1.0`, so TLS 1.0 and 1.1 are still accepted at the edge

- **Severity:** Low
- **Confidence:** High — read directly from the live zone settings (`GET /zones/{zone}/settings` →
  `min_tls_version: "1.0"`), not inferred from the repository.
- **Category:** Transport security configuration
- **CWE:** CWE-326 (Inadequate Encryption Strength), CWE-327 (Use of a Broken or Risky Cryptographic Algorithm)
- **Affected files:** none in the repository — this is a **zone setting**, so it cannot be fixed or regressed by
  a commit.
- **Affected lines or symbols:** Cloudflare zone `vgr.cat` (`cde2a5cda4abb8c41587e343c2c487cc`), setting
  `min_tls_version`.
- **Attack preconditions:** a network-positioned attacker able to downgrade a visitor's handshake to TLS 1.0/1.1.
- **Evidence:** `min_tls_version: "1.0"` while `tls_1_3: "on"` and `ssl: "strict"`. TLS 1.0 and 1.1 were
  deprecated by RFC 8996 and are barred by PCI-DSS; Cloudflare offers `"1.1"`, `"1.2"` and `"1.3"`.
- **Exploit or failure scenario:** a visitor on an old client negotiates TLS 1.0/1.1 with the edge; the modern
  cipher suites still protect the record layer, but the protocol version is out of policy and out of compliance.
- **Impact:** policy/compliance exposure and a wider protocol surface; no confidentiality break demonstrated.
- **Existing controls:** `ssl: strict` (origin validation is moot — the apex is Worker-only, `AAAA 100::`),
  TLS 1.3 enabled, `always_use_https: on`, `automatic_https_rewrites: on`, and HSTS shipped by the app.
- **Recommended remediation:** set `min_tls_version` to `"1.2"` (or `"1.3"` once legacy clients are not a
  concern). User action — an agent must not change zone settings.

## [I-1] The CSP is delivered in a `<meta>` element, so `frame-ancestors`, `report-uri` and `sandbox` are unavailable

- **Severity:** Informational
- **Confidence:** High
- **Category:** Browser security control placement
- **CWE:** CWE-1021 (Improper Restriction of Rendered UI Layers — covered by another control)
- **Affected files:** `astro.config.mjs`, `public/_headers`
- **Affected lines or symbols:** `astro.config.mjs:17-41`; `public/_headers:4` (`X-Frame-Options: DENY`)
- Clickjacking is covered by `X-Frame-Options: DENY` on static assets; there is no CSP violation *reporting*,
  which is why the earlier silently-blocked Web Analytics beacon had to be found by browser instrumentation.
  The trade-off (build-time hashes cannot be maintained by hand in a header) is documented and deliberate — do
  not "fix" it by hand-writing a header CSP.

## [I-2] `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` and `Cross-Origin-Embedder-Policy` are not set

- **Severity:** Informational / defence-in-depth gap
- **Confidence:** High
- **Category:** Browser isolation headers
- **CWE:** CWE-693
- **Affected files:** `public/_headers`, `src/worker/index.ts`
- `default-src 'self'`, `object-src 'none'`, `base-uri 'self'` and `frame-src` pinning already provide the
  bulk of the benefit. COOP/CORP would additionally isolate the browsing context and block embedding of the
  site's assets by third parties. Adding them is safe here (no cross-origin resource sharing is needed) but
  not required.

## [I-3] Verified absent: `unsafe-inline`, `unsafe-eval`, wildcard sources and nonce misuse

- **Severity:** Informational (positive verification)
- **Confidence:** High
- **Evidence:** `grep -c "unsafe-inline\|unsafe-eval" dist/index.html` → `0`; the shipped `script-src` is
  `https://challenges.cloudflare.com https://static.cloudflareinsights.com 'sha256-…'×8` and `style-src` is
  `'self' 'sha256-47DEQpj8…'` (the well-known hash of the empty string). The two host allowlists are the
  third-party loader and the zone-injected analytics beacon; both are necessary and neither can use SRI. Note
  that a host allowlist on `script-src` delegates script control to that origin — accepted for Turnstile.

## [I-4] `.nvmrc` floats on `24`, so CI does not build on an exactly reproducible Node

- **Severity:** Informational
- **Confidence:** High
- **Category:** Build reproducibility
- **Affected files:** `.nvmrc` (content: `24`), `.github/workflows/*.yml` (`node-version-file: .nvmrc`)
- The lockfile *is* enforced (`npm ci` in both workflows, `npm ci --ci` semantics), so dependency content is
  pinned; only the runtime patch level moves. A floating runtime can change behaviour unnoticed.

## [I-5] Dependabot groups every npm minor/patch update into a single PR

- **Severity:** Informational
- **Confidence:** High
- **Category:** Update automation / reviewability
- **Affected files:** `.github/dependabot.yml:5-10`
- One grouped PR can move dozens of transitive packages at once, which makes security review of any single
  bump impractical. Majors are excluded, so the TypeScript 7 / `@astrojs/check` peer cap is handled by hand.

## [I-6] No in-repo security automation (CodeQL, dependency review, secret scanning config, workflow linting)

- **Severity:** Informational
- **Confidence:** High that it is absent from the repository; the GitHub-side enablement is unknown.
- **Affected files:** `.github/workflows/**`, `.github/dependabot.yml`
- Only Dependabot version updates exist. There is no `dependency-review-action` on PRs, no CodeQL workflow, no
  actionlint/`zizmor`-style workflow analysis, and no secret-scanning configuration in the repo. `npm audit` is
  not run in CI either (`ci.yml` installs, formats, type-checks, lints, builds — no audit).

## [I-7] `.vscode/mcp.json` is tracked and points at a remote Cloudflare MCP endpoint

- **Severity:** Informational
- **Confidence:** High
- **Category:** Developer-environment configuration
- **Affected files:** `.vscode/mcp.json`
- The file contains only a URL (`https://mcp.cloudflare.com/mcp`); authentication is interactive OAuth with no
  embedded credential. Tracking it means every contributor is offered a tool with broad account access, which
  is a deliberate ergonomics choice rather than a leak.

## [I-8] `connect-src` does not include `challenges.cloudflare.com`

- **Severity:** Informational
- **Confidence:** Medium
- **Affected files:** `astro.config.mjs:28`
- Because `connect-src` is specified, it does not fall back to `default-src`. Any page-context `fetch`/XHR from
  Turnstile's loader to that host would be blocked. The project's recorded production measurements report zero
  CSP violations and a working widget, so the widget evidently communicates from inside its iframe
  (`frame-src`). Left as an observation for anyone changing the Turnstile `size`/integration mode.

## [I-9] HSTS includes `includeSubDomains; preload`

- **Severity:** Informational
- **Confidence:** High
- **Affected files:** `public/_headers:5`, `src/worker/index.ts:47-51`
- Every present and future subdomain of `vgr.cat` is committed to HTTPS for a year. Combined with the
  deliberate absence of a wildcard Worker route this is coherent, but any future non-TLS subdomain (e.g. a
  verification TXT-only host is fine; a plain-HTTP service is not) becomes unreachable for browsers that have
  cached the policy.

## [I-10] Install-time lifecycle scripts in the dependency graph

- **Severity:** Informational
- **Confidence:** High
- **Affected files:** `package-lock.json`
- Exactly three packages declare install scripts: `esbuild@0.28.2` (`node install.js`), `workerd@1.20261012.1`
  (`node install.js`), `fsevents@2.3.3` (darwin-only). All 559 tarballs resolve to `registry.npmjs.org` — no
  git, file, or alternate-registry resolutions, so there is no dependency-confusion surface configured. In CI
  (`ci.yml`, no secrets, `contents: read`) a compromised install script can only poison the review artifact;
  in `deploy.yml` a compromised install script could shape `dist/` before `wrangler deploy` runs.
  `npm audit` reports 0 vulnerabilities.

## [I-11] External settings: what is now verified, and what still needs a human

- **Severity:** Informational
- **Confidence:** High for the verified rows (live API read), Low for the remainder.
- **Category:** Unverified external configuration
- **Verified 2026-10-19 (no longer open questions):**
  - The `http_ratelimit` ruleset exists, is enabled, and is correctly phased at 5 req / 10 s per
    `(ip.src, cf.colo.id)` — see the Correction under M-1.
  - Worker routes contain **only** `vgr.cat`; there is no wildcard `*.vgr.cat/*` route and no wildcard DNS
    record.
  - There are **no** cache rules (`http_request_cache_settings` is absent) and no custom WAF rules, so L-5 is
    defence in depth only and nothing currently caches a non-GET response.
  - Zone HSTS (`security_header`) is **disabled** — correct, because the app ships
    `Strict-Transport-Security` itself; enabling both would emit a duplicate header.
  - Managed rulesets present: Cloudflare Managed Free Ruleset v74, L7 DDoS, request sanitisation.
  - `observability` is fully on and persisted with `redact_query_string: false` and `head_sampling_rate: 1`
    (see L-2).
- **Still requires a human:**
  - `workers_dev` / `preview_urls`: the script-settings payload omits both keys, which is consistent with
    "disabled because `routes` is set" but does not assert it. Confirm, and confirm no
    `vgr-cat.<subdomain>.workers.dev` hostname serves the site (account Workers subdomain: `vgr-spa-domains`).
  - The Cloudflare API token's scope (the MCP credential cannot read `GET /user/tokens` → `9109`).
  - `min_tls_version` (see L-8) and the Turnstile widget's `localhost` entries (see I-12).
  - GitHub: `production` environment protection rules (decides H-1 and L-6), fork-PR workflow policy (H-1
    precondition), secret scanning / push protection, Dependabot alerts, CodeQL default setup (I-6), and that
    `main` still requires signed commits (history shows all-`G`, so it holds today).

## [I-12] The production Turnstile widget allows `127.0.0.1` and `localhost`, but the Worker rejects those tokens

- **Severity:** Informational
- **Confidence:** High — widget metadata read from the live API.
- **Category:** Anti-bot configuration (compensating control present)
- **CWE:** CWE-1188 (insecure default) — mitigated to no demonstrated impact
- **Affected files:** `src/config.ts:8` (the committed production sitekey); zone/account Turnstile configuration
- **Affected lines or symbols:** widget `0x4AAAAAAFX7NYXtXTGajTgb` (`"vgr.cat (Spin)"`), `domains:
  ["127.0.0.1", "localhost", "vgr.cat"]`, `mode: managed`, `bot_fight_mode: false`
- **Attack preconditions:** possession of the public sitekey, which is public by design.
- **Evidence:** the production widget lists two loopback hostnames. A token minted on `localhost` reports
  `hostname: "localhost"` from Siteverify, and `src/worker/index.ts` requires
  `hostnames.has(outcome.hostname)` against `TURNSTILE_HOSTNAMES` = `vgr.cat` — so such a token is rejected
  server-side. The sitekey is not a secret and the widget can be loaded on `vgr.cat` regardless, so the
  loopback entries add no new capability an attacker lacks.
- **Exploit or failure scenario:** a spammer uses the loopback allowance to render the widget off-domain while
  developing a bot; the minted token then fails the Worker's hostname gate.
- **Impact:** none demonstrated; the residual value of the entries is developer convenience.
- **Existing controls:** the Worker's server-side hostname allowlist (the actual boundary).
- **Recommended remediation:** remove `127.0.0.1` and `localhost` from the production widget and keep a separate
  widget for local development (the repo already supports `PUBLIC_TURNSTILE_SITE_KEY` overrides). User action.

---

# Remediation Status (addendum, 2026-10-19)

This section is **appended**. Nothing above was edited, reordered or rewritten — the recorded command output in
the audit stands as captured. Implementation lives in
`.ai/plans/active/2026-10-19-security-audit-remediation.md` (Phases 0–5 complete for everything an agent can
change).

## Fixed in the repository

| ID | Status | Where |
| --- | --- | --- |
| H-1 | **Fixed** | `deploy.yml` job `if:` now asserts `workflow_run.event == 'push'`, `head_branch == 'main'` and `head_repository == github.repository` |
| M-1 | **Fixed in-repo** (edge rule kept as the outer layer) | `wrangler.jsonc` `ratelimits` → `CONTACT_RATE_LIMITER`, 5 / 60 s, fails open |
| M-2 | **Fixed** | all six `uses:` pinned to full SHAs with `# vX.Y.Z` comments; policy updated in `.github/instructions/workflows.instructions.md` |
| M-3 | **Fixed** | rate limit → content-type allowlist → 16 KiB `content-length` cap → parse → field allowlist, in that order |
| L-1 | **Fixed** | `EMAIL_LOCAL` / `EMAIL_DOMAIN` dot-atom rule + 254/64 length caps |
| L-2 | **Fixed in code** | delivery failures log `{ binding, name }` only; visitor addresses no longer serialised |
| L-3 | **Fixed** | JSON-LD sink escapes `<` as `\u003c` (no-op on current content, proven separately) |
| L-4 | **Fixed** | `check-production-env.mjs` also rejects a test key committed as `PRODUCTION_SITE_KEY`, and fails if the literal is not found |
| L-5 | **Fixed** | `Cache-Control: no-store` on every Worker response; `Allow: POST` on the 405 |
| L-6 | **Fixed** | `workflow_dispatch` deploys are restricted to `refs/heads/main` |
| I-2 | **Fixed** | `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` added; COEP deliberately omitted |
| I-4 | **Fixed** | `.nvmrc` pinned to `24.22.0` (inside `eslint-plugin-astro`'s `^24.16.0`) |
| I-5 | **Fixed** | npm Dependabot groups split by dependency type and limited to version updates |
| I-6 | **Partially fixed** | `npm audit --audit-level=high` added to CI; CodeQL remains a repository setting |

## Deferred (recorded with a revisit trigger)

| ID | Why deferred | Revisit when |
| --- | --- | --- |
| L-7 | Content markdown still renders raw HTML, but the hash-based CSP has no `'unsafe-inline'`, and adding `rehype-sanitize` adds a dependency that can silently strip legitimate markup | content is accepted from a non-maintainer, or the CSP is relaxed |
| M-1 (global ceiling) | A cross-location ceiling needs a Durable Object (new class, new binding, new failure mode); the per-IP pair is deliberately permissive and eventually consistent | distributed abuse bypasses both per-IP layers |

## Requires a human (no agent may change these)

| ID | Action |
| --- | --- |
| L-8 | Raise the zone's `min_tls_version` from `1.0` to at least `1.2` |
| I-12 | Remove `127.0.0.1` and `localhost` from Turnstile widget `0x4AAAAAAFX7NYXtXTGajTgb` |
| I-11 | Confirm `workers_dev` / `preview_urls` are off; confirm the API token's scope |
| L-2 (dashboard half) | Decide whether `observability.redact_query_string` should be enabled |
| H-1 (defence in depth) | Add required reviewers and a `main`-only deployment branch rule to the `production` environment |
| I-6 (dashboard half) | Enable CodeQL default setup, secret scanning + push protection, and Dependabot alerts |

## Accepted as-is (no action, with the reason on record)

| ID | Reason |
| --- | --- |
| I-1 | Meta-delivered CSP is a documented trade-off: per-build hashes cannot be hand-maintained in a header. `frame-ancestors` is unavailable in `<meta>`, so `X-Frame-Options: DENY` covers clickjacking |
| I-3 | Positive verification — no `unsafe-inline`, no `unsafe-eval`, no wildcards |
| I-7 | `.vscode/mcp.json` holds only a URL; auth is interactive OAuth |
| I-8 | `connect-src` omits `challenges.cloudflare.com`; production evidence shows the widget works from inside its iframe |
| I-9 | `includeSubDomains; preload` is coherent with the deliberate absence of a wildcard route |
| I-10 | Three install-script packages; every tarball resolves to `registry.npmjs.org`; `npm audit` reports 0 |

## Not verified by execution

- The edge rate limit's **behaviour** (only its configuration was read; probing it would mean attacking
  production).
- The `workflow_run` `if:` expression was reviewed against both payload shapes, not triggered — a real trigger
  needs a push to `main`.
- The e-mail **happy path** remains unverifiable with test keys (Siteverify's `action` gate), so only rejection
  paths were exercised.
