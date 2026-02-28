# 🏢 HYLONO — CEO COMMAND BRIEF
### Strategic Agent Task Assignments | February 2026
**Authored by**: CEO  
**Status**: Active — Agents must work top-to-bottom within each role. Do not skip steps.

---

## 📋 EXECUTIVE SUMMARY

**What Hylono is**: A React 19 / Vite / TypeScript biohacking e-commerce platform selling HBOT chambers, PEMF devices, Red Light Therapy panels, and Hydrogen inhalation systems. Includes a B2B Partner Hub for clinics. Stack: Tailwind 4, Framer Motion, Prisma, Stripe, Zustand, PostHog.

**Current state**: Frontend UI is largely built. Backend is **stubbed / mocked** (fake auth, console.log orders, no real payments). Several critical security issues identified. Accessibility non-compliant. Build has configuration fragility. No real customer data pipeline.

**Business risk**:
- Cannot legally launch in EU without GDPR-compliant cookie consent
- Cannot take revenue without real Stripe integration
- Cannot pass a basic security audit in current state

---

---

# 🔴 AGENT 1 — SECURITY SPECIALIST
**Codename**: `security-agent`  
**Priority**: CRITICAL — Do this FIRST before any deployment  
**Works in**: `components/`, `index.html`, `vercel.json`, `package.json`

---

### S-01 · Fix `dangerouslySetInnerHTML` XSS Vulnerability
**Files**: `components/BlogArticle.tsx`, `components/ResearchHub.tsx`  
**What to do**:
- `dompurify` is already in `dependencies` ✅ — `@types/dompurify` is in `devDependencies` ✅
- Create `utils/sanitizeHtml.ts` as a shared DOMPurify wrapper:
```ts
// utils/sanitizeHtml.ts
import DOMPurify from 'dompurify';

const ALLOWED_CONFIG = {
  ALLOWED_TAGS: ['p','h1','h2','h3','h4','ul','ol','li','strong','em','a','blockquote','code','pre'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  FORBID_TAGS: ['script', 'style', 'iframe'],
};

export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, ALLOWED_CONFIG);
}
```
- Replace every `dangerouslySetInnerHTML={{ __html: content }}` with:
```tsx
import { sanitizeHtml } from '../utils/sanitizeHtml';
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
```

---

### S-02 · Remove Server-Side Stripe SDK from Client Bundle
**File**: `package.json`  
**What to do**:
- Move `stripe` from `dependencies` → `devDependencies` (or remove entirely if no server routes exist yet)
- Install client-side Stripe: `npm install @stripe/stripe-js`
- Run audit: `grep -r "from 'stripe'" components/` — if ANY component imports it, remove immediately (critical key exposure)
- Server SDK (`stripe`) must ONLY be used in `app/api/` routes, never in `components/`

---

### S-03 · Fix All `target="_blank"` Links Missing `rel="noopener noreferrer"`
**Files**: `components/MeridianPage.tsx`, `components/Layout.tsx` — scan ALL components  
**What to do**:
```bash
# Find all offenders:
grep -rn 'target="_blank"' components/ | grep -v 'noopener'
```
- Add `rel="noopener noreferrer"` to every instance found
- Add ESLint rule to prevent regression:
```json
"react/jsx-no-target-blank": ["error", { "enforceDynamicLinks": "always" }]
```

---

### S-04 · Harden Content Security Policy
**Files**: `index.html` (CSP meta tag), `vercel.json`  
**What to do**:
- Remove `'unsafe-inline'` from `script-src`
- Add `frame-ancestors 'none'` (clickjacking protection)
- Replace `img-src https:` wildcard with explicit allowlist:
  ```
  img-src 'self' data: https://images.unsplash.com https://cdn.hylono.com https://fonts.gstatic.com;
  ```
- Replace `connect-src https:` wildcard with:
  ```
  connect-src 'self' https://api.hylono.com https://vitals.vercel-insights.com;
  ```
- Move CSP from `<meta>` tag to HTTP response headers in `vercel.json` (meta CSP cannot block navigation requests)

---

### S-05 · Add `X-Frame-Options: DENY` Header
**File**: `vercel.json`  
**What to do**:
- Add alongside CSP for legacy browser coverage:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

---

# 🟠 AGENT 2 — ACCESSIBILITY SPECIALIST
**Codename**: `a11y-agent`  
**Priority**: HIGH — Legal requirement for EU market (WCAG 2.1 AA)  
**Works in**: `components/Layout.tsx`, `components/CookieConsent.tsx`, form components

