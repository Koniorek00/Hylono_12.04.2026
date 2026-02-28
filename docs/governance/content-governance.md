# Content Governance — Hylono Platform

_Last updated: 2026-02-18 | Owner: Content & Legal team_

---

## 1. Purpose

This document defines rules and processes for creating, reviewing, approving, and publishing content across all Hylono platform surfaces (website, app, emails, documentation).

---

## 2. Regulatory Scope

Hylono operates in the EU health-adjacent wellness space. All content must comply with:

- **MDR 2017/745** — Medical Device Regulation (applies to any software/device classified as Class I–III)
- **GDPR** — No personal health data used in marketing without explicit consent
- **Directive 2006/114/EC** — No misleading claims
- **Directive 2005/29/EC** — No unfair commercial practices

---

## 3. Medical Claim Rules

### 3.1 Forbidden Language

The following terms are **strictly prohibited** in any customer-facing copy unless supported by formal regulatory clearance:

| Forbidden | Permitted alternative |
|-----------|----------------------|
| "diagnose" | "support assessment of" |
| "treat" | "designed to support" |
| "cure" | "may assist recovery from" |
| "heal" | "supports the body's natural process" |
| "prevent disease" | "may support overall wellness" |
| "FDA Cleared" | "CE Marked" (with Notified Body ref) |

### 3.2 Required Disclaimer

Every page discussing therapy benefits must include:

> _"Not intended to diagnose, treat, cure, or prevent any disease. Results may vary. Consult your healthcare provider before use."_

### 3.3 Evidence Standards

- **Tier 1 (Preferred):** Peer-reviewed studies retrieved via BioMCP/PubMed — cite PMID
- **Tier 2 (Acceptable):** Systematic reviews, meta-analyses
- **Tier 3 (Use with caution):** Case studies, manufacturer data — must be labeled as such
- **Forbidden:** Anecdotal claims presented as clinical evidence

---

## 4. Content Approval Workflow

```
Draft (Writer) 
  → Medical Review (Medical Advisor — required for therapy claims)
  → Legal Review (Legal team — required for T&Cs, Privacy, medical claims)
  → Brand Review (Marketing — tone, voice, visuals)
  → Publish (CMS → Strapi)
```

**SLA targets:**
- Medical review: 3 business days
- Legal review: 5 business days
- Brand review: 2 business days

---

## 5. Content Types & Owners

| Content Type | Owner | Review Required |
|-------------|-------|-----------------|
| Therapy benefit pages | Content Writer | Medical + Legal |
| Product pages | Product team | Legal |
| Blog articles (educational) | Content Writer | Medical |
| Terms & Conditions | Legal | Legal only |
| Privacy Policy | Legal + DPO | Legal + DPO |
| Email campaigns | Marketing | Brand |
| Partner portal copy | Product | Brand |

---

## 6. Localization Rules

- All medical claims translated by qualified medical translator — not general translator
- Locale priority: `en` → `de` → `pl` → `nl`
- Each locale must have its own legal review for jurisdiction-specific claims
- ATA pressure values always in bar AND ATA (EU standard: 1.1–1.5 ATA / 0.1–0.5 bar overpressure)

---

## 7. Versioning & Archival

- All published content snapshots stored in Strapi with publication timestamp
- Content changes to therapy pages trigger automatic legal review task in project management system
- Deleted content retained in archive for 7 years (MDR audit trail requirement)

---

## 8. Documentation Platform Governance

Hylono uses three distinct documentation tools, each with a defined scope and owner:

### 8.1 BookStack — Internal Wiki (port 8211, Phase 2)
- **Purpose:** Internal team knowledge base — SOPs, onboarding, company policies, internal runbooks
- **Owner:** Operations / Head of Content
- **Access:** Internal only (behind Zitadel SSO)
- **Content rules:** No patient data, no proprietary clinical data. Free-form wikis. No medical claims.
- **Review:** No formal medical/legal review required for internal wiki content

### 8.2 Outline — Technical Knowledge Base (port 8222, Phase 2)
- **Purpose:** Engineering and product team documentation — architecture decisions, API references, technical runbooks, ADRs
- **Owner:** CTO / Engineering Lead
- **Access:** Internal only (behind Zitadel SSO)
- **Content rules:** Technical documentation only. No marketing copy, no therapy claims.
- **Review:** Engineering peer review required for architecture docs

### 8.3 Docusaurus — Public Developer Documentation (port 8230, Phase 2)
- **Purpose:** External-facing developer documentation — API docs, SDK guides, integration guides for partners and developers
- **Owner:** Developer Relations / Product
- **Access:** Public (read-only)
- **Content rules:** Technical accuracy required. Must not include unverified clinical claims. API examples must be kept current with every release.
- **Review:** Engineering review + Legal review if regulatory references are included

### Content Tool Routing Matrix

| Content type | Tool |
|-------------|------|
| Team SOPs, internal policies | BookStack |
| Architecture decisions, technical runbooks | Outline |
| API docs, SDK guides, partner integration | Docusaurus |
| Product marketing copy, therapy benefit pages | Strapi |
| Email campaigns | Strapi + Novu |

---

## 9. Contacts

| Role | Responsibility |
|------|----------------|
| Head of Content | Owns this document, final publishing approval |
| Medical Advisor | Therapy claims sign-off |
| Data Protection Officer | GDPR/health data content review |
| Legal Counsel | Regulatory compliance sign-off |
