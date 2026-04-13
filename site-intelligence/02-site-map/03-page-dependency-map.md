# Page Dependency Map

- `components/TechDetail.tsx` affects the generic product hub family.
- `components/product/hydrogen-premium/HydrogenPremiumPage.tsx` affects the premium hydrogen model family.
- `components/HelpCenterPage.tsx` affects both `/help` and `/faq`.
- `components/legal/PolicyPages.tsx` affects six trust/policy routes.
- `config/featureFlags.ts` and `utils/featureFlags.ts` both influence public route behavior.
- `content/topical-graph.ts` defines the canonical cross-route journey.
