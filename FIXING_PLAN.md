# FIXING_PLAN (Loki Mode)

## Priority 1: Fix Build Barrier (CRITICAL)

- **Problem**: Build fails due to Tailwind v4 / PostCSS configuration mismatch.
- **Action**:
  - Install `@tailwindcss/postcss`.
  - Update `postcss.config.js` to use `@tailwindcss/postcss`.
  - Verify with `npm run build`.

## Priority 2: Refine HeroGpt (Loki Mode)

- **Problem**: 5 Lint warnings (unused vars, `any` types).
- **Action**:
  - Clean up unused variables (`wizardStep`, `wizardData`).
  - Replace `any` types with proper interfaces.

## Priority 3: Component Hygiene

- **Check**: Ensure `HeroGpt.tsx` vs `HeroGPT/Version1.tsx` naming conflict is resolved or clarified in routing.
- **Action**: Sync `AppRouter.tsx` to ensure it's pointing to the intended "Loki Mode" component.
