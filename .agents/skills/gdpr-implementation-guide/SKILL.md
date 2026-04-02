# SKILL: GDPR Implementation Guide
**Used by**: security-compliance, backend-specialist, legal-privacy-reviewer

---

## Core Principles (Art. 5 GDPR)
1. **Lawfulness, fairness, transparency** — Tell users what you collect and why
2. **Purpose limitation** — Collect only for specified purposes
3. **Data minimisation** — Collect only what you need
4. **Accuracy** — Keep data up to date
5. **Storage limitation** — Delete when no longer needed
6. **Integrity & confidentiality** — Secure processing
7. **Accountability** — Be able to prove compliance

## Legal Bases for Hylono Data Processing
| Processing Activity | Legal Basis | Notes |
|--------------------|-------------|-------|
| Rental agreement execution | Contract (Art. 6(1)(b)) | Core rental data |
| Marketing emails | Consent (Art. 6(1)(a)) | Explicit opt-in required |
| Order/payment history | Legal obligation (Art. 6(1)(c)) | Tax, accounting |
| Fraud prevention | Legitimate interest (Art. 6(1)(f)) | Balance test needed |
| Analytics (PostHog etc.) | Consent (Art. 6(1)(a)) | Cookie consent required |
| Device usage logs | Legitimate interest | Assess necessity |

## Data Categories at Hylono
| Category | GDPR Type | Handling |
|----------|-----------|---------|
| Name, email, address | Personal data | Standard GDPR |
| Payment info | Personal data + PCI | Stripe handles, never store raw |
| Device rental history | Personal data | Retention: 3 years post-contract |
| Wellness goals | Health-adjacent | Treat as special category |
| Session/usage logs | Personal data | Anonymize after 90 days |
| Marketing preferences | Personal data | Consent-based, easy withdrawal |

## Technical Implementation Requirements

### Cookie Consent
```javascript
// Consent categories
const categories = {
  necessary: true,       // Always on, no consent needed
  functional: false,     // User preferences (theme, language)
  analytics: false,      // PostHog, GA - requires consent
  marketing: false,      // Ad pixels - requires consent
};
```
- Must fire BEFORE non-essential scripts load
- Granular per category — no "accept all or nothing"
- Re-ask every 12 months maximum
- Store consent timestamp + version

### Data Subject Rights Implementation
| Right | Implementation |
|-------|---------------|
| Access | User dashboard → download my data |
| Deletion | Account settings → delete account → 30-day soft delete → hard delete |
| Portability | JSON export of all user data |
| Rectification | Edit profile → all linked data updates |
| Objection | Unsubscribe + marketing opt-out |
| Restriction | Support ticket → manual freeze |

### Retention Policies
```
User account data:     Active account duration + 3 years
Rental records:        7 years (legal/tax requirement)
Marketing data:        Until consent withdrawn + 30 days
Session logs:          90 days
Payment records:       Stripe retains per their policy (we keep reference only)
Support tickets:       3 years from resolution
```

### PII Handling Code Rules
```typescript
// NEVER log PII
logger.info('User logged in', { userId: user.id }); // ✅
logger.info('User logged in', { email: user.email }); // ❌

// NEVER expose PII in URLs
GET /api/users/:id/rentals // ✅
GET /api/users/:email/rentals // ❌

// NEVER store PII in localStorage
localStorage.setItem('userId', id); // ⚠️ only if non-sensitive
localStorage.setItem('userEmail', email); // ❌

// Hash/anonymize for analytics
analytics.track('rental_started', { 
  rentalId: rental.id, // ✅ internal ID ok
  userId: hash(user.id), // ✅ hashed
  // email: user.email // ❌ never
});
```

## Data Breach Response (72h GDPR requirement)
1. Hour 0: Detect and contain breach
2. Hour 4: Assess scope — what data, how many users
3. Hour 24: Internal report — DPO notified
4. Hour 48: Determine notification obligation (risk to users?)
5. Hour 72: Notify supervisory authority if required
6. Hour 96: Notify affected users if high risk

## Processors & DPAs Required
- Stripe (payments) — DPA in Stripe dashboard
- Resend/SendGrid (email) — DPA required
- PostHog/analytics — DPA required, EU hosting required
- Cloud hosting (AWS/GCP) — EU region + DPA
- Any AI tools processing user data — DPA required
