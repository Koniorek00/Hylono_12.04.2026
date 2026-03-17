TASK
T: Conduct a deep, comprehensive multi-domain audit of the platform encompassing code architecture, performance, UX consistency, and SEO.
You are working in F:\ag projects\Hylono_MAIN

```markdown
## Context
- Tier: T3
- Primary specialist: ceo-auditor
- Secondary: architect-orchestrator
- Composite: yes — seo-performance, frontend-specialist, code-skeptic, accessibility-specialist, legal-privacy-reviewer

## Absorb First
- Read `.agent/memory/active/errors.md` and `task-log.md` to identify historical friction points and fragile areas.
- Scan `src/app/globals.css` @theme and `src/components/ui/` to establish the baseline design system patterns.
- Read `.agent/registry/components.md` and `api-endpoints.md` to map the current architecture.
- CONSTRAINT: Evaluate the site against its *own* established patterns and `.clinerules`, not just generic web standards.

## Task
Perform a comprehensive, zero-assumptions diagnostic audit of the entire Hylono platform. Map and evaluate codebase structural integrity, frontend rendering strategies (Server vs. Client components), Core Web Vitals readiness, SEO metadata completeness, and UX/accessibility consistency. Identify technical debt, security/privacy risks in data flows, and deviation from established architecture. Document all findings into a prioritized, actionable roadmap rather than fixing issues directly.

## Scope
- Files likely affected: System-wide read-only scan; generating new reports in `.agent/memory/active/`.
- Systems touched: Core architecture, UI consistency, SEO metadata, Server/Client boundaries, routing, performance.
- Critical boundaries: Auth flows, medical/therapy content (compliance check), user data handling.
- Registries to update: Create a centralized audit report document.

## Approach
Execute a multi-lens review of the platform. Catalog discrepancies in visual consistency, deviations from Next.js 16 optimal rendering strategies, and SEO/accessibility gaps. Group findings by severity (Critical, High, Medium, Low) and by required specialist domain. Formulate specific, scoped handoff tasks for the appropriate specialists to execute the fixes.

## Pre-Task Research
- [ ] Filesystem: Search for inconsistent 'use client' usage, missing Suspense boundaries, and unoptimized image loading.
- [ ] BioMCP: Scan therapy/medical content pages for non-compliant diagnostic or curative claims.
- [ ] Semgrep: Run security scan on auth/payment/data flows to identify GDPR or OWASP vulnerabilities.

## Architecture Decisions
- [DECISION: This operation is strictly diagnostic and read-only regarding source code. All findings will be triaged into separate execution tasks to preserve specialist domain isolation.]

## Watch Out For
- Do not spend time on subjective design critiques; measure UI/UX strictly against the site's own established conventions and accessibility standards.
- Flag any usage of forbidden tools/patterns strictly prohibited in `.clinerules` (e.g., Prisma, npm, framer-motion, sync params access).
- Pay special attention to the medical/therapy content guardrails; any language that diagnoses or promises cures is a critical failure.

## Constraints
- Follow all `.clinerules` guardrails during evaluation.
- CONSTRAINT: The output report must be strictly factual, referencing exact file paths and specific line numbers for every identified issue.
- Medical constraint: Ensure all health-related copy aligns with the "support/assist/suggest" mandate.

## Verification
- [ ] Comprehensive audit document is generated with categorized findings.
- [ ] Actionable handoff tasks are formulated for at least 3 distinct specialist domains.
- [ ] Current baseline passes pnpm build (verify the site isn't already broken before logging new tasks).
- [ ] Current baseline passes pnpm check.

## Memory Updates Expected
- [ ] Create `.agent/memory/active/system-audit-report.md` with full findings.
- [ ] Log task in `task-log.md`.
- [ ] Handoff to `architect-orchestrator`: Schedule and route the prioritized execution of audit findings.
- [ ] Handoff to `skill-architect`: Trigger a skill gap analysis if the audit reveals missing capabilities in the current specialist roster.

```