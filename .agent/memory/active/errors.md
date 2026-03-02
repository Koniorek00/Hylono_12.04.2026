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