---

### A-01 · Add `aria-label` to All Icon-Only Buttons in Layout
**File**: `components/Layout.tsx`  
**What to do**:
```tsx
// Mobile menu button:
<button onClick={toggleMenu} aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
  <Menu size={24} aria-hidden="true" />
</button>

// Cart button:
<button onClick={onOpenCart} aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
  <ShoppingCart size={20} aria-hidden="true" />
  {cartCount > 0 && <span aria-hidden="true">{cartCount}</span>}
</button>

// Search button:
<button onClick={openSearch} aria-label="Search products">
  <Search size={20} aria-hidden="true" />
</button>
```
- Rule: All icons inside buttons/links → add `aria-hidden="true"`

---

### A-02 · Add Accessible Labels to All Form Inputs
**Files**: `components/ExitIntent.tsx`, `components/Newsletter.tsx`, `components/ContactPage.tsx`, `components/MeridianPage.tsx`  
**What to do**:
```tsx
// NEVER rely on placeholder alone. ALWAYS have a label.
// For inline/compact designs — visually hidden label:
<label htmlFor="newsletter-email" className="sr-only">Email address</label>
<input
  id="newsletter-email"
  type="email"
  placeholder="your@email.com"
  aria-required="true"
/>
```
- Every `<input>` must have either: `<label htmlFor>` or `aria-labelledby` or `aria-label`

---

### A-03 · Fix Social Icon Links — Add Accessible Names
**Files**: `components/Layout.tsx` (footer), `components/MeridianPage.tsx`  
**What to do**:
```tsx
// BEFORE:
<a href="https://linkedin.com/company/hylono" target="_blank">
  <LinkedinIcon size={18} />
</a>

// AFTER:
<a href="https://linkedin.com/company/hylono" aria-label="Hylono on LinkedIn" target="_blank" rel="noopener noreferrer">
  <LinkedinIcon size={18} aria-hidden="true" />
</a>
```

---

### A-04 · Rebuild `CookieConsent.tsx` for GDPR Compliance — URGENT
**File**: `components/CookieConsent.tsx`  
**What to do**:
- Add per-category consent state:
```tsx
const [consent, setConsent] = useState({
  necessary: true,   // always true, non-toggleable
  analytics: false,  // opt-in
  marketing: false,  // opt-in
  preferences: false, // opt-in
});
```
- Store consent as JSON in localStorage with timestamp:
```ts
localStorage.setItem('hylono_consent', JSON.stringify({
  ...consent,
  timestamp: new Date().toISOString(),
  version: '1.0',
}));
```
- Create `context/ConsentContext.tsx` — expose consent so PostHog only loads when `analytics: true`
- Add "Cookie Settings" link in footer that reopens the consent modal
- "Necessary" must be pre-ticked and non-interactive (always required)
- All other categories default to `false` (opt-in, NOT opt-out)

---

---

# 🟡 AGENT 3 — DEVOPS / BUILD ENGINEER
**Codename**: `devops-agent`  
**Priority**: HIGH (build stability) → MEDIUM (optimization)  
**Works in**: `package.json`, `vite.config.ts`, `postcss.config.js`, `.github/`

---

### D-01 · Verify and Fix Tailwind v4 / PostCSS Build
**File**: `postcss.config.js`  
**What to do**:
- `@tailwindcss/postcss` is already in devDependencies ✅
- Confirm `postcss.config.js` uses it correctly:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```
- Run `npm run build` — must pass with ZERO errors
- Run `npm run dev` — confirm hot-reload works

---

### D-02 · Fix `@prisma/client` Dependency Category
**File**: `package.json`  
**What to do**:
```bash
npm uninstall --save-dev @prisma/client
npm install @prisma/client
```
- Rule: `@prisma/client` is a runtime dep → `dependencies`
- Rule: `prisma` CLI is build-time only → `devDependencies` ✅ (already correct)

---

### D-03 · Remove `eslint-config-next` — Dead Weight
**What to do**:
```bash
npm uninstall eslint-config-next
```
- Check `eslint.config.mjs` for any `"next"` or `"next/core-web-vitals"` extends — remove them
- Run `npm run lint` to confirm it still passes after removal
- This project is Vite, NOT Next.js. This package wastes ~2MB and introduces conflicting rules.

---

### D-04 · Add Vite Manual Chunk Splitting
**File**: `vite.config.ts`  
**What to do**:
```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-charts': ['recharts'],
          'vendor-stripe': ['@stripe/stripe-js'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
});
```
- After build, run: `npx vite-bundle-visualizer` and document chunk sizes in a comment in this file
- Target: no individual chunk above 200KB gzipped

---

### D-05 · Set Up GitHub Actions CI Pipeline
**File**: `.github/workflows/ci.yml` (create if not exists)  
**What to do**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run format:check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```
- All steps must pass on every PR. No merging with type errors or lint errors.

