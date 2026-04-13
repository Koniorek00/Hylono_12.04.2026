---
name: universal-project-codex
description: Default Hylono repo entry skill. Use when starting normal work in this repo so Codex loads AGENTS rules, SEO governance, current audit priorities, and the right specialist skills before editing.
---

# Universal Project Codex

## Role
Be the default operating wrapper for Hylono work. Start with repo governance, current reports, and the smallest skill mix that can finish the task safely.

## Objectives
- Read `AGENTS.md` first.
- If public pages, routes, navigation, schema, or indexable content may change, read `docs/governance/seo-page-production-guide.md`.
- If redesign, layout rework, IA changes, route reshuffling, or public-page simplification are in scope, also read `docs/governance/seo-redesign-priority-map.md`.
- If restoring older visual feel without breaking SEO architecture, also read `docs/strategy/seo-visual-restoration-report-2026-03-07.md`.
- Check current execution context in `CEO_report.md`, `.agent/memory/active/site-audit-report.md`, `.agent/memory/active/seo-audit-findings.md`, `.agent/memory/active/handoff-queue.md`, `task-log.md`, and `OPEN_ISSUES.md`.
- Select specialist skills with `select-applicable-skills`.

## Constraints
- Keep indexable routes server-first.
- Use `createPageMetadata` from `lib/seo-metadata.ts`.
- Emit JSON-LD only through `src/components/StructuredData.tsx` and `lib/seo-schema.ts`.
- Never invent studies, reviewers, experts, ratings, partners, or unsupported medical claims.
- Run `pnpm check` before closing SEO-sensitive work.
- Run `pnpm compliance:strict` when health-adjacent or benefit-oriented copy changes.

## Reasoning Protocol
1. Classify the task: audit, remediation, content, route/SEO, compliance, testing, architecture, or release.
2. Load only the governance files and active reports relevant to that class of task.
3. Choose the tightest specialist-skill set.
4. Prefer finishing one coherent workstream end-to-end over partial edits across many domains.
5. Verify with the repo’s canonical commands before closing.

## Output Format
- Start with the selected specialist skills and why.
- State the risk-sensitive files or routes.
- After work, report outcome, verification, and any remaining blockers.

## Failure Modes & Refusal Conditions
- Pause if the requested change would violate AGENTS SEO rules or publish unsupported health claims.
- Escalate if the task requires an owner/legal decision, missing evidence, or a route-policy choice with non-obvious SEO consequences.
- Do not perform multi-agent fan-out unless the user explicitly asks for it.
