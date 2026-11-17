# 0001. Spec-driven AI agent workflow

- **Status:** accepted
- **Date:** 2026-11-17

## Context

AI coding agents are used in this repo. Their instructions and working memory must live in files
under version control, independent of any one tool, so sessions can be restarted and tools swapped.

## Decision

- `AGENTS.md` is the single instructions file. `CLAUDE.md` contains only `@AGENTS.md`. Tool-specific
  instruction files are merged into it.
- Features are worked through `specs/<YYYY-MM-DD>-<slug>/` with `spec.md`, `plan.md`, `progress.md`
  and, for large reviews, `review.md`. The date is the creation date. `spec.md` carries
  `status: draft | active | done | abandoned`.
- Three roles hand off through those files in fresh sessions: architect (spec to plan), builder
  (one plan step at a time, logging to `progress.md`), reviewer (adversarial check of the diff).
- A human signs off the plan before building and approves every commit.
- Architecture decisions are recorded in `docs/adr/`.
- Tool-side auto-memory is not relied upon.

## Consequences

- Any agent that reads `AGENTS.md` can take any role.
- Stalled work is visible by folder date and `status`; `/spec-status` reports specs older than the
  configured threshold.
- Role definitions and commands are global (dotfiles), not per repo.
