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
- `.ai/plans/active/2026-10-19-security-audit.md` - `[Modify]` - the audit is the source of truth; do **not**
  rewrite its recorded command output. Append a dated "Remediation status" note instead (§5).

## 4. Step-by-Step Execution Plan

### Phase 0: Preconditions and externally-owned verification

**Goal**: Establish a clean baseline, resolve the mutable-action SHAs, and hand the user the settings checklist
that no repository change can satisfy.

#### Tasks

- [ ] Task 0.1: In `/home/vagonzal/repos/vgr.cat`, confirm a clean tree and green baseline before touching
      anything: `git status --short` (empty), `npm run format:check`, `npm run lint`, `npm run check`
      (expect `30 files, 0 errors, 0 warnings, 0 hints`), `npm run build`, `npm run check:placeholders`.
- [ ] Task 0.2: Resolve immutable refs for every third-party Action (M-2). For each of
      `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`,
      `cloudflare/wrangler-action@v4` run, e.g.
      `gh api repos/actions/checkout/git/ref/tags/v7 --jq '.object.type + " " + .object.sha'`.
      If `type` is `tag` (annotated), dereference with
      `gh api repos/actions/checkout/git/tags/<sha> --jq '.object.sha'`.
      Record all four resolved SHAs **in this plan** under a dated note before editing any workflow.
- [ ] Task 0.3: Produce the user-facing settings checklist (do not attempt to apply it):
      GitHub → `production` environment required reviewers + deployment branches restricted to `main`;
      fork-PR workflow policy; secret scanning + push protection; Dependabot alerts; CodeQL default setup;
      confirm `main` still requires signed commits.
- [ ] Task 0.4: Cloudflare side — **already verified read-only on 2026-10-19, do not re-derive**: the
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

#### Acceptance Criteria

- [ ] Criterion 1: Baseline gate is green and its output is pasted into the plan's evidence note
      (`npm run check` line, `npm run build` page count, `wrangler --dry-run` file count).
- [ ] Criterion 2: Four full SHAs are recorded, each with the tag it corresponds to, and no workflow has been
      edited yet.

### Phase 1: Close the deployment trust boundary (H-1, M-2, L-6)

**Goal**: Make it impossible for a `pull_request`-origin `CI` run, or a non-`main` manual dispatch, to reach
`CLOUDFLARE_API_TOKEN`; make every Action reference immutable.

#### Tasks

- [ ] Task 1.1: In `.github/workflows/deploy.yml`, replace the job `if:` with an explicit trust expression
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
- [ ] Task 1.2: In `.github/workflows/deploy.yml`, replace `actions/checkout@v7`, `actions/setup-node@v7` and
      `cloudflare/wrangler-action@v4` with `owner/repo@<full-sha> # vN` using the SHAs from Task 0.2. Do not add
      `persist-credentials: false` here unless the user asks — it is not part of any finding.
- [ ] Task 1.3: In `.github/workflows/ci.yml`, apply the same SHA pins to `actions/checkout@v7`,
      `actions/setup-node@v7` and `actions/upload-artifact@v7`.
- [ ] Task 1.4: In `.github/workflows/ci.yml`, add a dependency-vulnerability gate after `npm ci`
      (informational finding I-6): `- run: npm audit --audit-level=high`. Leave `permissions: contents: read`
      and the `validate` job name untouched — the `Deploy` `workflows: [CI]` match depends on the workflow name.
- [ ] Task 1.5: In `.github/dependabot.yml`, split the single `npm-minor-patch` group so production and
      development updates land in separate PRs (I-5), e.g. two groups with
      `dependency-type: 'production'` and `dependency-type: 'development'`. Keep the `github-actions` updater
      (it must keep refreshing the SHA pins from Task 1.2/1.3) and add
      `groups: { github-actions: { patterns: ['*'] } }` if the existing grouping needs to stay.

#### Acceptance Criteria

- [ ] Criterion 1: `npm run format:check` passes (it covers `.github/workflows/*.yml`).
- [ ] Criterion 2: `grep -nE 'uses: [^ ]+@v[0-9]+$' .github/workflows/*.yml` returns **no** matches — every
      Action is SHA-pinned with a trailing `# vN` comment.
- [ ] Criterion 3: `grep -n 'workflow_run.event' .github/workflows/deploy.yml` shows the `push` assertion, and
      `grep -n 'head_repository' …` shows the same-repository assertion.
