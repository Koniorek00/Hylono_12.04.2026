# Feature Flag Standards

## 1. Purpose
Feature Flags allow us to decouple code deployment from feature release. We can ship code to production and toggle the feature ON only when ready.

## 2. Implementation Strategy
We use a lightweight, client-side feature flag utility located at `/utils/featureFlags.ts`.

### Storage & Overrides
1.  **Environment Variables**: Default values defined in `.env.local` or production environment.
2.  **Local Storage Override**: Allows developers and testers to toggle features in the browser for verification.
    - `localStorage.setItem('FEAT_NAME', 'true')`

## 3. Naming Conventions
Flags must be uppercase and prefixed based on their type:
- `FEAT_`: For new features (e.g., `FEAT_AUTH_V2`).
- `EXP_`: For A/B tests and experiments (e.g., `EXP_HERO_LIGHT_THEME`).
- `STRICT_`: For compliance or safety toggles (e.g., `STRICT_CLAIM_ENFORCEMENT`).

## 4. Lifecycle
- **Development**: Feature is hidden behind a flag.
- **Verification**: Flag is toggled ON in testing environments.
- **Rollout**: Flag is set to `true` by default in production.
- **Cleanup**: Once the feature is 100% stable and permanent, the flag and associated conditional logic must be removed.
