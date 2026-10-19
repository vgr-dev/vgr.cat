# Task Plan: Security Audit Remediation

## 1. Context & Objectives

- **Goal**: Close the findings raised by the read-only security audit recorded in
  `.ai/plans/active/2026-10-19-security-audit.md` — one High (H-1), two Medium (M-2, M-3) and nine Low
  (L-1…L-8 plus M-1, demoted into that band after live verification) — without changing the settled
  architecture (static output, no adapter, Workers static assets, meta-delivered CSP) and without weakening
  any existing control.
  - **Verified 2026-10-19 via the Cloudflare MCP (read-only `GET`s):** the "Contact Rate Limit" rule is
    **not** inert any more — it lives in the `http_ratelimit` phase, is enabled, and blocks at 5 req / 10 s per
    `(ip.src, cf.colo.id)`. That downgraded M-1 to Low and invalidates the `AGENTS.md` / repo-memory gotcha that
    says otherwise. Zone routes, cache rules, WAF and observability were also read; see the audit's
    "Cloudflare API verification" block.
- **Technical Strategy**:
  - **Risk-ordered phases.** The CI/CD trust boundary (H-1, M-2, L-6) ships first and independently, because it
    is the only path with production-write impact; endpoint hardening (M-1, M-3, L-1…L-5) ships second.
  - **Fail closed, cheapest-first.** Inside `POST /api/contact`, rejections are ordered so that no parsing work
    happens before the cheapest gate: method → rate limit → content-type → body size → parse → field checks →
    Turnstile → send. Today `request.formData()` runs before every gate.
  - **Native primitives over new dependencies.** Rate limiting uses Cloudflare's GA `ratelimits` binding
    (`wrangler.jsonc` `ratelimits[]`), not a new package. No new runtime dependency is introduced by this plan.
  - **Trust decided in the workflow, not inferred.** `deploy.yml` asserts the triggering run's event, branch
    **and** repository instead of relying on the `workflow_run.branches` filter alone.
  - **Evidence, not assertion.** Every acceptance criterion is an exact command with an expected output; the
    contact happy path stays unverifiable with test keys (documented Siteverify `action` gate) and is recorded
    as such rather than ticked.

## 2. Constraints & Non-Goals

- **In Scope**:
  - `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, `.github/dependabot.yml`, `.nvmrc`
  - `src/worker/index.ts` (validation order, rate limiting, body limits, redacted logging, headers)
  - `src/layouts/BaseLayout.astro` (JSON-LD escaping)
  - `scripts/check-production-env.mjs` (committed-sitekey guard)
  - `wrangler.jsonc` (rate-limit binding), `public/_headers` (isolation headers)
- **Out of Scope / Non-Goals** (each is a deliberate decision, not an oversight):
  - **No GitHub-side settings changes by an agent.** Adding required reviewers / a deployment branch
    restriction to the `production` environment, enabling fork-PR workflow restrictions, turning on secret
    scanning, push protection, Dependabot alerts and CodeQL default setup are **dashboard actions for the
    user**, captured as Phase 0 verification tasks. The plan assumes none of them.
  - **No Cloudflare zone changes by an agent.** Deleting or re-phasing the currently inert "Contact Rate Limit"
    ruleset (audit M-1) requires the dashboard/API. Recorded as a Phase 0 user task; the Worker must therefore
    enforce its own limit.
  - **No global (cross-location) cap.** The `ratelimits` binding is documented as *per Cloudflare location,
    permissive and eventually consistent* — it is not an accurate accounting system. A globally exact ceiling
    would require a Durable Object (new binding, new class, new failure mode) and is deliberately deferred
    until per-IP limiting proves insufficient. Recorded in §5.
  - **No content-markdown sanitisation (audit L-7).** Deferred: the hash-based CSP has no `'unsafe-inline'`, so
    injected inline script in `src/content/**/*.md` is already blocked, and adding `rehype-sanitize` introduces
    a new dependency and a new way to silently strip legitimate markup. **Revisit trigger:** the first time
    content is accepted from a non-maintainer, or the first CSP relaxation. Recorded in §5.
  - **No change to the contact form's rendered UX** beyond what a stricter e-mail rule implies; no new fields;
    no `@astrojs/cloudflare` adapter; no SSR; no Astro middleware.
  - **No `@ts-ignore`, no lint-disable, no baseline update, no `--legacy-peer-deps`.** Any peer conflict is a
    blocker to raise with the user, not something to force.

## 3. Files Affected

- `.github/workflows/deploy.yml` - `[Modify]` - job `if:` trust assertions (H-1), `workflow_dispatch` ref guard
  (L-6), SHA-pinned `checkout`/`setup-node`/`wrangler-action` (M-2).
- `.github/workflows/ci.yml` - `[Modify]` - SHA-pinned `checkout`/`setup-node`/`upload-artifact` (M-2); optional
  `npm audit` gate (I-6).
- `.github/dependabot.yml` - `[Modify]` - split the catch-all npm group so security-relevant runtime updates are
  reviewable (I-5); keep `github-actions` updates flowing so SHA pins stay current (M-2).
- `.nvmrc` - `[Modify]` - pin an exact patch release instead of the floating `24` (I-4).
- `wrangler.jsonc` - `[Modify]` - add the `ratelimits` binding (M-1).
- `src/worker/index.ts` - `[Modify]` - reordered gates, rate limit, content-type allowlist, body-size cap,
  `no-store`/`Allow` headers, stricter e-mail rule, redacted error logging (M-1, M-3, L-1, L-2, L-5).
- `src/layouts/BaseLayout.astro` - `[Modify]` - escape `<` in the JSON-LD payload (L-3).
- `scripts/check-production-env.mjs` - `[Modify]` - also reject a test key committed as
  `PRODUCTION_SITE_KEY` (L-4).
- `public/_headers` - `[Modify]` - add `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` (I-2).
- `AGENTS.md` - `[Modify]` - correct the **stale** gotcha that says the contact rate-limit rule is inert in
  the `dynamic-redirect` phase (verified false on 2026-10-19), and record that `check:production-env` now
  validates the committed default sitekey.
- `.github/instructions/workflows.instructions.md` - `[Modify]` - **(added during Phase 1, see the recorded
  deviation)** it still mandated major-tag pins and a stale CI step order, so leaving it untouched would have
  instructed the next agent to revert M-2.
- `.ai/plans/active/2026-10-19-security-audit.md` - `[Modify]` - the audit is the source of truth; do **not**
  rewrite its recorded command output. Append a dated "Remediation status" note instead (§5).

## 4. Step-by-Step Execution Plan

### Phase 0: Preconditions and externally-owned verification

**Goal**: Establish a clean baseline, resolve the mutable-action SHAs, and hand the user the settings checklist
that no repository change can satisfy.

#### Tasks

- [x] Task 0.1: In `/home/vagonzal/repos/vgr.cat`, confirm a clean tree and green baseline before touching
      anything: `git status --short` (empty), `npm run format:check`, `npm run lint`, `npm run check`
      (expect `30 files, 0 errors, 0 warnings, 0 hints`), `npm run build`, `npm run check:placeholders`.
      **Done 2026-10-19 — output recorded below.**
- [x] Task 0.2: Resolve immutable refs for every third-party Action (M-2). For each of
      `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`,
      `cloudflare/wrangler-action@v4` run, e.g.
      `gh api repos/actions/checkout/git/ref/tags/v7 --jq '.object.type + " " + .object.sha'`.
      If `type` is `tag` (annotated), dereference with
      `gh api repos/actions/checkout/git/tags/<sha> --jq '.object.sha'`.
      Record all four resolved SHAs **in this plan** under a dated note before editing any workflow.
      **Done 2026-10-19 — all four tags were lightweight (`object.type == "commit"`), so no dereference was
      needed; pins recorded below.**
- [x] Task 0.3: Produce the user-facing settings checklist (do not attempt to apply it):
      GitHub → `production` environment required reviewers + deployment branches restricted to `main`;
      fork-PR workflow policy; secret scanning + push protection; Dependabot alerts; CodeQL default setup;
      confirm `main` still requires signed commits.
      **Done 2026-10-19 — checklist recorded below; every item is deliberately unticked (user-owned).**
- [x] Task 0.4: Cloudflare side — **already verified read-only on 2026-10-19, do not re-derive**: the
      `http_ratelimit` ruleset is present, enabled and correctly phased (5 req / 10 s per IP+colo, 10 s
      mitigation); the only Worker route is `vgr.cat` (no wildcard) and there is no wildcard DNS record; there
      are no cache rules and no custom WAF rules; zone HSTS is off, which is correct because the app sends
      `Strict-Transport-Security` itself; observability is fully sampled, persisted, and
      `redact_query_string: false`. **Remaining user actions (agent must not perform them):**
      (a) raise `min_tls_version` from `1.0` to at least `1.2` (audit L-8);
      (b) remove `127.0.0.1` and `localhost` from Turnstile widget `0x4AAAAAAFX7NYXtXTGajTgb` and use
      `PUBLIC_TURNSTILE_SITE_KEY` for local development instead (audit I-12);
      (c) confirm `workers_dev` / `preview_urls` are off — the script-settings payload omits both keys, which is
      consistent with "off because `routes` is set" but does not assert it, so check and confirm no
      `vgr-cat.vgr-spa-domains.workers.dev` hostname serves the site;
      (d) confirm the API token's scope (the MCP credential cannot read `GET /user/tokens` → `9109`);
      (e) decide whether `observability.redact_query_string` should be on (audit L-2).

#### Recorded evidence (2026-10-19, Phase 0)

**Task 0.1 — baseline gate, captured on a clean tree with no workflow edited yet:**

```console
$ git status --short
                                    # empty
