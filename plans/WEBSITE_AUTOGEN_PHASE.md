# Website Autogen Phase 1: Gap Analysis & Execution Plan

Date: 2026-01-16
Status: IN_PROGRESS
Owner: strategy-executive-orchestrator

## 1. Blueprint vs Repo Audit

| Feature | Blueprint Status | Repo Status | Gap |
|---------|------------------|-------------|-----|
| **Routes** | 100% defined | 100% implemented | None |
| **Gated Pages** | 7 routes ⚠️ GATED | 7 routes ✅ ACTIVE | Governance/Status mismatch |
| **TechDetail Schema** | All sections required | All sections present | None |
| **SEO Metadata** | All routes required | Missing 5 routes + og:type | SEO Completeness |
| **Anchor Registry** | Standard IDs defined | IDs present but not entry-gated | Navigation/Deep-linking |
| **Compliance** | Trace IDs for all claims | Blog/Research lack visual trace | Compliance Consistency |

## 2. Top 3 Highest-Value Actions

### Action 1: Gated Access Enforcement (Governance)

**Status**: DEFERRED (User Request: "not for now")
**Reasoning**: Blueprint marks Partners, Locator, Affiliate, Press, Careers, Rewards, and Warranty as `GATED`. Currently, these are public. Implementing a gate helps manage expectations and roadmap.
**Owner**: `eng-architecture-lead`

### Action 2: SEO Schema Completion & og:type (Growth)

**Reasoning**: Missing metadata for `builder`, `dashboard`, `checkout`, `wishlist`, and `account`. Missing standard `og:type` required by Section H.
**Owner**: `growth-seo-eoc`

### Action 3: Visual Traceability for Research & Blog (Compliance)

**Reasoning**: Section F and Guardrail 2.1 require modality claims to have trace metadata. Product pages have it; Blog/Research hub show IDs only on hover or not at all. Visual consistency is required.
**Owner**: `compliance-gate`

## 3. Execution Roadmap

1. Implement `GatedView` wrapper and apply to 7 routes.
2. Update `SEO.tsx` and `pageSEO` registry.
3. Enhance `ResearchHub` and `BlogPage` with compliance badges.
4. Verify all changes with `build-test-prove`.
