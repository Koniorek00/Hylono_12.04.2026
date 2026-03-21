# System Audit Report (T3, Read-Only)

**Timestamp:** 2026-03-05 10:59 CET  
**Role:** `ceo-auditor` (primary) with `architect-orchestrator` secondary routing  
**Scope:** architecture integrity, server/client boundaries, SEO metadata/canonical strategy, compliance language posture, analytics instrumentation readiness  
**Constraint:** read-only audit of product code; no remediation code edits in this cycle.

---

## Verification Snapshot (This Cycle)

- `pnpm run security:semgrep:local` ✅
- `pnpm build` ✅
- `pnpm check` ✅ (`12` test files passed, `116` tests passed; non-fatal `act(...)` warnings in `tests/components/MultitoolContainer.test.tsx`)
- Tooling channel status confirms `biomcp` and `semgrep-mcp` enabled in config (`.mcp.json:23-29`, `.mcp.json:47-53`)

---

## Remediation Status (Implementation Pass — 2026-03-05)

| ID | Status | Implementation Notes |
|---|---|---|
| C-01 | ✅ Implemented | Removed `any` usage in `components/partner/nexus/ProtocolEngine.tsx` with explicit protocol recommendation types and typed rendering iteration. |
| H-01 | ✅ Implemented | Replaced treatment-adjacent phrases in `components/TechDetail.tsx` with support-oriented language. |
| H-02 | ✅ Implemented | Reframed diagnosis/prescription terminology in `components/partner/nexus/ProtocolEngine.tsx` to neutral protocol/intake language. |
| H-03 | ✅ Implemented | Consolidated canonical strategy around `lib/seo-metadata.ts`, removed legacy `components/SEO.tsx`, and removed SEO dependency from `hooks/useTech.ts`. |
| M-01 | ✅ Implemented | Standardized route metadata generation to `createPageMetadata` for `app/store/page.tsx` and `app/wellness-planner/page.tsx`. |
| M-02 | ⏳ Deferred | Product detail page decomposition (`components/TechDetail.tsx` monolith) is still pending as a larger refactor. |
| M-03 | ✅ Implemented | Removed client pass-through (`app/about/AboutClient.tsx` deleted), converted `components/AboutPage.tsx` to server component, and rendered it directly from `app/about/page.tsx`. |
| M-04 | ✅ Implemented | Expanded compliance scan scope in `scripts/compliance-check.ts`, added strict-by-default mode, and replaced hard truncation with configurable CLI limits. |
| M-05 | ✅ Implemented | Added consent-aware telemetry mount in `app/layout.tsx` via `src/components/providers/ConsentAwareVercelTelemetry.tsx` (`Analytics` + `SpeedInsights` only after analytics consent). |
| L-01 | ✅ Implemented | Updated `components/Visualizations.tsx` wording from “healing” to support-oriented phrasing in aria-label/comment context. |

---

## Findings (Strictly Factual, File+Line Referenced)

## Critical

### C-01 — Non-negotiable TypeScript guardrail breach (`any`)
- **Evidence:**
  - `components/partner/nexus/ProtocolEngine.tsx:238`
  - `components/partner/nexus/ProtocolEngine.tsx:248`
- **Observed:** Explicit tuple annotations use `[string, any]` in production component logic.
- **Why this is critical:** Workspace guardrail mandates “No `any`” (non-negotiable). This is a direct policy violation.
- **Owner:** `architect-orchestrator` → `frontend-specialist`

## High

### H-01 — Medical-claim phrasing exceeds support-oriented mandate in product narrative
- **Evidence:**
  - `components/TechDetail.tsx:1097` (`therapeutic dose`)
  - `components/TechDetail.tsx:1098` (`Smallest therapeutic molecule`)
  - `components/TechDetail.tsx:1348` (`Wound Healing`)
  - `components/TechDetail.tsx:1414` (`supports wound healing`)
  - `components/TechDetail.tsx:1485` (`Therapeutic window`)
  - `components/TechDetail.tsx:1523` (`healing support`)
- **Observed:** Multiple treatment-adjacent terms appear in product benefit copy outside a disclaimer-only section.
- **Owner:** `architect-orchestrator` → `content-product-writer` + `legal-privacy-reviewer`

### H-02 — Clinical diagnosis/prescription framing appears in partner protocol UI
- **Evidence:**
  - `components/partner/nexus/ProtocolEngine.tsx:30` (`PRESCRIPTION_MATRIX`)
  - `components/partner/nexus/ProtocolEngine.tsx:136` (`Awaiting Clinical Data`)
  - `components/partner/nexus/ProtocolEngine.tsx:138` (`targeted therapeutic prescription`)
  - `components/partner/nexus/ProtocolEngine.tsx:229` (`Primary Diagnosis Match`)
  - `components/partner/nexus/ProtocolEngine.tsx:236` (`Rx Dosing Parameters`)
- **Observed:** Interface language uses diagnosis/prescription treatment framing.
- **Owner:** `architect-orchestrator` → `legal-privacy-reviewer` + `content-product-writer`

