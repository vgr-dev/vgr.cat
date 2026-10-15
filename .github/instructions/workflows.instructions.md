---
description: 'Use when creating or editing GitHub Actions workflows. Covers Action version pinning, required permissions and concurrency blocks, and why Dependabot-triggered runs cannot use repository secrets.'
applyTo: '.github/workflows/**'
---

# GitHub Actions workflows

## Pin third-party Actions to majors, never `@main`

`actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`,
`cloudflare/wrangler-action@v4`.

**`wrangler-action` must be v4.** v3 defaults to bundling Wrangler v3, which Astro 7 is incompatible with.

## Every workflow declares `permissions:` and `concurrency:`

- Top-level `permissions:` is mandatory, least privilege (`contents: read`).
- Top-level `concurrency:` is mandatory.
- `ci.yml` uses `cancel-in-progress: true` — superseded runs are worthless.
- `deploy.yml` uses `cancel-in-progress: false` **deliberately**: interrupting a production deploy can
  leave the Worker inconsistent. Do not "fix" this.

## Secrets

- Reference only as `${{ secrets.CLOUDFLARE_API_TOKEN }}` / `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`.
- Never introduce a literal credential. `.dev.vars` and `.env` stay gitignored.
- **Dependabot-triggered workflows cannot read repository Actions secrets.** Any workflow that needs
  credentials on `pull_request` must guard with `github.actor != 'dependabot[bot]'` or use Dependabot
  secrets. This is why no per-PR preview workflow exists — see
  `.ai/plans/archive/2026-10-15-task-3.4-preview-decision.md`.

## The CI contract

`CI` runs, in order: `npm ci` (never `install`) → `npm run format:check` → `npm run check` →
`npm run build`.

- `.github/workflows/*.yml` **is** covered by `npm run format:check`. Format before committing.
- `main` is branch-protected and requires the **`CI / validate`** check. Renaming the `validate` job, or
  the `CI` workflow, silently breaks branch protection and leaves every PR unmergeable.
