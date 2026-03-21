# Error Log

Root cause analysis of failures. Max 30 entries. Oldest evicted when full.
Purpose: prevent repeating the same mistakes across sessions.

FORMAT:
[YYYY-MM-DD] [agent-slug]
Symptom: What appeared to be wrong
Root Cause: Why it actually happened
Fix: What resolved it
Prevention: Rule to apply going forward

---

[2026-03-02] [architect-orchestrator]
Symptom: `.agent` memory layer drifted from `.clinerules` contracts, causing ghost-file sprawl.
Root Cause: Legacy memory system templates were never reconciled with v12 canonical MEMORY SYSTEM table.
Fix: Merged ghost content into canonical files, added missing canonical files, removed uncontracted artifacts.
Prevention: Enforce Integrity Rule monthly by comparing `tree /f .agent` against `.clinerules § MEMORY SYSTEM`.

[2026-03-02] [architect-orchestrator]
Symptom: Governance docs in `.agent/` contained stale external links and duplicated authority.
Root Cause: Parallel governance surfaces (`agents.md`, `guardrails.md`, `PROTOCOL_INDEX.md`) were maintained outside canonical `.clinerules`.
Fix: Preserved unique operational notes in canonical memory/decision targets and deleted duplicate governance ghosts.
Prevention: Keep `.clinerules` as the only governance authority and archive/remove duplicate docs.

[2026-03-03] [skill-architect]
Symptom: Early phase of the skill-upgrade task delivered shallow edits and an attempted completion before user acceptance criteria were fully met.
Root Cause: Intent-depth mismatch and weak completion gate discipline (I optimized for local progress instead of explicit user-defined depth/sequence and closure checks).
Fix: Re-established the task around user’s explicit quality bar (rich-format parity, one-by-one execution), resumed sequential upgrades, and reinstated final verification + cleanup checkpoints.
Prevention: Enforce Intent Fidelity Gate on every specialist rewrite task: (1) restate depth/sequence constraints from user wording, (2) reject “small patch” plans when user asked for “big/rich” rewrites, (3) block attempt_completion until objective closure checklist is fully verified and evidence is recorded.

[2026-03-03] [architect-orchestrator]
Symptom: Attempting targeted Biome checks on selected files produced “No files were processed” even though edited files existed.
Root Cause: Path filtering/input pattern mismatch with Biome invocation in this workspace state caused the target list to be ignored.
Fix: Switched to full-workspace Biome verification command `pnpm exec biome check . --files-ignore-unknown=true`, then ran targeted Vitest and full `pnpm build` for closure evidence.
Prevention: For remediation closure in this repo, prefer full-workspace Biome invocation with `--files-ignore-unknown=true` unless a verified targeted pattern is confirmed in the same session.
