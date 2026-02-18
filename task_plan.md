# Hylono Task Plan - Autonomous Discovery & Improvement Protocol

**Generated:** 2026-02-16
**Based on:** File structure analysis, code audit, and pattern detection

---

## 📊 AUDIT SUMMARY

### Critical Issues Found
- **196 instances of `any` type** across TypeScript files - severe type safety violation
- **38 console.log statements** in production code - should use proper logging
- **No visible test files** - Playwright configured but no tests written
- **Large constants file** (23,356 chars) - needs modularization
- **Multiple backup directories** - suggests codebase instability
- **Custom routing implementation** - non-standard, may cause issues

### Architecture Concerns
- No SSR/SSG for e-commerce (SEO impact)
- Mock authentication system (not production-ready)
- Mixed state management (Context + Zustand)
- Unused imports across multiple files

---

## 🚀 PHASE 1: TYPE SAFETY & CODE QUALITY

- [ ] Phase 1: Replace all `any` types in [`components/AuthComponents.tsx`](components/AuthComponents.tsx:120) with proper interfaces (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`components/AppRouter.tsx`](components/AppRouter.tsx:136) with proper navigation types (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`components/BlogPage.tsx`](components/BlogPage.tsx:254) with typed interfaces (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`components/ComparisonEngine.tsx`](components/ComparisonEngine.tsx:35) with proper types (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`components/MeridianPage.tsx`](components/MeridianPage.tsx:119) with proper component props (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`components/MegaMenu.tsx`](components/MegaMenu.tsx:106) with typed search results (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in [`context/AuthContext.tsx`](context/AuthContext.tsx:9) with proper error types (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace all `any` types in partner components ([`components/partner/*.tsx`](components/partner/)) with domain types (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Remove all unused imports flagged by ESLint across components (USE: @code-refactoring-refactor-clean)
- [ ] Phase 1: Replace `console.log` with proper logging in [`components/CheckoutPage.tsx`](components/CheckoutPage.tsx:25) (USE: @code-refactoring-refactor-clean)

---

## 🏗️ PHASE 2: ARCHITECTURE IMPROVEMENTS

- [ ] Phase 2: Split [`constants.ts`](constants.ts) into modular files (products.ts, protocols.ts, synergies.ts, themes.ts) (USE: @software-architecture)
- [ ] Phase 2: Implement proper routing with React Router or TanStack Router (USE: @software-architecture)
- [ ] Phase 2: Consolidate state management strategy - choose Context OR Zustand, not both (USE: @software-architecture)
- [ ] Phase 2: Create proper error boundary hierarchy with typed error handling (USE: @software-architecture)
- [ ] Phase 2: Implement proper API layer with fetch abstraction and error handling (USE: @software-architecture)
- [ ] Phase 2: Design and implement proper authentication flow (replace mockAuth) (USE: @software-architecture)

---

## 🧪 PHASE 3: TESTING INFRASTRUCTURE

- [ ] Phase 3: Create Playwright test configuration and first E2E test for homepage (USE: @testing-patterns)
- [ ] Phase 3: Write E2E tests for product detail pages (HBOT, PEMF, RLT, Hydrogen) (USE: @testing-patterns)
- [ ] Phase 3: Write E2E tests for checkout flow (USE: @testing-patterns)
- [ ] Phase 3: Write E2E tests for partner portal authentication (USE: @testing-patterns)
- [ ] Phase 3: Set up Vitest for unit testing utility functions (USE: @testing-patterns)
- [ ] Phase 3: Write unit tests for [`utils/synergyEngine.ts`](utils/synergyEngine.ts) (USE: @testing-patterns)
- [ ] Phase 3: Write unit tests for [`utils/protocolEngine.ts`](utils/protocolEngine.ts) (USE: @testing-patterns)
- [ ] Phase 3: Write unit tests for [`utils/PricingEngine.ts`](utils/PricingEngine.ts) (USE: @testing-patterns)

---

## 🔒 PHASE 4: SECURITY & PRODUCTION READINESS

- [ ] Phase 4: Replace mock authentication in [`lib/mockAuth.ts`](lib/mockAuth.ts) with real auth provider integration (USE: @software-architecture)
- [ ] Phase 4: Implement proper CSRF protection for forms (USE: @security-patterns)
- [ ] Phase 4: Add input validation with Zod schemas for all form submissions (USE: @security-patterns)
- [ ] Phase 4: Implement proper Stripe webhook handling in [`app/api/rental/route.ts`](app/api/rental/route.ts) (USE: @security-patterns)
- [ ] Phase 4: Add rate limiting for API routes (USE: @security-patterns)
- [ ] Phase 4: Implement proper session management (USE: @security-patterns)

---

## 📱 PHASE 5: PERFORMANCE & SEO

- [ ] Phase 5: Implement lazy loading for all images with proper placeholders (USE: @web-performance)
- [ ] Phase 5: Add proper meta tags and Open Graph data to all pages (USE: @seo-optimization)
- [ ] Phase 5: Implement structured data (JSON-LD) for products - expand [`components/StructuredData.tsx`](components/StructuredData.tsx) (USE: @seo-optimization)
- [ ] Phase 5: Add sitemap generation for all product pages (USE: @seo-optimization)
- [ ] Phase 5: Implement proper code splitting for large components (ZoneBuilder, TechDetail) (USE: @web-performance)
- [ ] Phase 5: Add service worker for offline capability (USE: @web-performance)

---

## 🧹 PHASE 6: CODEBASE HYGIENE

- [ ] Phase 6: Remove backup directories ([`backups/`](backups/), [`protected-ui-backup-2026-02-16/`](protected-ui-backup-2026-02-16/)) (USE: @code-refactoring-refactor-clean)
- [ ] Phase 6: Consolidate duplicate component implementations (USE: @code-refactoring-refactor-clean)
- [ ] Phase 6: Remove unused files in [`src/components/hero-4.6t/`](src/components/hero-4.6t/) if duplicated (USE: @code-refactoring-refactor-clean)
- [ ] Phase 6: Clean up ESLint warnings in [`lint_results.txt`](lint_results.txt) (USE: @code-refactoring-refactor-clean)
- [ ] Phase 6: Remove or document the [`hylono-new/`](hylono-new/) directory purpose (USE: @code-refactoring-refactor-clean)
- [ ] Phase 6: Consolidate documentation files (GEMINI.md, README_STACK.md, etc.) (USE: @documentation)

---

## 📋 PHASE 7: FEATURE COMPLETION

- [ ] Phase 7: Implement real PostHog analytics tracking in [`src/lib/analytics.ts`](src/lib/analytics.ts) (USE: @analytics-integration)
- [ ] Phase 7: Complete Stripe integration in [`src/lib/stripe.ts`](src/lib/stripe.ts) with proper error handling (USE: @payment-integration)
- [ ] Phase 7: Implement Prisma database connection and migrations (USE: @database-integration)
- [ ] Phase 7: Build partner portal dashboard with real data (USE: @feature-development)
- [ ] Phase 7: Implement training module progress tracking (USE: @feature-development)
- [ ] Phase 7: Build referral system with commission calculation (USE: @feature-development)

---

## 📈 SUMMARY

| Phase | Focus Area | Task Count |
|-------|------------|------------|
| 1 | Type Safety & Code Quality | 10 |
| 2 | Architecture Improvements | 6 |
| 3 | Testing Infrastructure | 8 |
| 4 | Security & Production | 6 |
| 5 | Performance & SEO | 6 |
| 6 | Codebase Hygiene | 6 |
| 7 | Feature Completion | 6 |
| **TOTAL** | | **48** |

---

## ⚠️ CRITICAL BLOCKERS

1. **No tests exist** - Must establish testing baseline before refactoring
2. **Mock authentication** - Cannot deploy to production with current auth
3. **Type safety violations** - 196 `any` types risk runtime errors
4. **No API layer** - Direct fetch calls without error handling

---

## 🎯 RECOMMENDED EXECUTION ORDER

1. **First:** Run `npm run lint` and fix all errors (baseline)
2. **Second:** Set up Playwright and write first E2E test (safety net)
3. **Third:** Begin Phase 1 type safety improvements
4. **Fourth:** Continue with architecture improvements

---

*This plan was generated by autonomous analysis of the codebase structure and patterns. Each task includes specific file references and recommended skill tags for execution.*
