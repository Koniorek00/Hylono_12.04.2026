# Anti-Chaos Scaling Rulebook

## 1. Naming Conventions
- Agents: `[Role] Agent` (e.g., "Growth Agent", "Compliance Gate").
- Skills: `snake_case.md` in `/skills/`.
- Docs: `snake_case.md` in `/docs/`.

## 2. Ownership Model
- **Single Owner Rule**: Every file/folder has one owning agent.
- **Shared Spaces**: `/docs/decisions/` and `/docs/os/` are owned by the Org Steward but editable by all via Council.

## 3. Decision Rights Hierarchy
1.  **Compliance Gate**: Veto on all claims/safety/legal.
2.  **QA Authority**: Veto on all unverified code/merges.
3.  **Executive Orchestrator**: Tie-breaker for strategy/conflicts.
4.  **Daily PM**: Decision maker for daily tactics (bets).

## 4. Agent Lifecycle
- **Create**: Proposed by Org Steward, approved by Exec.
- **Trial**: Runs in sandbox or shadow mode.
- **Graduate**: Given full permissions (Secure Mode).
- **Merge/Retire**: Merged if scope overlaps; retired if KPI implies obsolescence.

## 5. Duplication Prevention
- Before creating a new agent/skill, check `/docs/os/agent_constellation.md` and `/skills/index.md`.
- Use "Routing" to delegate rather than duplicate.

## 6. Single Sources of Truth (SSOT)
- **Policies**: `/policies/` (Compliance, Trace, Brand).
- **Knowledge**: `/docs/knowledge/` and `/research/index.md`.
- **Decisions**: `/docs/decisions/`.
