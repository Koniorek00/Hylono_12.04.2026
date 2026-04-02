# SKILL: Hylono Rental Model
**Used by**: architect-orchestrator, backend-specialist, frontend-specialist, content-product-writer, conversion-ux-strategist, email-notification-engineer, legal-privacy-reviewer

---

## Business Model Overview
Rental is Hylono's **primary** business model. Purchase is secondary. This is not an afterthought — rental IS the mission of democratizing access.

## Rental State Machine
```
Available → Reserved → Active → Returning → Returned → Maintenance → Available
```

| State | Description | Triggers |
|-------|-------------|---------|
| Available | Device ready to rent | Return completed, maintenance done |
| Reserved | Booking confirmed, awaiting delivery | Customer checkout complete |
| Active | Device with customer | Delivery confirmed |
| Returning | Customer initiated return | Return request submitted |
| Returned | Device back in warehouse | Physical receipt confirmed |
| Maintenance | Device being serviced | Inspection found issue |

**Dead states**: Damaged, Lost (require manual resolution)

## Rental Products
- **Standard Rental**: Weekly/monthly subscription, auto-renews
- **Protocol Rental**: Fixed duration tied to a specific protocol (e.g., 30-day HBOT protocol)
- **Trial Rental**: Short-term (7-day), conversion-focused
- **B2B Rental**: Multi-device, longer terms, invoicing

## Pricing Structure
- Base rental fee (device)
- Protocol package (optional add-on)
- Delivery/collection fee (if applicable)
- Deposit (refundable, damage protection)
- Extension fee (if beyond agreed term)

## Customer Journey
1. **Discovery** → Product page → understand modality + protocol
2. **Configuration** → Choose duration, protocol, addons
3. **Checkout** → Address, payment method, deposit
4. **Confirmation** → Email confirmation, delivery window
5. **Delivery** → Device arrives, welcome email + protocol guide
6. **Active** → Weekly check-ins, support access
7. **Extension or Return** → Extension offer at week 3/4, return logistics
8. **Post-return** → Survey, ecosystem upsell, subscription option

## Key Business Rules
- Rental CTA must be ≥ as prominent as purchase CTA on all product pages
- Trial rental should be the lowest-friction entry point
- Deposit collected at booking, refunded within 5 business days of return
- Protocol guides delivered digitally immediately + in box
- Extension offer sent automatically 7 days before end of rental period

## API Considerations
- Idempotency required on all payment and state-change endpoints
- Webhook events: `rental.created`, `rental.activated`, `rental.return_requested`, `rental.completed`
- Inventory must be real-time accurate — no overbooking
- Calendar blocking for reserved/active devices

## Legal Considerations
- 14-day EU withdrawal right applies to new rental agreements
- Damage policy must be clearly disclosed before checkout
- GDPR: rental history is personal data, retention policy applies
