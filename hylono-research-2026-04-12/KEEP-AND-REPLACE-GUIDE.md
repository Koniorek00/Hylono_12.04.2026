# Keep and Replace Guide

## Purpose
This file tells the implementation team what to keep as the canonical research set, what to treat as optional support material, and what can be removed if the folder needs to stay clean.

## Keep as Canonical
Keep these files as the primary source of truth for implementation planning:
- `MASTER-REPORT.md`
- `RECOMMENDED-ROLLOUT-ORDER.md`
- `DEPENDENCY-AND-OVERLAP-ANALYSIS.md`
- `FINAL-CODEX-MASTER-HANDOFF-PROMPT.md`
- `OPEN-QUESTIONS-MISSING-INFO.md`
- `master-index.csv`
- `hylono-stack-manifest.json`
- `packages/` (all per-app folders)

Reason:
- These files define the full stack view, app-by-app package structure, rollout logic, overlap decisions, and Codex usage rules.
- They are broader and more complete than single-app notes.

## Add These New Files as Complements
These new files are meant to be added, not substituted for the main research set:
- `EXECUTION-PLAYBOOK-FIRST-30-DAYS.md`
- `VERSION-LICENSE-VERIFY-FIRST.md`
- `OPS-NON-NEGOTIABLES.md`
- `INFRA-OPERATOR-CHECKLISTS.md`
- `CODEX-CONFLICT-RESOLUTION-RULES.md`
- `SERVICE-DECISION-LOG-TEMPLATE.md`

Reason:
- They add operator discipline, preflight validation, execution sequencing, and implementation governance.
- They do not duplicate the per-app packages.

## Optional Files You Can Remove or Archive
These are safe to archive if they are duplicates or low-value snapshots:
- `rollout-order.txt` if it is only a plain-text copy of `RECOMMENDED-ROLLOUT-ORDER.md`
- Any one-off notes from other AI tools that are narrower than the package set and do not add unique operator detail

## If You Imported External One-Off Notes
If you already copied in app-specific notes from another AI, keep them only if they add one or more of the following:
- explicit operator checklists
- hidden risk lists
- rollback or restore testing steps
- concrete validation commands
- service-specific performance warnings

If they only restate what the package already says, archive them outside this folder.

## Folder Rule
Use this folder as the implementation control room:
- canonical research stays here
- execution addenda stay here
- raw experiments, temporary drafts, and duplicate summaries go elsewhere
