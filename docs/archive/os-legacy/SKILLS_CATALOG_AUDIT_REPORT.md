# Content Audit Report: Skills Catalog (skills_catalog.md)

**Audit Date**: 2026-02-17  
**Document Audited**: `docs/os/skills_catalog.md`  
**Auditor**: AntiGravity Content Audit System  

---

## Executive Summary

The skills_catalog.md document contains **28 skills** across **5 categories**. Cross-referencing with the broader AntiGravity OS documentation reveals **15 discrepancies** including missing skills, misplaced entries, naming inconsistencies, and structural misalignments.

---

## 1. MISSING SKILLS (Not in Catalog but Referenced Elsewhere)

### 1.1 Skills from `agent_constellation.md` (Functional Skills Section)

| Missing Skill | Referenced In | Recommended Category | Priority |
|:---|:---|:---|:---|
| `write-marketing-copy` | agent_constellation.md L22 | 03. Product & Growth | **HIGH** |
| `unit-economics-check` | agent_constellation.md L23 | 03. Product & Growth | **HIGH** |
| `seo-page-optimizer` | agent_constellation.md L24 | 03. Product & Growth | **HIGH** |
| `browser-regression-walkthrough` | agent_constellation.md L25 | 04. Operations & Engineering | **HIGH** |
| `build-test-prove` | agent_constellation.md L26 | 04. Operations & Engineering | **HIGH** |

**Recommendation**: Add these 5 skills to their respective categories. These are explicitly listed as "Functional Skills (SOPs & Expertise)" in the agent constellation document and should be present in the catalog.

---

### 1.2 Skills for Meta-OS Roles (from `meta_os_roles.md`)

| Missing Role | Recommended Skill ID | Recommended Category | Priority |
|:---|:---|:---|:---|
| Org Evolution Steward | `ops-org-evolution` | 04. Operations & Engineering | MEDIUM |
| Incident Commander | `ops-incident-command` | 04. Operations & Engineering | **HIGH** |
| Security/Privacy Steward | `security-privacy-steward` | 01. Governance & Compliance | MEDIUM |

**Note**: `security-risk-auditing` partially covers Security Steward but lacks privacy-by-design focus mentioned in meta_os_roles.md.

---

### 1.3 Skills for Daily Loop Phases (from `daily_loop.md`)

| Daily Loop Phase | Missing Skill | Recommended Category | Priority |
|:---|:---|:---|:---|
| Scan Signals | `ops-signal-scanner` | 04. Operations & Engineering | MEDIUM |
| Choose Bets | `ops-bet-selector` | 04. Operations & Engineering | LOW |
| Measure & Learn | `ops-scoreboard-update` | 04. Operations & Engineering | MEDIUM |

---

### 1.4 Skills for Synergy Map Roles (from `synergy_map.md`)

| Missing Role | Recommended Skill ID | Recommended Category | Priority |
|:---|:---|:---|:---|
| Analytics Lead | `growth-analytics-lead` | 03. Product & Growth | MEDIUM |
| CX Lead | `customer-experience-lead` | 03. Product & Growth | MEDIUM |

---

## 2. MISPLACED SKILLS (Wrong Category)

### 2.1 `strategy-conflict-resolution` (Line 44)

**Current Location**: 04. Operations & Engineering  
**Issue**: This skill implements "Multi-agent decision council" which directly maps to **Council Mode Protocol** (`council_protocol.md`). Council Mode is a governance/decision-making mechanism, not an engineering function.

**Recommendation**: Move to **01. Governance & Compliance** or create new category **06. Strategy & Decision Making**.

---

### 2.2 `qa-visual-inspection` (Line 43)

**Current Location**: 04. Operations & Engineering  
**Issue**: This duplicates functionality with `browser-regression-walkthrough` referenced in agent_constellation.md. Both perform "Visual recording of UI flows" / "QA visual inspection".

**Recommendation**: 
- Either consolidate into single skill `qa-visual-inspection` (preferred name)
- Or clearly differentiate scope in descriptions