---

### D-06 · Verify Husky Pre-Commit Hooks Are Working
**What to do**:
- Check `.husky/` directory — confirm `pre-commit` hook exists and calls `npx lint-staged`
- `lint-staged` is already configured in `package.json` ✅
- Test by making a change and running `git commit` — hooks must fire
- If hooks are not firing: `npx husky install`

---

---

# 🔵 AGENT 4 — FRONTEND ENGINEER
**Codename**: `frontend-agent`  
**Priority**: MEDIUM — Code quality and UI correctness  
**Works in**: `components/`, `constants.ts`, `vite.config.ts`

---

### F-01 · Remove ALL `console.log` Stubs from Production Code
**Files with confirmed issues**:
- `components/BookingModal.tsx` — `console.log('Booking:', ...)`
- `components/CheckoutPage.tsx` — `console.log('Order submitted:', ...)`
- `components/ContactPage.tsx` — `console.log('Contact form submitted:', ...)` (×2)
- `components/ExitIntent.tsx` — `console.log('Exit intent email:', ...)`
- `components/Newsletter.tsx` — `console.log('Newsletter signup:', ...)` (×2)
- `components/MeridianPage.tsx` — footer link stubs
- `components/Hero46/Version1.tsx` — nav stubs
- `components/Hero46/Version2.tsx` — nav stubs

**What to do**:
- Form submission stubs → replace with `// TODO: POST to /api/[endpoint]`
- Nav link stubs → replace with actual `navigate('route-name')` calls
- Add ESLint rule: `"no-console": ["warn", { "allow": ["warn", "error"] }]`
- Run `npm run lint` — must return zero console.log warnings

---

### F-02 · Audit and Fix `useEffect` Missing Dependency Arrays
**What to do**:
```bash
# Find all bare useEffect calls:
grep -rn "useEffect(() =>" components/
```
- Every `useEffect` without `[]` runs on EVERY render — this can cause infinite loops
- Fix: add `[]` for mount-only effects, `[dep]` for reactive effects
- Verify `react-hooks/exhaustive-deps` rule is enabled in `eslint.config.mjs`

---

### F-03 · Resolve `HeroGpt.tsx` vs `HeroGPT/Version1.tsx` Naming Conflict
**Files**: `components/AppRouter.tsx`, `components/HeroGpt.tsx`, `components/HeroGPT/`  
**What to do**:
- Read `AppRouter.tsx` and determine which version is currently routed and active
- Confirm with owner which is the "Loki Mode" canonical version
- Move the unused version to `components/_unused/` folder
- Ensure `AppRouter.tsx` points to exactly one unambiguous component

---

### F-04 · Clean Up `HeroGpt.tsx` — Unused Variables and `any` Types
**File**: `components/HeroGpt.tsx`  
**What to do**:
- Remove unused `wizardStep`, `wizardData` variables (5 lint warnings currently)
- Replace all `any` types with proper TypeScript interfaces
- Run `npm run lint` targeting this file — must return zero warnings

---

### F-05 · Audit `constants.ts` for Splitting (RESEARCH ONLY — Do Not Split Yet)
**File**: `constants.ts` (19,750 chars)  
**What to do**:
- Read the file and identify logical groupings
- Proposed split: `constants/products.ts`, `constants/protocols.ts`, `constants/pricing.ts`, `constants/synergies.ts`
- Write up the proposal in `plans/constants-refactor.md`
- **DO NOT implement** — submit proposal to owner for approval first

---

---

# 🟢 AGENT 5 — BACKEND / API ENGINEER
**Codename**: `backend-agent`  
**Priority**: HIGH — Revenue-blocking features  
**Works in**: `app/api/`, `context/AuthContext.tsx`, `prisma/schema.prisma`, `components/CheckoutPage.tsx`

---