### H-03 — Canonical/domain strategy drift (env-based metadata vs hardcoded domain literals)
- **Evidence:**
  - Env-based canonical source: `lib/seo-metadata.ts:4`, `lib/seo-metadata.ts:35`, `lib/seo-metadata.ts:41-43`
  - Hardcoded product breadcrumb URLs: `components/TechDetail.tsx:518-520`
  - Hardcoded canonical defaults/map: `components/SEO.tsx:17-18`, `components/SEO.tsx:73`, `components/SEO.tsx:79`, `components/SEO.tsx:85`, `components/SEO.tsx:109`
- **Observed:** Mixed canonical URL strategy (runtime env source + embedded absolute domain strings).
- **Owner:** `architect-orchestrator` → `seo-performance` + `frontend-specialist`

## Medium

### M-01 — Metadata pattern inconsistency across routes
- **Evidence:**
  - Plain metadata object: `app/store/page.tsx:6-9`, `app/wellness-planner/page.tsx:6-10`
  - Helper-based metadata pattern: `app/about/page.tsx:2`, `app/about/page.tsx:5-9`, `lib/seo-metadata.ts:34-65`
- **Observed:** Route-level metadata generation is not standardized to one canonical pattern.
- **Owner:** `seo-performance` + `frontend-specialist`

### M-02 — Product detail path is a large client-rendered monolith
- **Evidence:**
  - Client directive: `components/TechDetail.tsx:1`
  - File size observed in audit: `components/TechDetail.tsx` total `2595` lines
  - Route usage: `app/product/[tech]/ProductClient.tsx:1`, `app/product/[tech]/ProductClient.tsx:5`, `app/product/[tech]/ProductClient.tsx:32-39`
- **Observed:** Product detail rendering is concentrated in one very large client component.
- **Owner:** `frontend-specialist` + `seo-performance`

### M-03 — About route uses client pass-through for mostly static content
- **Evidence:**
  - Client wrapper: `app/about/AboutClient.tsx:1-6`
  - Route delegates to wrapper: `app/about/page.tsx:3`, `app/about/page.tsx:12-13`
  - About page component is client-marked: `components/AboutPage.tsx:1`
  - Static text-heavy content sample: `components/AboutPage.tsx:23-49`
- **Observed:** Static informational route relies on client composition in current implementation.
- **Owner:** `frontend-specialist`

### M-04 — Compliance scanner under-scopes and truncates findings by design
- **Evidence:**
  - Scan scope limited to two roots: `scripts/compliance-check.ts:32-35`
  - Non-strict validation mode: `scripts/compliance-check.ts:140`
  - Output truncation (top 20 files): `scripts/compliance-check.ts:229`
  - Output truncation (top 5 issues/file): `scripts/compliance-check.ts:232`
- **Observed:** Current checker can miss issues outside configured roots and does not emit full issue inventory.
- **Owner:** `security-compliance` + `content-product-writer`

### M-05 — Analytics/speed insight dependencies present without root layout mount evidence
- **Evidence:**
  - Installed deps: `package.json:44-45`
  - Root layout import block (no analytics/speed-insights import): `app/layout.tsx:1-11`
  - Root layout body render tree (no mounted analytics/speed components): `app/layout.tsx:60-77`
- **Observed:** Packages are present, but root app layout does not currently mount them.
- **Owner:** `seo-performance` + `frontend-specialist`

## Low

### L-01 — Therapy visualization accessibility label uses “healing” framing
- **Evidence:**
  - `components/Visualizations.tsx:108`
  - `components/Visualizations.tsx:112`
- **Observed:** `aria-label` and nearby comments include “healing” terminology.
- **Owner:** `accessibility-specialist` + `content-product-writer`

---

## Prioritized Execution Roadmap

### Phase 1 (Immediate)
1. **C-01** remove `any` from protocol engine typed iteration.
2. **H-01/H-02** medical/prescription language hardening in product + partner surfaces.

### Phase 2 (Short-term)
3. **H-03/M-01** canonical + metadata pattern consolidation (single source: env-driven helper).
4. **M-05** analytics/speed instrumentation decision and explicit root mount policy.

### Phase 3 (Stabilization)
5. **M-02/M-03** server-first decomposition plan for client-heavy pages.
6. **M-04/L-01** compliance scanner coverage expansion and wording hygiene.

---

## Specialist Handoffs

- **Handoff → `architect-orchestrator` (required):**
  - Sequence remediation phases in this order: `C-01` → `H-01/H-02` → `H-03/M-01` → `M-02/M-03/M-04/M-05`.
  - Ensure guardrail-first closure (TypeScript + medical language) before optimization tasks.

- **Handoff → `skill-architect` (required due capability gap):**
  - Audit identified a **capability gap** in medical/compliance evidence automation: current checker is local-pattern based and truncated (`scripts/compliance-check.ts:229`, `scripts/compliance-check.ts:232`) with no explicit BioMCP-backed evidence linking.
  - Design/update specialist workflow so medical copy audits require full-scope evidence mapping (no top-N truncation) and explicit evidence traceability policy.

- **Additional specialist routing:**
  - `seo-performance`: H-03, M-01, M-05
  - `frontend-specialist`: C-01, M-02, M-03
  - `content-product-writer` + `legal-privacy-reviewer`: H-01, H-02, L-01
  - `security-compliance`: M-04

---

## Notes

- This report is diagnostic only and does not include remediation code changes.
- All findings above are tied to explicit file-path and line-level citations.