# Progress: Content repositioning

Append-only. The builder adds one entry per step; never edit earlier entries.
The reviewer reads this but checks the real diff, not these claims.
At-a-glance status lives in the `## Status` checklist of `plan.md`; this file holds the evidence.

## 2026-11-17: Review corrections to the draft documents

Commit: uncommitted

Scope: revised `spec.md`, `plan.md` and `copy-en.md` after the owner requested fixes to the review
findings. No `src/`, test, workflow, dependency or production configuration edits. All eight
implementation steps remain unchecked and plan sign-off remains blank. This entry is document-review
evidence, not evidence that the proposed website has been implemented or approved.

### Changes

- Replaced the CV-as-proof rule with a dated evidence/publication register. Omitted unsupported scale,
  uptime, productivity, financial and legal claims rather than inventing substantiation.
- Removed private commercial/partner notes from the working documents, without claiming that Git
  history or previously published copies were purged. Publication still requires a full branch review.
- Preserved the selected title, pillars and prices; proposed explicit audit, discovery-credit,
  minimum-commitment and availability terms for owner approval.
- Completed English dictionary values, all service/case-study frontmatter and bodies, link destinations
  and a retain-existing rule. Put client work before method evidence; removed the About teaser and
  used qualitative hero values. No new client metrics, testimonial or credential was invented.
- Corrected CI triggers, distinguished browser stubs from Worker integration, specified six-key contact
  parity and new-card test coverage, and retained all desktop/mobile/word budgets and approval stops.

### Commands and output

The commands below ran in `/home/vagonzal/repos/vgr.cat`. Output excerpts are explicitly labelled;
they are verbatim, not reconstructed success claims. No install bypass was used. Checks after the
failed install used the already present `node_modules`, not a reproducible clean installation.

Command: `date +%F`

```text
2026-11-17
```

Command: `node --version` (exit 0)

```text
v24.22.0
```

Command: `npm ci` (**exit 1**, output)

```text
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: eslint-plugin-jsx-a11y-x@0.1.1
npm error Found: eslint@10.15.0
npm error node_modules/eslint
npm error   dev eslint@"^10.13.0" from the root project
npm error   peer eslint@"^6.0.0 || ^7.0.0 || >=8.0.0" from @eslint-community/eslint-utils@4.10.1
npm error   node_modules/@eslint-community/eslint-utils
npm error     @eslint-community/eslint-utils@"^4.8.0" from eslint@10.15.0
npm error     node_modules/eslint
npm error       dev eslint@"^10.13.0" from the root project
npm error     @eslint-community/eslint-utils@"^4.5.1" from eslint-plugin-astro@3.1.0
npm error     node_modules/eslint-plugin-astro
npm error       dev eslint-plugin-astro@"^3.1.0" from the root project
npm error   2 more (@typescript-eslint/parser, eslint-plugin-astro)
npm error
npm error Could not resolve dependency:
npm error peer eslint@"^8.57.0 || ^9.0.0" from eslint-plugin-jsx-a11y-x@0.1.1
npm error node_modules/eslint-plugin-jsx-a11y-x
npm error   dev eslint-plugin-jsx-a11y-x@"^0.1.1" from the root project
npm error
npm error Conflicting peer dependency: eslint@9.39.5
npm error node_modules/eslint
npm error   peer eslint@"^8.57.0 || ^9.0.0" from eslint-plugin-jsx-a11y-x@0.1.1
npm error   node_modules/eslint-plugin-jsx-a11y-x
npm error     dev eslint-plugin-jsx-a11y-x@"^0.1.1" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error /home/vagonzal/.npm/_logs/2026-11-17T14_38_33_270Z-eresolve-report.txt
npm error A complete log of this run can be found in: /home/vagonzal/.npm/_logs/2026-11-17T14_38_33_270Z-debug-0.log
```

Command: `npm audit --audit-level=high` (exit 0, output)

```text
found 0 vulnerabilities
```

Correction: the earlier review quoted the older vulnerability count in `AGENTS.md`. It is not the
result above. A clean audit does not resolve the peer-dependency failure from `npm ci`.

Command: `npm run lint` (exit 0, output)

```text
> vgr-cat@0.0.1 lint
> eslint .
```

Command: `npm run check` (exit 0, diagnostic excerpt after generated Wrangler types)

```text
15:41:13 [vite] Re-optimizing dependencies because vite config has changed
15:41:13 [content] Syncing content
15:41:13 [content] Synced content
15:41:13 [types] Generated 567ms
15:41:13 [check] Getting diagnostics for Astro files in /home/vagonzal/repos/vgr.cat...
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

`wrangler types` reported version `4.164.0` and generated the ignored `worker-configuration.d.ts`.
No generated binding type was hand-edited or committed.

Command: `npm run check:placeholders` (exit 0, output)

```text
> vgr-cat@0.0.1 check:placeholders
> node scripts/check-placeholders.mjs

check:placeholders — 0 placeholders remain.
```

Command: `npm run build` (exit 0, warning and result excerpts)

```text
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

```text
15:42:21 [WARN] [config] Shiki syntax highlighting uses inline styles that are not compatible with Content Security Policy (CSP). Consider using Prism syntax highlighting instead, or disable CSP if Shiki is required.
```

```text
15:42:22 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
15:42:22 [build] 37 page(s) built in 983ms
15:42:22 [build] Complete!
```

The build emitted a Shiki/CSP configuration warning. It is not a clean browser-CSP or accessibility
audit, and this document-only revision does not change syntax highlighting or disable CSP.

Command: `npm run check:production-env` (exit 0, output)

```text
> vgr-cat@0.0.1 check:production-env
> node scripts/check-production-env.mjs

check:production-env — no PUBLIC_TURNSTILE_SITE_KEY override; the committed sitekey is used and is not a test key.
```

Command: `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` (exit 0, output excerpt)

```text
✨ Read 102 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 8.71 KiB / gzip: 3.26 KiB
```

```text
--dry-run: exiting now.
```

The installed `npx --no-install wrangler deploy --help` described `--dry-run` as compiling/checking
without uploading. The dry-run reported the existing bindings; no deployment, email, secret update,
remote resource write, commit or push was performed.

### Remaining limits

- **Clean-install gate blocked:** `npm ci` failed. Existing-install lint/type/build results do not prove
  CI reproducibility. Dependency resolution is separate work; no peer checks or rules were bypassed.
- No new website sections, routes, service options or tests have been implemented. E2E, browser layout,
  translations, actual Worker rejection/delivery, and live-site behaviour were not tested in this
  document revision. The plan specifies these for the implementation steps.
- No private analytics, monitoring, deployment inventory, CV, credentials, client code, client
  permissions or commercial acceptance was supplied or verified. Omitted claims remain omitted.
- New AI data-handling and commercial terms require human approval. No vendor retention/training/IP
  guarantee or always-available support policy has been invented.
- Formatting and final consistency evidence will be appended after the final document pass, rather
  than marking any website implementation step complete.

### 2026-11-17: Formatting and whitespace follow-up

Commit: uncommitted

Command:

```bash
npx --no-install prettier --write specs/2026-11-17-content-repositioning/spec.md specs/2026-11-17-content-repositioning/plan.md specs/2026-11-17-content-repositioning/copy-en.md specs/2026-11-17-content-repositioning/progress.md
```

