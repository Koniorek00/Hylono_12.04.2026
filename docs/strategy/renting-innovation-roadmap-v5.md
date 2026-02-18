# Innovation Roadmap: Renting System 6.0 (The Living Lease)

## Evolution

We are moving from "Financial Mastery" to a **"Living Bio-Financial Asset"**.

- Please review: `docs/strategy/renting-innovation-roadmap-v4.md` (Previous Version)
- **New Focus**: Behavioral Incentives & Equity Portability.

## 9. Feature: "Performance-Linked Rebates" (Behavioral Utility)

**Problem**: Users pay regardless of whether they actually get healthy.
**Solution**: Link usage data to the monthly invoice.

- **Mechanism**:
  - Complete 12 sessions/month -> **$75 Rebate**.
  - Hit Deep Sleep targets (via Oura) -> **$25 Rebate**.
- **Utility**: The rental actually pays you to be healthy. "The more you use it, the less you pay."

## 10. Feature: "Multi-Model Asset Swap" (Equity Portability)

**Problem**: Users feel "locked in" to one specific technology for 12 months.
**Solution**: Mid-lease collateral transfer.

- **Mechanism**:
  - "Swap to PEMF" button.
  - Moves accrued equity from the HBOT lease into a new PEMF lease.
- **Utility**: Allows users to rotate through the "Hylono Stack" as their goals change.

## 11. Feature: "Hylono Passport" (Social Utility)

**Problem**: High-end gear is often underutilized during travel or holidays.
**Solution**: Digital "Sub-Letting" keys.

- **Mechanism**:
  - Invite a "Guest Renter" for 7 days.
  - System handles the liability transfer and temporary billing change.
- **Utility**: Maximizing the "yield" of the leased hardware within a social circle.

---

## Implementation Plan

### Phase 1: Performance Rebate UI

- Update `app/rental/checkout/page.tsx` (sidebar).
- Visual: "Potential Monthly Rebate" indicator.
- Logic: `estimatedTotal - potentialRebate`.

### Phase 2: Asset Swap Visualization

- Update Sidebar in `app/rental/checkout/page.tsx`.
- UI: "Portability Score" (How easy it is to swap this equity to another device).

### Phase 3: Social Passport

- Add "Share Access" card to the Success step.
- Mock Invitation flow.
