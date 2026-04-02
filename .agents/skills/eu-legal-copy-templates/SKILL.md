# SKILL: EU Legal Copy Templates
**Used by**: legal-privacy-reviewer

---

⚠️ **DISCLAIMER**: These are templates and best-practice drafts. All final legal documents must be reviewed by a qualified EU lawyer before publishing. Flag every uncertain item with `[LEGAL REVIEW NEEDED: reason]`.

---

## Medical Disclaimer (mandatory on all product pages)
```
This device is designed for wellness and recovery support.
It is not intended to diagnose, treat, cure, or prevent any disease.
These statements have not been evaluated by a regulatory authority.
Consult your healthcare provider before use if you have a medical condition,
are pregnant, or are taking prescription medications.
```

## Cookie Consent Categories
```
STRICTLY NECESSARY — Required for the website to function.
  Examples: session cookies, shopping cart, CSRF protection.
  Opt-in: Not required.

FUNCTIONAL — Remember your preferences.
  Examples: language, currency, theme settings.
  Opt-in: Required (soft/implied acceptable in some jurisdictions — verify).

ANALYTICS — Understand how visitors use the site.
  Examples: PostHog, Google Analytics.
  Opt-in: Required (explicit). Must NOT fire before consent.

MARKETING — Personalised advertising.
  Examples: Meta Pixel, Google Ads.
  Opt-in: Required (explicit). Most restrictive category.
```

## Privacy Policy Outline (GDPR Art. 13/14)
```markdown
# Privacy Policy

**Last updated**: [DATE]
**Controller**: Hylono [Legal Entity], [Address], [Registration Number]

## 1. What data we collect and why
| Data | Purpose | Legal Basis | Retention |
|------|---------|-------------|-----------|
| Name, email, address | Rental/purchase fulfilment | Contract | 3 years |
| Payment reference | Accounting | Legal obligation | 7 years |
| Usage preferences | Service improvement | Legitimate interest | 90 days |
| Marketing opt-in | Sending newsletters | Consent | Until withdrawn |

## 2. Who we share data with
- Stripe (payment processing) — [DPA link]
- Resend (email delivery) — [DPA link]
- [Any other processor] — [DPA link]
We do not sell your data. We do not share with advertisers without consent.

## 3. Transfers outside the EU
[If applicable: Describe safeguards — SCCs, adequacy decision]
[If none: "All data is processed within the European Union."]

## 4. Your rights
Under GDPR you have the right to:
- Access your data
- Correct inaccurate data
- Delete your data ("right to be forgotten")
- Receive your data in portable format
- Object to processing
- Withdraw consent at any time

To exercise your rights: [email/link]
Response time: 30 days (GDPR requirement)

## 5. Complaints
You can file a complaint with your national supervisory authority.
[LEGAL REVIEW NEEDED: List relevant authority for each market: DE, PL, NL]

## 6. Contact
[DPO name/contact if appointed]
privacy@hylono.com
```

## Terms of Service Outline
```markdown
# Terms and Conditions

**Last updated**: [DATE]
**Company**: Hylono [Legal Entity] | [Registration] | [VAT number]

## Rental Terms
- Rental period: [options — 7/30/60/90 days]
- Auto-renewal: [Yes/No — specify clearly]
- Deposit: €[amount], refundable within 5 business days of return
- Damage policy: [define what constitutes damage vs. normal wear]
- Early termination: [conditions and any fees]
- Return process: [how to initiate, collection arrangement]
[LEGAL REVIEW NEEDED: Auto-renewal terms must comply with EU consumer protection]

## EU Consumer Rights — 14-Day Withdrawal
Under EU law, you have the right to withdraw from this contract within 14 days
without giving any reason. The withdrawal period expires 14 days from the day
of delivery.
[LEGAL REVIEW NEEDED: Verify withdrawal rights apply to rental model in each jurisdiction]

## Limitation of Liability
[LEGAL REVIEW NEEDED: Draft limitation clauses — jurisdiction-specific]

## Governing Law
[LEGAL REVIEW NEEDED: Specify governing law and jurisdiction for dispute resolution]
```

## Rental Agreement Checklist
Before any device ships, the customer must acknowledge:
- [ ] Device description and serial number
- [ ] Rental period start/end dates
- [ ] Total cost (rental fee + deposit)
- [ ] Care obligations (no modifications, proper storage)
- [ ] Damage liability terms
- [ ] Return process
- [ ] Safety acknowledgment (read and understood safety information)
- [ ] Not suitable for: [contraindications list]
[LEGAL REVIEW NEEDED: Full rental agreement — this checklist is a minimum, not a substitute]