---

## 3. NAMING INCONSISTENCIES

### 3.1 Prefix Pattern Violations

| Skill ID | Current Prefix | Expected Pattern | Issue |
|:---|:---|:---|:---|
| `customer-voice-analysis` | `customer-` | `growth-` | Breaks category prefix convention |
| `strategy-conflict-resolution` | `strategy-` | `ops-` or `compliance-` | No "strategy" category exists |

**Convention Analysis**:
- Category 01 uses `compliance-` and `security-` prefixes
- Category 02 uses `research-` prefix
- Category 03 uses `product-` and `growth-` prefixes
- Category 04 uses `ops-`, `eng-`, `qa-` prefixes
- Category 05 uses `data-` prefix

**Recommendation**: Rename `customer-voice-analysis` → `growth-voice-analysis` for consistency.

---

### 3.2 Agent vs Skill Naming Mismatch

| Agent ID (agent_constellation.md) | Skill ID (skills_catalog.md) | Issue |
|:---|:---|:---|
| `ops-daily-pm` | `ops-daily-operations` | Different suffixes for same function |
| `compliance-gate` | No matching skill | Agent exists, skill missing |
| `eng-architecture-lead` | `eng-architecture-review` | Similar but not matching |

**Recommendation**: Align skill naming with agent IDs where they represent the same capability, or clearly document the relationship.

---

## 4. OVERLAPPING/DUPLICATE SKILLS

### 4.1 Release-Related Skills

| Skill ID | Function | Overlap |
|:---|:---|:---|
| `ops-release-train` (L36) | Full deployment & verification loop | Broad |
| `ops-staged-release` (L37) | Staged rollout & feature flags | Subset of above |

**Issue**: These appear to be steps in the same process rather than distinct skills. The `release_train.md` document describes a single unified process.

**Recommendation**: Consolidate into `ops-release-train` with staged release as a documented phase, or clearly delineate responsibilities.

---

### 4.2 Verification Skills

| Skill ID | Function | Overlap |
|:---|:---|:---|
| `eng-verification-loop` (L42) | Automated build & test proof | Technical verification |
| `qa-visual-inspection` (L43) | Visual recording of UI flows | UI verification |

**Issue**: Both serve the "Verify & Ship" phase of daily_loop.md. No clear ownership boundary defined.

**Recommendation**: Document which skill owns which verification type, or merge under `qa-verification-suite`.

---

## 5. MISSING CROSS-REFERENCES

### 5.1 Skills Without Agent Mapping

The catalog lacks a column showing which Skeleton Agent (from agent_constellation.md) owns each skill.

**Recommendation**: Add "Owner Agent" column:

```markdown
| Skill ID | Business Function | Owner Agent | Trigger Example |
```

### 5.2 Skills Without Synergy Loop Mapping

No reference to which loop in `synergy_map.md` each skill supports.

**Recommendation**: Add metadata or separate mapping document linking skills to:
- Growth & Content Loop
- Product & Engineering Loop
- Research & Feedback Loop
- Master Control

---

## 6. STRUCTURAL GAPS

### 6.1 Missing Category: Strategy & Decision Making

The following skills/roles don't fit existing categories:
- `strategy-conflict-resolution` (Council Mode)
- Executive Orchestrator functions
- Strategic alignment activities

**Recommendation**: Add new category:

```markdown
## 06. Strategy & Decision Making
| Skill ID | Business Function | Trigger Example |
| :--- | :--- | :--- |
| **strategy-council-mode** | Multi-agent decision council. | High-Risk Choice |
| **strategy-executive-alignment** | Strategic prioritization. | Quarterly Review |
| **strategy-conflict-resolution** | Multi-agent decision council. | High-Risk Choice |
```

### 6.2 Missing Category: Customer Experience

`customer-voice-analysis` exists but CX Lead role from synergy_map.md has no supporting skills.

