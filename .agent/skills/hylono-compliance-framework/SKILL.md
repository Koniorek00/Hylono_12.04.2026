# SKILL: Hylono Compliance Framework
**Used by**: ceo-auditor, security-compliance, content-product-writer, legal-privacy-reviewer

---

## Regulatory Landscape

### EU MDR (Medical Device Regulation 2017/745)
- Applies IF Hylono makes medical claims or products meet MDR device definition
- Consumer wellness devices with no medical claims: Generally exempt
- **Rule**: If a product page says it "treats" or "diagnoses" anything → MDR applies
- **Safe harbour**: "For wellness support" + "Not a medical device" + no diagnostic/therapeutic claims

### GDPR (General Data Protection Regulation)
- **Mandatory** — Hylono is EU-based, all customers are data subjects
- Legal basis for processing: Consent (marketing) | Contract (rental/purchase) | Legitimate interest (security/fraud)
- Health-adjacent data (device usage + wellness goals) = treat as sensitive category until classified
- DPA (Data Processing Agreement) required with all data processors (Stripe, Resend, etc.)

### EU Consumer Rights Directive
- 14-day right of withdrawal on all distance contracts (rental + purchase)
- Must inform customer BEFORE checkout, not after
- Exceptions: custom/personalized items (apply carefully to protocols)

### EU eCommerce Directive
- Price transparency: all prices must include VAT
- Clear identification of commercial communications
- No dark patterns in checkout flow

---

## Medical Content Rules

### Claim Classification
| Level | Definition | Allowed? | Disclaimer Required? |
|-------|-----------|---------|---------------------|
| **Wellness claim** | "Supports recovery," "may help with relaxation" | ✅ Yes | Optional but recommended |
| **Structure/function** | "Increases ATP production in cells" | ✅ Yes | "Research suggests" required |
| **Health claim** | "Reduces inflammation" | ⚠️ With evidence | Evidence citation required |
| **Medical claim** | "Treats arthritis," "cures condition" | ❌ No | Forbidden without MDR |
| **Diagnostic claim** | "Detects disease," "diagnoses condition" | ❌ No | Forbidden without MDR |

### Mandatory Disclaimer (all product pages)
```
Not intended to diagnose, treat, cure, or prevent any disease.
These statements have not been evaluated by a medical authority.
Consult your healthcare provider before use if you have a medical condition.
```

### Forbidden Words/Phrases
- diagnose, diagnoses, diagnosis
- treat, treats, treatment (in medical context)
- cure, cures, cured
- heal disease / heal condition
- "FDA approved" (EU device, wrong authority)
- "clinically proven" (without citation to specific study)
- "guaranteed results"

### Evidence Citation Standards
- Use peer-reviewed sources only (PubMed preferred)
- Format: "Research suggests [claim]. [Author et al., Year]"
- Add: "[VERIFY]" placeholder for any citation not yet confirmed
- Never fabricate citations or study results

---

## GDPR Implementation Checklist
- [ ] Privacy policy: Art 13/14 compliant
- [ ] Cookie consent: Granular, opt-in for non-essential
- [ ] Data subject rights: Access, deletion, portability, objection
- [ ] Retention policies: Documented and enforced
- [ ] DPAs: Signed with all processors
- [ ] Data breach procedure: Documented (72h notification requirement)
- [ ] DPO: Required if large-scale health data processing

## Compliance Review Triggers
Any of these require security-compliance + legal-privacy-reviewer review:
- New data collection field
- New third-party integration
- New product page with health claims
- Changes to checkout/signup flow
- Cookie/tracking script additions
- Marketing email campaign setup
