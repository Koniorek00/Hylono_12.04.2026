# Innovation Roadmap: Renting System 5.0 (Flexibility & Reality)

## Evolution

We are moving from an "Intelligent Platform" to a **"Hyper-Flexible Spatial Experience"**.

- Please review: `docs/strategy/renting-innovation-roadmap-v2.md` (Previous Version)
- **New Focus**: Financial Control & Spatial Confidence.

## 6. Feature: "Dynamic Term Slider" (Financial Utility)

**Problem**: Fixed 12-month terms don't fit every budget or goal.
**Solution**: An interactive slider allowing 6, 12, 18, 24, or 36-month terms.

- **Visuals**: As you slide right, the Monthly Price drops drastically, but the "Equity Speed" changes.
- **Utility**: Gives the user control over the "Time vs Money" equation.

## 7. Feature: "AR Space Validator" (Logistic Innovation)

**Problem**: Medical grade chambers are huge (7ft+). "Will it fit in my spare room?"
**Solution**: A "Verify Space" button triggering a mocked AR Camera view.

- **Utility**: Prevents the #1 reason for returns (doesn't fit).
- **Innovation**: Uses the browser camera to "scan" the room.

## 8. Feature: "Protocol-Matched Add-ons" (Contextual Utility)

**Problem**: Users don't know what accessories aid their specific goal.
**Solution**: If user chose "Recovery" protocol -> Suggest "PEMF Mat" add-on.

- **Input**: Derived from Step 2 (Protocol Intelligence).
- **Output**: "Ecosystem Boost" cards in the Payment Step.

---

## Implementation Plan

### Phase 1: Dynamic Term Slider

- Update `app/rental/checkout/page.tsx`.
- Add Slider component in the "Payment" step OR Sidebar.
- Logic: `price = base * (1 + (12 - term)*0.05)`.

### Phase 2: AR Validator

- Update `app/rental/checkout/page.tsx`.
- Add "Check Fit" button in Sidebar.
- Mock Modal: "Scanning Room..." -> "Space Verified ✅".

### Phase 3: Smart Add-ons

- Update `app/rental/checkout/page.tsx`.
- In Payment Step, render specific add-ons based on `selectedGoal`.
