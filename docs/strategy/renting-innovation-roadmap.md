# Innovation Roadmap: Renting System 3.0

## Vision: "High Utility, High Innovation"

Moving beyond standard e-commerce into a **value-compounding ecosystem**. We stop treating rentals as "expense" and start treating them as "investment" and "contribution".

## 1. Feature: "Rental Equity Wallet" (Financial Innovation)

**Validating the users investment.**
Instead of "throwing money away" on rent, the user builds equity.

- **Visualizer**: A progress bar in the checkout sidebar showing "Ownership %" increasing with each month selected.
- **Utility**: "Rent for 12 months, and you own 45% of this machine. Buyout anytime for the difference."

## 2. Feature: "Bio-Data Research Discount" (Scientific Innovation)

**Monetizing user data for the user's benefit.**
Hylono is a research company. We value data.

- **The Hook**: "Share your anonymous Oura/Whoop sleep data with our Research Hub?"
- **The Benefit**: "Receive a $50/month research grant (discount) applied to your rental."
- **Implementation**: A toggle in the Payment step.

## 3. Feature: "Concierge Onboarding" (Service Innovation)

**Removing the fear of complexity.**
Medical hardware is intimidating.

- **The Hook**: "Includes complimentary 1-on-1 setup call."
- **Implementation**: A "Book Your Onboarding" scheduler integrated into the Success page.

---

## Implementation Plan

### Phase 1: Smart Checkout Sidebar (Immediate)

- Modify `app/rental/checkout/page.tsx`
- Add `EquityVisualizer` component: Calculates cumulative spend vs. retail price.

### Phase 2: Data-for-Dollars Toggle (Immediate)

- Modify `app/rental/checkout/page.tsx` (Payment Step)
- Add "Research Contributor" proprietary toggle.
- Logic: Reduces monthly total by fixed amount if checked.

### Phase 3: Concierge Success (Immediate)

- Modify `app/rental/checkout/page.tsx` (Success Step)
- Embed a Cal.com (or mock) scheduler for "White Glove Setup".