**Recommendation**: Either:
- Expand Category 03 to include CX skills
- Create new Category 06 for Customer Experience

---

## 7. TRACEABILITY COMPLIANCE ISSUES

### 7.1 Skills Referenced in Trace Documents

| Document | Referenced Function | Missing Skill |
|:---|:---|:---|
| `traceability.md` | Content Linter | No `compliance-content-linter` skill |
| `release_train.md` | Safety Lint | No `compliance-safety-lint` skill |

**Recommendation**: Add these skills or clarify if they're subsets of existing `compliance-automated-linting`.

---

## 8. TRIGGER EXAMPLE INCONSISTENCIES

### 8.1 Time-Based vs Event-Based Triggers

| Skill ID | Trigger Type | Issue |
|:---|:---|:---|
| `ops-daily-operations` | "09:00 AM" | Time-based, not event-based |
| `ops-system-uptime` | "System status" | Command-based |
| `compliance-coverage-metric` | "Daily Report" | Output-based |

**Recommendation**: Standardize trigger format. Suggest event-based triggers:
- `ops-daily-operations`: "Daily Cycle Start" or "Scheduler Trigger"
- `ops-system-uptime`: "Health Check Request"
- `compliance-coverage-metric`: "Report Generation"

---

## 9. SUMMARY OF REQUIRED ACTIONS

### Critical (Must Fix)

| # | Action | Affected Lines |
|:---|:---|:---|
| 1 | Add 5 missing skills from agent_constellation.md | New rows needed |
| 2 | Move `strategy-conflict-resolution` to Governance or new Strategy category | L44 |
| 3 | Rename `customer-voice-analysis` to `growth-voice-analysis` | L30 |
| 4 | Add missing Incident Commander skill | New row needed |

### High Priority

| # | Action | Affected Lines |
|:---|:---|:---|
| 5 | Consolidate or differentiate `ops-release-train` / `ops-staged-release` | L36-37 |
| 6 | Resolve `qa-visual-inspection` vs `browser-regression-walkthrough` duplication | L43 |
| 7 | Add Owner Agent column | Entire table structure |
| 8 | Add missing Content Linter and Safety Lint skills | New rows needed |

### Medium Priority

| # | Action | Affected Lines |
|:---|:---|:---|
| 9 | Standardize trigger format | All trigger columns |
| 10 | Add skills for Analytics Lead and CX Lead roles | New rows needed |
| 11 | Create Strategy & Decision Making category | New section |
| 12 | Align skill naming with agent IDs | Multiple |

---

## 10. PROPOSED CORRECTED CATALOG STRUCTURE

