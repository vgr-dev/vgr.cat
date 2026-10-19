---
description: 'Use when creating or editing GitHub Actions workflows. Covers Action version pinning, required permissions and concurrency blocks, and why Dependabot-triggered runs cannot use repository secrets.'
applyTo: '.github/workflows/**'
---

# GitHub Actions workflows

## Pin third-party Actions to immutable commit SHAs, never `@main` or a major tag

Every `uses:` is `owner/repo@<40-char-sha> # vX.Y.Z`. A major tag like `@v7` is mutable in the action's own
repository, and the deploy job hands `cloudflare/wrangler-action` the production Cloudflare token — a retagged
major would execute arbitrary code with it (audit M-2, 2026-10-19).

| Action                       | Pin                                                     |
| ---------------------------- | ------------------------------------------------------- |
| `actions/checkout`           | `3d3c42e5aac5ba805825da76410c181273ba90b1` (`# v7.0.1`) |
| `actions/setup-node`         | `949feb2413d6458794dcd2491c4babbbce0c15c1` (`# v7.1.0`) |
| `actions/upload-artifact`    | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` (`# v7.0.2`) |
| `cloudflare/wrangler-action` | `953926a2e2182532811c01a25e53647d93bf07c0` (`# v4.1.3`) |

- **Keep the `# vX.Y.Z` comment.** Dependabot only bumps a SHA pin when the version is identifiable from it.
- Resolve a new pin with
  `gh api repos/<owner>/<repo>/git/ref/tags/<tag> --jq '.object.type + " " + .object.sha'`; if `type` is `tag`
  (annotated), dereference with `gh api repos/<owner>/<repo>/git/tags/<sha> --jq '.object.sha'`.
- **`wrangler-action` must stay v4.** v3 defaults to bundling Wrangler v3, which Astro 7 is incompatible with.

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

`CI` runs, in order: `npm ci` (never `install`) → `npm audit --audit-level=high` → `npm run format:check` →
`npm run check` → `npm run lint` → `npm run check:placeholders` → `npm run build`.

- `.github/workflows/*.yml` **is** covered by `npm run format:check`. Format before committing.
- **Branch protection was removed from `main` on 2026-10-16** (working solo), so direct pushes are no
  longer rejected; **required signed commits were kept**. `CI` still runs on push and on pull requests,
  reporting as **`CI / validate`**. Renaming the `validate` job or the `CI` workflow still changes that
  reported name — which the plan's acceptance criteria depend on, and which any future protection rule
  would need to match.
- **`Deploy` runs only after `CI` passes on `main`.** Because protection no longer orders them, that
  ordering is enforced inside `deploy.yml`: `workflow_run` on `CI` (`types: [completed]`, `branches:
[main]`) plus a job condition requiring `conclusion == 'success'`. `workflows: [CI]` matches the
  triggering workflow **by name**, so renaming the `CI` workflow silently stops every deploy. The
  checkout is pinned to `github.event.workflow_run.head_sha`, so Deploy ships the commit `CI` validated
  rather than whatever sits at the tip of `main` when the job starts.