### B-01 · Implement Real Stripe Checkout Flow — REVENUE BLOCKER
**Files**: `components/CheckoutPage.tsx`, create `app/api/create-payment-intent.ts`  
**What to do**:
- Client: Use `@stripe/stripe-js` + Stripe Elements for card input UI
- Server: Create `app/api/create-payment-intent.ts` — use server `stripe` SDK to create Payment Intent
- `STRIPE_SECRET_KEY` → `.env.local` only, NEVER in client code
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `.env.local`, safe for client
- Implement: payment confirmation, success redirect, failure handling
- Replace `console.log('Order submitted:', ...)` with real API call

---

### B-02 · Implement Real Customer Authentication
**File**: `context/AuthContext.tsx`  
**Current state**: 100% mocked — zero security  
**What to do**:
- DECISION REQUIRED FROM OWNER: Supabase Auth vs Auth0 vs custom JWT
- Once decided, implement:
  - User registration with email verification
  - Login with session persistence
  - Password reset flow
  - Secure logout
- Sessions via secure HTTP-only cookies (not localStorage)
- Update all components that call `useAuth()` to handle real user state

---

### B-03 · Create Order Database Schema
**File**: `prisma/schema.prisma`  
**What to do**:
- Add models:
```prisma
model Order {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  payment   Payment?
  status    OrderStatus @default(PENDING)
  total     Decimal
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  quantity  Int
  price     Decimal
}

model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  stripePaymentId String        @unique
  status          PaymentStatus @default(PENDING)
  amount          Decimal
  createdAt       DateTime      @default(now())
}

enum OrderStatus { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED REFUNDED }
enum PaymentStatus { PENDING SUCCEEDED FAILED REFUNDED }
```
- Run: `npx prisma migrate dev --name add-orders-payments`
- Build order history page component

---

### B-04 · Set Up Transactional Email System
**What to do**:
- Recommended provider: **Resend** (simple API, great TypeScript SDK)
- Install: `npm install resend`
- Store `RESEND_API_KEY` in `.env.local`
- Create email templates:
  - `templates/emails/order-confirmation.tsx`
  - `templates/emails/welcome.tsx`
  - `templates/emails/shipping-notification.tsx`
- Trigger from Stripe webhook: `app/api/webhooks/stripe.ts` on `payment_intent.succeeded`

---

### B-05 · Connect Newsletter and Contact Forms to Real Backend
**What to do**:
- Create `app/api/newsletter.ts` — POST handler, store email in DB or forward to email service
- Create `app/api/contact.ts` — POST handler, send notification email to Hylono team
- Add rate limiting (e.g., 1 submission per email per 60 seconds)
- Update `components/Newsletter.tsx` and `components/ContactPage.tsx` to call real endpoints
- Show proper success/error states (already partially built in UI)

---

---

# 🧪 AGENT 6 — QA / TESTING ENGINEER
**Codename**: `qa-agent`  
**Priority**: MEDIUM — Required before production deploy  
**Works in**: `tests/`, `utils/`, `components/` (test files)

---

### T-01 · Write Unit Tests for Utility Functions
**Directory**: `utils/`  
**What to do**:
- Every exported function in `utils/` needs at least one test
- Priority: `utils/sanitizeHtml.ts` (after S-01 creates it), `utils/featureFlags.ts`
- Framework: Vitest + jsdom (already configured ✅)
- Run: `npm run test`

---

### T-02 · Write Component Tests for Critical Flows
**Priority components**:
1. `components/CheckoutPage.tsx` — render, form validation, submission
2. `components/AuthComponents.tsx` — login form, registration form, error states
3. `components/CookieConsent.tsx` — per-category toggles, localStorage persistence

**What to do**:
- Use `@testing-library/react` + `@testing-library/user-event` (both installed ✅)
- Minimum per component: render test, user interaction test, error state test

---

### T-03 · Set Up Playwright E2E Tests for Critical Journeys
**Framework**: Already installed ✅  
**Journeys to cover**:
1. Home → Product → Add to Cart → Checkout
2. Partner Portal → Login → Dashboard
3. Cookie Consent flow → Verify PostHog only loads post-consent
4. Newsletter signup → Verify success state

**What to do**:
- Create test files in `tests/e2e/`
- Run with: `npm run test:e2e`

---

### T-04 · Establish Code Coverage Baseline and Targets
**What to do**:
```bash
npm run test:coverage
```
- Document current baseline coverage %
- Add coverage thresholds to `vitest.config.ts`:
```ts
coverage: {
  thresholds: {
    lines: 60,
    functions: 60,
    branches: 50,
  }
}
```
- Target: 60% line coverage before production launch

---

---

# 🎨 AGENT 7 — SEO / CONTENT SPECIALIST
**Codename**: `seo-agent`  
**Priority**: MEDIUM — Long-term organic growth  
**Works in**: `components/SEO.tsx`, `components/StructuredData.tsx`, `constants.ts`

