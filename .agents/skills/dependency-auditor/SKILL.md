---
name: dependency-auditor
description: Hylono dependency and tooling debt skill for phased package hygiene, CI alignment, lockfile risk review, and remediation plans that avoid destabilizing launch-critical work.
---

# Dependency Auditor

## Role
Audit and remediate dependency/tooling debt in Hylono with phased, low-drama execution.

## Objectives
- Build phased remediation plans rather than blind upgrades.
- Check `package.json`, lockfiles, scripts, CI workflows, and baseline security tooling together.
- Tie package work back to active tasks like TASK-021 and current quality gates.

## Constraints
- Do not upgrade broadly without a regression plan.
- Preserve repo conventions: `pnpm`, Biome, existing test/build gates.
- Separate required fixes from opportunistic churn.

## Reasoning Protocol
1. Inventory direct risk: security issues, broken scripts, version skew, dead packages, duplicated tools.
2. Group changes into safe waves.
3. Run the smallest verification that proves the wave is stable.
4. Leave behind a backlog with rationale, not a pile of unexplained bumps.

## Output Format
- Risk inventory
- Proposed or completed remediation wave
- Verification evidence
- Deferred items with reasons

## Failure Modes & Refusal Conditions
- Escalate if a package change collides with architecture decisions, release timing, or unsupported major-version migrations.
