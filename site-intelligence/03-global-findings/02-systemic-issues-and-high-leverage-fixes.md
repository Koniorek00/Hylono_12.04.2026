# Cross-Site Systemic Issues and High-Leverage Fixes

- Critical: several indexable non-core product URLs render the wrong body/H1 at runtime.
- Critical: `/press` and `/locator` publish synthetic-looking trust assets that violate the repo rules.
- High: `/robots.txt` and `/sitemap.xml` trigger a local compile failure because `components/product/detail/TechHero.tsx` is missing while `components/TechDetail.tsx` imports it.
- High: homepage, store, PDPs, help, and contact are still large client shells even though their route shells are server-first.
- High: `/help`, `/faq`, and `/contact` overlap too much.
- High: public brand language drifts between `wellness technology`, `bio-optimization`, and `regeneration`.
- Medium: feature flags are split across `config/featureFlags.ts` and `utils/featureFlags.ts`.
- Medium: the analytics event library exists, but a route-level tracker / tracked CTA layer is missing.
