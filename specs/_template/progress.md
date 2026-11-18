# Progress: <Feature title>

Append-only. The builder adds one entry per step; never edit earlier entries.
The reviewer reads this but checks the real diff, not these claims.
At-a-glance status lives in the `## Status` checklist of `plan.md`; this file holds the evidence.

<!-- Entry format:

## YYYY-MM-DD - Step N: <title>
- **Status:** done | blocked | partial
- **Changed:** `path`, `path`
- **Verified:** `<command>` -> pass/fail (short result)
- **Commit:** uncommitted, proposed "<subject>" | <short hash>
- **Open issues:** none | <list>

-->
