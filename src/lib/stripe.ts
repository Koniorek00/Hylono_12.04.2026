/**
 * Stripe server SDK is intentionally disabled in the Vite SPA runtime.
 *
 * Context:
 * - TASK-018 architecture decision is still pending
 * - Server-side payment handlers are dead in current Vite-only setup
 * - `stripe` package was removed from devDependencies to prevent accidental client coupling
 *
 * Re-enable only when a real server runtime exists (Next.js API routes,
 * Vercel Functions, or dedicated backend service).
 */
export const stripeServerDisabledReason =
    'Stripe server client is disabled until backend architecture is finalized (TASK-018).';

export const getStripeServerClient = (): never => {
    throw new Error(stripeServerDisabledReason);
};
