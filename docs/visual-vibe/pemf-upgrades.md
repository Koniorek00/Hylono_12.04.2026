# Visual Vibe Upgrade Report — PEMF (Signal Therapy)

**Date:** 2026-02-24
**Page route:** `/product/pemf`
**Therapy accent color:** `#8B7EB8` (Signal/PEMF purple)
**Components reviewed:** `TechDetail.tsx`, `Visualizations.tsx` (PemfVisual)

---

## Summary

The current PEMF product page renders a static toroidal field visualization via `PemfVisual` component. The electromagnetic field lines rotate passively without narrative purpose. This upgrade report proposes **5 narrative transformation animations** — each with a clear starting state, meaningful action, and satisfying end state. These visualizations make the invisible "signal" tangible through story-driven motion.

---

## Interactive Upgrades

### Upgrade 1: Cellular Recharge (Hero Section)

- **Location:** `components/Visualizations.tsx` → Replace `PemfVisual` or add as alternative
- **Trigger:** Scroll into view (IntersectionObserver)
- **Narrative Transformation:**
  - **Start:** Deflated gray cell membrane, sagging, dull. Mitochondria dormant.
  - **Action:** Purple electromagnetic pulses flow inward. Membrane tightens, glows brighter. Mitochondria spin up, rotate faster.
  - **End:** Vibrant, energized cell pulsing with life in Signal purple #8B7EB8.
- **Visual Concept:** A single cell transforms from depleted to restored — visualizes "cellular voltage restoration" claim.
- **Accessibility:** `prefers-reduced-motion` → static energized end state. Max 1.5s pulse interval (photosensitivity safe).

---

### Upgrade 2: Frequency Journey (Technical Specs)

- **Location:** `components/TechDetail.tsx` → Frequency range section
- **Trigger:** Click on frequency buttons OR automatic scroll-trigger
- **Narrative Transformation:**
  - **Start:** Slow, sluggish gray sine wave (1Hz Delta — deep, heavy)
  - **Action:** Wave morphs through frequencies: 1Hz → 7.83Hz Schumann (glows purple) → 10Hz Alpha → 50Hz (rapid sharp waves)
  - **End:** Harmonized at Schumann resonance, glowing in Signal purple
- **Visual Concept:** Shows the frequency range visually — from sleep to stimulation.
- **Accessibility:** Static wave at 7.83Hz for reduced-motion.

---

### Upgrade 3: Pain to Relief (Benefits Section)

- **Location:** `components/TechDetail.tsx` → Benefits "Pain Reduction" card
- **Trigger:** Scroll into view
- **Narrative Transformation:**
  - **Start:** Jagged red lightning bolts along a nerve pathway (inflammation, stress)
  - **Action:** Purple electromagnetic waves intercept from left, dissolve red bolts into smooth blue sine waves
  - **End:** Calm blue nerve pathway, soothed and relaxed
- **Visual Concept:** Makes "pain reduction" visible — inflammation transforming to calm.
- **Accessibility:** Static calm blue end state for reduced-motion.

---

### Upgrade 4: Electromagnetic Field Awakening (Product Visual)

- **Location:** `components/TechDetail.tsx` → Product hero area (above fold)
- **Trigger:** Hover (desktop) / Tap (mobile)
- **Narrative Transformation:**
  - **Start:** Flat dormant coil lying horizontally, gray and lifeless
  - **Action:** Coil rises into 3D isometric perspective, spins up like a turbine. Toroidal field lines extend outward, pulsing with purple glow.
  - **End:** Fully-awakened electromagnetic field wrapping a silhouette figure
- **Visual Concept:** Shows the invisible PEMF field becoming visible — the core technology in action.
- **Accessibility:** Static awakened field for reduced-motion. Keyboard focus triggers animation.

---

### Upgrade 5: Recovery Transformation (Protocol Section)

- **Location:** `components/TechDetail.tsx` → Protocol "Rest and Restore" section
- **Trigger:** Scroll into view
- **Narrative Transformation:**
  - **Start:** Hunched gray silhouette figure on therapy mat — tired, depleted
  - **Action:** Purple pulses flow from mat into figure. With each pulse, posture straightens. Gray shifts to purple-blue.
  - **End:** Upright figure with subtle glowing aura — energized, restored
- **Visual Concept:** Humanizes the therapy benefit — from tired to revitalized.
- **Accessibility:** Static upright energized state for reduced-motion.

---

## Bonus Concepts

### Vagus Nerve Harmony (VNS Feature)
- **Start:** Faded gray vagus nerve pathway with irregular sparks (stress)
- **Action:** Purple pulse travels down, dissolves sparks into calm rhythmic nodes
- **End:** Synchronized, glowing pathway from brain to heart

### Synergy Bridge (Cross-sell)
- **Start:** Three therapy icons disconnected (PEMF coil, RLT light, HBOT chamber)
- **Action:** Purple energy lines draw from PEMF to each icon
- **End:** All three pulse in synchronized rhythm — visualizes therapy stacking

---

## Elements NOT Recommended for Animation

| Location | Reason |
|----------|--------|
| Medical Disclaimer section | Legal/compliance requires static clarity |
| Trust badges | Authority requires stillness |
| Contraindication warnings | Safety information priority |
| Price/financing | Commerce clarity |

---

## Technical Constraints

1. **Color:** Signal accent `#8B7EB8` is primary. Slate grays for neutrals.
2. **Timing:** 3-5 second transformations. No infinite loops without user intent.
3. **Performance:** CSS/SVG-native preferred. JS only for IntersectionObserver.
4. **Accessibility:** All animations respect `prefers-reduced-motion`. Max 1.5s pulse rate.

---

## Next Steps

See `pemf-prompts.md` for copy-paste-ready Gemini 3.1 Pro prompts for each animation.