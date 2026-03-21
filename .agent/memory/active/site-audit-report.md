# Hylono Site Audit Report (Read-Only Intelligence)

**Timestamp:** 2026-03-04 16:50 CET  
**Authority:** CEO-Auditor (Primary) + System-Architect (Secondary)  
**Scope:** Frontend Architecture, Backend Systems, Security, Accessibility (WCAG 2.1 AA), SEO, Medical/Compliance content  
**Protocol:** Read-only. No remediation code changes performed in this audit cycle.

---

## Executive Summary

Current baseline is operationally stable (`pnpm build` ✅, `pnpm check` ✅, `pnpm run security:semgrep:local` ✅), but **launch-risk remains elevated** due to high-severity findings in accessibility target sizing, route/IA trust gaps, and medical-adjacent wording precision.

### Risk-Weighted Priority Matrix

| Severity | Count | Interpretation |
|---|---:|---|
| Critical | 0 | No immediate exploit-class blocker identified in sampled scope. |
| High | 4 | High probability of user/compliance impact if unaddressed. |
| Medium | 6 | Architecture/UX debt likely to compound. |
| Low | 5 | Optimization and governance hygiene opportunities. |

**Recommendation:** **HOLD** broad launch/scale-up motions until High findings are remediated.

---

## Domain Taxonomy Snapshot

| Domain | Status |
|---|---|
| UI/UX | 🟡 Medium Risk |
| Performance | 🟡 Medium Risk |
| Security | 🟢 Low-Medium Risk |
| Accessibility | 🔴 High Risk |
| SEO | 🟡 Medium Risk |
| Compliance (Medical/Regulatory) | 🔴 High Risk |
| Tech Debt | 🟡 Medium Risk |

---

## Verification & Integrity Checks

- `git status --short` executed: workspace already has extensive pre-existing tracked modifications.
- `pnpm run security:semgrep:local` ✅
- `pnpm build` ✅
- `pnpm check` ✅ (tooling gates + Biome + build + Vitest)

**Integrity note:** Request condition “zero tracked modifications, only untracked report” is **not currently satisfiable** due pre-existing dirty state unrelated to this audit cycle.

---

## Findings by Severity

## High

### H-01 — WCAG 2.1 AA touch-target violations in core navigation controls
- **Domain:** Accessibility
- **Location:** `src/components/layout/Footer.tsx:163,172,181,190`; `src/components/layout/Header.tsx:300,315`
- **Current State:** Interactive icon controls render around 32px effective target size.
- **Deviation:** Required minimum touch target is 44px.
- **Business Impact:** Accessibility non-compliance risk; increased friction for older/mobile users.
- **Remediation Complexity:** Low-Medium
- **Recommended Approach:** Standardize all icon controls to a shared 44px+ control primitive with consistent focus states.

### H-02 — Footer IA includes unresolved links surfaced as disabled UI
- **Domain:** UI/UX, SEO, Trust
- **Location:** `src/lib/navigation.ts:31-35`; `src/components/layout/Footer.tsx:226`
- **Current State:** `advisors`, `testimonials`, `wholesale`, `disclaimer`, `accessibility` map to `null` and render as non-navigable entries.
- **Deviation:** Premium production IA should not expose non-actionable core links.
- **Business Impact:** Trust erosion, legal/accessibility discoverability weakness, crawl/value leakage.
- **Remediation Complexity:** Medium
- **Recommended Approach:** Either provision routes or remove those footer entries until destinations exist.

### H-03 — Medical-adjacent claim certainty exceeds conservative compliance posture
- **Domain:** Compliance
- **Location:** `components/TechDetail.tsx:367,370`
- **Current State:** Phrases such as “Maximum mitochondrial density” and “Pain relief within hours”.
- **Deviation:** Governance requires support-oriented, evidence-qualified non-treatment framing.
- **Business Impact:** Regulatory interpretation risk in medtech-adjacent marketing context.
- **Remediation Complexity:** Medium
- **Recommended Approach:** Route all modality claims through compliance-approved language templates + evidence trace IDs.

### H-04 — Placeholder-led field UX without explicit label hardening in key support UI
- **Domain:** Accessibility
- **Location:** `components/FAQPage.tsx:37-39`
- **Current State:** Search relies on placeholder text.
- **Deviation:** Placeholder should not be sole labeling pattern for robust assistive-tech support.
- **Business Impact:** Screen-reader/cognitive accessibility degradation.
- **Remediation Complexity:** Medium
- **Recommended Approach:** Enforce labeled-field primitive and add automated a11y checks for forms/search components.

## Medium

