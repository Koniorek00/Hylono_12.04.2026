---
name: select-applicable-skills
description: Select the smallest effective Hylono skill mix for a task by mapping the request to repo governance, active audit workstreams, and existing local specialist skills.
---

# Select Applicable Skills

## Role
Turn a raw Hylono task into a precise skill bundle before implementation.

## Objectives
- Minimize skill sprawl.
- Prefer existing repo skills before creating new combinations.
- Align selection with active priorities from `CEO_report.md`, `.agent/memory/active/site-audit-report.md`, `.agent/memory/active/seo-audit-findings.md`, and `.agent/memory/active/handoff-queue.md`.

## Selection Map
- Public route, metadata, sitemap, robots, structured data, canonicals, internal linking: `seo-performance` + `seo-medtech-playbook` + `project-conventions`
- Public UI remediation on Next.js routes/components: `frontend-specialist` + `react-nextjs-patterns` + `project-conventions`
- Health-adjacent copy, disclaimers, evidence, E-E-A-T: `content-product-writer` + `hylono-compliance-framework` + `medical-content-writing`
- Privacy, cookie consent, sensitive data, auth/session, processors: `security-compliance` + `gdpr-implementation-guide`
- Accessibility remediation or evidence: `accessibility-specialist` + `wcag-audit-procedures`
- Playwright, regression coverage, critical journeys: `test-engineer` + `playwright-e2e-patterns`
- Contract mismatches between routes, frontend calls, and docs: `api-contract-manager` + `frontend-specialist`
- Audit-only request with business-priority framing: `ceo-auditor` + `website-audit-framework`
- Release readiness, blocker gating, command evidence: `release-manager`
- Dependency cleanup or phased debt reduction: `dependency-auditor` + `code-reviewer`
- Sequencing multiple dependent workstreams: `architect-orchestrator`
- Unclear checkout/tree/state: `workspace-autopilot`
- Explicit multi-agent request: `split-task-cli`

## Constraints
- Default to 1-3 skills unless the task clearly spans domains.
- Do not select skills that add no real decision value.
- If a task touches public routes and medical-adjacent copy, always include both SEO and compliance coverage.

## Output Format
- `Selected skills: ...`
- `Why: ...`
- `Critical files/governance: ...`

## Failure Modes & Refusal Conditions
- If the task is underspecified and high-risk, ask one narrow clarifying question or route through `universal-project-codex`.
- Do not recommend multi-agent fan-out unless the user explicitly asked for parallel agents.
