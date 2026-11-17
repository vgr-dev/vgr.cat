---
description: 'Use when editing the contact Worker (src/worker/), the contact form, Turnstile or rate-limiter config, or the send_email bindings. Covers the run_worker_first requirement, Turnstile key handling, the two rate-limit layers, siteverify checks, email delivery status, and local Worker testing.'
applyTo: 'src/worker/**,src/components/ContactForm.astro,scripts/check-production-env.mjs,tests/form.spec.ts'
---

# Contact Worker and form

`src/worker/index.ts` serves `POST /api/contact`; everything else is prerendered static output. These traps
were moved here verbatim from `AGENTS.md`. `wrangler.jsonc` edits also need
`.github/instructions/cloudflare-config.instructions.md`.

- **The Worker needs `assets.run_worker_first` or browser form POSTs break.** `not_found_handling:
'404-page'` intercepts _navigation_ requests before the Worker runs, so a real browser POST to
  `/api/contact` returned **405** while the identical `curl` request succeeded — curl does not send
  `Sec-Fetch-Mode: navigate`. `run_worker_first: ["/api/*"]` is therefore mandatory, not an
  optimisation. The tell is a request that works from curl and fails from a browser.
- **Turnstile: the sitekey is committed, the secret never enters the repo.** Sitekeys are public — they
  ship in the markup — so `src/config.ts` holds the production sitekey as the default and
  `PUBLIC_TURNSTILE_SITE_KEY` overrides it (set that to the always-passes _test_ sitekey
  `1x00000000000000000000AA` for automated runs). The secret lives only in
  `wrangler secret put TURNSTILE_SECRET_KEY` (production) and `.dev.vars` (local test secret
  `1x0000000000000000000000000000000AA`). `deploy.yml` runs `npm run check:production-env`, which
  **refuses to deploy with a test sitekey** — it validates both the `PUBLIC_TURNSTILE_SITE_KEY` override
  **and** the committed `PRODUCTION_SITE_KEY` in `src/config.ts` (and fails if that literal cannot be found),
  since a test key silently disables bot protection.
- **The contact endpoint has two rate-limit layers, and only one of them is in git.** The zone carries an
  `http_ratelimit` rule (5 requests / 10 s per `ip.src` + colo, 10 s mitigation). That layer is
  dashboard-only, so it cannot be regression-tested — and it _has_ drifted: it sat in the inert
  `dynamic-redirect` phase until 2026-10-19 and returned a Worker `4xx` rather than a Cloudflare `403`.
  `wrangler.jsonc` therefore also declares `CONTACT_RATE_LIMITER` (5 / 60 s, keyed on `CF-Connecting-IP`),
  deliberately looser than the edge rule, and it **fails open** on a binding error so a limiter outage cannot
  take the contact form down.
- **Siteverify checks `action` and `hostname`, and Cloudflare's test keys cannot satisfy them.** The
  Worker requires `success === true` **plus** `action === 'contact'` **plus** a hostname in
  `TURNSTILE_HOSTNAMES` (production: `vgr.cat`; never add `localhost` to a production value). The test
  secret reports `hostname: "example.com"` and **omits `action` entirely**, so a test-key run clears the
  hostname gate and is stopped by the action gate. **Consequence: the contact happy path cannot be
  verified end-to-end with test keys** — only the rejection paths are locally exercisable. The Worker
  logs the reason as `siteverify rejected { action, hostname, codes }`, never the secret or the token.
- **Email delivery truth lives in Email _Sending_, not Email Routing — the two have separate status
  vocabularies.** Cloudflare documents sending as `Sent` / `Delivered` / `Delivery failed` / `Rejected` /
  `Failed`, and routing as `Forwarded` / `Handled` / **`Dropped`** / `Rejected` / `Delivery failed` /
  `Error`, where `Dropped` means _inbound_ mail discarded by a routing rule. This Worker **sends**
  outbound mail through the `send_email` bindings, so an Email Routing view is the wrong place to look
  for it. Use the Email Sending activity log, or the `emailSendingAdaptive*` GraphQL datasets documented
  at `developers.cloudflare.com/email-service/observability/metrics-analytics/`. Note that the Worker
  **discards `EmailSendResult`** — it never logs `messageId` — so message IDs are absent from Workers
  Logs; add logging there if they are ever needed.
- **Local Worker testing needs `wrangler dev`, not `astro dev`.** `npm run dev` and `npm run preview`
  serve static output only and never run the Worker, so `/api/contact` does not exist there.
  `wrangler dev` also simulates the Email Service bindings, which is how the contact flow is testable
  without a real sending domain.