$ npm run format:check
All matched files use Prettier code style!
$ npm run lint
> vgr-cat@0.0.1 lint
> eslint .
                                    # 0 messages
$ npm run check
Result (30 files):
- 0 errors
- 0 warnings
- 0 hints
$ npm run build
[build] 7 page(s) built in 739ms
[build] Complete!
$ npm run check:placeholders
check:placeholders — 0 placeholders remain.
$ npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
✨ Read 32 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 5.62 KiB / gzip: 2.34 KiB
env.NOTIFY (contact@vgr.cat)                    Send Email
env.REPLY (unrestricted)                        Send Email
env.ASSETS                                      Assets
env.CONTACT_DESTINATION ("contact@vgr.cat")     Environment Variable
env.TURNSTILE_HOSTNAMES ("vgr.cat")             Environment Variable
--dry-run: exiting now.
                                    # exit 0, no warnings; no secret binding listed (not set locally)
```

**Task 0.2 — resolved pins, recorded before any workflow edit.** All four tags resolved to
`object.type == "commit"` (lightweight), so the ref SHA *is* the commit SHA; no annotated-tag dereference was
required. The trailing `# vX.Y.Z` comments come from each action's `package.json` at the pinned commit and are
what lets Dependabot keep updating SHA pins.

| Action | Tag | Pin to use in `uses:` | Comment |
| --- | --- | --- | --- |
| `actions/checkout` | `v7` | `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` | `# v7.0.1` |
| `actions/setup-node` | `v7` | `actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1` | `# v7.1.0` |
| `actions/upload-artifact` | `v7` | `actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9` | `# v7.0.2` |
| `cloudflare/wrangler-action` | `v4` | `cloudflare/wrangler-action@953926a2e2182532811c01a25e53647d93bf07c0` | `# v4.1.3` |

**Task 0.3 — GitHub settings checklist. User-owned; nothing was applied:**

- [ ] `production` environment: add required reviewers, and restrict deployment branches to `main`
- [ ] Fork-PR policy: confirm whether fork-origin workflows run for this repository (decides H-1)
- [ ] Secret scanning + push protection: enable
- [ ] Dependabot alerts: enable (the updater already exists in `.github/dependabot.yml`)
- [ ] CodeQL default setup: enable
- [ ] Confirm `main` still requires signed commits (`git log --format='%G?'` reports `G` today)

