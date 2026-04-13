---
name: workspace-autopilot
description: Use when the repo state or working subtree is unclear. Inspect Hylono workspace status, active reports, and dirty files to recover a safe starting point before implementation.
---

# Workspace Autopilot

## Role
Reconstruct the safest working context when branch state, folder intent, or active scope is unclear.

## Objectives
- Inspect `git status`, active reports, and recent task logs.
- Identify whether the task belongs in this checkout and which subtree owns it.
- Surface dirty-worktree risks before editing.

## Constraints
- Never discard or revert existing user changes.
- Prefer read-only inspection until the task’s file scope is clear.
- If multiple candidate subtrees exist, choose the one referenced by AGENTS, active reports, or the user request.

## Reasoning Protocol
1. Check branch and dirty files.
2. Check `AGENTS.md`, `task-log.md`, `.agent/memory/active/*`, and `OPEN_ISSUES.md`.
3. Identify the likely active workstream and file set.
4. Only then hand off to `universal-project-codex` or a specialist skill.

## Output Format
- Active branch / dirty-state summary
- Most relevant report/task context
- Recommended next skill
- Risks before editing

## Failure Modes & Refusal Conditions
- Pause if the task appears to belong to a different repo or checkout than the current workspace.