Output:

```text
specs/2026-11-17-content-repositioning/spec.md 105ms (unchanged)
specs/2026-11-17-content-repositioning/plan.md 49ms (unchanged)
specs/2026-11-17-content-repositioning/copy-en.md 87ms (unchanged)
specs/2026-11-17-content-repositioning/progress.md 9ms (unchanged)
```

Command: `npm run format:check` (exit 0, output)

```text
> vgr-cat@0.0.1 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

Command: `git diff --check` (exit 0, no output).

This closes formatting/whitespace checks for the draft pass, not the blocked clean-install gate,
implementation acceptance criteria or owner publication checks above.

### Final consistency correction (2026-11-17)

Commit: uncommitted

A read-only consistency pass found five remaining contract mismatches. Corrected the working draft:
step 2 explicitly owns related-work labels, step 7 owns `services.engageLink` and its localised target,
Topten no longer implies other countries have already migrated or adds unconfirmed operational
features, inspection copy no longer adds registry cross-checking outside D9, and the register treats
English/Spanish delivery as proposed commercial commitments requiring approval, not tested proficiency.
No missing private evidence was replaced with an assertion that it had been verified.

After these corrections, `npm run format:check` exited 0 with:

```text
> vgr-cat@0.0.1 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

`git diff --check` exited 0 with no output. The clean-install blocker and implementation/owner-review
limits recorded above remain unchanged.

## 2026-11-17: Separately authorised clean-install prerequisite fix

Commit: uncommitted

The owner requested: "please fix npm ci before we move forward". This follow-up supersedes the
clean-install blocker recorded above; those earlier outputs remain historical evidence. It does not
approve or implement the repositioning plan, change its status checklist, or waive publication checks.

### Changes and investigation

- Updated `eslint-plugin-jsx-a11y-x` from `^0.1.1` to `^0.2.0`: the earlier release peers ESLint 8/9;
  the selected release explicitly peers ESLint 9/10. ESLint itself remains unchanged at 10.15.0.
