# CookieConsent — How It Works

## Phase B — Core architecture
- **Runtime model:** Frontend JavaScript library integrated into the website. [https://cookieconsent.orestbida.com/, 2026-04-12, v3.1.0]
- **Main components:** Banner, modal/preferences UI, consent state handling, script category control, and translation/config options. [https://github.com/orestbida/cookieconsent/releases, 2026-04-12, v3.1.0]
- **Typical deployment model:** Very light. Integrates directly into the existing Next.js frontend. [https://cookieconsent.orestbida.com/, 2026-04-12, v3.1.0]
- **Runtime dependencies:** Frontend integration and legal/policy decisions about categories/copy.
- **Primary data stores:** Browser-side consent state plus any server-side recording Hylono adds.
- **Auth model:** None.
- **API / integration surface:** Frontend config/hooks and consent events.
- **Operational complexity:** **Low**
- **Security / compliance considerations:** Main concern is legal/config correctness, not infrastructure.

## Architecture interpretation for Hylono
- **Control-plane placement:** Integrate directly into the existing Next.js 16 App Router codebase. Keep the integration narrow: a client boundary only where browser consent/script control is required; do not create a separate frontend.
- **Integration boundary:** Wire through centralized site metadata, analytics gating, and legal copy review.
- **Blast-radius note:** Low.