# Project State

## What Works
- `.agent/` role/mode/skill framework is present and largely aligned with current role taxonomy.
- Active memory files (`active/errors.md`, `active/patterns.md`, `active/preferences.md`) exist and can be used as canonical rolling logs.
- `codemap.md` exists and provides a useful navigation baseline.

## What's Broken
- Multiple ghost files existed without explicit `.clinerules` memory contracts.
- Duplicate governance docs (`agents.md`, `guardrails.md`, `PROTOCOL_INDEX.md`) drifted from `.clinerules` and contained stale/external links.
- Legacy memory artifacts used non-canonical formats (`user_patterns.yml`) and duplicated active-memory responsibilities.

## In Progress
- Aligning `.agent/` filesystem to `.clinerules` v12.0 memory contract model.
- Archiving non-canonical modes and removing unreferenced workflow/proposal artifacts.
- Finalizing `.clinerules` MEMORY SYSTEM + WORKFLOW trigger alignment.

## Recent Updates (2026-03-03)
- Completed audit hardening batch: canonical breadcrumb migration wiring fixed (`components/AppRouter.tsx` now points to `src/components/navigation/Breadcrumbs.tsx`; stale Layout breadcrumb import removed).
- Completed CSS layering correction: removed duplicate `@import "tailwindcss";` from `app/styles/base.css` and retained single Tailwind entry in `index.css`.
- Expanded CI guardrails in `.github/workflows/ci.yml` for: forbidden `framer-motion` imports, raw `process.env` usage outside `lib/env.ts`, metadata export in `use client` files, and WCAG critical Playwright audit execution.
- Verification passed via `pnpm check` (Biome + Next build + Vitest all green).

## Recent Updates (2026-03-04)
- Closed HIGH-01 final architecture boundary: verified removal of legacy shell files (`App.tsx`, `components/AppRouter.tsx`, `components/AppProviders.tsx`, `components/Layout.tsx`) while preserving active auth/account entrypoints through `components/AuthComponents.tsx`.
- Closed CRIT-01 / CRIT-02 tooling restoration baseline in audit artifacts: `.mcp.json` keeps `semgrep-mcp` and `biomcp` enabled; `scripts/verify-audit-tooling.cjs` confirms required channel state.
- Synchronized audit/memory artifacts (`.agent/memory/active/site-audit-report.md`, `task-log.md`, `.agent/memory/active/handoff-queue.md`, `.agent/memory/activeContext.md`, `.agent/registry/components.md`) to remove stale statuses and reflect current closure state.
- Verification evidence captured in this cycle: `pnpm exec biome check .` ✅, `pnpm build` ✅, `pnpm check` run log shows full pipeline completion through Vitest (`9 passed`, `106 tests`).
- Closed medium audit remediation set: MED-06 disclaimer SSOT centralization completed in `components/TechDetail.tsx`, LOW-02 decomposition advanced with extracted `components/product/detail/ResearchOverviewSection.tsx`, and Home decomposition cleanup completed (`components/Home.tsx` unused import removal).
- Verified MED-03 and MED-07 integrity after remediation (`src/lib/navigation.ts` alias + `src/components/layout/RouteBreadcrumbs.tsx` shared mapping usage confirmed; `any` checks remain clean in audited targets).
- Registry synchronized for new/modified components (`HomeDemoModal`, `HomeTestimonialsSection`, `TechDetail`, `ResearchOverviewSection`).
- Closed strategic audit governance remediations for H3/M2/M3/L1/L2: added `scripts/check-page-decisions.cjs` + `scripts/check-component-registry-parity.cjs`, integrated both into `package.json` `check`, expanded `security:semgrep:local` scope (`app`, `components`, `src`, `lib`, runtime entry files), and corrected registry/client directive mismatches.
- Verification evidence for this closure cycle: `pnpm run audit:page-decisions` ✅, `pnpm run audit:registry-parity` ✅, `pnpm run security:semgrep:local` ✅, `pnpm exec biome check .` ✅, `pnpm build` ✅, `pnpm check` ✅ (9 files / 106 tests).
- Closed additional strategic remediation items: M-01 token drift governance integrated (`scripts/check-marketing-token-drift.cjs` + `audit:token-drift` in `package.json` check pipeline), M-04 runtime terminology clarification documented in `docs/component-layer-policy.md`, and M-05 sanitizer regression coverage expanded in `tests/utils/sanitization.test.ts`.
- Checkout route strategy compatibility corrected for Next.js 16 Cache Components: removed incompatible `dynamic` segment export from `app/checkout/page.tsx` and retained explicit [DECISION] rationale on request-time behavior.
- Governance hygiene strengthened: `.agent/registry/components.md` synchronized with newly extracted Home modules and `TestimonialsPage`; `docs/decisions/ADR-MCP-OPTIMIZATION.md` marked as historical/non-authoritative with `.clinerules` supersedence note.

## Operational Savepoint
- Canonical savepoint path: `.agent/memory/project-state.md` (replaces legacy `session-state.md`).
- If a task is long-running, update this file sections instead of creating parallel state files.
- Quarterly compaction rule: archive oldest 50% entries in high-churn memory/governance logs when they exceed documented caps to keep active artifacts high-signal.

## Known Issues
- Historical mode files include repeated stale guardrail phrasing that requires normalization after archive split.
- Legacy content includes references that contradict current stack conventions (e.g., old Tailwind config patterns, forbidden package manager examples).

## Metrics
- Corrections log structure retained (from `metrics.md`) and migrated as a state concern.
- Build/test regression tracking retained as an operational metric category.
- Proposal outcome tracking retained as a governance metric category.

### Metric Buckets
- Corrections: user correction events and root cause summaries.
- Build/Test Failures: regressions introduced by agent edits.
- Proposal Outcomes: promoted/rejected proposal decisions and rationale.