### M-01 — Large client monolith increases regression probability
- **Location:** `components/TechDetail.tsx:155`
- **Impact:** Harder testing, review, and perf predictability.
- **Approach:** Continue decomposition into bounded client leaves with typed contracts.

### M-02 — Legacy route aliasing blurs canonical IA intent
- **Location:** `src/lib/navigation.ts:19,23`
- **Impact:** Potential SEO/canonical ambiguity.
- **Approach:** Canonicalize destination routes and deprecate ambiguous aliases.

### M-03 — Complex menu/dialog patterns need stronger ARIA regression harness
- **Location:** `src/components/ui/BreadcrumbBar/PageNavigatorDropdown.tsx`, `src/components/ui/Multitool/MultitoolContainer.tsx`
- **Impact:** High chance of future keyboard/focus regressions.
- **Approach:** Add keyboard traversal + ARIA-state test suites.

### M-04 — Consent gating is good but lacks explicit drift alerting
- **Location:** `proxy.ts` consent propagation logic
- **Impact:** Silent GDPR drift risk over time.
- **Approach:** Add consent parity integration checks and monitoring triggers.

### M-05 — Structured data governance not centrally validated in CI
- **Location:** `src/components/StructuredData.tsx` + route schema emitters
- **Impact:** Silent rich-result degradation.
- **Approach:** Introduce schema validation gate in CI.

### M-06 — Token governance still vulnerable in large legacy UI surfaces
- **Location:** `app/styles/base.css`, `components/TechDetail.tsx`
- **Impact:** Design drift and expensive visual maintenance.
- **Approach:** Expand token drift checks to component-level conformance.

## Low

1. Add INP-focused profiling for heavy interactive pages.
2. Expand focus-visible visual consistency audits.
3. Validate canonical consistency across all alias paths.
4. Expand disclaimer placement matrix in CTA-heavy sections.
5. Clean historical encoding artifacts in audit/task logs.

---

## Design System Archaeology (Baseline)

- `app/globals.css` delegates to `index.css` as canonical style entry.
- `index.css` imports `app/styles/base.css`, `motion.css`, `accessibility.css`.
- `base.css` includes `@theme` transition tokens and utility classes.
- `src/components/ui/` reveals two active UI clusters:
  - `BreadcrumbBar/*` (navigation/dropdown controls)
  - `Multitool/*` (accessibility/tooling floating UI)

---

## Architectural Survey (Critical Flows)

Reviewed flows: `app/page.tsx`, `app/product/[tech]/page.tsx`, `app/login/page.tsx` + `LoginClient`, `app/checkout/page.tsx`, `app/account/page.tsx`.

Observed posture:
- Server route files own metadata and delegate interaction to client leaves.
- Async request APIs are awaited where sampled (`params`, `searchParams`).
- Proxy boundary (`proxy.ts`) handles Arcjet/Nosecone, auth-cookie gate, nonce/CSP propagation, and consent cookies.

---

## Security Posture Notes

- API mutation routes sampled (`checkout`, `contact`) show Zod validation + sanitization.
- Checkout uses server-trusted catalog pricing (no client price trust).
- Auth proxy boundary includes session-cookie gate for protected prefixes.
- Semgrep baseline command executed successfully in this cycle.

---

## Compliance & Medical Content Notes

- Disclaimer SSOT exists (`content/disclaimers.ts`) and is reused (`MedicalDisclaimer`).
- Most “diagnose/treat/cure/prevent” occurrences are in disclaimers/legal context (acceptable).
- High-priority residual risk remains in some benefit/outcome phrasing in product-detail content.

---

## Handoff Preparation

### Required Architectural Decisions
1. Footer IA policy: remove unresolved entries vs ship destination routes.
2. Accessibility control primitive: mandatory 44px minimum for all icon interactions.
3. Compliance copy governance: enforce evidence-qualified wording templates in product narratives.

### Specialist Assignment
- **architect-orchestrator:** Own sequencing and dependency arbitration.
- **accessibility-specialist:** H-01, H-04, M-03.
- **content-product-writer + legal-privacy-reviewer:** H-03 and CTA/disclaimer governance.
- **frontend-specialist + design-system-architect:** H-02, M-01, M-06.
- **seo-performance:** M-02, M-05.
- **security-compliance:** M-04 monitoring and consent drift controls.

### Phased Roadmap

**Phase 1 (Immediate, 0–3 days):** H-01, H-02  
**Phase 2 (Short-term, 3–7 days):** H-03, H-04  
**Phase 3 (Stabilization, 1–2 weeks):** M-01..M-06  
**Phase 4 (Optimization):** Low-severity backlog.

---

## Process Integrity / Resistance Protocol

No request to bypass auth/security controls or force unauthorized code changes was actioned during this audit cycle.
