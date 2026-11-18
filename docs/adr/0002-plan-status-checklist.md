# 0002. Plan status checklist

- **Status:** accepted
- **Date:** 2026-11-17

## Context

Under ADR 0001, `plan.md` steps carried no status: progress lived only in the append-only
`progress.md`, so seeing where a spec stood meant matching log entries to steps by hand, and nothing
recorded whether a finished step had been committed. The archived `.ai/plans/` format showed
checkbox status inline, which made unfinished or uncommitted work obvious. Spec-driven frameworks
(Spec Kit, Kiro, OpenSpec) converge on the same `tasks.md` checklist; adopting one of them wholesale
was rejected because it would tie the workflow to a tool's CLI and file layout.

## Decision

- `plan.md` opens with a `## Status` checklist, one line per step: `[ ]` todo, `[~]` in progress,
  `[x]` done, `[-]` deferred, `[!]` blocked, followed by `uncommitted`, the short commit hash, or the
  reason for deferral or blocking.
- It is the only part of `plan.md` that changes after sign-off. The builder updates the line for its
  own step and replaces `uncommitted` with the hash once the human has committed.
- `progress.md` stays the append-only evidence log and gains a `Commit:` field per entry.
- `/spec-status` compares the checklist with `progress.md` and git and flags mismatches; the reviewer
  treats a stale Status line as a mechanical fix.
- The evidence standard applies: never `[x]` for partial work.

## Consequences

- One glance at `plan.md` shows progress and commit state, as the old plans did.
- The checklist duplicates information in `progress.md` and git, so it can drift; `/spec-status` and
  the reviewer exist to catch that.
- The role and skill definitions live in the dotfiles and were updated with this decision.