**Task 0.4 — Cloudflare items. User-owned; nothing was applied:**

| Item | Verified state (2026-10-19) | Remaining action |
| --- | --- | --- |
| `http_ratelimit` ruleset | phase `http_ratelimit`, enabled, 5 req / 10 s per `(ip.src, cf.colo.id)` | none |
| Worker route | only `vgr.cat`; no wildcard DNS record | none |
| Cache rules / custom WAF | absent | none |
| Zone HSTS | `security_header` disabled (app sends the header) | none |
| `min_tls_version` | `"1.0"` (audit L-8) | **(a)** raise to at least `"1.2"` |
| Turnstile widget domains | `[127.0.0.1, localhost, vgr.cat]` (audit I-12) | **(b)** remove the two loopback entries |
| `workers_dev` / `preview_urls` | keys absent from script settings — not asserted | **(c)** confirm off, and that `vgr-cat.vgr-spa-domains.workers.dev` serves nothing |
| API token scope | unreadable with this credential (`9109`) | **(d)** confirm least privilege |
| `observability.redact_query_string` | `false` (audit L-2) | **(e)** decide whether to enable |

#### Acceptance Criteria

- [x] Criterion 1: Baseline gate is green and its output is pasted into the plan's evidence note
      (`npm run check` line, `npm run build` page count, `wrangler --dry-run` file count) — see the Task 0.1
      block: `30 files / 0 errors`, `7 page(s) built`, `Read 32 files`.
- [x] Criterion 2: Four full SHAs are recorded, each with the tag it corresponds to, and no workflow has been
      edited yet (`git status --short` shows only this plan file).

### Phase 1: Close the deployment trust boundary (H-1, M-2, L-6)

**Goal**: Make it impossible for a `pull_request`-origin `CI` run, or a non-`main` manual dispatch, to reach
`CLOUDFLARE_API_TOKEN`; make every Action reference immutable.

#### Tasks

- [x] Task 1.1: In `.github/workflows/deploy.yml`, replace the job `if:` with an explicit trust expression
      (GitHub Actions has no ternary operator — use two `||`-joined groups, and note the second group
      short-circuits on `event_name` so `github.event.workflow_run` being null on dispatch is safe):

      ```yaml
      if: >-
        (github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main')
        || (github.event_name == 'workflow_run'
            && github.event.workflow_run.conclusion == 'success'
            && github.event.workflow_run.event == 'push'
            && github.event.workflow_run.head_branch == 'main'
            && github.event.workflow_run.head_repository.full_name == github.repository)
      ```

      Keep the existing comment block and extend it: the `workflows: [CI]` name match and the SHA pin stay
      mandatory, and the new clauses are what make `workflow_run` a trust boundary rather than a hint.
- [x] Task 1.2: In `.github/workflows/deploy.yml`, replace `actions/checkout@v7`, `actions/setup-node@v7` and
      `cloudflare/wrangler-action@v4` with `owner/repo@<full-sha> # vN` using the SHAs from Task 0.2. Do not add
      `persist-credentials: false` here unless the user asks — it is not part of any finding.
- [x] Task 1.3: In `.github/workflows/ci.yml`, apply the same SHA pins to `actions/checkout@v7`,
      `actions/setup-node@v7` and `actions/upload-artifact@v7`.
- [x] Task 1.4: In `.github/workflows/ci.yml`, add a dependency-vulnerability gate after `npm ci`
      (informational finding I-6): `- run: npm audit --audit-level=high`. Leave `permissions: contents: read`
      and the `validate` job name untouched — the `Deploy` `workflows: [CI]` match depends on the workflow name.
- [x] Task 1.5: In `.github/dependabot.yml`, split the single `npm-minor-patch` group so production and
      development updates land in separate PRs (I-5), e.g. two groups with
      `dependency-type: 'production'` and `dependency-type: 'development'`. Keep the `github-actions` updater
      (it must keep refreshing the SHA pins from Task 1.2/1.3) and add
      `groups: { github-actions: { patterns: ['*'] } }` if the existing grouping needs to stay.
- [x] Task 1.6 **(added during implementation)**: In `.github/instructions/workflows.instructions.md`, replace
      the "pin to majors" rule with the SHA-pinning rule and refresh the CI step order. The scoped instruction
      file is the repository's own policy for this exact decision; leaving it as-is would have made the next
      agent re-pin `@v7`.

#### Recorded results (2026-10-19, Phase 1)

```console
$ npm run format:check
All matched files use Prettier code style!
$ grep -nE 'uses: [^ ]+@v[0-9]+$' .github/workflows/*.yml
grep exit=1                        # exit 1 = no matches: nothing is pinned to a major tag
$ grep -n 'workflow_run.event\|head_repository' .github/workflows/deploy.yml
38:          && github.event.workflow_run.event == 'push'
40:          && github.event.workflow_run.head_repository.full_name == github.repository)
$ grep -n 'uses: ' .github/workflows/*.yml
ci.yml:21      actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
ci.yml:22      actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
ci.yml:35      actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
deploy.yml:50  actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
deploy.yml:55  actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
deploy.yml:69  cloudflare/wrangler-action@953926a2e2182532811c01a25e53647d93bf07c0 # v4.1.3
$ npm audit --audit-level=high
found 0 vulnerabilities           # exit 0 — the new CI step passes today
$ npm run lint                    # 0 messages
$ npm run check                   # 30 files: 0 errors, 0 warnings, 0 hints
$ npm run build                   # 7 page(s) built, Complete!
$ npm run check:placeholders      # 0 placeholders remain.
$ npx wrangler deploy --dry-run   # exit 0, Read 32 files, no warnings
```

**Recorded deviation 1 — file outside the original §3.**
`.github/instructions/workflows.instructions.md` was edited (Task 1.6). It stated *"Pin third-party Actions to
majors, never `@main`"* and listed `@v7`/`@v4` as the required form, which directly contradicts M-2. A scoped
instruction file that contradicts committed code is worse than an unlisted edit: the next agent would follow it
and silently undo the hardening. The same file also listed the CI order as
`npm ci → format:check → check → build`, which was already stale (it omitted `lint` and `check:placeholders`)
before Task 1.4 added a step.

