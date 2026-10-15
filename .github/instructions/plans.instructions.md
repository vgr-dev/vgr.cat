---
description: 'Use when creating, updating, verifying, or archiving implementation plans and decision records under .ai/plans. Covers the evidence standard, the archive footer, and why recorded command output must never be rewritten.'
applyTo: '.ai/plans/**'
---

# Plans and decision records

- `.ai/plans/active/` — the in-progress plan.
- `.ai/plans/archive/` — completed plans and decision records, each with an `## Archive Metadata` footer.

Check `active/` before starting work.

`.ai/plans/active/` is kept in git by an empty `.gitkeep` even when no plan is in progress. **Do not
delete it** — git does not track empty directories, so removing it makes `active/` vanish for everyone
until the next plan happens to be created.

## The evidence standard — the important part

This repository records evidence; it does not assert it.

- Capture the **exact command and its output**. State explicitly what you did _not_ verify, and why.
- "Recorded deviations", "Correction" and "Deferred" notes are the expected norm, not noise. Write them.
- **Never tick a checkbox for partial work.** Mark it deferred and say what is missing.
- **Never rewrite an earlier recorded command output** to match a new path, name, or state. Doing so
  falsifies the record. Add a dated correction note instead and explain the discrepancy.
- A plan may be archived with deliberately-deferred criteria only with explicit user confirmation, and the
  deferral must be recorded in the archive footer.

## Archiving

Append this footer when moving a plan to `archive/`:

```markdown
---

## Archive Metadata

- **Completed Date**: YYYY-MM-DD
- **Verified Commit**: <short-hash>
- **Sign-off**: Manual Review Passed
```

- `.ai/` is in `.prettierignore`, so plan documents are not kept formatted. Do not run Prettier on them.
- After a move, in-body paths may still read `.ai/plans/active/...`. **That is deliberate** — several
  occur inside recorded command output. Explain it in the footer rather than rewriting them.
- Move a plan together with any companion decision record it references, or the link breaks.