- [ ] Criterion 4: Manual review: a `pull_request`-origin run of `CI` can no longer satisfy the job `if:`;
      a `workflow_dispatch` from any ref other than `refs/heads/main` is skipped (verify by reading the
      expression against the two event payload shapes — this cannot be exercised locally).

### Phase 2: Rate limit and bound the entire request before parsing (M-1, M-3)

**Goal**: Every rejection is cheap, and no single client can drive unbounded e-mail volume or unbounded parse
work. **This is defence in depth, not the closure of a missing control** — the edge already limits a single IP
(verified), but that guarantee lives only in the dashboard and has drifted once, so it must also exist in the
repository where it can be reviewed and regressed.

#### Tasks

- [ ] Task 2.1: In `wrangler.jsonc`, add a rate-limit binding next to `send_email` (M-1). The binding is a
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
- [ ] Task 2.2: In `src/worker/index.ts`, add module constants next to the existing ones:
      `MAX_BODY_BYTES = 16 * 1024`, `LIMIT_EXCEEDED` message, and
      `ALLOWED_CONTENT_TYPES = ['multipart/form-data', 'application/x-www-form-urlencoded']`
      (match by prefix — `multipart/form-data` carries a `boundary` parameter).
- [ ] Task 2.3: In `src/worker/index.ts`, reorder `contact()` so no parsing precedes a gate. Exact order:
      (1) `request.method !== 'POST'` → `405` with `Allow: POST`; (2) rate limit;
      (3) `content-type` prefix not in the allowlist → `415`; (4) `content-length` numeric and
      `> MAX_BODY_BYTES` → `413`; (5) `request.formData()`; (6) honeypot; (7) `elapsed`; (8) per-field
      emptiness/length/CRLF; (9) e-mail format; (10) `serviceType`; (11) Turnstile; (12) send.
- [ ] Task 2.4: In `src/worker/index.ts`, add the limiter call as step (2):
      `const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';`
      `const { success } = await env.CONTACT_RATE_LIMITER.limit({ key });`
      `if (!success) return problem(429, 'Too many requests');`
      Wrap the call in `try/catch` and **fail closed** (`problem(429, …)`) only if the user accepts that
      trade-off — otherwise document explicitly in a comment that a binding error fails **open** and say why
      (a rate limiter outage must not take the contact form down). Pick one and record the decision in the plan.
- [ ] Task 2.5: In `src/worker/index.ts`, extend `problem()` to accept optional extra headers
      (`headers?: Record<string, string>`) so `415`/`429`/`405` can carry the right values, and add
      `'Cache-Control': 'no-store'` to `SECURITY_HEADERS` (L-5) — it then applies to every `problem()` response
      and to the `303`.
- [ ] Task 2.6: In `src/worker/index.ts`, refuse oversized bodies even without a usable `content-length`: after
      parsing, reject when any single field exceeds `MAX_FIELD_LENGTH` (already present) **and** when the parsed
      field count exceeds the expected set, returning `400`.

#### Acceptance Criteria

- [ ] Criterion 1: `npm run check` passes and `grep -n 'CONTACT_RATE_LIMITER' worker-configuration.d.ts` shows
      the binding in the generated `Env` (proves `wrangler types` chained correctly — the file is gitignored,
      so this is a run-time check, not a commit).
- [ ] Criterion 2: `npx wrangler dev` (local, simulates the `send_email` bindings) then six rapid
      `curl -s -o /dev/null -w '%{http_code}\n' -X POST http://127.0.0.1:8787/api/contact` calls return five
      non-`429` statuses followed by `429`. Record the exact output.
- [ ] Criterion 3: `curl -s -D- -o /dev/null -X POST -H 'content-type: text/plain' --data 'x'
      http://127.0.0.1:8787/api/contact` → `415`; with `-H 'content-type: application/x-www-form-urlencoded'`
      and a `Content-Length` above 16 KiB → `413`; `curl -s -D- -o /dev/null -X GET …` → `405` with
      `Allow: POST` and `Cache-Control: no-store` present.
- [ ] Criterion 4: Static analysis passes with zero suppressions (`npm run lint`).

### Phase 3: Input-validation and logging hardening (L-1, L-2, L-3, L-4)

**Goal**: Remove the residual mail-serialisation, log-retention and serialisation-edge risks.

#### Tasks

