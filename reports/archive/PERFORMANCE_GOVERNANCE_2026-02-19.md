# Performance Governance Baseline (Lighthouse CI)

**Date:** 2026-02-19  
**Purpose:** Address unresolved governance gap from `to_fix_yet.md` TFY-011 by introducing measurable performance budget scaffolding.

## Added assets
- `lighthouserc.json` with baseline CI collect/assert configuration
- Core route sampling (`/`, `/store`, `/product/HBOT`, `/contact`)
- Initial warning thresholds for performance and accessibility categories

## Initial budget thresholds
- Performance score: >= 0.80 (warn)
- Accessibility score: >= 0.90 (warn)
- LCP <= 3000ms (warn)
- CLS <= 0.10 (warn)
- TTI <= 5000ms (warn)

## Suggested pipeline integration (next step)
1. Install `@lhci/cli` as a dev dependency.
2. Add script:
   - `"perf:lighthouse": "lhci autorun"`
3. Run against preview/deploy URL in CI.
4. Promote warnings to errors once baseline stabilizes.

## Status
- [x] Governance config scaffolded
- [ ] CI execution wired
- [ ] First baseline run captured
- [ ] Threshold calibration complete

## Note
This artifact sets governance structure; it does not claim that budgets are currently passing.