**Recorded behaviour change — manual `CI` dispatch no longer deploys.**
`ci.yml` has a `workflow_dispatch` trigger, and previously a manually dispatched `CI` run that succeeded would
fire `Deploy` through `workflow_run`. The new `if:` requires `workflow_run.event == 'push'`, so it no longer
does. That is deliberate (a manual test run is not an intent to ship) and `deploy.yml` keeps its own
`workflow_dispatch` for manual deploys — but it is a change readers should not have to discover.

#### Acceptance Criteria

- [x] Criterion 1: `npm run format:check` passes (it covers `.github/workflows/*.yml` and
      `.github/dependabot.yml`).
- [x] Criterion 2: `grep -nE 'uses: [^ ]+@v[0-9]+$' .github/workflows/*.yml` returns **no** matches — every
      Action is SHA-pinned with a trailing `# vN` comment (grep exit 1, recorded above).
- [x] Criterion 3: `grep -n 'workflow_run.event' .github/workflows/deploy.yml` shows the `push` assertion, and
      `grep -n 'head_repository' …` shows the same-repository assertion (lines 38 and 40, recorded above).
- [x] Criterion 4: Manual review: a `pull_request`-origin run of `CI` can no longer satisfy the job `if:` —
      `workflow_run.event` is `pull_request` there, so the `&&` chain is false; a `workflow_dispatch` from any
      ref other than `refs/heads/main` fails the first group's `github.ref` check. Not exercisable locally (no
      runner, and a real trigger would need a push to `main`); the expression was reviewed against both payload
      shapes instead.

### Phase 2: Rate limit and bound the entire request before parsing (M-1, M-3)

**Goal**: Every rejection is cheap, and no single client can drive unbounded e-mail volume or unbounded parse
work. **This is defence in depth, not the closure of a missing control** — the edge already limits a single IP
(verified), but that guarantee lives only in the dashboard and has drifted once, so it must also exist in the
repository where it can be reviewed and regressed.

#### Tasks

- [x] Task 2.1: In `wrangler.jsonc`, add a rate-limit binding next to `send_email` (M-1). The binding is a
      **version-controlled second layer** in front of the already-active edge rule, deliberately set looser so
      it never contradicts it:

      ```jsonc
      "ratelimits": [
        // Per-IP, per-location: the Workers Rate Limiting API is documented as
        // permissive and eventually consistent, so this is abuse friction, not a
        // global cap. A global ceiling would need a Durable Object (deferred).
        { "name": "CONTACT_RATE_LIMITER", "namespace_id": "2001", "simple": { "limit": 5, "period": 60 } },
      ],
      ```

      `namespace_id` must be a unique integer string for the account; `period` may only be `10` or `60`.
- [x] Task 2.2: In `src/worker/index.ts`, add module constants next to the existing ones:
      `MAX_BODY_BYTES = 16 * 1024`, `LIMIT_EXCEEDED` message, and
      `ALLOWED_CONTENT_TYPES = ['multipart/form-data', 'application/x-www-form-urlencoded']`
      (match by prefix — `multipart/form-data` carries a `boundary` parameter).
      *Deviation: no `LIMIT_EXCEEDED` constant was added — the message is a literal at the single call site,
      matching how every other `problem()` message is written.*
- [x] Task 2.3: In `src/worker/index.ts`, reorder `contact()` so no parsing precedes a gate. Exact order:
      (1) `request.method !== 'POST'` → `405` with `Allow: POST`; (2) rate limit;
      (3) `content-type` prefix not in the allowlist → `415`; (4) `content-length` numeric and
      `> MAX_BODY_BYTES` → `413`; (5) `request.formData()`; (6) honeypot; (7) `elapsed`; (8) per-field
      emptiness/length/CRLF; (9) e-mail format; (10) `serviceType`; (11) Turnstile; (12) send.
      Implemented in that order; the unexpected/duplicate-field check sits between (5) and (6).
- [x] Task 2.4: In `src/worker/index.ts`, add the limiter call as step (2):
      `const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';`
      `const { success } = await env.CONTACT_RATE_LIMITER.limit({ key });`
      `if (!success) return problem(429, 'Too many requests');`
      Wrap the call in `try/catch` and **fail closed** (`problem(429, …)`) only if the user accepts that
      trade-off — otherwise document explicitly in a comment that a binding error fails **open** and say why
      (a rate limiter outage must not take the contact form down). Pick one and record the decision in the plan.
      **Decision taken: FAIL OPEN.** Extracted into `withinRateLimit()`; on a binding error it logs
      `rate limiter unavailable` with the error *name only* (never the key, so no visitor IP reaches Workers
      Logs) and returns `true`. Rationale: this is the inner layer, the zone rule and Turnstile still gate the
      request, and a limiter outage must not take the contact form down.
- [x] Task 2.5: In `src/worker/index.ts`, extend `problem()` to accept optional extra headers
      (`headers?: Record<string, string>`) so `415`/`429`/`405` can carry the right values, and add
      `'Cache-Control': 'no-store'` to `SECURITY_HEADERS` (L-5) — it then applies to every `problem()` response
      and to the `303`.
      No `Retry-After` was added: the local window is 60 s and the edge window is 10 s, so any single value
      would misstate one of them.
- [x] Task 2.6: In `src/worker/index.ts`, refuse oversized bodies even without a usable `content-length`: after
      parsing, reject when any single field exceeds `MAX_FIELD_LENGTH` (already present) **and** when the parsed
      field count exceeds the expected set, returning `400`.
      **Deviation: implemented as an unknown-field/duplicate-field rejection** (`ALLOWED_FIELDS` allowlist plus
      a duplicate-key check) rather than a raw count. A count is both weaker — nine attacker-chosen names pass
      it — and more brittle — any future legitimate field breaks it. Underlying limit recorded honestly: a
      chunked body with no `content-length` still reaches `formData()`; the Workers API offers no streaming
      size cap, so the platform's own body ceiling is the backstop there.

