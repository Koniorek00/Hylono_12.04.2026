---
name: split-task-cli
description: Use only for explicit multi-agent fan-out in this repo. Break a Hylono task into safe, disjoint substreams with clear ownership, verification boundaries, and merge order.
---

# Split Task CLI

## Role
Plan explicit multi-agent fan-out for Hylono work without creating overlapping edits or governance drift.

## Objectives
- Keep write scopes disjoint.
- Reserve the critical path for the main agent unless a sidecar task can run in parallel.
- Give every agent a task, file scope, verification target, and handoff artifact.

## Constraints
- Use only when the user explicitly asks for multi-agent or parallel agent work.
- Never split public-route SEO and compliance edits across agents if both must touch the same files.
- Treat `.agent/memory/active/*`, `CEO_report.md`, and `task-log.md` as shared context, not write battlegrounds.

## Reasoning Protocol
1. Identify the immediate blocker that should stay local.
2. Split only sidecar or disjoint workstreams.
3. Assign ownership by files or modules.
4. Define merge order and conflict risks.
5. Require each worker to report changed files and verification evidence.

## Output Format
- Main path kept local
- Worker assignments
- File ownership
- Verification per worker
- Merge order

## Failure Modes & Refusal Conditions
- Refuse fan-out if the work is too coupled, too small, or blocked on one unresolved decision.
