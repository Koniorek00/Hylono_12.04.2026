# Hylono Platform

European medtech platform for non-invasive regenerative technology systems.

## Stack (Canonical)

- **Next.js 16.1.6** (App Router)
- **React 19**
- **TypeScript (strict)**
- **Drizzle ORM** + Neon PostgreSQL
- **Auth.js v5** (`next-auth@beta`)
- **Tailwind CSS v4**
- **Arcjet** (bot protection + rate limiting)
- **Nosecone** (CSP + security headers)
- **Biome** (lint/format)

> Legacy Vite/SPA architecture is not used in this repository.

## Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm exec biome check .
pnpm build
pnpm test
pnpm check
```

## E2E

```bash
pnpm run e2e:install
pnpm run test:e2e
```

## Notes

- Authentication is centralized through Auth.js v5 route handlers.
- API routes must not return fake success responses when required env/config is missing.
- `proxy.ts` is used for Next.js 16 network boundary/security (no `middleware.ts`).

## License

Proprietary — Hylono GmbH