#### Recorded results (2026-10-19, Phase 2)

```console
$ npm run check
Result (30 files):
- 0 errors
- 0 warnings
- 0 hints
$ grep -n 'CONTACT_RATE_LIMITER' worker-configuration.d.ts
7:      CONTACT_RATE_LIMITER: RateLimit;

$ npx wrangler dev   # local workerd; "Rate Limit 5 requests/60s" shown as a local binding

$ curl -s -D- -o /dev/null -X GET http://127.0.0.1:8787/api/contact
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json
Allow: POST
Cache-Control: no-store

$ curl ... -H 'content-type: text/plain' --data 'x'        → 415
$ curl ... -H 'content-type: application/x-www-form-urlencoded' --data-binary @- (20000 B)  → 413
$ curl ... --data 'foo=bar'                                 → {"error":"Unexpected field"} 400

$ # six POSTs sharing one CF-Connecting-IP
415 415 415 415 415 {"error":"Too many requests"} 429
```

The `wrangler dev` request log corroborates it: `GET 405`, `POST 415`, `POST 413`, `POST 400`, then
`415 ×5` and a final `429 Too Many Requests`.

**Verification note — the rate-limit key is spoofable only locally.** `wrangler dev` does not overwrite
`CF-Connecting-IP`, so the probes above set it explicitly to give each group its own bucket. In production
Cloudflare sets that header at the edge and a client cannot influence it, which is why it is a safe key.

**Limitation recorded, not hidden:** a chunked body without `content-length` is not caught by the size gate —
the Workers API exposes no streaming limit, so the platform body ceiling is the backstop for that case.

#### Acceptance Criteria

- [x] Criterion 1: `npm run check` passes and `grep -n 'CONTACT_RATE_LIMITER' worker-configuration.d.ts` shows
      the binding in the generated `Env` (line 7: `CONTACT_RATE_LIMITER: RateLimit;`) — proves `wrangler types`
      chained correctly. The file is gitignored, so this is a run-time check, not a commit.
- [x] Criterion 2: `npx wrangler dev` (local, simulates the `send_email` bindings) then six rapid POSTs return
      five non-`429` statuses followed by `429` — recorded verbatim above. The rate-limit binding **is**
      simulated locally, so the plan's pre-recorded uncertainty ("if the local simulation does not enforce it")
      does not apply.
- [x] Criterion 3: `text/plain` → `415`; a >16 KiB urlencoded body → `413`; `GET` → `405` with `Allow: POST`
      and `Cache-Control: no-store` present.
- [x] Criterion 4: Static analysis passes with zero suppressions (`npm run lint` → 0 messages;
      `npm run format:check` → all files compliant). No `@ts-ignore`, no disabled rule.

### Phase 3: Input-validation and logging hardening (L-1, L-2, L-3, L-4)

**Goal**: Remove the residual mail-serialisation, log-retention and serialisation-edge risks.

#### Tasks

