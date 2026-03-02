# Patterns & Learnings — Hylono Fresh
<!-- Format: [DATE] [agent-slug] [learning] | Max 50 entries -->

[2026-02-18] [ceo-auditor] stripe SDK in client-side dependencies — must move to server-side only or remove
[2026-02-18] [ceo-auditor] eslint-config-next is leftover Next.js dep in Vite project — remove
[2026-02-18] [ceo-auditor] Non-Drizzle ORM client in dependencies/devDependencies — remove entirely (Drizzle-only workspace)
[2026-02-18] [ceo-auditor] No typecheck script in package.json — add `tsc --noEmit` (Biome is formatter/linter, no Prettier)
[2026-02-18] [ceo-auditor] console.log stubs left in: BookingModal, CheckoutPage, ContactPage, ExitIntent, Newsletter, MeridianPage, Hero46 — replace with real handlers or remove
[2026-02-18] [ceo-auditor] unsafe-inline in script-src CSP — high XSS risk, needs nonce/hash approach
[2026-02-18] [ceo-auditor] img-src and connect-src use https: wildcard — should be domain-allowlisted
[2026-02-18] [ceo-auditor] frame-ancestors directive missing from CSP — clickjacking risk
[2026-02-18] [ceo-auditor] Many buttons missing aria-label — Layout.tsx mobile menu, cart, search, social icons
[2026-02-18] [ceo-auditor] dangerouslySetInnerHTML found in BlogArticle.tsx and ResearchHub.tsx — must sanitize with DOMPurify
[2026-02-18] [ceo-auditor] target=_blank without rel=noopener noreferrer found in MeridianPage footer — tabnapping risk
[2026-02-18] [ceo-auditor] vite.config.ts missing manual chunk splitting strategy — all vendor JS in one bundle
[2026-02-18] [ceo-auditor] useEffect(() => { without deps array found in multiple components — potential infinite loops
[2026-02-18] [ceo-auditor] CookieConsent missing granular consent categories (analytics/marketing separate) for full GDPR compliance
[2026-02-18] [frontend-specialist] motion/react useMotionTemplate pattern confirmed working for reactive CSS values
[2026-02-18] [frontend-specialist] EASING tuple type [number,number,number,number] required for motion/react custom easing
[2026-02-18] [frontend-specialist] AppRouter pathname must be useState not window.location.pathname snapshot for SPA routing