```markdown
# Hylono AntiGravity — Skills Catalog (Business Registry)

The following skills are available to AntiGravity agents. They are categorized by business function.

## 01. Governance & Compliance
| Skill ID | Business Function | Owner Agent | Trigger Example |
| :--- | :--- | :--- | :--- |
| **compliance-trace-audit** | AI intent auditor (Script + Examples). | compliance-gate | Post-Sandbox |
| **compliance-ai-safety** | AI safety/trace test suite. | compliance-gate | Model Update |
| **compliance-trace-enforcement** | Detection of claims without trace. | compliance-gate | Commit / Pull |
| **compliance-automated-linting** | Code/Doc trace link validation. | compliance-gate | Pre-Commit / Release |
| **compliance-content-linter** | Content trace validation. | compliance-gate | Content Update |
| **compliance-safety-lint** | Forbidden terms scanning. | compliance-gate | Pre-Release |
| **compliance-coverage-metric** | KPI generation for trace coverage. | compliance-gate | Daily Report |
| **security-risk-auditing** | Audit secrets/PII. | security-steward | Security Check |
| **security-privacy-steward** | Privacy-by-design enforcement. | security-steward | Data Request |
| **strategy-conflict-resolution** | Multi-agent decision council. | executive-orchestrator | High-Risk Choice |

## 02. Research & Knowledge
| Skill ID | Business Function | Owner Agent | Trigger Example |
| :--- | :--- | :--- | :--- |
| **research-backlog-triage** | Ticket prioritization logic. | research-curator | Signal Scan |
| **research-gap-analysis** | Capture uncertainty as tickets. | research-curator | Uncertainty Detect |
| **research-quality-control** | Logic for Knowledge Pack validity. | research-curator | Pack Review |
| **research-knowledge-merging** | Logic for SSOT integration. | research-curator | Pack Validated |

## 03. Product & Growth
| Skill ID | Business Function | Owner Agent | Trigger Example |
| :--- | :--- | :--- | :--- |
| **product-feature-factory** | Builds complete UI/Logic sections. | eng-lead | New Feature Req |
| **product-spec-architecture** | Create PRD/Implementation Plans. | eng-lead | "Write spec" |
| **growth-seo-planning** | Keyword & Content Briefs. | any | "Plan content" |
| **growth-seo-optimizer** | Page-level SEO optimization. | any | "Optimize page" |
| **growth-experimentation** | Plan A/B tests & Data. | any | "Design experiment" |
| **growth-voice-analysis** | Turn feedback into backlog. | any | "Analyze feedback" |
| **growth-analytics-lead** | Metrics analysis & insights. | any | "Analyze metrics" |
| **growth-marketing-copy** | Premium Hylono-style storytelling. | any | "Write copy" |
| **growth-unit-economics** | Financial feasibility analysis. | any | "Check economics" |
| **customer-experience-lead** | CX workflow orchestration. | any | "CX review" |

## 04. Operations & Engineering
| Skill ID | Business Function | Owner Agent | Trigger Example |
| :--- | :--- | :--- | :--- |
| **ops-daily-operations** | Master heartbeat of the OS. | ops-daily-pm | Daily Cycle Start |
| **ops-signal-scanner** | Scan all signal sources. | ops-daily-pm | Signal Scan |
| **ops-bet-selector** | Select daily business bets. | ops-daily-pm | Bet Selection |
| **ops-release-train** | Full deployment & verification loop. | ops-devops-lead | Release |
| **ops-work-delegation** | Standard delegation format. | ops-daily-pm | Delegation |
| **ops-agent-configurator** | Generation of new agent packs. | ops-daily-pm | New Hire |
| **ops-system-uptime** | Uptime/Build status. | ops-devops-lead | Health Check |
| **ops-incident-command** | Outage & regression handling. | ops-devops-lead | Incident Alert |
| **ops-scoreboard-update** | Update daily metrics. | ops-daily-pm | Cycle Complete |
| **eng-architecture-review** | Codebase/Stack review. | eng-lead | "Audit stack" |
| **eng-verification-loop** | Automated build & test proof. | eng-lead | Local Change |
| **eng-build-test-prove** | Technical verification loop. | eng-lead | "Verify build" |
| **qa-visual-inspection** | Visual recording of UI flows. | qa-authority | UI Regression |

## 05. Data Operations
| Skill ID | Business Function | Owner Agent | Trigger Example |
| :--- | :--- | :--- | :--- |
| **data-cleaning-automation** | Dedupe/PII masking in sheets. | any | Data Clean |
| **data-sheets-management** | CRUD ops on Google Sheets. | any | Sheet Update |
| **data-reporting-automation** | Generating sheet-based reports. | any | Export Report |
```

---

## 11. VALIDATION CHECKLIST

Before considering this audit complete, verify:

- [ ] All skills from agent_constellation.md are present
- [ ] All Meta-OS roles have corresponding skills
- [ ] All Daily Loop phases have supporting skills
- [ ] All Synergy Map roles have supporting skills
- [ ] No duplicate/overlapping skills exist
- [ ] All skills have consistent prefix naming
- [ ] All skills have defined owner agents
- [ ] All triggers follow consistent format
- [ ] Trace-related skills match traceability.md requirements
- [ ] Release skills match release_train.md process

---

**End of Audit Report**