- [x] Task 3.1: In `src/worker/index.ts`, replace `EMAIL_RE` with a pragmatic RFC 5322 dot-atom form that
      excludes `< > , " ( ) ; : \` whitespace and all control characters, e.g.

      ```ts
      const EMAIL_LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
      const EMAIL_DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
      ```

      plus explicit length caps (`email.length <= 254`, local part `<= 64`). Verify the existing form still
      accepts ordinary addresses (`name@example.com`, `first.last+tag@sub.example.co.uk`). Record the accepted
      trade-off: punycode **TLDs** are rejected.
- [x] Task 3.2: In `src/worker/index.ts`, replace `console.error('contact delivery failed', error)` with a
      redacted form that never serialises the thrown object:
      `console.error('contact delivery failed', { binding: 'NOTIFY', name: errorName(error) })` (and the same for
      `REPLY`), where `errorName` returns `error instanceof Error ? error.name : typeof error`.
      Implemented by splitting the single `try` into one per binding, so the log names which send failed.
      `errorName` is also reused by `withinRateLimit()`.
- [x] Task 3.3: In `src/layouts/BaseLayout.astro`, change the JSON-LD sink to
      `set:html={JSON.stringify(jsonLd).replace(/</g, '\\u003c')}` and add a one-line comment stating why
      (`JSON.stringify` does not escape `</script>`).
- [x] Task 3.4: In `scripts/check-production-env.mjs`, add a second check that reads
      `../src/config.ts` and asserts the `PRODUCTION_SITE_KEY` literal is **not** in `TEST_SITE_KEYS`, failing
      with a clear message if the literal cannot be found (so a refactor cannot silently disable the guard).
      Do **not** import the `.ts` module from an `.mjs` script — parse the source text instead; that keeps the
      script runnable on the same Node with no loader flags.
- [x] Task 3.5: Update `AGENTS.md`: (a) the Turnstile paragraph gains "the committed default is validated too";
      (b) **correct the stale contact-rate-limit gotcha** — the rule is in the `http_ratelimit` phase, enabled,
      and does 5 req / 10 s per IP+colo (verified 2026-10-19 via the Cloudflare API), so the "inert
      `/api/contact` block rule" open item must be closed rather than carried forward. Do not restate the
      audit; link it. Update the repository memory (`/memories/repo/vgr.cat.md`) the same way.
      **(a) done. (b) partially corrected — see the note below: `AGENTS.md` never contained that claim.**

#### Recorded results (2026-10-19, Phase 3)

**Criterion 1 — the real handler, not a regex copy.** The rule was exercised through `wrangler dev`, so the
verdicts below come from the shipped code path. `400 Invalid email` means `isValidEmail()` rejected the value;
`403 Challenge missing` means it **passed** e-mail validation and was stopped by the next gate.

```console
$ POST /api/contact  (all other fields valid; no Turnstile token)
a,b@x.com                         -> {"error":"Invalid email"} 400
"x"@y.com                         -> {"error":"Invalid email"} 400
<x>@y.com                         -> {"error":"Invalid email"} 400
a@b                               -> {"error":"Invalid email"} 400
a@b.c                             -> {"error":"Invalid email"} 400
name@example.com                  -> {"error":"Challenge missing"} 403
first.last+tag@sub.example.co.uk  -> {"error":"Challenge missing"} 403
user@xn--80ak6aa92e.com           -> {"error":"Challenge missing"} 403
65-char local part                -> {"error":"Invalid email"} 400
```

**Criterion 2 — the deploy guard, three modes:**

```console
$ npm run check:production-env
check:production-env — no PUBLIC_TURNSTILE_SITE_KEY override; the committed sitekey is used and is not a test key.
exit=0
$ PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run check:production-env
check:production-env — refusing to deploy with the Turnstile test sitekey 1x00000000000000000000AA.
exit=1
$ PUBLIC_TURNSTILE_SITE_KEY=0xNotARealTestKey npm run check:production-env
check:production-env — both the committed and the override Turnstile sitekeys are non-test keys; proceeding.
exit=0
```

The third run is the evidence that the committed key is now inspected: its success message can only be
reached after the `PRODUCTION_SITE_KEY` extraction succeeded and cleared `TEST_SITE_KEYS`. The remaining case
— a test key committed **as** `PRODUCTION_SITE_KEY` — was reasoned from the code rather than executed, because
proving it would require committing a test key (forbidden): the `TEST_SITE_KEYS.has(committed)` branch sits
before the override check and calls `process.exit(1)`. The not-found branch fails the same way, so a refactor
that renames the constant cannot silently disable the guard.

**Criterion 3 — JSON-LD:**

```console
$ npm run build
[build] 7 page(s) built, Complete!
$ node -e "...extract and JSON.parse the ld+json block..."
parsed ok; graph nodes = 2 ; raw < inside block = 0
$ node -e "...JSON.stringify then replace(/</g,'\\u003c')..."
escaped < count = 0 ; parses = </script><script>alert(1)</script>
```

Current content contains no `<`, so the escape is a no-op on today's pages — recorded honestly rather than
claimed as an active fix. The second check proves the transform itself: after escaping, the payload contains
**zero** `<`, still parses as JSON, and round-trips the hostile string intact.

**Criterion 4 — redacted logging:**

```console
$ grep -n "console.error('contact delivery failed'" src/worker/index.ts
302:    console.error('contact delivery failed', {
317:    console.error('contact delivery failed', {
# followed by: binding: 'NOTIFY' / binding: 'REPLY', name: errorName(error)
```

**Note on Task 3.5(b) — the premise was wrong.** `AGENTS.md` never contained the stale
"rate limit is inert in `dynamic-redirect`" claim; it lived only in the repository memory, which was corrected
on 2026-10-19. Rather than fabricate an edit, an accurate two-layer bullet was **added** to `AGENTS.md` (zone
`http_ratelimit` rule + `CONTACT_RATE_LIMITER`, which fails open). Recorded so the difference between
"corrected" and "added" is visible.

**Process note.** The first probe run returned `400` for *every* address, including valid ones. The cause was
shell-side, not code-side: zsh does not word-split an unquoted scalar, so the shared curl arguments arrived as
one malformed option. Re-run with an array (`C=(...); curl "${C[@]}"`) produced the table above. The pitfall
is now recorded in the repository memory.

#### Acceptance Criteria

- [x] Criterion 1: the valid/invalid table above, produced by the **real handler** rather than a duplicated
      regex — a strictly stronger check than the `node -e` probe the criterion asked for.
- [x] Criterion 2: `npm run check:production-env` exits `0` with the committed key; exits `1` with the test-key
      override; and the committed-test-key case is reasoned from the code with the not-found case as its
      fail-closed sibling (a test key was **not** committed).
- [x] Criterion 3: build emits JSON-LD that parses (2 graph nodes, 0 raw `<`); the escape is a no-op on current
      content and its correctness was proven separately.
- [x] Criterion 4: both call sites pass `{ binding, name: errorName(error) }`; no raw `error` argument remains.

### Phase 4: Browser and build hygiene (I-2, I-4, L-6 if not done in Phase 1)

**Goal**: Add the two cheap isolation headers and stop the remaining reproducibility drift, without touching the
CSP or the inline-style strategy.

#### Tasks

- [x] Task 4.1: In `public/_headers`, add to the `/*` block:
      `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`. Do **not** add
      `Cross-Origin-Embedder-Policy` (it would break the Turnstile iframe) and do **not** touch the CSP.
      Add a comment noting CORP intentionally blocks third-party embedding of `/og/og-default.png` etc.
- [x] Task 4.2: In `.nvmrc`, replace `24` with the exact patch already verified locally (currently `24.22.0`)
      and confirm it still satisfies `eslint-plugin-astro`'s `^24.16.0` peer range. If the user prefers the
      floating major, stop and record the deferral instead.
      Done: `.nvmrc` is now `24.22.0`, the runtime `npm run lint` was executed on, and the plugin's range reads
      `^22.22.3 || ^24.16.0 || >=26.3.0`.
- [x] Task 4.3: If Task 1.1 was deferred, apply the `workflow_dispatch` ref guard from Phase 1 here; otherwise
      mark this task as already satisfied and say where.
      **Already satisfied in Phase 1** — the `github.ref == 'refs/heads/main'` clause went in with the H-1 fix
      (`deploy.yml`, first `||` group). Nothing to do here.

#### Recorded results (2026-10-19, Phase 4)

```console
$ npm run build
[build] 7 page(s) built, Complete!
$ grep -ci 'cross-origin-opener-policy' dist/_headers      # -i: header names are capitalised
1
$ grep -c 'Cross-Origin-Embedder-Policy:' dist/_headers
0                                                          # COEP deliberately not a header
$ grep -c "unsafe-inline\|unsafe-eval" dist/index.html
0                                                          # CSP untouched
$ cat .nvmrc
24.22.0
$ node --version
v24.22.0

$ npx wrangler dev   # "✨ Parsed 2 valid header rules" — unchanged count, so the `#` comments added no rule
$ curl -s -D- -o /dev/null http://127.0.0.1:8787/
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
permissions-policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
                                                           # no cross-origin-embedder-policy — as intended
```

**Process note — the criterion's own grep was wrong.** `grep -c 'cross-origin-opener-policy'` returns `0`
because HTTP field names here are capitalised (`Cross-Origin-Opener-Policy`); `grep` is case-sensitive. The
header was present on the first build; the criterion needs `grep -ci`. Recorded rather than silently corrected,
because a future reader comparing the plan to a real run would hit the same false negative.

**Extra verification beyond the criterion.** `wrangler dev` reports the same two header rules as before, so the
`#` comment block did not become a third rule, and a real response from the assets layer carries both new
headers. That is stronger than grepping the built file: it proves the parser accepted the comments *and* that
the headers reach the browser.

#### Acceptance Criteria

- [x] Criterion 1: `npm run build`, then COOP is present in `dist/_headers` (`1`, with `grep -ci`) and
      `grep -c "unsafe-inline\|unsafe-eval" dist/index.html` → `0` (CSP untouched).
- [x] Criterion 2: `cat .nvmrc` prints `24.22.0` (full `X.Y.Z`); `npm run lint` passes on `v24.22.0`, which is
      inside `eslint-plugin-astro`'s `^24.16.0` range.

### Phase 5: Verification sweep and audit status

**Goal**: Prove the whole gate is green, prove no unintended file changed, and record what remains unverifiable.

#### Tasks

- [x] Task 5.1: Run the full gate in order and paste the exact output into the plan:
      `npm ci` → `npm run format:check` → `npm run lint` → `npm run check` → `npm run build` →
      `npm run check:placeholders` → `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`.
      Done — output recorded below. `npm ci` was run for real (not dry-run): the cache was writable and the
      install reproduced a working tree, which is the same thing CI does on the newly pinned Node.
- [x] Task 5.2: Inspect the artifact: `find dist -name '*.map'` (empty),
      `grep -rIl -E 'TURNSTILE_SECRET_KEY|CLOUDFLARE_API_TOKEN' dist` (empty),
      `grep -o 'content-security-policy[^>]*' dist/index.html` (unchanged directive set).
- [x] Task 5.3: Confirm `git status --short` lists **only** the files in §3.
      Confirmed: 13 modified files, all listed in §3; no untracked files. (13, not 12, because appending the
      audit addendum in Task 5.4 also modified `.ai/plans/active/2026-10-19-security-audit.md`, which is a §3
      entry.)
- [x] Task 5.4: Append a dated "Remediation status" note to
      `.ai/plans/active/2026-10-19-security-audit.md` mapping each audit ID (H-1, M-1…M-3, L-1…L-6) to
      fixed / deferred / user-action-required. **Do not edit or rewrite any command output already recorded in
      that file** — the plans instruction forbids falsifying recorded evidence.
      Done: appended as a new `# Remediation Status (addendum, 2026-10-19)` section; nothing above it was
      touched.
- [x] Task 5.5: Do **not** commit or push. Propose a Conventional Commit message and stop
      (`fix(security): …` / `ci(security): …` as separate commits — one per phase is preferable so H-1 and M-1
      can be reverted independently).
      No commit was made. Messages proposed below, with the caveat that a true per-phase split is not possible
      at file granularity because `src/worker/index.ts` carries Phase 2 **and** Phase 3 edits.

#### Recorded results (2026-10-19, Phase 5)

```console
$ npm ci
found 0 vulnerabilities
npm warn install-scripts 2 packages have install scripts not yet covered by allowScripts:
  esbuild@0.28.2 (postinstall: node install.js)
  workerd@1.20261012.1 (postinstall: node install.js)
$ node_modules/@esbuild/linux-x64/bin/esbuild  → present
$ node -e "require('esbuild')"                 → esbuild loads
$ npx astro --version                          → astro  v7.4.0

$ npm run format:check    → All matched files use Prettier code style!
$ npm run lint            → eslint . (0 messages)
$ npm run check           → 30 files: 0 errors, 0 warnings, 0 hints
$ npm run build           → 7 page(s) built, Complete!
$ npm run check:placeholders → 0 placeholders remain.
$ npx wrangler deploy --dry-run --outdir=.wrangler/dry-run
✨ Read 32 files from the assets directory …/dist
Total Upload: 8.19 KiB / gzip: 3.15 KiB
env.NOTIFY (contact@vgr.cat)                 Send Email
env.REPLY (unrestricted)                     Send Email
env.CONTACT_RATE_LIMITER (5 requests/60s)    Rate Limit
env.ASSETS                                   Assets
env.CONTACT_DESTINATION ("contact@vgr.cat")  Environment Variable
env.TURNSTILE_HOSTNAMES ("vgr.cat")          Environment Variable
--dry-run: exiting now.

$ find dist -name '*.map'                                     → (empty)
$ grep -rIl -E 'TURNSTILE_SECRET_KEY|CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID' dist → (none found)
$ CSP directives (unchanged set, 9 directives, no unsafe-*):
default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';
frame-src https://challenges.cloudflare.com; connect-src 'self' https://cloudflareinsights.com;
script-src https://challenges.cloudflare.com https://static.cloudflareinsights.com 'sha256-…';
style-src 'self' 'sha256-…'
$ find dist -type f | wc -l → 22
$ git status --short        → 13 modified files, all listed in §3, no untracked files
```

`npm ci` emits an advisory `install-scripts … not yet covered by allowScripts` warning naming `esbuild` and
`workerd`. The scripts **did** run — the esbuild binary is present and loadable — so this is noise from the
newer npm, not a skipped postinstall. Worth knowing because CI will print the same warning on every run.

**Proposed commits (nothing was committed):**

```text
1. ci(security): gate deploys on run provenance and pin actions by SHA

   deploy.yml only checked workflow_run.conclusion, so a successful CI run
   triggered by a pull request could reach CLOUDFLARE_API_TOKEN. Assert the
   triggering event, branch and repository, and restrict manual deploys to main.
   Pin every third-party action to an immutable commit SHA and add an npm audit
   gate to CI.

   Files: .github/workflows/{ci,deploy}.yml, .github/dependabot.yml,
          .github/instructions/workflows.instructions.md, .nvmrc

2. fix(contact): rate limit, size-bound and harden the submission endpoint

   Parse nothing before the cheap gates: method, per-IP rate limit, content-type
   allowlist, 16 KiB body cap, then field allowlist. Tighten the e-mail rule to
   dot-atom form with length caps, redact delivery-error logs to the binding and
   error name, escape </script> in JSON-LD, add no-store to API responses, and
   reject a committed Turnstile test sitekey at deploy time. Add COOP/CORP.

   Files: wrangler.jsonc, src/worker/index.ts, src/layouts/BaseLayout.astro,
          public/_headers, scripts/check-production-env.mjs

3. docs(agents): record verified rate-limit state and remediation status

   The repo recorded the contact rate-limit rule as inert in the dynamic-redirect
   phase. It is in http_ratelimit and enabled. Correct AGENTS.md, record the two
   layers, and append the audit's remediation status.

   Files: AGENTS.md, .ai/plans/active/*.md
```

A strict per-phase split would require `git add -p`, because `src/worker/index.ts` holds both Phase 2 and
Phase 3 edits. The three-commit shape above keeps H-1/M-2 revertible independently of the endpoint changes.

#### Acceptance Criteria

- [x] Criterion 1: Every gate command exits `0`; `npm run check` still reports `30 files / 0 errors / 0 warnings
      / 0 hints` (no file added under `src/`).
- [x] Criterion 2: `wrangler deploy --dry-run` exits `0` with no warnings and `Read 32 files` — identical to the
      Phase 0 baseline (`Read 32 files`).
- [x] Criterion 3: The audit's remediation note accounts for H-1, M-1…M-3, L-1…L-6 (the 10 fixable), plus L-7,
      L-8, I-2, I-4, I-5, I-6, I-12 and the remaining informational items, each classified
      fixed / deferred / user-action / accepted-as-is.

## 5. Post-Implementation Verification & Regression Checks

- [ ] Feature end-to-end functionality verified — **within the documented limit**: the contact happy path
      cannot be proved with test keys (the test secret reports `hostname: example.com` and omits `action`, so
      Siteverify's action gate rejects it). Verified instead: `415`, `413`, `405`, `429`, `400` (honeypot,
      elapsed, CRLF, e-mail) and `403` (missing/invalid token) against `wrangler dev`. The happy path is
      confirmed only by the existing production evidence — state this rather than ticking it.
      **Left unticked deliberately** (see Phase 2/3 evidence): the rejected/limited paths were verified
      locally; the happy path was not and cannot be.
- [x] Test suites, linters, and static analyzers pass cleanly (`format:check`, `lint`, `check`, `build`,
      `check:placeholders`, `check:production-env`, `wrangler --dry-run`) with **zero** suppressions added.
- [x] No unintended modifications outside the listed affected files (`git status --short`).
- [x] **Recorded deferrals** (do not silently drop) — all four are carried in the audit's
      `# Remediation Status` addendum under "Deferred" and "Requires a human":
      1. Global, cross-location rate ceiling — needs a Durable Object; revisit if the per-IP limiter is bypassed
         by distributed sources.
      2. Content-markdown sanitisation (audit L-7) — contained by the hash CSP; revisit when content is
         accepted from a non-maintainer or the CSP is relaxed.
      3. `.nvmrc` exact pin — **not deferred**: Task 4.2 pinned `24.22.0`.
      4. All GitHub settings in Task 0.3 and the remaining Cloudflare items in Task 0.4 (a)–(e) — user-owned,
         outside any agent's authority. **Verified done 2026-10-19:** the `http_ratelimit` rule, the absence of a
         wildcard route/DNS record, the absence of cache and custom WAF rules, and zone HSTS being off.
- [x] **Recorded uncertainty** — stated plainly in the audit's "Not verified by execution" list: the `if:`
      expression was reviewed against both payload shapes but never triggered, and the hardening stands on its
      own regardless of how `on.workflow_run.branches` treats `pull_request`-origin runs. The original filter is
      **not** claimed to have been broken.
- [x] Local `wrangler dev` support for the `ratelimits` binding — **resolved, not deferred**: the dev server
      reports `env.CONTACT_RATE_LIMITER  Rate Limit  5 requests/60s` and the sixth POST returned `429`, so
      Criterion 2 of Phase 2 is genuinely verified locally.

---

## Archive Metadata

- **Completed Date**: 2026-10-19
- **Verified Commit**: 8c158d2
- **Sign-off**: Manual Review Passed

**Deferred criteria (archived with 7 unticked boxes, by explicit user confirmation on 2026-10-19).** Every
Phase task (0.1–5.5) and every Acceptance Criterion is ticked. The seven remaining boxes are:

1. **Six user-owned GitHub settings** (recorded evidence, Task 0.3 block): `production` environment reviewers
   and a `main`-only deployment branch rule, fork-PR workflow policy, secret scanning + push protection,
   Dependabot alerts, CodeQL default setup, signed-commit re-confirmation. None is reachable by a repository
   change, so no agent could complete them. Tracked in the audit addendum under "Requires a human".
2. **"Feature end-to-end functionality verified"** (§5), left unticked deliberately: the contact happy path
   cannot be proven with Turnstile test keys because Siteverify's `action` gate rejects them. Rejection and
   limit paths were verified locally; the happy path rests on pre-existing production evidence.

**Also carried, not closed:** the two deferrals — a global cross-location rate ceiling (needs a Durable Object)
and content-markdown sanitisation (audit L-7) — plus the review finding raised after deployment, that
`MAX_BODY_BYTES` (16 KiB) is smaller than a worst-case legitimate multipart body (~22.4 KB, measured).

**In-body paths.** Several references above still read `.ai/plans/active/...`. That is deliberate: they occur
inside recorded command output and recorded evidence, and rewriting them would falsify the record.