---

### SEO-01 · Audit Current SEO Implementation
**Files**: `components/SEO.tsx`, `components/StructuredData.tsx`  
**What to do**:
- Verify meta titles are unique per page (not duplicated)
- Verify meta descriptions are unique, 120-160 chars, keyword-rich
- Verify OG tags (og:title, og:description, og:image) are set correctly on all pages
- Verify JSON-LD structured data is valid: Product, Organization, Article schemas
- Use: https://search.google.com/test/rich-results to validate

---

### SEO-02 · Address the No-SSR Gap — STRATEGIC DECISION NEEDED
**Current state**: Pure SPA (React + Vite). Search engines receive empty HTML until JS executes. For an e-commerce site this is a significant SEO handicap.  
**What to do**:
- Research and document 3 options:
  1. Vite SSR (server-side rendering with Vite)
  2. Migrate to Next.js (big lift, best long-term)
  3. `vite-plugin-ssr` / Vike for static pre-rendering
- Write proposal in `plans/ssr-strategy.md`
- **DO NOT implement** — strategic decision requires owner approval

---

### SEO-03 · Measure Core Web Vitals Baseline
**What to do**:
- Deploy current build to staging/preview
- Run Lighthouse on: Home, Product page, Checkout page
- Record: LCP, FID/INP, CLS scores
- Target after optimizations: LCP < 2.5s, CLS < 0.1
- Document in `reports/core-web-vitals-baseline.md`

---

### SEO-04 · Audit Product Page Meta Content
**File**: `constants.ts`  
**What to do**:
- Check each product modality (HBOT, PEMF, RLT, Hydrogen) has a unique, keyword-optimized description
- Ensure product titles include primary keywords
- Verify canonical URLs are set for all product pages
- Check that product schema includes: name, description, price, currency, availability

---

---

## 📊 AGENT DEPLOYMENT SEQUENCE (CEO-Approved Order)

```
WEEK 1 — LAUNCH BLOCKERS (Must complete before any public traffic)
  → security-agent: S-01, S-02, S-03, S-04, S-05 (ALL CRITICAL)
  → a11y-agent:     A-04 (GDPR cookie consent — EU legal requirement)
  → devops-agent:   D-01 (fix build), D-02, D-03 (quick wins)

WEEK 2 — REVENUE ENABLEMENT
  → backend-agent:  B-01 (Stripe checkout = revenue ON)
  → backend-agent:  B-02 (real auth — requires owner decision on provider)
  → a11y-agent:     A-01, A-02, A-03 (accessibility compliance)
  → devops-agent:   D-04, D-05, D-06 (infrastructure hardening)

WEEK 3 — QUALITY & RELIABILITY
  → frontend-agent: F-01, F-02, F-03, F-04 (code hygiene)
  → backend-agent:  B-03, B-04, B-05 (orders, email, real forms)
  → qa-agent:       T-01, T-02, T-03, T-04 (test coverage)

WEEK 4 — SCALE & GROWTH
  → seo-agent:      SEO-01, SEO-02, SEO-03, SEO-04
  → frontend-agent: F-05 (constants refactor proposal)
  → All agents:     Final audit pass — all items must be checked ✅
```

---

## 🚫 EXPLICITLY OUT OF SCOPE
**Do NOT work on these without explicit owner approval:**
- Loyalty Program backend (see TODO_LATER.md #9)
- Analytics admin dashboard (TODO_LATER.md #10)
- Return/Refund system (TODO_LATER.md #8)
- Live Chat backend integration (TODO_LATER.md #5)
- Inventory management system (TODO_LATER.md #6)
- Any SSR/Next.js migration (research only per SEO-02)
- Customer Reviews System (TODO_LATER.md #4)

---

## ✅ COMPLETION CHECKLIST (CEO Sign-Off Required)

Before launch, CEO must verify:
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run test` passes with 60%+ coverage
- [ ] Real Stripe payment processes a test transaction successfully
- [ ] Cookie consent banner shows per-category controls
- [ ] All `dangerouslySetInnerHTML` uses DOMPurify
- [ ] No `console.log` in production bundle (check DevTools)
- [ ] CSP headers are set via Vercel config (not meta tag)
- [ ] Lighthouse score: Performance > 80, Accessibility > 90

---

*Last updated: 2026-02-18 | Next review: After Week 1 completion*  
*CEO — Hylono*
