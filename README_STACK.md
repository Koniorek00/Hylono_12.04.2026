# Hylono Golden Stack - Tier 1 (Foundation)

This document describes the core tooling installed and configured as part of the Tier 1 Golden Stack foundation.

## Tools Included

### 1. Zod (Validation)

- **Path**: `src/lib/schemas/`
- **Usage**: Define schemas for data validation and type inference.
- **Example**: `src/lib/schemas/example.ts`

### 2. Prisma (ORM)

- **Database**: PostgreSQL (configured in `prisma/schema.prisma`)
- **Commands**:
  - `npm run db:push`: Push local schema changes to the database.
  - `npx prisma studio`: Open a visual editor for your database.

### 3. Playwright (E2E Testing)

- **Config**: `playwright.config.ts`
- **Commands**:
  - `npm run test:e2e`: Run end-to-end tests.
  - `npx playwright show-report`: View test results.

### 4. PostHog (Analytics)

- **Wrapper**: `src/lib/analytics.ts`
- **Usage**:

  ```typescript
  import { analytics } from '@/lib/analytics';
  analytics.capture('button_clicked', { color: 'blue' });
  ```

### 5. Stripe (Payments)

- **Wrapper**: `src/lib/stripe.ts`
- **Usage**: Exported `stripe` instance for server-side API calls.

### 6. ESLint & Prettier (Linting & Formatting)

- **ESLint**: `.eslintrc.json` (Strict rules enabled).
- **Prettier**: `.prettierrc` (Consistent formatting).
- **Commands**:
  - `npm run lint`: Run linting checks.

## Environment Variables Required

Create or update your `.env.local` with the following:

```env
# Prisma
DATABASE_URL="postgresql://user:password@localhost:5432/hylono"

# PostHog
NEXT_PUBLIC_POSTHOG_KEY="your_posthog_key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
```