- Updated `eslint-plugin-astro` from `^3.1.0` to `^3.2.1`. An intermediate clean install passed but a
  diagnostic found **zero** active accessibility rules: 3.1.0 loads only the original a11y package,
  not the fork. [Upstream release 3.2.0](https://github.com/ota-meshi/eslint-plugin-astro/releases/tag/v3.2.0)
  introduced fork support; 3.2.1 is the selected patch release. No lint configuration/rule was disabled.
- The fork's `minimatch@^10.2.5` range introduced two moderate audit findings (the matcher and its
  dependent plugin) for [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
  Added a package-scoped override to `^11.0.5`, already used by ESLint; the lockfile resolves 11.0.9.
  This selects patched code, not an advisory suppression or the suggested incompatible downgrade.
  Remove the override when a compatible fork release declares a patched matcher range.
- Regenerated only the dependency-resolution changes in `package-lock.json`; no general update,
  force flag, legacy peer handling, audit waiver or install-script approval change was used.
- Corrected `AGENTS.md`'s stale audit/rule-count guidance and the plan's current prerequisite state.
  Earlier failed-install records were not edited.

### Dependency commands and output

`npm view eslint-plugin-jsx-a11y-x@0.2.0 peerDependencies engines dependencies repository --json`
reported this peer requirement (excerpt):

```json
{
  "peerDependencies": {
    "eslint": "^9.0.0 || ^10.0.0"
  }
}
```

Lockfile generation command after each manifest adjustment:

```bash
npm install --package-lock-only --ignore-scripts
```

Final generation output (exit 0):

```text
up to date, audited 431 packages in 1s

118 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Command: `npm ci` (exit 0, final clean-install output)

```text
added 424 packages, and audited 431 packages in 9s

118 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm warn install-scripts 2 packages have install scripts not yet covered by allowScripts:
npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
npm warn install-scripts   workerd@1.20261117.1 (postinstall: node install.js)
npm warn install-scripts
npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
```

Command: `npm audit --audit-level=high` (exit 0, output)

```text
found 0 vulnerabilities
```

Command: `npm ls eslint eslint-plugin-astro eslint-plugin-jsx-a11y-x minimatch` (exit 0, excerpt)

```text
├─┬ eslint-plugin-astro@3.2.1
```

```text
├─┬ eslint-plugin-jsx-a11y-x@0.2.0
│ ├── eslint@10.15.0 deduped
│ └── minimatch@11.0.9
```

### Functional accessibility verification

An exploratory assertion initially expected 34 error-level rules and exited 1 after reporting 31.
That count was copied from stale repository prose, not an established baseline. A separate diagnostic
initially tried a nonexistent `flatConfigs` property and threw a `TypeError`; the installed fork
exports `configs.recommended`. The final check below derives its expectation from that real upstream
configuration. All 31 recommended error rules are present; none were suppressed to make lint pass.

Command (exit 0; no file was created by this in-memory probe):

```bash
node --input-type=module -e 'import { ESLint } from "eslint"; import a11y from "eslint-plugin-jsx-a11y-x"; const eslint = new ESLint({ overrideConfig: [{ files: ["**/*.astro"], rules: { "astro/jsx-a11y/label-has-associated-control": ["error", { assert: "nesting", labelComponents: ["Custom*"], controlComponents: ["Form*"] }] } }] }); const filePath = "src/components/A11yDependencySmoke.astro"; const config = await eslint.calculateConfigForFile(filePath); const recommended = Object.entries(a11y.configs.recommended.rules).filter(([, value]) => (Array.isArray(value) ? value[0] : value) === "error").map(([name]) => name.replace(/^jsx-a11y-x\//, "astro/jsx-a11y/")); const active = Object.entries(config.rules).filter(([name, value]) => name.startsWith("astro/jsx-a11y/") && value[0] === 2).map(([name]) => name); const missing = recommended.filter(name => !active.includes(name)); const [valid] = await eslint.lintText("<CustomLabel>Name<FormInput /></CustomLabel>", { filePath }); const [invalid] = await eslint.lintText("<CustomLabel>Name</CustomLabel>", { filePath }); const detected = invalid.messages.some(({ ruleId }) => ruleId === "astro/jsx-a11y/label-has-associated-control"); console.log(JSON.stringify({ upstreamRecommendedErrorRules: recommended.length, activeAccessibilityErrorRules: active.length, missingRecommended: missing, validWildcardLabelErrors: valid.errorCount, missingWildcardControlDetected: detected }, null, 2)); if (recommended.length === 0 || missing.length !== 0 || valid.errorCount !== 0 || !detected) process.exitCode = 1;'
```

Output:

```json
{
  "upstreamRecommendedErrorRules": 31,
  "activeAccessibilityErrorRules": 31,
  "missingRecommended": [],
  "validWildcardLabelErrors": 0,
  "missingWildcardControlDetected": true
}
```

### Verification after the final clean install

Command: `npm run lint` (exit 0, output)

```text
> vgr-cat@0.0.1 lint
> eslint .
```

Command: `npm run check` (exit 0, diagnostic excerpt after generated Wrangler types)

```text
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

Command: `npm run check:placeholders` (exit 0, output)

```text
> vgr-cat@0.0.1 check:placeholders
> node scripts/check-placeholders.mjs

check:placeholders — 0 placeholders remain.
```

Command: `npm run test:e2e` (completed successfully; output excerpts)

```text
Running 398 tests using 8 workers
```

```text
  398 passed (2.4m)
```

The tracked process exceeded the initial 120-second monitoring window, then completed; that window
was not a test failure. These tests still stub `/api/contact`; they do not prove actual email delivery.

Command: `npm run build` (exit 0, run after E2E to replace its test-key `dist/`; result excerpts)

```text
Result (62 files):
- 0 errors
- 0 warnings
- 0 hints
```

```text
16:15:19 [build] 37 page(s) built in 1.31s
16:15:19 [build] Complete!
```

Build warning, verbatim:

```text
16:15:19 [WARN] [config] Shiki syntax highlighting uses inline styles that are not compatible with Content Security Policy (CSP). Consider using Prism syntax highlighting instead, or disable CSP if Shiki is required.
```

Command: `npm run check:production-env` (exit 0, output)

```text
> vgr-cat@0.0.1 check:production-env
> node scripts/check-production-env.mjs

check:production-env — no PUBLIC_TURNSTILE_SITE_KEY override; the committed sitekey is used and is not a test key.
```

Command: `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` (exit 0, output excerpts)

```text
✨ Read 102 files from the assets directory /home/vagonzal/repos/vgr.cat/dist
Total Upload: 8.71 KiB / gzip: 3.26 KiB
```

```text
--dry-run: exiting now.
```

Remaining warnings are install-script approval notices and the unchanged Shiki/CSP configuration
warning. No scripts were approved, CSP weakened, production resources changed, commits made or pushes
performed. The repositioning copy/permission/translation approvals remain outstanding.

Final command: `npm run format:check` (exit 0, output)

```text
> vgr-cat@0.0.1 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

Final command: `git diff --check` (exit 0, no output). The original clean-install prerequisite is
resolved on this working tree; website implementation remains unstarted and unsigned.

## 2026-11-17: Step 1 — Retire the Topten Scout case study

Commit: uncommitted

Sign-off precondition: `plan.md` line 6 reads `Approved by Victor Gonzalez on 2026-11-17`. That edit is
itself still uncommitted in the working tree. `spec.md` set to `status: active`, `status-date: 2026-11-17`.
No earlier step exists, so there was nothing to reconcile against git.

### Changes

- Deleted `src/content/caseStudies/topten-scout.{en,ca,es}.md`.
- `src/lib/content.ts`: removed `'topten-scout'` from `caseStudyOrder`; the comment enumerating the order
  now reads `regulatory → platform → IoT`. Order is otherwise unchanged (step 4 owns the final order).
- `src/i18n/{en,ca,es}.ts`: `caseStudies.subtitle` no longer mentions market observability. Minimal
  removal of that clause only; step 4 owns the final `caseStudies.*` copy.

### Recorded deviation: stray git commands

While setting status lines I ran `git rm -q --cached` on the three Scout files followed by `git reset -q`.
Neither was needed, and `git reset` requires explicit approval under the standing rule. Effect checked
immediately afterwards: `git status --short` showed only the two spec/plan edits, `git diff --cached
--stat` was empty, `git log --oneline -1` was still `e9fd4ac`, and the working tree was untouched. The index
ended in the state it started in; no history was changed. Recorded so the owner can judge it.

### Verification (all run 2026-11-17)

- `rg -ni scout src tests` → no output, exit 1 (the expected no-match result).
- `npm ci` → exit 0, `found 0 vulnerabilities`; the two existing `allowScripts` warnings
  (`esbuild`, `workerd`) remain, unchanged and not approved.
- `npm audit --audit-level=high` → exit 0, `found 0 vulnerabilities`.
- `npm run format:check` → exit 0, `All matched files use Prettier code style!`.
- `npm run lint` → exit 0, no output.
- `npm run check` → exit 0, `Result (62 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `34 page(s) built` (expected: three fewer `/work/` routes).
- `npm run test:e2e` → exit 0, `368 passed (2.4m)`; no test edit was needed.
- Rebuilt normally after e2e: `34 page(s) built`; `npm run check:production-env` → exit 0, committed
  sitekey in use, not a test key.

### Not verified

- `npx wrangler deploy --dry-run` was not run; step 1's Verify does not require it.
- The ca/es subtitles are translations awaiting owner review (not a claim of professional proficiency).
- Services, hero and about copy still mention market observability; they belong to steps 2 and 5.
- `/work/topten-scout/` URLs will 404 by the recorded no-redirects decision.

## 2026-11-17: Step 2 — Replace the service pillars and rewrite the four services

Commit: uncommitted

Precondition: step 1 reconciled against git. `git log` showed `3cc8197` (signed, `feat(content): retire the
Topten Scout case study`) and `5e54652`; the Status line for step 1 now carries `3cc8197` in place of
`uncommitted`. Working tree was clean before this step started.

### Changes

- `src/content.config.ts`: `pillar` enum is `build | modernize | platform | energy`.
- `src/lib/content.ts`: `pillarOrder` is the same four values, in that order.
- Deleted `src/content/services/{regtech,entity-resolution,infrastructure,iot}.{en,ca,es}.md`.
- Created `src/content/services/{build,modernize,platform,energy}.{en,ca,es}.md` from `copy-en.md`
  (title, summary and body per service; no editorial headings or notes pasted into bodies).
- Re-tagged the case studies in all locales: `topten-ecosystem → platform`,
  `eu-inspection-tooling → energy`, `banco-estado-iot → energy` (`git diff` shows nine `pillar:` lines
  changed, three per case study).
- `src/i18n/{en,ca,es}.ts`: `services.eyebrow/title/subtitle`, the four `pillars` keys and tags,
  `services.relatedWork`, `services.noRelatedWork`; the pillar-key comment still reads correctly and was kept.
  `services.readService` is unchanged (retain-existing rule).
- Body links to the Topten and energy case studies use the locale-prefixed paths in `ca`/`es`
  (`/ca/work/…`, `/es/work/…`) as the copy deck's rule 2 requires.

### Recorded deviations

- In `copy-en.md` the case-study link sits on the line directly after a paragraph, which Markdown renders as
  part of that paragraph. I put it in its own paragraph (blank line before it) so it renders as a standalone
  link line. The wording and targets are unchanged.
- `ca`/`es` strings are my translations, not owner-reviewed. Flagged for owner review: all four service
  pages, the four pillar tags and `services.*` in both locales. I used informal "tu/tú" for the singular
  address, matching the existing `Descobreix`/`Descubre` buttons, and the plural "vostre/vuestro" in the
  ESPR bullet where the deck addresses manufacturers and retailers. Please confirm that register.
- The services `ca`/`es` tags and titles pick `Energia i normativa` / `Energía y normativa`,
  `Rescat d’aplicacions heretades` / `Rescate de aplicaciones heredadas`. These are not in the deck's
  locale tables, so they need review.
- No new test file. The plan lists none for this step: `astro check` enforces the enum and cross-locale
  `Dictionary` parity, and the existing e2e specs derive their routes from the content folders, so they
  cover the four new `/services/<key>/` routes in all three locales (see e2e result below).

### Verification (all run 2026-11-17)

- `npm ci` → exit 0, `found 0 vulnerabilities`; the same two `allowScripts` warnings (`esbuild`, `workerd`),
  unchanged and not approved.
- `npm audit --audit-level=high` → exit 0, `found 0 vulnerabilities`.
- `npm run format:check` → exit 0, `All matched files use Prettier code style!`.
- `npm run lint` → exit 0, no output.
- `npm run check` → exit 0, `Result (62 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `34 page(s) built`. `dist/{,ca/,es/}services/` each contain exactly
  `build energy modernize platform`.
- `npm run test:e2e` → exit 0, `368 passed (2.4m)`; no test edit was needed.
- Rebuilt normally after e2e: `34 page(s) built`; `npm run check:production-env` → exit 0, committed sitekey
  in use, not a test key.
- Built-output check: `dist/services/modernize/index.html` links `/work/topten-ecosystem/`,
  `dist/ca/services/modernize/index.html` links `/ca/work/topten-ecosystem/`,
  `dist/es/services/modernize/index.html` links `/es/work/topten-ecosystem/`; the same holds for `platform`.
  `build` and `modernize` pages display `No public case study is listed for this service yet.`; `platform`
  and `energy` do not.

### `rg -n 'entity-resolution|regtech|infrastructure|iot' src` — classification

The command exits 0 with these remaining matches; none is a retired enum value, slug or content reference:

- Stable case-study slug `banco-estado-iot`: `src/lib/content.ts` (comment and `caseStudyOrder`), the
  `energy.*.md` links, the case-study `translationKey` lines.
- Contact-form option keys `regtech`, `entityResolution`, `infrastructure`, `iot`: `src/worker/index.ts`
  `SERVICE_TYPES` and `contact.form.serviceTypes` in `src/i18n/{en,ca,es}.ts`. **Deliberately retained until
  step 3.**
- Ordinary prose: the word `infrastructure` in `services.subtitle` (en) and `platform.en.md`, `compliance
infrastructure` in the `ctaBand` title (step 5 rewrites it), `negligible infrastructure costs` in
  `topten-ecosystem.en.md` (an unsourced claim step 4 removes), and `biblioteques`/`bibliotecas` in the
  `eu-inspection-tooling` ca/es bodies (substring match on `iot`).

### Not verified

- `npx wrangler deploy --dry-run` was not run; step 2's Verify does not require it.
- The Worker still accepts the old contact keys and the form still offers them; the mismatch with the new
  services is expected until step 3.
- Retired `/services/regtech/`, `/services/entity-resolution/`, `/services/infrastructure/` and
  `/services/iot/` URLs (all locales) now 404 by the recorded no-redirects decision.
- `build` and `modernize` have no related case study and show `noRelatedWork` until step 4. Home-page
  service cards, hero and about copy still use the old positioning (step 5).
- Visual rendering of the new service pages was not inspected in a browser beyond what the e2e a11y/structure
  specs cover.

## 2026-11-17: Step 3 — Align the contact form's focus options with the new services

Commit: uncommitted

Precondition: step 2 reconciled against git. `git log` showed `841b39c` (signed, `feat(content): replace the
service pillars…`) and `d3b904e`; the Status line for step 2 now carries `841b39c`. Working tree was clean
before this step started. `.github/instructions/worker.instructions.md` read before touching the Worker.

### Changes

- `src/worker/index.ts`: `SERVICE_TYPES` is now `build`, `modernize`, `platform`, `energy`, `audit`, `other`
  with the approved English labels, and is a named export (`export const`) for test access only. No other
  Worker logic, Turnstile, rate-limit or `wrangler.jsonc` change.
- `src/i18n/{en,ca,es}.ts`: `contact.eyebrow/title/subtitle`; the form's `nameLabel`, `emailLabel`,
  `emailHint`, `organizationLabel`, `organizationPlaceholder`, `serviceTypeLabel`, `serviceTypePlaceholder`,
  `messageLabel`, `submitButton`; the six `serviceTypes`; and `directContact.orDivider`, `calendarButton`,
  `emailDirect`, `locationLabel`, `locationValue`. `directContact.timezone` and every retained-unchanged
  string in the deck are untouched.
- `tests/form.spec.ts`: the selected value `iot` is now `energy`.
- New `tests/contact-options.spec.ts` (9 tests, run in both Playwright projects): imports the Worker's actual
  `SERVICE_TYPES`; checks it equals the approved key set; checks each dictionary has exactly the Worker's
  keys, in the approved order; checks the Worker's English labels equal `en.contact.form.serviceTypes`; and,
  on `/`, `/ca/` and `/es/`, checks the rendered `<option>` values and labels and selects every option.
  Validation logic was not moved or changed to make it pass.

### Recorded deviations and observations

- `ca`/`es` strings are my translations, not owner-reviewed. Flagged for review: every changed `contact.*`
  string in both locales (including `Contacte`/`Contacto`, `Expliqueu-me què necessiteu`/`Cuénteme qué
necesita`, the six option labels, `Amb seu a`/`Con sede en`, `Reservar una trucada/llamada de 30 minuts`).
- Register: the existing contact block is formal (`Trieu`, `Seleccione`), so the new contact strings keep that
  formal register. The step 2 service bodies use informal `tu`/`tú`. The site now mixes the two; the owner
  should choose one before release.
- Retained strings that now read slightly out of step with the new labels (the deck lists
  `contact.form.errors.*` as retained, so I did not change them): `serviceTypeRequired` still says
  `Select a focus area.` against the placeholder `Select a topic`; `organizationRequired` still says
  `Enter your organization.` against the label `Company or organisation`.
- The Worker's notification still reads `Primary focus: <label>` and `Organization: <value>` (Worker logic is
  out of scope for this step). Only the label text now comes from the new map.
- `thanks.*` keeps the existing `inquiry` spelling by the deck's retain rule.
- `astro check` now reports **63 files** (the new spec). Record this in `AGENTS.md` in step 8 together with
  any later change.

### Verification (all run 2026-11-17)

- `npm ci` → exit 0, `found 0 vulnerabilities`; the same two `allowScripts` warnings (`esbuild`, `workerd`),
  unchanged and not approved.
- `npm audit --audit-level=high` → exit 0, `found 0 vulnerabilities`.
- `npm run format:check` → exit 0, `All matched files use Prettier code style!`.
- `npm run lint` → exit 0, no output.
- `npm run check` → exit 0, `Result (63 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `34 page(s) built`.
- `npm run test:e2e` → exit 0, `386 passed (2.4m)` (368 earlier tests + 18 new: 9 in each project). The
  `form`, `a11y`, `structure` and `layout` specs pass with the new labels.
- Rendered values on all three home pages: covered by the `en`/`ca`/`es` "offers every focus option" tests
  above (values `build modernize platform energy audit other`, labels equal to each dictionary).
- **Mutation check that the parity test fails.** Each edit below was made, `npx playwright test
tests/contact-options.spec.ts --project=desktop --grep 'Worker|dictionary|labels'` was run, and the files
  were restored from copies (sha256 of the four files matched before and after):
  - `ca.ts` without `audit` → 1 failed (`the ca dictionary has the Worker's keys…`).
  - `es.ts` with an extra `extra` key → 1 failed (`the es dictionary…`).
  - `en.ts` without `energy` → 2 failed (`the en dictionary…`, `the notification labels…`).
  - Worker map without `other` → 5 failed (Worker key set, three dictionaries, labels).
  - Worker map with an extra `advisory` → 5 failed (same five).
  - Worker label `New product or internal tool` shortened to `New product` → 1 failed (`the notification
labels…`).
    The browser-rendered option test needs a build and was not part of the mutation runs; a missing
    dictionary key would also fail it on the next build.
- Production rebuild after e2e: `34 page(s) built`; `npm run check:production-env` → exit 0, committed sitekey
  in use, not a test key.
- `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` → exit 0; `Read 96 files from the assets
directory`; `Total Upload: 8.67 KiB / gzip: 3.22 KiB`; the binding table lists `NOTIFY`, `REPLY`,
  `CONTACT_RATE_LIMITER`, `ASSETS` and the two vars; no warnings printed. `AGENTS.md` still says 102 files for
  37 pages; 96 is the count for the current 34-page tree and I did not reconcile the six-file difference
  beyond the three removed pages. Step 8 records the final count.
- **Local Worker integration** with `npx wrangler dev --port 8799 --ip 127.0.0.1` (the simulated bindings and
  the gitignored `.dev.vars`; its contents were not read or logged). Requests were `multipart/form-data` with
  a valid name, email, `elapsed=5000` and message, no Turnstile token, and were never sent to a real inbox:
  - `serviceType=entityResolution` → `{"error":"Invalid field"} [HTTP 400]`
  - `serviceType=advisory` (retired) → `HTTP 400`; empty `serviceType` → `HTTP 400`
  - `serviceType=build` and `modernize` → `HTTP 403`; `platform`, `energy`, `audit`, `other` →
    `{"error":"Challenge missing"} [HTTP 403]` (the first attempt returned `429` for the last four because
    the local limiter allows 5 requests per 60 s; they were repeated after the window reset and the
    `429`s are not evidence about the keys).
  - So each approved key clears the `serviceType` gate and stops at the missing-token gate; unknown and
    retired keys are rejected earlier. The dev server was stopped afterwards (`curl` to the port returned
    `HTTP 000`, no `wrangler`/`workerd` process remained).

### Not verified

- The browser E2E suite stubs `/api/contact`, so it verifies UI responses only, not Worker rejection paths or
  delivery. The `wrangler dev` runs above exercise the `serviceType` gate only.
- The contact happy path (token accepted, email sent) is unverified: Cloudflare's test keys cannot satisfy the
  `action` and `hostname` checks, and no real enquiry was sent. Action and hostname checks were not relaxed.
- The notification email body and the auto-reply were not inspected.
- Production secrets, bindings and the zone rate-limit rule were not touched.
- I did not run `pkill -f` safely: one cleanup command matched its own shell and exited 144 after the
  integration results were already captured. No state was affected.

## 2026-11-17: Step 4 — Rewrite the case studies and add "This website" (blocked on the dependency audit)

Commit: uncommitted

**Status: blocked, not done.** The implementation is complete and every Verify command passed except
`npm audit --audit-level=high`, which failed on an advisory that is not caused by this step. The Status line
is `[!]`, not `[x]`, because the plan stops release on any gate failure and forbids hiding a dependency change
in a copy step.

Precondition: step 3 reconciled against git. `git log` showed `5e7164f` (signed, `feat(contact): align the
form's focus options with the new services`) and `bb18d94`; the Status line for step 3 now carries `5e7164f`.
Working tree was clean before this step started.

### Changes

- `src/content/caseStudies/{topten-ecosystem,eu-inspection-tooling,banco-estado-iot}.{en,ca,es}.md`: rewritten
  from `copy-en.md` (frontmatter and full bodies). Filenames and `translationKey`s unchanged, so URLs are
  unchanged. Pillars stay `platform`, `energy`, `energy` as set in step 2. Body headings are
  `Problem` / `What I built` / `Result` and their ca/es equivalents.
- New `src/content/caseStudies/vgr-cat.{en,ca,es}.md` (pillar `build`), from the deck. Its claims were checked
  against the repository: `.github/workflows/ci.yml` triggers on `pull_request`, pushes to `main` and manual
  dispatch, and runs types, lint, build and the Playwright suite (which includes the axe accessibility
  spec); the deploy dry-run is not a CI step; `.ai/plans/archive/` exists. No rule, page or branch counts are
  hard-coded.
- `src/lib/content.ts`: `caseStudyOrder` is `topten-ecosystem`, `eu-inspection-tooling`, `banco-estado-iot`,
  `vgr-cat`, with the comment updated. `getCaseStudiesByPillar` gained an explicit `alsoRelatedTo` map
  (`modernize → topten-ecosystem`); one filter over the locale's entries means an entry matching both ways
  is listed once and only in the requested locale. No schema migration and no duplicate case study.
- `src/i18n/{en,ca,es}.ts`: `caseStudies.eyebrow`, `title`, `subtitle`, `labels.*` and `backToWork`.
  `readCase` and `nextCase` are retained unchanged.
- `src/content/services/modernize.{en,ca,es}.md` needed no edit: step 2 already links the localised Topten case.
- `tests/structure.spec.ts`: new assertions, run per locale and per project: related-work cards of each service
  equal the deck's mapping and `noRelatedWork` is absent; the exact internal link count and locale prefix of
  each service body (`build` 0, `modernize` 1, `platform` 1, `energy` 2); `modernize` and `platform` link to
  `<prefix>/work/topten-ecosystem/`; and the home page's Selected work order. The first draft of the
  link-count test wrongly required at least one link on `build`; six runs failed on that, and the
  assertion was replaced with exact counts. The content was correct.

### Recorded deviations and observations

- `ca`/`es` text is my translation, not owner-reviewed. Flagged for review: all four case studies (frontmatter
  and bodies) and `caseStudies.*` in both locales. Choices that are not in the deck's locale tables: the ca/es
  `caseStudies.eyebrow` (`Projectes seleccionats` / `Proyectos seleccionados`), `title` (`Sistemes en
producció` / `Sistemas en producción`), `subtitle`, the three labels and `backToWork`. I kept the English
  term `Content Security Policy` in the `vgr-cat` ca/es text rather than coin a translation.
- Attribution (D1, D8, D9): the copy names Topten, Banco Estado and Fundación Chile as the deck specifies.
  Owner review of contracts, confidentiality and permission for each named attribution remains a release
  requirement; nothing in this step establishes it. The inspection-tooling claim that results retain input
  data, formula version and calculation is the owner's statement (D9); the implementation was not inspected.
- The deck's case-study link lines were already placed in their own paragraph in step 2; no change here.
- `astro check` still reports **63 files**; no file was added to the checked set by this step.

### Verification (all run 2026-11-17)

- `npm ci` → exit 0 (same two `allowScripts` warnings for `esbuild` and `workerd`, unchanged and not approved).
- **`npm audit --audit-level=high` → exit 1, `16 high severity vulnerabilities`.** Steps 1–3 recorded
  `found 0 vulnerabilities` earlier today. `package.json` and `package-lock.json` have no diff, so the lockfile
  did not change; the advisory data did. Root cause per `npm audit --json`: `picomatch` advisory
  [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) (ReDoS through single-branch
  repeated extglobs), affected range `<=4.0.7`. `npm view picomatch` reports `latest` as `4.0.7`, so **no
  patched release exists to move to**. The installed copies are 4.0.7 (via `astro`, `vite`, `tinyglobby`,
  `fdir`, `@astrojs/internal-helpers`) and 2.3.2 (via `unstorage → anymatch`). The 16 entries are that one
  advisory propagated up through `astro`, `@astrojs/check`, `eslint-plugin-astro`, `@typescript-eslint/parser`,
  `vite`, `unstorage` and related packages. npm's suggested remedy (`npm audit fix --force`) would install
  `astro@5.3.0`, a breaking downgrade; it was **not** run, and nothing in `package.json`, the lockfile, the
  `overrides` block or the CI audit step was changed. A `minimatch`-style override cannot help because there is
  no patched `picomatch` to select.
  `ci.yml` runs `npm audit --audit-level=high` in the `validate` job, so a pull request or push to `main` would
  fail `CI` and `Deploy` would not run.
- `npm run format:check` → exit 0, `All matched files use Prettier code style!`.
- `npm run lint` → exit 0, no output.
- `npm run check` → exit 0, `Result (63 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `37 page(s) built` (the three `/work/vgr-cat/` routes return the count to 37).
- `npm run test:e2e` → exit 0, `482 passed (2.4m)`, including `page-weight.spec.ts` (all six desktop and
  mobile budget tests pass; the numbers were not logged, since step 6 owns that baseline).
  The 482 is the earlier 386 plus 66 new assertions (33 per project) and 30 from the three new `vgr-cat`
  routes in the route-driven specs.
- Claim-phrase scan: `rg -ni 'sub-second|zero maintenance|legally defensible|defensible audit|immutable audit|
legal enforcement|days to minutes|hours to seconds|weeks to hours|negligible|days rather than months|slashed
analyst' src/content` → no output, exit 1. The translated equivalents were reviewed by reading the six
  rewritten ca/es case studies; none of the removed claims survives. A looser scan for `defensible`,
  `immutable`, `uptime`, `failover`, traffic and fleet numbers matched only the ordinary word `rules`.
- Mutation check: with the `modernize` addition emptied in `src/lib/content.ts`, `npx playwright test
tests/structure.spec.ts --project=desktop --grep 'related work of|localised Topten'` gave `3 failed, 15
passed` (the `modernize` related-work test in en, ca and es). The file was restored; sha256 matched.
- Production rebuild after e2e and after the mutation run: `37 page(s) built`; `npm run check:production-env`
  → exit 0, committed sitekey in use, not a test key.
- Built output: `dist/{,ca/,es/}services/modernize/` and `…/platform/` link `/work/topten-ecosystem/`,
  `/ca/work/topten-ecosystem/` and `/es/work/topten-ecosystem/`; `…/build/` links `…/work/vgr-cat/`;
  `dist/{,ca/,es/}work/` each hold `banco-estado-iot eu-inspection-tooling topten-ecosystem vgr-cat`.

### Not verified

- A passing dependency audit. Everything else in the standard gate passed; this one did not.
- No browser inspection of the new pages beyond what the structure, axe and layout specs cover.
- `npx wrangler deploy --dry-run` was not run; step 4's Verify does not require it.
- Named attribution, the D8/D9 technical facts and permission to publish them (owner review).
- The retired `/work/topten-scout/` URLs and the old pillar URLs return 404 by the no-redirects decision.

### Decision needed from the owner

The audit failure blocks release and is not fixable inside this change. Options, none taken:
(a) wait for an upstream `picomatch` release and re-run; (b) approve a separate, explicit change to how the
audit gate treats this advisory, which AGENTS.md rule 5 forbids doing silently; (c) review whether the affected
packages only run at build time. Steps 5–8 will hit the same failure until one of these is chosen.

## 2026-11-17: Owner-directed fix for the dependency audit blocker (step 4 follow-up)

Commit: uncommitted

The owner asked for the npm issues to be fixed and chose, from the options offered, to **loosen the audit
threshold to `critical`** and to approve the `esbuild` and `workerd` install scripts. The first was done; the
second was **not** done (see below). Earlier entries are unchanged.

### Investigation (read-only)

- `gh api /advisories/GHSA-fc5q-39xc-vjpf`: severity `high`, CVSS 7.5, published 2026-10-19, **updated
  2026-11-17T15:56:44Z**, vulnerable range `<= 4.0.7`, `first_patched_version: null`, not withdrawn. The
  update on the day of the failure is the likely reason runs earlier that day reported 0 vulnerabilities; the
  advisory's earlier content was not retrieved, so this is an inference.
- `npm view picomatch versions`: the newest release is `4.0.7`, so there is nothing to upgrade to. The
  installed copies are `4.0.7` (via `astro`, `vite`, `tinyglobby`, `fdir`, `@astrojs/internal-helpers`) and
  `2.3.2` (via `unstorage → anymatch`).
- `npm audit --json` metadata: `high: 16, critical: 0, total: 16`; all 16 are the one advisory propagated up
  the tree. `astro` is a runtime `dependency`, so `--omit=dev` does not clear it either.
- Exposure: `grep -rli picomatch` over `dist/`, `.wrangler/dry-run/` (the Worker bundle from step 3's dry-run)
  and `src`, `astro.config.mjs`, `playwright.config.ts`, `scripts` each exited 1 (no match). The package is used
  only for build-time globbing by Astro, Vite and the linters. The advisory needs an attacker to supply the glob
  pattern; the patterns here are authored in this repository. This is analysis of this tree, not a claim that
  the advisory is harmless elsewhere.

### Changes

- `.github/workflows/ci.yml`: the `Audit dependencies` step runs `npm audit --audit-level=critical`, with a
  comment recording the reason and the advisory. The workflow name `CI`, the job names `validate` and `e2e`,
  `permissions`, `concurrency` and every pinned Action are unchanged (parsed with Node `yaml`: `CI`,
  jobs `validate,e2e`).
- `.github/instructions/workflows.instructions.md`: the CI contract line says `critical`.
- `AGENTS.md`: new gotcha "Dependency audit threshold is `critical`, not `high` (owner decision 2026-11-17)",
  recording the advisory, why no override or `audit fix --force` can help, and the condition for restoring
  `high`. The earlier dated "Verified 2026-11-17 … 0 vulnerabilities" record was left as written.
- Not changed: `package.json`, `package-lock.json`, the `overrides` block, any dependency version, and
  `allowScripts`. No suppression file, ignore list or custom audit script was added. `npm audit fix --force`
  was not run.

### Install-script approval: not done, owner re-confirmation needed

The owner chose to approve `esbuild` and `workerd`. I had described that as "only makes the approval explicit"
because the scripts "already run today". **That was wrong.** `npm help install-scripts` states that install
commands silently _skip_ lifecycle scripts for any dependency with no matching `allowScripts` entry, and
`npm install-scripts ls` lists exactly these two (`esbuild@0.28.2` and `workerd@1.20261117.1`, each
`postinstall: node install.js`). The skipped scripts have not been running, and the whole gate and all e2e
suites pass without them. Approving would therefore start running two postinstall scripts on every install,
locally and in CI, a behaviour change. The owner approved on the basis of my incorrect description, and
AGENTS.md says not to change this policy silently, so `package.json` was left untouched and the question is
re-asked. By default npm writes version-pinned entries (`esbuild@0.28.2`), which need re-approval on every
bump; `--no-allow-scripts-pin` writes name-only entries covering any future version.

### Verification (all run 2026-11-17, after the change)

- `npm ci` → exit 0 (the same two `allowScripts` warnings).
- `npm audit --audit-level=critical` → exit 0; the report still lists `16 high severity vulnerabilities`.
  `npm audit --audit-level=high` still exits 1 and is expected to until picomatch is patched.
- `npm run format:check` → exit 0. `npm run lint` → exit 0.
- `npm run check` → exit 0, `Result (63 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `37 page(s) built`.
- `npm run test:e2e` was not re-run: nothing under `src/` or `tests/` changed since the 482-pass run recorded
  in the step 4 entry; only CI configuration and documentation changed.

### Not verified

- The workflow was not executed on GitHub Actions: nothing was pushed, and `CI` only runs on pushes to `main`,
  pull requests and manual dispatch. It was only parsed and formatted locally.
- `plan.md` still reads `npm audit --audit-level=high` in its "Standard gate" and step 8 Verify text. Only
  the Status checklist may change after sign-off, so I did not edit it. The gate for steps 4 onwards is run
  at `critical` by the owner's decision; the owner should update the plan text if they want it to agree.
- Whether upstream will publish a patched `picomatch`, and when.

### Step 4 status

With the gate run at the owner-approved `critical` threshold, every other Verify command for step 4 had
already passed (see the step 4 entry). The step 4 Status line is therefore changed from `[!]` to
`[x] … uncommitted`, with the threshold caveat above. Nothing is committed.

### Correction (2026-11-17): step 4 was already committed

When the entry above was written, `git status` showed the step 4 content and test changes as clean: the owner
had committed them as `8caace1` (signed, `feat(content): rewrite the case studies and add the vgr.cat case`)
and the blocked-state log as `83da336` (signed). The sentences above that say step 4 is `[x] … uncommitted`
and that "nothing is committed" refer to the state I assumed, not the real one. The step 4 Status line now
carries `8caace1`. The audit-threshold, `AGENTS.md`, `ci.yml` and workflow-instruction edits in this follow-up
remain uncommitted. The `83da336` commit recorded step 4 as `[!]` blocked; this follow-up supersedes that, and
the earlier entry is left as written.

## 2026-11-17: Step 5 — Rewrite hero, meta, about, CTA band and footer

Commit: uncommitted

Precondition: step 4 reconciled against git. `git log` showed `8caace1` (signed, `feat(content): rewrite the
case studies and add the vgr.cat case`) and the follow-up commits `83da336`, `80538e2` and `f71ea0a`; the Status
line for step 4 already carried `8caace1`. The working tree was clean before this step started. The standard
gate ran with `npm audit --audit-level=critical`, the owner-approved threshold recorded earlier today; `plan.md`
still says `high` (see that entry).

### Changes

- `src/i18n/{en,ca,es}.ts`: `site.*` (title, description, author `Victor Gonzalez`, location, jobTitle),
  `nav.caseStudies` (`Selected work`) and `nav.bookCall`, `hero.*` (badge, title, highlight, subtitle, both CTAs
  and the three metrics, now `Build`/`Modernise`/`Run` with qualitative labels and no figures), `about.*`
  (eyebrow, title, the five paragraphs, three experience entries with approved attribution, ten flat
  competencies, `experienceTitle`, `techStackTitle`, `credentials`), `ctaBand.*`, and `footer.tagline`,
  `footer.builtWith` and the new `footer.sourceLabel`. `about.competencies` stays a flat array because
  `schema.ts` feeds it to `knowsAbout`. The hero metrics keep the existing `{ value, label }` shape.
- `src/config.ts`: new `repositoryUrl` (`https://github.com/vgr-dev/vgr.cat`), the single constant for links to
  the repository; step 6 will reuse it.
- `src/components/SiteFooter.astro` and `PageShell.astro`: the copyright line is `© {year} {author}.` from
  `t.site.author` instead of a hard-coded `VGR`; the source link is a real anchor with `footer.sourceLabel` and
  `repositoryUrl`, passed as props rather than HTML inside a translated string.
- `src/lib/schema.ts`: `knowsLanguage` is `['en', 'es']`, was `['en', 'ca', 'es']`. The copy deck and spec D2 make
  English and Spanish the working languages and Catalan enquiries welcome without a proficiency claim, so listing
  Catalan as a known language did not agree with the approved copy. This is a judgement call for the owner.
  Location and `areaServed` (`ES`, `EU`) were checked against the copy ("remote across the EU, on site in the
  Barcelona area") and left unchanged.
- `src/lib/navigation.ts`: comment only (`"Case Studies"` → `"Selected work"`).
- The hero secondary CTA and the CTA-band secondary link already pointed at `#work` in `HomeSections.astro`;
  only their labels changed.
- New `tests/identity.spec.ts` (4 tests per locale, in both Playwright projects): the `<title>`; the JSON-LD
  `Person` (`name`, `jobTitle`, `address`, `knowsAbout`) and `knowsLanguage`; both `#work` anchors and the hero
  metric; the footer's author line and its source anchor (compared with the approved URL literal, not read from
  `config.ts`, which cannot be imported under plain Node because it reads `import.meta.env`); and the About
  page's three roles and ten competencies.

### Recorded deviations and observations

- **Interim stale copy.** `about.teaser` and `about.readMore` are deliberately untouched: the plan removes them
  in step 6. The home page therefore still renders the old About teaser (`Principal software engineer and
consultant…`, `Twelve years…`, `market observability`) in all three locales until step 6. Do not release this
  branch between steps 5 and 6. A scan of `src` and `tests` for the old claims (`12+`, `1.5M`, `99.99`, `17 multi`,
  `200+`, `principal`, `observab`, `acquisition`, `GTIN`, `Case Studies`, `technical call`) matched only those
  teaser strings, the generic word `principal` in `Navegació principal`-style labels and translated prose, and code
  comments.
- **Translations are mine, not owner-reviewed.** Flagged for review: every changed `site`, `nav`, `hero`,
  `about`, `ctaBand` and `footer` string in `ca` and `es`, and in particular the ca/es headline titles (`Enginyer
full-stack sènior i tech lead a temps parcial` / `Ingeniero full-stack sénior y tech lead a tiempo parcial`,
  following D2's `tech lead a temps/tiempo parcial`), the metric words (`Construir`, `Modernitzar`, `Operar` /
  `Construir`, `Modernizar`, `Operar`), the translated competencies, and the three experience entries
  (`Enginyer líder de plataforma i consultor`, `Ingeniero líder de plataforma y consultor`).
- **Register.** These strings address the reader formally (`vostre`/`su`), matching the contact block from step 3. The step 2 service bodies use informal `tu`/`tú`. The mix remains and needs an owner decision.
- **Gendered forms.** ca/es job titles use the masculine forms (`Enginyer`, `Ingeniero`, `sènior`, `sénior`), as
  the existing site did. I phrased the first-person prose gender-neutrally where that was easy (`Em moc igual de
bé…`, `Me desenvuelvo igual de bien…`), but the titles cannot avoid it. Please confirm.
- **Attribution.** About paragraph 2 names Bush Energie, the experience entries name Topten, Fundación Chile and
  Banco Estado, and the hero/about make no unsourced figure claims. Owner review of permission to name them
  remains a release requirement (D1).
- **Commitments in copy.** `ctaBand.body` says `I reply personally, usually within two business days`, as the
  deck specifies; the retained thanks page says `one or two business days`. Both are owner-approved statements,
  but they are not the same.
- `astro check` now reports **64 files** (63 plus the new spec). Record in `AGENTS.md` in step 8.

### Verification (all run 2026-11-17)

- `npm ci` → exit 0 (the same two `allowScripts` warnings; the approval question is still open).
- `npm audit --audit-level=critical` → exit 0; the report still lists `16 high severity vulnerabilities` (the
  picomatch advisory), as recorded earlier.
- `npm run format:check` → exit 0, `All matched files use Prettier code style!`.
- `npm run lint` → exit 0, no output.
- `npm run check` → exit 0, `Result (64 files): 0 errors, 0 warnings, 0 hints`.
- `npm run check:placeholders` → exit 0, `0 placeholders remain.`
- `npm run build` → exit 0, `37 page(s) built`.
- `npm run test:e2e` → exit 0, `506 passed (2.4m)`: the earlier 482 plus 24 new (4 tests × 3 locales × 2
  projects). This includes `page-weight.spec.ts` and `layout.spec.ts`; all budgets pass. The page-weight numbers
  were not logged, since step 6 owns the baseline.
- Production rebuild after e2e: `37 page(s) built`; `npm run check:production-env` → exit 0, committed sitekey in
  use, not a test key.
- `<title>` in the built HTML, from `dist/index.html`: `Victor Gonzalez | Senior Full-Stack Engineer &amp;
Fractional Tech Lead`; `dist/ca/index.html`: `Victor Gonzalez | Enginyer full-stack sènior i tech lead a temps
parcial`; `dist/es/index.html`: `Victor Gonzalez | Ingeniero full-stack sénior y tech lead a tiempo parcial`.
- JSON-LD parsed from each home page: `name: Victor Gonzalez` in all three (and `grep -c '"name":"Victor
Gonzalez"' dist/index.html` → `1`); `jobTitle` equal to the locale's headline title; `address` `Sant Cugat del
Vallès, near Barcelona` / `a prop de Barcelona` / `cerca de Barcelona`; `knowsLanguage ['en', 'es']`;
  `areaServed ['ES', 'EU']`; ten `knowsAbout` entries.
- Footer anchor in `dist/{,ca/,es/}index.html`: `<a href="https://github.com/vgr-dev/vgr.cat" …>` with the
  translated label. `curl -L https://github.com/vgr-dev/vgr.cat` → `HTTP 200`; `gh api repos/vgr-dev/vgr.cat`
  reports `visibility: public`.
- `public/og/og-default.png` was viewed: it shows only the `vgr.cat` wordmark and logo, so it carries no
  positioning text to update.

### Not verified

- The footer link was checked by its built `href` and an HTTP request, not by clicking it in a browser.
- `npx wrangler deploy --dry-run` was not run; step 5's Verify does not require it.
- No external account, CV, LinkedIn or directory listing was touched (out of scope), so those can still carry the
  old title and claims.
- Visual rendering of the new hero metrics (`Modernitzar` at display size in the narrow panel) is covered only by
  the layout and page-weight specs, which pass, not by a manual look.
- Owner review of all ca/es wording, attribution and the `knowsLanguage` change.

## 2026-11-17: Install-script approval for esbuild and workerd (owner re-confirmed)

Commit: uncommitted

Closes the question left open in the audit-blocker entry. After I corrected my earlier statement (npm _skips_
unapproved install scripts; it does not run them), the owner re-confirmed that `esbuild` and `workerd` should
be approved and asked for it to be done. The owner did not choose between pinned and name-only entries, so I used
npm's default, **version-pinned**, which is the narrower grant. Say if name-only is wanted instead.

### Review before approving (read-only)

- `npm install-scripts ls` listed exactly `esbuild@0.28.2` and `workerd@1.20261117.1`, each with `postinstall:
node install.js`, and nothing else.
- `node_modules/{esbuild,workerd}/package.json` define only that one script. `install.js` in each (300 and 252
  lines) imports `fs`, `os`, `path`, `zlib`, `https`, `crypto` and `child_process`; the only URL built is
  `https://registry.npmjs.org/<platform package>/-/<name>-<version>.tgz`, used as a fallback download of the
  platform binary package. I read the matching lines, not the whole files, so this is a review of what they
  fetch and execute at the surface, not an audit of every line.

### Change

- `npm install-scripts approve esbuild workerd` → `Approved esbuild: added esbuild@0.28.2` and `Approved
workerd: added workerd@1.20261117.1`. `package.json` gains
  `"allowScripts": { "esbuild@0.28.2": true, "workerd@1.20261117.1": true }` and nothing else changes in it.
  `package-lock.json` has no diff. No dependency version, override or `--all` approval was involved.
- `AGENTS.md`: dated "Resolved 2026-11-17" note appended to the existing install-script gotcha, recording the
  decision, that the scripts were previously skipped, that entries are pinned, and what to do when a bump
  reintroduces the warning. The earlier text was left as written.

### Verification (all run 2026-11-17, after the change)

- `npm install-scripts ls` → `No packages with unreviewed install scripts.`
- `npm ci` → exit 0 with **no** `install-scripts` warning lines (a count of the string in the output was `0`);
  the output ends with the picomatch `16 high severity vulnerabilities` audit summary recorded earlier.
- `npm audit --audit-level=critical` → exit 0. `npm run format:check`, `npm run lint` → exit 0.
- `npm run check` → exit 0, `0 errors, 0 warnings, 0 hints`. `npm run check:placeholders` → exit 0.
- `npm run build` → exit 0, `37 page(s) built`.
- `npm run test:e2e` → exit 0, `506 passed (2.5m)`, with the scripts now running during install.
- Rebuilt normally afterwards: `37 page(s) built`; `npm run check:production-env` → exit 0, committed sitekey in
  use, not a test key.
- `npx wrangler deploy --dry-run --outdir=.wrangler/dry-run` → exit 0; `Read 102 files from the assets
directory`, which matches the `AGENTS.md` figure for the current 37-page tree; no warnings printed.

### Not verified

- The change was not exercised on GitHub Actions (nothing pushed). CI runs `npm ci`, so it will now run the two
  scripts on the runner. Locally they ran harmlessly, but a runner-specific difference is not ruled out.
  An earlier draft of this line claimed the scripts had been run by hand before; that was not done and the claim
  was removed before commit.
- Whether a future bump of either package changes what its install script does; pinned entries mean it will be
  skipped until re-approved, which is the intent.
