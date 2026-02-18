# Innovation Roadmap: Renting System 4.0 (Intelligence & Access)

## Evolution

We are moving from a "Smart Rental" to an **"Intelligent Bio-Optimization Platform"**.

- Please review: `docs/strategy/renting-innovation-roadmap.md` (Previous Version)
- **New Focus**: Hyper-Personalization & Financial Accessibility.

## 4. Feature: "Protocol Intelligence Engine" (AI Utility)

**Problem**: Users rent the hardware but don't know the optimal *software* (usage protocol) for their body.
**Solution**: An AI-driven "Bio-Calibration" step during purchasing.

- **Input**: User selects goals (e.g., "Deep Sleep", "ACL Recovery") and sensitivity levels.
- **Output**: A dynamic "12-Week Usage Calendar" generated instantly.
- **Value**: Transforms the rental from a "commodity" to a "personalized therapy".

## 5. Feature: "Fractional Leasing" (financial Utility)

**Problem**: Medical grade tech is expensive ($1,299/mo). Families/Teams want to share.
**Solution**: Native "Split Bill" functionality.

- **Mechanism**: "Add a Co-Renter".
- **Utility**: Allows splitting the monthly fee across up to 3 credit cards. Drastically lowers the barrier to entry.

---

## Implementation Plan

### Phase 1: Protocol Step (Immediate)

- Update `app/rental/checkout/page.tsx`
- Insert `PROTOCOL` step between `IDENTITY` and `CONTRACT`.
- Create `GoalSelector` and `BioCalibrator` UI.

### Phase 2: Split Pay (Immediate)

- Update `Payment` step in `app/rental/checkout/page.tsx`.
- Add "Split Payment" toggle.
- Add UI for "Second Payer Email".
