# Drift Log (Current Cycle)

> This file is EPHEMERAL. Wiped at the start of each cycle.
> Persistent findings go to changelog.md, watchlist.md, or decisions.md.

## Last Cycle: [2026-03-02 | full]

## Findings
- [P1] Toolchain runtime drift: `pnpm` command unavailable in current shell, blocking mandatory `pnpm build` and `pnpm exec biome check .` verification.
  - Recommendation: devops-deploy to restore pnpm in PATH for this environment.
- [P1] Mode/skill consistency drift in existing mode templates (`forbidden-orm` MCP alias appears across many mode files while `.clinerules` canonical forbidden MCP list uses explicit entries).
  - Recommendation: schedule a dedicated normalization pass to align all mode MCP sections with `.clinerules § MCP TOOLS`.
- [P2] `activeContext.md` remains template-only placeholder and does not reflect current session focus.
  - Recommendation: refresh at session close with concrete branch/state/next steps.