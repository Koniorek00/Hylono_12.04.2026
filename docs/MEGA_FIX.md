T: FINAL ORCHESTRATED IMPLEMENTATION OF HYLONO RESILIENCE LAYER v4 (FULL FIXTURE INTEGRATION)
You are working in F:\ag projects\Hylono_MAIN

```markdown
T: FINAL IMPLEMENTATION OF HYLONO PERMANENT RESILIENCE LAYER v4 (FULL FIXTURE INTEGRATION)

You are working in F:\ag projects\Hylono_MAIN

### MISSION
Establish a permanent, infrastructure-level "Resilience Layer" to eliminate five classes of recurring failures: Memory Heap OOM, CSP violations, Playwright timeouts, Console errors (404s), and WCAG audit timeouts. This version includes full Playwright fixture integration for the network guard and cross-platform pre-flight checks.

### 🧠 SYSTEMIC DIAGNOSTICS & ROOT CAUSES
1. **MEMORY:** Default Node heap is insufficient for concurrent Build + Playwright.
2. **CSP:** Next.js 16 requires specific Nonce propagation via Nosecone and `next/script`.
3. **TIMEOUTS:** Playwright worker overload and network-dependent tests cause non-deterministic flakes.
4. **CONSOLE:** Broken external images (404) pollute logs and trigger audit failures.



### 🛠 CRITICAL OPERATING RULES
1. **BATCH LIMIT:** Maximum 5 files changed per batch. `package.json`, `pnpm-lock.yaml`, and documentation files are excluded from this count.
2. **VERIFICATION:** Run `pnpm build` separately after every batch. Sequential execution ONLY.
3. **MEMORY GUARD:** If memory usage exceeds 6GB or exit code 134 occurs, STOP and reduce workers to 1.
4. **NO WEAKENING:** Fix the underlying infrastructure; do not disable or skip tests.
5. **READ-ONLY:** Do NOT modify `.clinerules`. All resilience documentation goes into `docs/`.

### PHASE 0: SETUP
1. Create branch `infra/cline-resilience-layer`.
2. Create `docs/hylono-cline-resilience-layer.md` to track progress with implementation timestamps.

### PHASE 1: MEMORY & ENGINE HARDENING
1. **Install cross-env:** `pnpm add -D --save-exact cross-env`.
2. **Update package.json:** - Use `cross-env NODE_OPTIONS='--max-old-space-size=8192'` for `dev`, `build`, and `test` scripts.
   - Add `"preflight": "node scripts/pre-flight.mjs"`.
3. **Node Version:** Create `.nvmrc` with content `20.18.0`.
4. **Diagnostics:** Add `"build:profile": "cross-env NODE_OPTIONS='--heap-prof --max-old-space-size=8192' next build"`.

### PHASE 2: PLAYWRIGHT DETERMINISM (ZERO NETWORK FLAKE)
1. **Resource Isolation:** Update `playwright.config.ts`:
   - `workers: process.env.CI ? 1 : 2`.
   - `fullyParallel: false`.
   - Set `dependencies: ['chromium']` for Firefox/Webkit.
2. **Network Blocking (Fixture Integration):**
   - Create `tests/fixtures/network-guard.ts` containing `applyNetworkGuard(page)` logic.
   - **ALLOW:** `localhost`, `127.0.0.1`, `eu.i.posthog.com`, `*.sentry.io`, `vitals.vercel-insights.com`, `*.uploadthing.com`.
   - **STUB:** All external `image`, `media`, and `font` requests from other domains → 1x1 transparent WebP pixel.
   - **ABORT:** All other unrecognized external requests → `route.abort('blockedbyclient')`.
3. **Base Fixture:** Create `tests/fixtures/base.ts`. Extend the base Playwright `test` to automatically call `applyNetworkGuard` on every `page`.
4. **Test Migration:** Update core E2E tests to import `test` from `tests/fixtures/base` instead of `@playwright/test`.
5. **A11Y Project:** Create a dedicated `a11y` project in config with `timeout: 90000` and `workers: 1`.

### PHASE 3: CSP & ASSET INTEGRITY

1. **Nonce Strategy:**
   - **CHECK FIRST:** `rg "connection" app/layout.tsx`. If missing, add `import { connection } from 'next/server'` and `await connection()`.
   - Confirm Nosecone (`@nosecone/next`) generates nonces. Wrap ALL JSON-LD blocks in `<Script type="application/ld+json">` from `next/script`.
2. **Broken Asset Fix:**
   - Download/create a 1920x1080 WebP placeholder for `oxylife-i-90-hero.webp`.
   - Save to `/public/images/oxylife-i-90-hero.webp`. Update code references to this local path.
3. **SafeImage Wrapper:** Implement `components/ui/SafeImage.tsx` with an `onError` handler switching to a local placeholder.

### PHASE 4: CROSS-PLATFORM GATES
1. **Pre-flight Script:** Add `scripts/pre-flight.mjs` (ESM) using `os.freemem()` and `process.version` to verify 4GB+ free RAM and Node 20+ before tasks.
2. **Acceptance Criteria:**
   - [ ] `pnpm build` exits 0.
   - [ ] `pnpm test` (Playwright) exits 0 with 0 flakes.
   - [ ] `pnpm exec biome check .` exits 0.
   - [ ] Zero CSP violations on `/`, `/rental`, `/about` (verify via Playwright `page.on('console')` filtering for `Refused to`).
   - [ ] All commands run SEPARATELY, not chained with `&&`.

### ROLLBACK
If a Phase breaks >3 previously passing tests, revert the Phase commit and analyze logs before retrying.