- [ ] Task 3.1: In `src/worker/index.ts`, replace `EMAIL_RE` with a pragmatic RFC 5322 dot-atom form that
      excludes `< > , " ( ) ; : \` whitespace and all control characters, e.g.

      ```ts
      const EMAIL_LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
      const EMAIL_DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
      ```

      plus explicit length caps (`email.length <= 254`, local part `<= 64`). Verify the existing form still
      accepts ordinary addresses (`name@example.com`, `first.last+tag@sub.example.co.uk`). Record the accepted
      trade-off: punycode **TLDs** are rejected.
- [ ] Task 3.2: In `src/worker/index.ts`, replace `console.error('contact delivery failed', error)` with a
      redacted form that never serialises the thrown object:
      `console.error('contact delivery failed', { binding: 'NOTIFY', name: errorName(error) })` (and the same for
      `REPLY`), where `errorName` returns `error instanceof Error ? error.name : typeof error`.
- [ ] Task 3.3: In `src/layouts/BaseLayout.astro`, change the JSON-LD sink to
      `set:html={JSON.stringify(jsonLd).replace(/</g, '\\u003c')}` and add a one-line comment stating why
      (`JSON.stringify` does not escape `</script>`).
- [ ] Task 3.4: In `scripts/check-production-env.mjs`, add a second check that reads
      `../src/config.ts` and asserts the `PRODUCTION_SITE_KEY` literal is **not** in `TEST_SITE_KEYS`, failing
      with a clear message if the literal cannot be found (so a refactor cannot silently disable the guard).
      Do **not** import the `.ts` module from an `.mjs` script — parse the source text instead; that keeps the
      script runnable on the same Node with no loader flags.
- [ ] Task 3.5: Update `AGENTS.md`: (a) the Turnstile paragraph gains "the committed default is validated too";
      (b) **correct the stale contact-rate-limit gotcha** — the rule is in the `http_ratelimit` phase, enabled,
      and does 5 req / 10 s per IP+colo (verified 2026-10-19 via the Cloudflare API), so the "inert
      `/api/contact` block rule" open item must be closed rather than carried forward. Do not restate the
      audit; link it. Update the repository memory (`/memories/repo/vgr.cat.md`) the same way.

#### Acceptance Criteria

- [ ] Criterion 1: `node -e` unit-style probe of the two regexes over a table of valid/invalid addresses
      (`a,b@x.com`, `"x"@y.com`, `<x>@y.com`, `a@b`, `a@b.c`, `first.last+tag@sub.example.co.uk`) produces the
      expected accept/reject verdicts; paste the table and output into the plan.
- [ ] Criterion 2: `npm run check:production-env` exits `0` with the committed key, and exits `1` when the
      script is run with `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`; record both invocations.
      Then, with the working tree temporarily reverted in-memory (no file edit), reason through and record what
      happens if `PRODUCTION_SITE_KEY` were a test key: the script **must** exit `1`. Do not commit a test key.
- [ ] Criterion 3: `npm run build`, then
      `grep -o 'application/ld+json[^<]*' dist/index.html | grep -c '\\\\u003c'` → at least `1` only if a field
      actually contains `<`; otherwise record that the escape is a no-op on current content and prove the sink
      by asserting the emitted JSON-LD still parses (`node -e` on the extracted block).
- [ ] Criterion 4: `grep -n "console.error('contact delivery failed'" src/worker/index.ts` shows no raw `error`
      argument.

### Phase 4: Browser and build hygiene (I-2, I-4, L-6 if not done in Phase 1)

**Goal**: Add the two cheap isolation headers and stop the remaining reproducibility drift, without touching the
CSP or the inline-style strategy.

#### Tasks

- [ ] Task 4.1: In `public/_headers`, add to the `/*` block:
      `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`. Do **not** add
      `Cross-Origin-Embedder-Policy` (it would break the Turnstile iframe) and do **not** touch the CSP.
      Add a comment noting CORP intentionally blocks third-party embedding of `/og/og-default.png` etc.
- [ ] Task 4.2: In `.nvmrc`, replace `24` with the exact patch already verified locally (currently `24.22.0`)
      and confirm it still satisfies `eslint-plugin-astro`'s `^24.16.0` peer range. If the user prefers the
      floating major, stop and record the deferral instead.
- [ ] Task 4.3: If Task 1.1 was deferred, apply the `workflow_dispatch` ref guard from Phase 1 here; otherwise
      mark this task as already satisfied and say where.

#### Acceptance Criteria

- [ ] Criterion 1: `npm run build` then `grep -c 'cross-origin-opener-policy' dist/_headers` → `1`, and
      `grep -c "unsafe-inline\|unsafe-eval" dist/index.html` → `0` (CSP untouched).
- [ ] Criterion 2: `cat .nvmrc` prints a full `X.Y.Z`; `npm run lint` still passes on that runtime.

### Phase 5: Verification sweep and audit status

**Goal**: Prove the whole gate is green, prove no unintended file changed, and record what remains unverifiable.

#### Tasks

- [ ] Task 5.1: Run the full gate in order and paste the exact output into the plan:
      `npm ci` → `npm run format:check` → `npm run lint` → `npm run check` → `npm run build` →
      `npm run check:placeholders` → `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run`.
- [ ] Task 5.2: Inspect the artifact: `find dist -name '*.map'` (empty),
      `grep -rIl -E 'TURNSTILE_SECRET_KEY|CLOUDFLARE_API_TOKEN' dist` (empty),
      `grep -o 'content-security-policy[^>]*' dist/index.html` (unchanged directive set).
- [ ] Task 5.3: Confirm `git status --short` lists **only** the files in §3.
- [ ] Task 5.4: Append a dated "Remediation status" note to
      `.ai/plans/active/2026-10-19-security-audit.md` mapping each audit ID (H-1, M-1…M-3, L-1…L-6) to
      fixed / deferred / user-action-required. **Do not edit or rewrite any command output already recorded in
      that file** — the plans instruction forbids falsifying recorded evidence.
- [ ] Task 5.5: Do **not** commit or push. Propose a Conventional Commit message and stop
      (`fix(security): …` / `ci(security): …` as separate commits — one per phase is preferable so H-1 and M-1
      can be reverted independently).

#### Acceptance Criteria

- [ ] Criterion 1: Every gate command above exits `0`; `npm run check` still reports `30 files, 0 errors,
      0 warnings, 0 hints` (no file was added under `src/`).
- [ ] Criterion 2: `wrangler deploy --dry-run` exits `0` with no warnings and the same asset count as the
      baseline recorded in Phase 0.
- [ ] Criterion 3: The audit file's remediation note accounts for all 10 fixable findings plus the deferrals.

## 5. Post-Implementation Verification & Regression Checks

- [ ] Feature end-to-end functionality verified — **within the documented limit**: the contact happy path
      cannot be proved with test keys (the test secret reports `hostname: example.com` and omits `action`, so
      Siteverify's action gate rejects it). Verified instead: `415`, `413`, `405`, `429`, `400` (honeypot,
      elapsed, CRLF, e-mail) and `403` (missing/invalid token) against `wrangler dev`. The happy path is
      confirmed only by the existing production evidence — state this rather than ticking it.
- [ ] Test suites, linters, and static analyzers pass cleanly (`format:check`, `lint`, `check`, `build`,
      `check:placeholders`, `check:production-env`, `wrangler --dry-run`) with **zero** suppressions added.
- [ ] No unintended modifications outside the listed affected files (`git status --short`).
- [ ] **Recorded deferrals** (do not silently drop):
      1. Global, cross-location rate ceiling — needs a Durable Object; revisit if the per-IP limiter is bypassed
         by distributed sources.
      2. Content-markdown sanitisation (audit L-7) — contained by the hash CSP; revisit when content is
         accepted from a non-maintainer or the CSP is relaxed.
      3. `.nvmrc` exact pin — only if the user declines (Task 4.2).
      4. All GitHub settings in Task 0.3 and the remaining Cloudflare items in Task 0.4 (a)–(e) — user-owned,
         outside any agent's authority. **Verified done 2026-10-19:** the `http_ratelimit` rule, the absence of a
         wildcard route/DNS record, the absence of cache and custom WAF rules, and zone HSTS being off.
- [ ] **Recorded uncertainty**: `workflow_run` trigger semantics were hardened defensively because the exact
      evaluation of `on.workflow_run.branches` for `pull_request`-origin runs could not be verified from the
      repository or without an authenticated API call. The added `event`/`head_repository` assertions make the
      answer irrelevant; say so in the remediation note rather than claiming the original filter was broken.
- [ ] Local `wrangler dev` support for the `ratelimits` binding was not verified before writing this plan; if
      the local simulation does not enforce it, Criterion 2 of Phase 2 is marked **deferred** with that reason
      and the limit is validated on a preview deployment instead.
