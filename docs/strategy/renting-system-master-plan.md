# Strategy: Renting System 2.0 - "The Hylono Lease"

## 1. Executive Summary

The goal is to transition from a simple "Add to Cart" UI to a fully compliant, legally binding, and automated **Rental Operating System**. This system must handle high-value medical-grade equipment rentals with the same friction-free experience as a SaaS subscription, while robustly managing risk/liability.

## 2. The User Journey (The "Golden Path")

### Phase A: Configuration & Discovery (The "Hook")

*Current State: `RentalConfigurator.tsx` (Good start)*

- **Optimization**: Show "Pay-off" clear dates. "Rent for 12 months, own for $1".
- **Interaction**: Synergy Builder (Done).

### Phase B: Verification (The "Gate")

*New Requirement*
Before we ship $5k+ hardware, we need Trust.

1. **Identity Verification**:
    - Integration with **Stripe Identity** or **Persona**.
    - User scans ID/Passport via phone camera.
    - Automatic risk score returned.
2. **Soft Credit Check** (Optional but recommended for high value):
    - Plaid integration to verify bank account balance/history.

### Phase C: Contract & Liability (The "Pact")

*New Requirement: "Digital Handshake"*

1. **Dynamic Contract Generation**:
    - Based on selected devices.
    - Auto-fills User Details.
    - Terms: Minimum term (e.g., 3 months), Damage Clauses, Return Policy.
2. **Signing**:
    - Embedded **HelloSign** (Dropbox Sign) or **DocuSign** API.
    - Legally binding e-signature.
    - PDF copy sent to User & Hylono Ops.

### Phase D: Payment & Subscription (The "Transaction")

*New Requirement*

- **Stripe Subscriptions**:
  - Setup recurring monthly billing.
  - **Security Deposit**: Hold $X amount as auth, release on return.
  - **Dunning Management**: Auto-retry failed cards, lock-out procedures.

### Phase E: Logistics & Onboarding (The "Handover")

1. **Shipping Integration**:
    - ShipStation / Shippo API.
    - Auto-generate return label included in box.
2. **Smart Onboarding**:
    - QR code on device leads to "My Rental Dashboard".
    - "Unboxing & Setup" video sequence mandatory before first use.

### Phase F: Management & Return (The "Cycle")

- **User Dashboard**:
  - "Buyout" option (Click to purchase).
  - "Return" button (Generates pickup schedule).
  - "Swap" (Upgrade to different modality).

## 3. Technical Architecture Requirements

### Data Schema (Prisma)

```prisma
model Rental {
  id              String      @id @default(cuid())
  userId          String
  status          RentalStatus // PENDING_KYC, ACTIVE, OVERDUE, RETURNED
  startDate       DateTime
  minTermMonths   Int
  monthlyPrice    Float
  securityDeposit Float
  
  contractPdfUrl  String?     // Link to signed PDF
  stripeSubId     String?     // Stripe Subscription ID
  
  devices         RentalDevice[]
}

model RentalDevice {
  id              String   @id @default(cuid())
  rentalId        String
  deviceModel     String
  serialNumber    String?  // Assigned upon shipping
  condition       String   // NEW, REFURBISHED
}
```

### Integrations Stack

- **Payments**: Stripe (Billing + Identity)
- **Contracts**: HelloSign API
- **Logistics**: Shippo / EasyPost
- **Email**: Resend (Transactional emails for contracts/shipping)

## 4. Immediate Next Steps (The Plan)

1. **Design the flows**: Map the exact screen-by-screen flow.
2. **Choose Providers**: Confirm Stripe Identity + HelloSign as the stack.
3. **Prototype**: Build the "Checkout -> Identity -> Sign" flow.
