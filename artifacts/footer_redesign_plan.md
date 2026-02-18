# Implementation Plan - Smarter Footer Redesign

## A. Objective

Redesign the existing footer to be more "smart", user-friendly, and clear, incorporating all necessary information and pages while maintaining a premium, futuristic aesthetic.

## B. Core Features

1. **Five-Column Layout**:
    * **General**: Logo, refined mission statement, social links (placeholders), maybe a status indicator ("All Systems Operational").
    * **Technology**: Direct links to modality pages (HBOT, PEMF, RLT, Hydrogen).
    * **Company**: About, Careers, Press, Blog, Contact.
    * **Partnerships**: Partner Portal, Locator, Affiliate Program, Showroom.
    * **Resources**: FAQ, Documentation, Research Hub, Learning Hub.
2. **Legal & Metrics Bar**:
    * Privacy, Terms, Shipping, Warranty.
    * Data Sovereignty (EU Hosted), GDPR Compliant.
    * System Status Indicator.
3. **Newsletter Integration**:
    * Embedded newsletter signup with high-end micro-interactions.
4. **Design System Compliance**:
    * Glassmorphism (backdrop-blur, border-white/10).
    * Subtle abstract light leaks.
    * Resonance animations (Framer Motion).
    * Typography: Inter/Roboto/Outfit (already in use).

## C. Technical Tasks

1. **Refactor `Layout.tsx`**: Update the `Footer` component.
2. **Component Integration**:
    * Import and use `Newsletter` component if suitable, or create a compact version.
    * Add `Lucide` icons for social and status.
3. **Styling**:
    * Use Tailwind classes for consistent layout.
    * Add custom CSS if needed for complex gradients or animations.
4. **Verification**:
    * Check all navigation links.
    * Verify responsive behavior (stacking on mobile).
    * Visual check via browser subagent.

## D. Proof Artifacts

1. Screenshot of the new footer.
2. Link verification logs.
