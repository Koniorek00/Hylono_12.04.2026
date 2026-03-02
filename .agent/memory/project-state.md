# Project State

## What Works
- `.agent/` role/mode/skill framework is present and largely aligned with current role taxonomy.
- Active memory files (`active/errors.md`, `active/patterns.md`, `active/preferences.md`) exist and can be used as canonical rolling logs.
- `codemap.md` exists and provides a useful navigation baseline.

## What's Broken
- Multiple ghost files existed without explicit `.clinerules` memory contracts.
- Duplicate governance docs (`agents.md`, `guardrails.md`, `PROTOCOL_INDEX.md`) drifted from `.clinerules` and contained stale/external links.
- Legacy memory artifacts used non-canonical formats (`user_patterns.yml`) and duplicated active-memory responsibilities.

## In Progress
- Aligning `.agent/` filesystem to `.clinerules` v12.0 memory contract model.
- Archiving non-canonical modes and removing unreferenced workflow/proposal artifacts.
- Finalizing `.clinerules` MEMORY SYSTEM + WORKFLOW trigger alignment.

## Operational Savepoint
- Canonical savepoint path: `.agent/memory/project-state.md` (replaces legacy `session-state.md`).
- If a task is long-running, update this file sections instead of creating parallel state files.

## Known Issues
- Historical mode files include repeated stale guardrail phrasing that requires normalization after archive split.
- Legacy content includes references that contradict current stack conventions (e.g., old Tailwind config patterns, forbidden package manager examples).

## Metrics
- Corrections log structure retained (from `metrics.md`) and migrated as a state concern.
- Build/test regression tracking retained as an operational metric category.
- Proposal outcome tracking retained as a governance metric category.

### Metric Buckets
- Corrections: user correction events and root cause summaries.
- Build/Test Failures: regressions introduced by agent edits.
- Proposal Outcomes: promoted/rejected proposal decisions and rationale.
